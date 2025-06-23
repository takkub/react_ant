'use client';
import React from 'react';
import { Button, Card, Row, Col, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const DndLayoutBuilder = ({ fields = [], layouts, setLayouts }) => {
  const [draggingField, setDraggingField] = React.useState(null);
  const [internalLayouts, setInternalLayouts] = React.useState([]);

  const actualLayouts = layouts ?? internalLayouts;
  const updateLayouts = setLayouts ?? setInternalLayouts;

  const addLayout = (cols) => {
    updateLayouts((prev) => [
      ...prev,
      { id: uuidv4(), cols, fields: Array.from({ length: cols }, () => []) },
    ]);
  };

  const removeLayout = (id) => {
    updateLayouts((prev) => prev.filter((l) => l.id !== id));
  };

  const handleDrop = (layoutIndex, colIndex) => {
    if (!draggingField) return;
    updateLayouts((prev) =>
      prev.map((l, i) => {
        if (i !== layoutIndex) return l;
        const newFields = l.fields.map((col, j) =>
          j === colIndex ? [...col, { ...draggingField, instanceId: uuidv4() }] : col
        );
        return { ...l, fields: newFields };
      })
    );
    setDraggingField(null);
  };

  return (
    <Card title="Layout Builder" style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Typography.Text strong>Add Layout: </Typography.Text>
        <Button onClick={() => addLayout(1)} style={{ marginRight: 8 }}>
          1 Col
        </Button>
        <Button onClick={() => addLayout(2)} style={{ marginRight: 8 }}>
          2 Col
        </Button>
        <Button onClick={() => addLayout(3)}>3 Col</Button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {fields.map((field) => (
          <Card
            key={field.id}
            draggable
            onDragStart={() => setDraggingField(field)}
            style={{ width: 120, textAlign: 'center', cursor: 'grab' }}
          >
            {field.title || field.label || field.name}
          </Card>
        ))}
      </div>

      {actualLayouts.map((layout, layoutIndex) => (
        <Card
          key={layout.id}
          type="inner"
          title={`Layout ${layoutIndex + 1} - ${layout.cols} Column`}
          style={{ marginBottom: 16 }}
          extra={
            <Button
              icon={<DeleteOutlined />}
              onClick={() => removeLayout(layout.id)}
              size="small"
            />
          }
        >
          <Row gutter={16}>
            {Array.from({ length: layout.cols }).map((_, colIndex) => (
              <Col
                key={colIndex}
                span={24 / layout.cols}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(layoutIndex, colIndex)}
                style={{ minHeight: 60, border: '1px dashed #ccc', padding: 8 }}
              >
                {layout.fields[colIndex].map((item) => (
                  <Card key={item.instanceId} size="small" style={{ marginBottom: 8 }}>
                    {item.label}
                  </Card>
                ))}
              </Col>
            ))}
          </Row>
        </Card>
      ))}
    </Card>
  );
};

export default DndLayoutBuilder;
