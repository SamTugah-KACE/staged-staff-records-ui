import React, { useState } from 'react';
import { Table, Button, Modal, Space, Menu, Dropdown, List, Descriptions, Typography } from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FileOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const QualificationsTable = ({ data, type, onEdit, onDelete }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [documentsListVisible, setDocumentsListVisible] = useState(false);
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [documentListMode, setDocumentListMode] = useState('view'); // 'view' or 'download'

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const handleDetails = (record) => {
    setCurrentDetails(record);
    setDetailsVisible(true);
  };

  const handleViewDocuments = (record) => {
    // Handle multiple documents
    if (record.documents && record.documents.length > 0) {
      setCurrentDocuments(record.documents);
      setDocumentListMode('view');
      setDocumentsListVisible(true);
    } else if (record.filePath) {
      // Backward compatibility for single file
      handlePreview({
        url: record.filePath,
        name: `${type}_qualification_document_${record.id}`
      });
    } else {
      // No documents
      Modal.info({
        title: 'No Documents',
        content: 'No documents are available for this qualification.',
      });
    }
  };

  const handleDownloadDocuments = (record) => {
    // Handle multiple documents
    if (record.documents && record.documents.length > 0) {
      setCurrentDocuments(record.documents);
      setDocumentListMode('download');
      setDocumentsListVisible(true);
    } else if (record.filePath) {
      // Backward compatibility for single file
      const link = document.createElement('a');
      link.href = record.filePath;
      link.download = `${type}_qualification_document_${record.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.href = document.url || document.filePath;
    link.download = document.name || `document_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to convert object details to downloadable text
  const downloadDetails = (record) => {
    const getDetailString = () => {
      if (type === 'academic') {
        return `
Academic Qualification Details:
----------------------------
Institution: ${record.institution || 'N/A'}
Degree: ${record.degree || 'N/A'}
Major: ${record.major || 'N/A'}
Year Obtained: ${record.yearObtained || 'N/A'}
GPA: ${record.gpa || 'N/A'}
Honors: ${record.honors || 'N/A'}
        `;
      } else {
        return `
Professional Qualification Details:
-------------------------------
Institution: ${record.institution || 'N/A'}
Qualification: ${record.qualification || 'N/A'}
Field: ${record.field || 'N/A'}
Year Obtained: ${record.yearObtained || 'N/A'}
Experience: ${record.experience || 'N/A'} years
Former Company: ${record.formerCompany || 'N/A'}
Reason for Leaving: ${record.leavingReason || 'N/A'}
Issuing Organization: ${record.issuingOrg || 'N/A'}
Publications: ${record.publications || 'N/A'}
        `;
      }
    };

    const element = document.createElement('a');
    const file = new Blob([getDetailString()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${type}_qualification_${record.id}.txt`;
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
      {((record.documents && record.documents.length > 0) || record.filePath) && (
        <Menu.Item 
          key="1" 
          icon={<FilePdfOutlined />} 
          onClick={() => handleDownloadDocuments(record)}
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

  const columns = [
    {
      title: 'Institution',
      dataIndex: 'institution',
      key: 'institution',
      render: (text) => text || 'N/A',
    },
    {
      title: type === 'academic' ? 'Degree' : 'Qualification',
      dataIndex: type === 'academic' ? 'degree' : 'qualification',
      key: 'qualification',
      render: (text) => text || 'N/A',
    },
    {
      title: type === 'academic' ? 'Major' : 'Field',
      dataIndex: type === 'academic' ? 'major' : 'field',
      key: 'field',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Year',
      dataIndex: 'yearObtained',
      key: 'year',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button 
          type="text"
          icon={<InfoCircleOutlined />} 
          onClick={() => handleDetails(record)}
          className="view-button"
        />
      ),
    },
    {
      title: 'Documents',
      key: 'documents',
      render: (_, record) => {
        const hasDocuments = (record.documents && record.documents.length > 0) || record.filePath;
        return hasDocuments ? (
          <div className="file-actions">
            <Button 
              type="text"
              icon={<EyeOutlined />} 
              onClick={() => handleViewDocuments(record)}
              className="view-file-button"
            />
            <Dropdown overlay={downloadMenu(record)}>
              <Button 
                type="text"
                icon={<DownloadOutlined />}
                className="download-file-button"
              />
            </Dropdown>
          </div>
        ) : <span>No documents</span>;
      },
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
            className="employment-history-edit-button"
          />
          <Button 
            type="text"
            icon={<DeleteOutlined />} 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this record?')) {
                onDelete(record.id);
              }
            }}
            className="delete-button"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="custom-table-container">
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="custom-table"
        locale={{ emptyText: `No ${type} qualifications found` }}
      />

      {/* Modal for previewing a single document */}
      <Modal
        visible={previewVisible}
        title={`Document: ${previewFile?.name || 'Preview'}`}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setPreviewVisible(false)}
          >
            Close
          </Button>
        ]}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        style={{ top: 20 }}
        zIndex={2000} // Higher zIndex to appear on top
      >
        {previewFile && (
          <iframe 
            src={previewFile.url || previewFile} 
            style={{ width: '100%', height: '70vh', border: 'none' }} 
            title="Document Preview"
          />
        )}
      </Modal>

      {/* Modal for listing all documents */}
      <Modal
        visible={documentsListVisible}
        title={documentListMode === 'view' ? "View Documents" : "Download Documents"}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setDocumentsListVisible(false)}
          >
            Close
          </Button>
        ]}
        onCancel={() => setDocumentsListVisible(false)}
        width={600}
        zIndex={2000} // Higher zIndex to appear on top
      >
        <List
          itemLayout="horizontal"
          dataSource={currentDocuments.length > 0 ? currentDocuments : (currentDetails?.filePath ? [{ 
            uid: '1', 
            name: 'Document', 
            filePath: currentDetails.filePath 
          }] : [])}
          renderItem={doc => (
            <List.Item
              actions={[
                documentListMode === 'view' ? (
                  <Button 
                    key="view"
                    type="primary"
                    onClick={() => handlePreview(doc.url || doc.filePath)}
                  >
                    View
                  </Button>
                ) : (
                  <Button 
                    key="download"
                    type="primary"
                    onClick={() => downloadDocument(doc)}
                  >
                    Download
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(doc.name)}
                title={doc.name || 'Document'}
                description={`Added on ${new Date(parseInt(doc.uid?.replace(/[^0-9]/g, '') || Date.now())).toLocaleDateString()}`}
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal for qualification details */}
      <Modal
        visible={detailsVisible}
        title={`${type === 'academic' ? 'Academic' : 'Professional'} Qualification Details`}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setDetailsVisible(false)}
          >
            Close
          </Button>
        ]}
        onCancel={() => setDetailsVisible(false)}
        width={700}
        zIndex={1000}
      >
        {currentDetails && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Institution">{currentDetails.institution || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={type === 'academic' ? 'Degree' : 'Qualification'}>
              {type === 'academic' ? currentDetails.degree : currentDetails.qualification || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={type === 'academic' ? 'Major' : 'Field'}>
              {type === 'academic' ? currentDetails.major : currentDetails.field || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Year Obtained">{currentDetails.yearObtained || 'N/A'}</Descriptions.Item>
            
            {type === 'academic' ? (
              <>
                <Descriptions.Item label="GPA">{currentDetails.gpa || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Honors/Distinctions">
                  {currentDetails.honors ? (
                    <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                      {currentDetails.honors.split(',').map((honor, index) => (
                        <li key={index}>{honor.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    'None specified'
                  )}
                </Descriptions.Item>
              </>
            ) : (
              <>
                <Descriptions.Item label="Experience">{currentDetails.experience || '0'} years</Descriptions.Item>
                <Descriptions.Item label="Former Company">{currentDetails.formerCompany || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Reason for Leaving">{currentDetails.leavingReason || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Issuing Organization">{currentDetails.issuingOrg || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Publications">
                  {currentDetails.publications ? (
                    <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                      {currentDetails.publications.split(',').map((link, index) => (
                        <li key={index}>
                          <a href={link.trim()} target="_blank" rel="noopener noreferrer">
                            {link.trim()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'None specified'
                  )}
                </Descriptions.Item>
              </>
            )}
            
            {((currentDetails.documents && currentDetails.documents.length > 0) || currentDetails.filePath) && (
              <Descriptions.Item label="Documents">
                <div className="document-section">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => {
                      if (currentDetails.documents && currentDetails.documents.length > 0) {
                        setCurrentDocuments(currentDetails.documents);
                        setDocumentListMode('view');
                        setDocumentsListVisible(true); 
                      } else if (currentDetails.filePath) {
                        handlePreview({
                          url: currentDetails.filePath,
                          name: `${type}_qualification_document_${currentDetails.id}`
                        });
                      }
                    }}
                  >
                    View Documents
                  </Button>
                  <Dropdown overlay={downloadMenu(currentDetails)} style={{ marginLeft: 8 }}>
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
    </div>
  );
};

export default QualificationsTable;