'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {Card, Typography, App} from 'antd';
import CrudTable from '@/components/CrudTable';
import {useTitleContext} from "@/components/TitleContext";
import dayjs from 'dayjs';
import api from "@/lib/api";
import { useParams } from 'next/navigation';

export default function AutoFormPage() {
    const params = useParams();
    const slugFormName = params.form ? params.form.join('/') : 'default_form_slug';
    useTitleContext({ title: slugFormName, icon: <span className="text-2xl">📝</span> });
    const [data, setData] = useState([]);
    const [crudOptions, setCrudOptions] = useState(null);
    const [pageTitle, setPageTitle] = useState('Loading Form...');
    const [pageLoading, setPageLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actualTableNameForApi, setActualTableNameForApi] = useState(null);
    const { message } = App.useApp();

    const fetchData = useCallback(async (tableNameForApi) => {
        if (!tableNameForApi) {
            console.warn("fetchData called without tableNameForApi");
            setData([]);
            setError("Table name for data fetching is not specified.");
            return;
        }
        console.log('Fetching data for actual table:', tableNameForApi);
        setDataLoading(true);
        try {
            console.log(`Calling API to fetch data for table: ${tableNameForApi}`);
            const response = await api.get(`autoform`, { table: tableNameForApi });
            console.log('Fetched data response:', response);
            if (response.data) {
                setData(response.data.data || response.data || []);
            } else {
                setData([]);
                console.log('No data from API for table:', tableNameForApi);
            }
            setError(null);
        } catch (err) {
            console.error(`Error fetching data for table ${tableNameForApi}:`, err);
            setError(`Failed to fetch data for ${tableNameForApi}.`);
            message.error(`Failed to fetch data for ${tableNameForApi}.`);
            setData([]);
        } finally {
            setDataLoading(false);
        }
    }, [message]);

    useEffect(() => {
        const fetchFormDesignAndThenData = async () => {
            if (!slugFormName || slugFormName === 'default_form_slug') {
                message.error('Form name (slug) not specified in URL.');
                setError('Form name (slug) not specified in URL.');
                setPageTitle('Error: No Form Slug Specified');
                setCrudOptions(null);
                setPageLoading(false);
                return;
            }

            setPageLoading(true);
            setCrudOptions(null);
            setActualTableNameForApi(null);
            setError(null);

            let determinedTableName = slugFormName;

            try {
                const designResponse = await api.get('form-designs', { name: slugFormName });
                console.log('Form Design API response:', designResponse);

                if (designResponse.data && designResponse.data.length > 0) {
                    const design = designResponse.data[0];

                    if (design.table && typeof design.table === 'string' && design.table.trim() !== '') {
                        determinedTableName = design.table.trim();
                        console.log(`Using target_db_table for API calls: ${determinedTableName}`);
                    } else {
                        console.warn(`'target_db_table' not found or invalid in form design for slug '${slugFormName}'. Falling back to slug as table name for API calls.`);
                    }
                    setActualTableNameForApi(determinedTableName);

                    let parsedOptions = { columns: [], form: {}, filters: {}, pagination: {} };
                    let designPageTitle = design.name;

                    if (design.crud_options_data) {
                        try {
                            parsedOptions = JSON.parse(design.crud_options_data);
                            if (parsedOptions.form?.settings?.title) {
                                designPageTitle = parsedOptions.form.settings.title.replace(' Form', '');
                            } else if (design.settings_data) {
                                const settings = JSON.parse(design.settings_data);
                                designPageTitle = settings.pageTitle || settings.title || design.name;
                            }
                        } catch (e) {
                            console.error('Error parsing crud_options_data:', e);
                            message.error('Failed to parse form design options.');
                            setError('Failed to parse form design options. Displaying with default structure.');
                        }
                    } else {
                        console.warn('No crud_options_data found in form design:', slugFormName);
                        message.warn('Form design is incomplete. Displaying with default structure.');
                        setError('Form design is incomplete (missing crud_options_data).');
                    }

                    setCrudOptions(parsedOptions);
                    setPageTitle(designPageTitle);

                    await fetchData(determinedTableName);
                    setPageLoading(false);

                } else {
                    console.warn('No form design found for slug:', slugFormName);
                    message.error(`Form design '${slugFormName}' not found.`);
                    setError(`Form design '${slugFormName}' not found.`);
                    setPageTitle(`Error: Form '${slugFormName}' Not Found`);
                    setCrudOptions(null);
                    setPageLoading(false);
                }
            } catch (err) {
                console.error('Error fetching form design:', err);
                message.error('Failed to fetch form design.');
                setError('Failed to fetch form design.');
                setPageTitle('Error Loading Form Design');
                setCrudOptions(null);
                setPageLoading(false);
            }
        };
        fetchFormDesignAndThenData();
    }, [slugFormName, fetchData, message]);

    const handleAdd = useCallback((currentData, currentSetData, tableNameForApi) => async (newRecord) => {
        if (!tableNameForApi) { message.error("Cannot add record: table name not defined."); return; }
        try {
            const res = await api.post(`autoform`, {table:tableNameForApi,body:newRecord});
            console.log('Add record response:', res);
            currentSetData([...currentData, res.data]);
            message.success(`New record added successfully to ${tableNameForApi}`);
        } catch (error) {
            console.error('Error adding record:', error);
            if (error.response && error.response.data) {
                message.error(`Failed to add record: ${error.response.data.message || 'Server error'}`);
            } else {
                message.error('Failed to add record. Please try again.');
            }
        }
    }, [message]);

    const handleEdit = useCallback((currentData, currentSetData, tableNameForApi) => async (key, updatedRecord) => {
        if (!tableNameForApi) { message.error("Cannot edit record: table name not defined."); return; }
        try {
            const newData = [...currentData];
            const index = newData.findIndex(item => item.id === key);
            if (index > -1) {
                
                await api.put(`autoform`, {body: updatedRecord, where: { id: key },table: tableNameForApi});
                newData[index] = {...newData[index], ...updatedRecord};
                currentSetData(newData);
                message.success(`Record updated successfully in ${tableNameForApi}`);
            }
        } catch (error) {
            console.error('Error updating record:', error);
            message.error('Failed to update record. Please try again.');
        }
    }, [message]);

    const handleDelete = useCallback((currentData, currentSetData, tableNameForApi) => async (keys) => {
        if (!tableNameForApi) { message.error("Cannot delete records: table name not defined."); return; }
        try {
            await Promise.all(keys.map(key => api.delete(`autoform`, {id: key,table: tableNameForApi})));
            const newData = currentData.filter(item => !keys.includes(item.id));
            currentSetData(newData);
            message.success(`${keys.length} record(s) deleted successfully from ${tableNameForApi}`);
        } catch (error) {
            console.error('Error deleting records:', error);
            message.error('Failed to delete records. Please try again.');
        }
    }, [message]);

    const handleExport = useCallback((currentCrudOptions, tableNameForApi) => (allData, selectedKeys) => {
        if (!tableNameForApi) { message.error("Cannot export: table name not defined."); return; }
        if (!currentCrudOptions || !currentCrudOptions.columns) {
            message.error('Cannot export: Column configuration is missing.');
            return;
        }
        try {
            const dataToExport = selectedKeys.length > 0
                ? allData.filter(item => selectedKeys.includes(item.id))
                : allData;

            const headers = currentCrudOptions.columns.map(col => col.title).join(',');
            const csvRows = dataToExport.map(item => {
                return currentCrudOptions.columns.map(col => {
                    let cellValue = item[col.dataIndex];
                    if (Array.isArray(cellValue)) {
                        return `"${cellValue.join(', ')}"`;
                    } else if (col.dataIndex === 'createdAt' && cellValue) {
                        return dayjs(cellValue).format('YYYY-MM-DD');
                    }
                    return `"${cellValue || ''}"`;
                }).join(',');
            });

            const csvString = [headers, ...csvRows].join('\n');

            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${tableNameForApi}-export-${dayjs().format('YYYY-MM-DD')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            message.success(`Exported ${dataToExport.length} records successfully`);
        } catch (error) {
            console.error('Error exporting data:', error);
            message.error('Failed to export data. Please try again.');
        }
    }, [message]);

    if (pageLoading) {
        return <Card className="p-4"><Typography.Title level={3}>Loading form design: {slugFormName}...</Typography.Title></Card>;
    }

    if (!crudOptions && !pageLoading) {
        return <Card className="p-4"><Typography.Title level={3} type="danger">{error || `Form configuration for '${slugFormName}' not available or incomplete.`}</Typography.Title></Card>;
    }

    if (!crudOptions) {
        return <Card className="p-4"><Typography.Title level={3}>Waiting for form configuration...</Typography.Title></Card>;
    }

    return (
        <Card className="p-4">
            {error && !pageLoading && <div className="mb-4 text-red-500">Error: {error}</div>}
            <CrudTable
                title={pageTitle}
                data={data}
                onAdd={handleAdd(data, setData, actualTableNameForApi)}
                onEdit={handleEdit(data, setData, actualTableNameForApi)}
                onDelete={handleDelete(data, setData, actualTableNameForApi)}
                onExport={handleExport(crudOptions, actualTableNameForApi)}
                loading={dataLoading}
                customColumns={crudOptions}
                rowkeys={['id']}
            />
        </Card>
    );
}

