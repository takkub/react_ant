'use client';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import api from '@/lib/api';

const DynamicSelect = ({ optionsConfig, initialOptions = [], ...props }) => {
  const [options, setOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (
        optionsConfig &&
        optionsConfig.table &&
        optionsConfig.labelField &&
        optionsConfig.valueField
      ) {
        setLoading(true);
        try {
          const res = await api.get('options', {
            table: optionsConfig.table,
            labelField: optionsConfig.labelField,
            valueField: optionsConfig.valueField,
          });
          if (res.data && res.data.success) {
            setOptions(res.data.data || []);
          }
        } catch (err) {
          console.error('Failed to load options:', err);
        } finally {
          setLoading(false);
        }
      } else if (Array.isArray(initialOptions)) {
        setOptions(initialOptions);
      }
    };

    fetchOptions();
  }, [optionsConfig, initialOptions]);

  return <Select options={options} loading={loading} {...props} />;
};

export default DynamicSelect;
