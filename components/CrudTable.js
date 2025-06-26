'use client';
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  message,
  Card,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Typography,
  Radio,
  Pagination,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CrudTable = ({
  title,
  data,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  loading = false,
  customColumns = { columns: [] },
  rowkeys = ['key'],
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [editingKey, setEditingKey] = useState(null);
  const [form] = Form.useForm();
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'multiple' for bulk, record for single

  const tableFilterFields = useMemo(
    () => customColumns.filters?.fields || [],
    [customColumns.filters?.fields],
  ); // Wrapped in useMemo

  // Custom pagination state with defaults and options from customColumns
  const paginationOptions = customColumns.pagination || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(paginationOptions.pageSize || 10);
  const pageSizeOptions = paginationOptions.pageSizeOptions || ['10', '20', '50', '100'];
  const showSizeChanger = paginationOptions.showSizeChanger !== undefined ? paginationOptions.showSizeChanger : true;
  const showQuickJumper = paginationOptions.showQuickJumper !== undefined ? paginationOptions.showQuickJumper : true;

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Custom pagination footer component
  const CustomPaginationFooter = () => (
    <div
      style={{
        padding: '8px 16px',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>รายการต่อหน้า</span>
        <Select
          value={pageSize}
          onChange={value => handlePageChange(1, value)}
          style={{ width: 80, marginRight: 12 }}
          options={pageSizeOptions.map(size => ({ value: parseInt(size), label: size }))}
        />
        <span style={{ color: '#1976d2', fontSize: 14 }}>
          {`แสดงผล ${(currentPage - 1) * pageSize + 1} ถึง ${Math.min(
            currentPage * pageSize,
            filteredData.length,
          )} จาก ${filteredData.length} รายการ`}
        </span>
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        pageSizeOptions={pageSizeOptions}
        onChange={(page, size) => handlePageChange(page, size)}
        onShowSizeChange={(current, size) => handlePageChange(current, size)}
        style={{ background: 'transparent' }}
      />
    </div>
  );

  useEffect(() => {
    const applyFilters = () => {
      let result = [...data];

      // Handle status filter (hardcoded)
      if (
        filterValues.status !== undefined &&
        filterValues.status !== null &&
        filterValues.status !== ''
      ) {
        result = result.filter(record => record.status === filterValues.status);
      }

      // Handle other filters from tableFilterFields
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'status') {
          const filter = tableFilterFields.find(
            f => f.field === key || (Array.isArray(f.field) && f.field.includes(key)),
          );

          if (filter) {
            if (filter.type === 'select' || filter.type === 'radio') {
              result = result.filter(record => {
                if (Array.isArray(record[key])) {
                  return record[key].includes(value);
                }
                return record[key] === value;
              });
            } else if (
              filter.type === 'dateRange' &&
              Array.isArray(value) &&
              value.length === 2
            ) {
              const startDate = value[0].startOf('day');
              const endDate = value[1].endOf('day');

              result = result.filter(record => {
                const recordDate = dayjs(record[key]);
                return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
              });
            }
          }
        }
      });

      if (searchText) {
        const searchFilters = tableFilterFields.filter(f => f.type === 'text');
        const searchFields = searchFilters.flatMap(f =>
          Array.isArray(f.field) ? f.field : [f.field],
        );

        result = result.filter(record => {
          return searchFields.some(field => {
            const value = record[field];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchText.toLowerCase());
            }
            return false;
          });
        });
      }

      setFilteredData(result);
    };

    applyFilters();
  }, [data, filterValues, searchText, tableFilterFields]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues, searchText]);

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys),
    getCheckboxProps: record => ({
      disabled: false, // หรือกำหนดเงื่อนไขการ disable
    }),
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        // เลือกทั้งหมดในทุกหน้า - ใช้ filteredData ที่มีข้อมูลทั้งหมด
        const allKeys = filteredData.map(record => {
          for (const key of rowkeys) {
            if (record[key] !== undefined && record[key] !== null) {
              return record[key];
            }
          }
          return record.key;
        });
        setSelectedRowKeys(allKeys);
      } else {
        // ยกเลิกเลือกทั้งหมด
        setSelectedRowKeys([]);
      }
    },
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      Object.keys(values).forEach(key => {
        if (values[key] instanceof dayjs) {
          values[key] = values[key].toDate();
        }
      });

      Modal.confirm({
        title: 'ยืนยันการบันทึกข้อมูล',
        content: 'คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่?',
        okText: 'ตกลง',
        cancelText: 'ยกเลิก',
        centered: true,
        cancelButtonProps: { style: { backgroundColor: 'red', color: 'white' } },
        async onOk() {
          try {
            if (formMode === 'add') {
              const result = await onAdd(values);
              if (result && result.success === false) {
                Modal.error({
                  title: 'เกิดข้อผิดพลาด',
                  content: result.message || 'ไม่สามารถบันทึกข้อมูลได้',
                  centered: true,
                  okText: 'ตกลง',
                });
                return;
              }
              Modal.success({
                title: 'บันทึกข้อมูลสำเร็จ',
                centered: true,
                okText: 'ตกลง',
              });
            } else if (formMode === 'edit') {
              const result = await onEdit(editingKey, values);
              if (result && result.success === false) {
                Modal.error({
                  title: 'เกิดข้อผิดพลาด',
                  content: result.message || 'ไม่สามารถแก้ไขข้อมูลได้',
                  centered: true,
                  okText: 'ตกลง',
                });
                return;
              }
              Modal.success({
                title: 'แก้ไขข้อมูลสำเร็จ',
                centered: true,
                okText: 'ตกลง',
              });
            }
            setIsFormVisible(false);
            form.resetFields();
          } catch (err) {
            Modal.error({
              title: 'เกิดข้อผิดพลาด',
              content: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
              centered: true,
              okText: 'ตกลง',
            });
            console.error('Save failed:', err);
          }
        },
        onCancel() {
          console.log('User cancelled save.');
        },
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const showAddForm = () => {
    setFormMode('add');
    setEditingKey(null);
    form.resetFields();
    setIsFormVisible(true);
  };

  const showEditForm = record => {
    setFormMode('edit');

    let editKey = record.key;
    for (const key of rowkeys) {
      if (record[key] !== undefined && record[key] !== null) {
        editKey = record[key];
        break;
      }
    }

    setEditingKey(editKey);

    const formValues = { ...record };

    // Convert date strings to dayjs objects for form fields
    Object.keys(formValues).forEach(key => {
      if (formValues[key] && typeof formValues[key] === 'string') {
        // Check if it's a date string (you can adjust this pattern as needed)
        if (formValues[key].match(/^\d{4}-\d{2}-\d{2}/)) {
          formValues[key] = dayjs(formValues[key]);
        }
      }
    });

    if (form) {
      form.setFieldsValue(formValues);
    } else {
      console.error('Form instance is not properly initialized');
    }
    setIsFormVisible(true);
  };

  const handleDelete = async keys => {
    if (Array.isArray(keys) && keys.length > 0) {
      await onDelete(keys);
      setSelectedRowKeys([]);
      Modal.success({
        title: 'ลบข้อมูลสำเร็จ',
        centered: true,
        okText: 'ตกลง',
      });
    }
  };

  const handleDeleteSingle = async record => {
    const keys = rowkeys.map(key => record[key]).filter(val => val !== undefined);
    const keyToDelete = keys.length > 0 ? keys[0] : record.key;

    await handleDelete([keyToDelete]);
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length > 0) {
      await handleDelete(selectedRowKeys);
    } else {
      message.warning('Please select at least one record to delete');
    }
  };

  const showDeleteModal = target => {
    setDeleteTarget(target);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteTarget === 'multiple') {
        // Bulk delete
        await handleDeleteSelected();
      } else {
        // Single delete
        await handleDeleteSingle(deleteTarget);
      }
      setIsDeleteModalVisible(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleExport = type => {
    if (typeof onExport === 'function') {
      onExport(filteredData, selectedRowKeys);
      return;
    }

    const dataToExport =
      selectedRowKeys.length > 0
        ? filteredData.filter(item => selectedRowKeys.includes(item.key))
        : filteredData;

    if (dataToExport.length === 0) {
      message.warning('No data to export');
      return;
    }

    const columns = customColumns.columns;

    const exportData = dataToExport.map(record => {
      const row = {};
      columns.forEach(col => {
        let value = record[col.dataIndex];

        if (Array.isArray(value)) {
          value = value.join(', ');
        } else if (col.dataIndex === 'createdAt' && value) {
          value = dayjs(value).format('YYYY-MM-DD');
        }

        row[col.title] = value;
      });
      return row;
    });

    if (type === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format(
        'YYYY-MM-DD',
      )}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      message.success(`Exported ${dataToExport.length} records to Excel`);
    } else if (type === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${title.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.csv`,
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success(`Exported ${dataToExport.length} records to CSV`);
    }
  };

  // Generate form items based on column definitions and cardGroupSetting
  const getFormItems = () => {
    const formSettings = customColumns.form?.settings || {};
    const formFields = customColumns.form?.fields || [];
    const cardGroupSettings = customColumns.form?.cardGroupSetting;

    if (
      cardGroupSettings &&
      Array.isArray(cardGroupSettings) &&
      cardGroupSettings.length > 0
    ) {
      const renderedGroups = cardGroupSettings
        .map(group => {
          const groupFields = formFields.filter(field => field.cardGroup === group.key);
          if (groupFields.length === 0) {
            return null;
          }

          const groupGridColumns = group.gridColumns || formSettings.gridColumns || 1;
          // Use group-specific layout settings, fallback to global formSettings
          const groupLayoutSettings = {
            layout: group.layout || formSettings.layout,
            labelCol: group.labelCol || formSettings.labelCol,
            wrapperCol: group.wrapperCol || formSettings.wrapperCol,
          };

          return (
            <Card
              key={group.key}
              title={group.title || 'Group'}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 0]}>
                {groupFields.map(field => (
                  <Col
                    key={field.dataIndex}
                    xs={24}
                    sm={groupGridColumns > 1 ? 24 / Math.min(groupGridColumns, 2) : 24}
                    md={24 / groupGridColumns}
                    lg={24 / groupGridColumns}
                  >
                    {renderFormItem(field, field.dataIndex, groupLayoutSettings)}
                  </Col>
                ))}
              </Row>
            </Card>
          );
        })
        .filter(Boolean);

      // Render fields not in any group, if any
      const ungroupedFields = formFields.filter(
        field =>
          !field.cardGroup || !cardGroupSettings.find(g => g.key === field.cardGroup),
      );
      if (ungroupedFields.length > 0) {
        const globalGridColumns = formSettings.gridColumns || 1;
        renderedGroups.push(
          <Card key="ungrouped-fields" title="Other Fields" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 0]}>
              {ungroupedFields.map(field => (
                <Col
                  key={field.dataIndex}
                  xs={24}
                  sm={globalGridColumns > 1 ? 12 : 24}
                  md={24 / globalGridColumns}
                  lg={24 / globalGridColumns}
                >
                  {renderFormItem(field, field.dataIndex, formSettings)}
                </Col>
              ))}
            </Row>
          </Card>,
        );
      }
      return renderedGroups;
    } else {
      // Existing logic for non-grouped or single-group layout
      const gridColumns = formSettings.gridColumns || 1;
      if (
        gridColumns === 1 &&
        (!formSettings.layout || formSettings.layout === 'vertical')
      ) {
        // Simpler rendering for single column vertical
        return formFields.map(field =>
          renderFormItem(field, field.dataIndex, formSettings),
        );
      }
      return (
        <Row gutter={[16, 0]}>
          {formFields.map(field => (
            <Col
              key={field.dataIndex}
              xs={24}
              sm={gridColumns > 1 ? 12 : 24}
              md={24 / gridColumns}
              lg={24 / gridColumns}
            >
              {renderFormItem(field, field.dataIndex, formSettings)}
            </Col>
          ))}
        </Row>
      );
    }
  };

  // Helper function to render a single form item
  const renderFormItem = (field, key, itemLayoutSettings) => {
    const isDisabled =
      typeof field.disabled === 'function' ? field.disabled(formMode) : field.disabled;

    let formItemComponent;
    let formItemProps = {};

    switch (field.type) {
      case 'input':
      case 'text':
        formItemComponent = <Input disabled={isDisabled} />;
        break;
      case 'email':
        formItemComponent = <Input type="email" disabled={isDisabled} />;
        break;
      case 'textArea':
        formItemComponent = <TextArea rows={field.rows || 4} disabled={isDisabled} />;
        break;
      case 'number':
        formItemComponent = (
          <Input
            type="number"
            disabled={isDisabled}
            style={{ width: '100%' }}
            onChange={e => {
              // Convert string value to number before setting in form
              let numValue = undefined;

              // Check if input is a valid number
              if (e.target.value !== '') {
                numValue = Number(e.target.value);

                // Validate if conversion was successful and it's a valid number
                if (isNaN(numValue)) {
                  // If not a valid number, don't update the form value
                  return;
                }
              }
              form.setFieldValue(field.dataIndex, numValue);
            }}
          />
        );

        // Add getValueFromEvent handler to ensure number type for validation
        formItemProps.getValueFromEvent = e => {
          if (e?.target?.value === '') return undefined;
          const val = Number(e?.target?.value);
          return isNaN(val) ? undefined : val;
        };

        // Add normalize function to convert string to number during form validation
        formItemProps.normalize = value => {
          if (value === undefined || value === null || value === '') return undefined;
          const val = Number(value);
          return isNaN(val) ? undefined : val;
        };

        break;
      case 'select':
        formItemComponent = (
          <Select
            disabled={isDisabled}
            options={field.options || []}
            allowClear
            showSearch={field.showSearch || false}
            optionFilterProp={field.optionFilterProp || 'children'}
            filterOption={
              field.filterOption ||
              ((input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()))
            }
          />
        );
        break;
      case 'date':
        formItemComponent = (
          <DatePicker
            style={{ width: '100%' }}
            disabled={isDisabled}
            format={field.format || 'YYYY-MM-DD'}
          />
        );
        break;
      case 'dateRange':
        formItemComponent = (
          <RangePicker
            style={{ width: '100%' }}
            disabled={isDisabled}
            format={field.format || 'YYYY-MM-DD'}
          />
        );
        break;
      case 'checkbox': // This is for a single checkbox. Checkbox.Group would be different.
        formItemComponent = field.options ? (
          <Checkbox.Group disabled={isDisabled} options={field.options} />
        ) : (
          <Checkbox disabled={isDisabled}>{field.checkboxLabel || ''}</Checkbox>
        );
        break;
      case 'tags':
        formItemComponent = (
          <Select
            mode="tags" // Changed from "multiple" to "tags" for free-form input
            disabled={isDisabled}
            options={field.options || []} // Options can still be provided as suggestions
            tokenSeparators={[',']}
            // tagRender prop can be used for custom tag appearance if needed
          />
        );
        break;
      case 'radio':
        formItemComponent = (
          <Radio.Group disabled={isDisabled} options={field.options || []}>
            {/* Options are now directly passed to Radio.Group if they are in {label, value} format */}
          </Radio.Group>
        );
        break;
      case 'blank':
        formItemComponent = <div />; // Empty component spacing
        break;
      default:
        formItemComponent = <Input disabled={isDisabled} />;
    }

    const columnDef = customColumns.columns.find(
      col => col.dataIndex === field.dataIndex,
    );
    const label = field.label || columnDef?.title || field.dataIndex;

    // Determine layout for this specific item
    const itemSpecificLayout =
      itemLayoutSettings?.layout || customColumns.form?.settings?.layout || 'horizontal';
    const itemLabelCol =
      itemLayoutSettings?.labelCol || customColumns.form?.settings?.labelCol;
    const itemWrapperCol =
      itemLayoutSettings?.wrapperCol || customColumns.form?.settings?.wrapperCol;

    return (
      <Form.Item
        key={key}
        name={field.dataIndex}
        label={label}
        rules={field.rules || []}
        {...(itemSpecificLayout === 'horizontal' && {
          // Apply labelCol/wrapperCol only if layout is horizontal
          labelCol: itemLabelCol,
          wrapperCol: itemWrapperCol,
        })}
        {...(field.type === 'checkbox' && !field.options && { valuePropName: 'checked' })} // For single Checkbox only
        {...formItemProps} // Apply additional form item props specific to field type
      >
        {formItemComponent}
      </Form.Item>
    );
  };

  // Build columns with action column
  const buildColumns = () => {
    const columns = [...customColumns.columns];

    // Add action column
    columns.push({
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditForm(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    });

    return columns;
  };

  const finalColumns = useMemo(() => buildColumns(), [customColumns.columns, rowkeys]); // Memoize finalColumns

  // Render filter components
  const renderFilters = () => {
    return (
      <Row gutter={8} className="mb-4" justify="end">
        {tableFilterFields.map((filter, index) => {
          const fields = Array.isArray(filter.field) ? filter.field : [filter.field];
          const fieldKey = fields[0];

          switch (filter.type) {
            case 'select':
              return (
                <Col key={index} xs={24} sm={12} md={6} lg={4}>
                  <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
                    <Select
                      placeholder={`Select ${filter.title}`}
                      allowClear
                      style={{ width: '100%' }}
                      options={filter.options}
                      value={filterValues[fieldKey]}
                      onChange={value => {
                        setFilterValues({
                          ...filterValues,
                          [fieldKey]: value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              );
            case 'dateRange':
              return (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
                    <RangePicker
                      style={{ width: '100%' }}
                      value={filterValues[fieldKey]}
                      onChange={dates => {
                        setFilterValues({
                          ...filterValues,
                          [fieldKey]: dates,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              );
            case 'text':
              return (
                <Col key={index} xs={24} sm={12} md={6} lg={4}>
                  <Form.Item className="mb-0" style={{ marginBottom: 8 }}>
                    <Input
                      placeholder={`Search ${filter.title}`}
                      prefix={<SearchOutlined />}
                      allowClear
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              );
            default:
              return null;
          }
        })}
      </Row>
    );
  };

  const exportMenu = {
    items: [
      {
        key: '1',
        label: 'Export to Excel',
        icon: <FileExcelOutlined />,
        onClick: () => handleExport('excel'),
      },
      {
        key: '2',
        label: 'Export to CSV',
        icon: <FileTextOutlined />,
        onClick: () => handleExport('csv'),
      },
    ],
  };

  return (
    <div className="crud-table">
      <Card>
        {!isFormVisible ? (
          <>
            <Row className="mb-4" style={{ marginBottom: 20 }}>
              <Col span={24}>
                <Space
                  direction="horizontal"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <Row>
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddForm}
                      >
                        Create
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => showDeleteModal('multiple')}
                      >
                        Delete
                      </Button>
                    </Space>
                  </Row>
                  <Row>
                    <Space direction="horizontal">
                      <Col>
                        <Dropdown menu={exportMenu} trigger={['click']}>
                          <Button icon={<DownloadOutlined />} className="mr-8">
                            Export
                          </Button>
                        </Dropdown>
                      </Col>
                    </Space>
                  </Row>
                </Space>
              </Col>
              <Col flex="auto">{tableFilterFields.length > 0 && renderFilters()}</Col>
            </Row>

            <Table
              rowSelection={rowSelection}
              columns={finalColumns}
              dataSource={paginatedData}
              loading={loading}
              pagination={false}
              scroll={{ x: 'max-content' }}
              size="middle"
              bordered
              rowKey={record => {
                for (const key of rowkeys) {
                  if (record[key] !== undefined && record[key] !== null) {
                    return record[key];
                  }
                }
                return record.key;
              }}
              footer={() => <CustomPaginationFooter />}
            />
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <Row style={{ marginBottom: 20 }}>
              <Col span={24}>
                <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }}>
                  {formMode === 'add'
                    ? customColumns.form?.settings?.addModalTitle || 'Add New Record'
                    : customColumns.form?.settings?.editModalTitle || 'Edit Record'}
                </Typography.Title>
              </Col>
            </Row>

            <Form
              form={form}
              layout={customColumns.form?.settings?.layout || 'horizontal'}
              labelCol={customColumns.form?.settings?.labelCol || { span: 6 }}
              wrapperCol={customColumns.form?.settings?.wrapperCol || { span: 18 }}
              style={customColumns.form?.settings?.style}
              initialValues={customColumns.form?.settings?.initialValues || {}}
            >
              {getFormItems()}
            </Form>

            <Row style={{ marginTop: 24 }}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Space size="middle">
                  <Button type="primary" onClick={handleFormSubmit}>
                    {formMode === 'add' ? 'Create' : 'Update'}
                  </Button>
                  <Button onClick={() => setIsFormVisible(false)}>Cancel</Button>
                </Space>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="ยืนยันการลบข้อมูล"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setDeleteTarget(null);
        }}
        okText="ตกลง"
        cancelText="ยกเลิก"
        centered
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
        <p>
          {deleteTarget === 'multiple'
            ? `คุณต้องการลบข้อมูลที่เลือกไว้ ${selectedRowKeys.length} รายการใช่หรือไม่?`
            : 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?'}
        </p>
      </Modal>
    </div>
  );
};

export default CrudTable;
