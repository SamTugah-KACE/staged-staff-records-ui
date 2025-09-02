// EmergencyContactTable.js
import React, { useState } from 'react';
import { Table, Button, Typography, Descriptions } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import './EmergencyContact.css';

const { Title } = Typography;

const EmergencyContactTable = ({ data, pending, onEdit, onDelete }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const columns = [
    // {
    //   title: 'Employee ID',
    //   dataIndex: ['employee', 'id'],
    //   key: 'employee_id',
    //   render: (id) => (
    //     <span>
    //       <UserOutlined style={{ marginRight: 8 }} />
    //       {id || 'N/A'}
    //     </span>
    //   ),
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Relation',
      dataIndex: 'relation',
      key: 'relation',
    },
    {
      title: 'Phone',
      dataIndex: 'emergency_phone',
      key: 'emergency_phone',
    },
    {
      title: 'Address',
      dataIndex: 'emergency_address',
      key: 'emergency_address',
      render: (address) => address || 'Not specified',
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            setSelectedRecord(record);
            setShowDetails(true);
          }}
          className="details-button"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="edit-button"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            className="delete-button"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="custom-table-container">
       {pending && (
        <div className="pending-banner">
          ⚠️ Your changes to the Emergency Contacts are pending approval
        </div>
      )}
      <Title level={4} style={{ marginBottom: 16 }}>Emergency Contacts</Title>
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        className="custom-table" 
      />

      {showDetails && selectedRecord && (
        <div className="contact-details-modal">
          <div className="details-backdrop" onClick={() => setShowDetails(false)} />
          <div className="details-content">
            <Descriptions 
              title="Emergency Contact Details" 
              bordered 
              column={1}
              size="small"
            >
              {/* <Descriptions.Item label="Employee ID">
                {selectedRecord.employee?.id || 'N/A'}
              </Descriptions.Item> */}
              <Descriptions.Item label="Contact Name">
                {selectedRecord.name}
              </Descriptions.Item>
              <Descriptions.Item label="Relation">
                {selectedRecord.relation}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedRecord.emergency_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedRecord.emergency_address || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Additional Details">
                {selectedRecord.details || 'None'}
              </Descriptions.Item>
            </Descriptions>
            <Button 
              type="primary" 
              onClick={() => setShowDetails(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactTable;