import React, { useState } from 'react';
import { Table, Button, Modal, Descriptions, Dropdown, Menu, List, Typography, Alert, Space } from 'antd';
import { EyeOutlined, InfoCircleOutlined, EditOutlined, DeleteOutlined, FilePdfOutlined, FileImageOutlined, FileOutlined, DownloadOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import './EmploymentHistory.css';
import EmploymentHistoryModal from './EmploymentHistoryModal';
import dayjs from 'dayjs';

const { Text } = Typography;

// const EmploymentHistoryTable = ({ data, onEdit, onDelete }) => {
const EmploymentHistoryTable = ({ data, pending, onRequestChange, OnEdit, OnDelete }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing]         = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [documentPreview, setDocumentPreview] = useState({
    visible: false,
    url: null,
    name: null
  });
  const [documentsListModal, setDocumentsListModal] = useState({
    visible: false,
    documents: [],
    mode: 'view' // 'view' or 'download'
  });

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : 
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleViewDocument = (url, name) => {
    setDocumentPreview({ visible: true, url, name });
  };

  const handleViewDocumentsList = (documents) => {
    setDocumentsListModal({
      visible: true,
      documents,
      mode: 'view'
    });
  };

  const handleDownloadDocumentsList = (documents) => {
    setDocumentsListModal({
      visible: true,
      documents,
      mode: 'download'
    });
  };

  const handleDownloadDocument = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDetails = (record) => {
    const detailString = `
Employment History Details:
----------------------------
Job Title: ${record.job_title || 'N/A'}
Company: ${record.company || 'N/A'}
Start Date: ${formatDate(record.start_date) || 'N/A'}
End Date: ${record.end_date ? formatDate(record.end_date) : 'Present'}
Details: ${record.details || 'N/A'}
    `;

    const element = document.createElement('a');
    const file = new Blob([detailString], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `employment_history_${record.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileOutlined />;
    
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].some(ext => fileName.toLowerCase().endsWith(ext))) {
      return <FileImageOutlined style={{ color: '#1890ff' }} />;
    } else {
      return <FileOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const downloadMenu = (record) => (
    <Menu>
      {record.documents_path?.length > 0 && (
        <Menu.Item 
          key="1" 
          icon={<FilePdfOutlined />} 
          onClick={() => handleDownloadDocumentsList(record.documents_path)}
        >
          Download Documents
        </Menu.Item>
      )}
      <Menu.Item 
        key="2" 
        icon={<FileTextOutlined />} 
        onClick={() => downloadDetails(record)}
      >
        Download Details as Text
      </Menu.Item>
    </Menu>
  );

  const handleAdd = () => {
        /* local handleAddHistory… */
        setEditing(null);
        setModalVisible(true);
       };

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => formatDate(text) || 'N/A',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text) => text ? formatDate(text) : 'Present',
    },
    {
      title: 'Files',
      key: 'files',
      render: (_, record) => (
        <div className="file-actions">
          {record.documents_path?.length > 0 ? (
            <>
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewDocumentsList(record.documents_path)}
                className="view-file-button"
              />
              <Dropdown overlay={downloadMenu(record)}>
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  className="download-file-button"
                />
              </Dropdown>
            </>
          ) : (
            <span>No files</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        // <div className="actions">
        //   <Button
        //     type="text"
        //     icon={<InfoCircleOutlined />}
        //     onClick={() => handleViewDetails(record)}
        //     className="view-button"
        //   />
        //   <Button
        //     type="text"
        //     icon={<EditOutlined />}
        //     onClick={() => onEdit({
        //       ...record,
        //       start_date: record.start_date ? dayjs(record.start_date) : null,
        //       end_date: record.end_date ? dayjs(record.end_date) : null
        //     })}
        //     className="employment-history-edit-button" 
        //   />
        //   <Button
        //     type="text"
        //     icon={<DeleteOutlined />}
        //     onClick={() => {
        //       if (window.confirm('Are you sure you want to delete this record?')) {
        //         onDelete(record.id);
        //       }
        //     }}
        //     className="delete-button"
        //   />
        // </div>
        <Space>
                  {/* <Button icon={<InfoCircleOutlined />} */}
                  <Button icon={<EditOutlined />}
                          // onClick={() => { setSelectedRecord(record); setIsDetailsVisible(true); }}
                          onClick={() => {
                                     setEditing({
                                       ...record,
                                       start_date: record.start_date
                                         ? dayjs(record.start_date)
                                         : null,
                                       end_date: record.end_date
                                         ? dayjs(record.end_date)
                                         : null
                                     });
                                     setModalVisible(true);
                                   }}
                          disabled={pending}
                  />
                  <Button icon={<DeleteOutlined />}
                          danger
                          onClick={() =>
                            onRequestChange({
                              data: { id: record.id },
                              requestType: 'delete',
                            })
                          }
                          disabled={pending}
                  />
                </Space>
      ),
    },
  ];

  return (
    <div className="custom-table-container">
      {pending && (
        <Alert
          type="warning"
          showIcon
          message="You have pending changes awaiting approval."
          style={{ marginBottom: 16 }}
        />
     )}

<Space className="action-buttons">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-button"
          onClick={handleAdd}
          disabled={pending}
        >
          Add Record
        </Button>
      </Space>


      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="custom-table"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No employment history found' }}
        bordered
      />

      {/* Employment Details Modal */}
      <Modal
        title="Employment Record Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Job Title">{selectedRecord.job_title}</Descriptions.Item>
            <Descriptions.Item label="Company">{selectedRecord.company}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{formatDate(selectedRecord.start_date)}</Descriptions.Item>
            <Descriptions.Item label="End Date">
              {selectedRecord.end_date ? formatDate(selectedRecord.end_date) : 'Present'}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              {selectedRecord.details || 'No additional details'}
            </Descriptions.Item>
            {selectedRecord.documents_path?.length > 0 && (
              <Descriptions.Item label="Documents">
                <div className="document-section">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewDocumentsList(selectedRecord.documents_path)}
                  >
                    View Documents
                  </Button>
                  <Dropdown overlay={downloadMenu(selectedRecord)} style={{ marginLeft: 8 }}>
                    <Button icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Dropdown>
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal> 

<EmploymentHistoryModal
        visible={modalVisible}
        initialValues={editing}
        onCancel={() => setModalVisible(false)}
        onFinish={(values, files) => {
          onRequestChange({
            data: values,
            requestType: editing ? 'update' : 'save',
            files,
          });
          setModalVisible(false);
        }}
      />


      {/* Document Preview Modal */}
      <Modal
        title={`Document: ${documentPreview.name || 'Preview'}`}
        visible={documentPreview.visible}
        onCancel={() => setDocumentPreview({ ...documentPreview, visible: false })}
        footer={[
          <Button 
            key="download" 
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadDocument(documentPreview.url, documentPreview.name)}
          >
            Download
          </Button>,
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setDocumentPreview({ ...documentPreview, visible: false })}
          >
            Close
          </Button>
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        {documentPreview.url && (
          <iframe 
            src={documentPreview.url} 
            style={{ width: '100%', height: '70vh', border: 'none' }}
            title="Document preview"
          />
        )}
      </Modal>

      {/* Documents List Modal */}
      <Modal
        title={documentsListModal.mode === 'view' ? "View Documents" : "Download Documents"}
        visible={documentsListModal.visible}
        onCancel={() => setDocumentsListModal({ ...documentsListModal, visible: false })}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setDocumentsListModal({ ...documentsListModal, visible: false })}
          >
            Close
          </Button>
        ]}
        width={600}
      >
        <List
          itemLayout="horizontal"
          dataSource={documentsListModal.documents}
          renderItem={item => (
            <List.Item
              actions={[
                documentsListModal.mode === 'view' ? 
                  <Button 
                    key="view" 
                    type="primary" 
                    onClick={() => handleViewDocument(item.url, item.name)}
                  >
                    View
                  </Button> :
                  <Button 
                    key="download" 
                    type="primary" 
                    onClick={() => handleDownloadDocument(item.url, item.name)}
                  >
                    Download
                  </Button>
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(item.name)}
                title={item.name}
                description={`Added on ${new Date(parseInt(item.uid?.replace(/[^0-9]/g, '') || Date.now())).toLocaleDateString()}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default EmploymentHistoryTable;