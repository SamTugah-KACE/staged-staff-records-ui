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

// parse a JSON‐string or object into { filename: url } map
function parsePaths(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); }
    catch { return {}; }
  }
  return raw;
}


const QualificationsTable = ({ data, type, onEdit, onDelete }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [documentsListVisible, setDocumentsListVisible] = useState(false);
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [documentListMode, setDocumentListMode] = useState('view'); // 'view' or 'download'

  const [docList, setDocList] = useState([]);
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docMode, setDocMode] = useState('view'); // or 'download'

  
   // helper: build your canonical docs array for a record
   const docsFor = (record) => {
    const raw = type === 'academic'
      ? record.certificate_path
      : record.license_path;
    const map = parsePaths(raw);
    return Object.entries(map).map(([name, url]) => ({ name, url }));
  };

  
  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const handleDetails = (record) => {
    setCurrentDetails(record);
        // Ensure details is always an object
    // let normalizedDetails = {};
    // if (typeof record.details === 'string') {
    //   try {
    //     normalizedDetails = JSON.parse(record.details);
    //   } catch {
    //     normalizedDetails = {};
    //   }
    // } else {
    //   normalizedDetails = record.details || {};
    // }
    // setCurrentDetails({ ...record, details: normalizedDetails });
    setDetailsVisible(true);
  };

  const showPreview = file => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const openDocs = (record, mode) => {
    // pick the correct field
    const raw = type === 'academic'
      ? record.certificate_path
      : record.license_path;
    const map = parsePaths(raw);
    const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
    setDocList(docs);
    setDocMode(mode);
    setDocModalVisible(true);
  };

  const downloadBlob = ({ url, name }) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };


  const handleViewDocuments = (record) => {
    // Handle multiple documents
    const docsArray = docsFor(record);
  if (docsArray.length > 0) {
      setCurrentDocuments(record.certificate_path);
      setDocumentListMode('view');
      setDocumentsListVisible(true);
    } else if (type === 'professional' && record.license_path && record.license_path.length > 0) {
      setCurrentDocuments(record.license_path);
      setDocumentListMode('view');
      setDocumentsListVisible(true);
    } 


    // if (record.documents && record.documents.length > 0) {
    //   setCurrentDocuments(record.documents);
    //   setDocumentListMode('view');
    //   setDocumentsListVisible(true);
    // } 
    else if (record.filePath) {
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
    // if (record.documents && record.documents.length > 0) {
    //   setCurrentDocuments(record.documents);
    //   setDocumentListMode('download');
    //   setDocumentsListVisible(true);
    // } else if (record.filePath) {
    //   // Backward compatibility for single file
    //   const link = document.createElement('a');
    //   link.href = record.filePath;
    //   link.download = `${type}_qualification_document_${record.id}.pdf`;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // }

    // Handle multiple documents
    // if (type === 'academic' && record.certificate_path && record.certificate_path.length > 0) {
    //   setCurrentDocuments(record.certificate_path);
    //   setDocumentListMode('download');
    //   setDocumentsListVisible(true);
    // } else if (type === 'professional' && record.license_path && record.license_path.length > 0) {
    //   setCurrentDocuments(record.license_path);
    //   setDocumentListMode('download');
    //   setDocumentsListVisible(true);
    // } else if (record.filePath) {
    //   handlePreview({
    //     url: record.filePath,
    //     name: `${type}_qualification_document_${record.id}`
    //   });
    // }
    

    const raw = type === 'academic'
      ? record.certificate_path
      : record.license_path;

    const map = parsePaths(raw);
    const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
    setDocList(docs);
    setDocMode('download');
    setDocModalVisible(true);




    // const docsArray = docsFor(record);
    // if (docsArray.length > 0) {
    //   setDocList(docsArray);
    //   setDocMode('download');
    //   setDocModalVisible(true);
    // } else if (record.filePath) {
    //   const a = document.createElement('a');
    //   a.href = record.filePath;
    //   a.download = `doc_${record.id}`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // }



  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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
Year Obtained: ${record.year_obtained || 'N/A'}
GPA: ${record.details.gpa || 'N/A'}
        `;
      } else {
        return `
Professional Qualification Details:
-------------------------------
Institution: ${record.institution || 'N/A'}
Qualification: ${record.qualification_name || 'N/A'}
Year Obtained: ${record.year_obtained || 'N/A'}
Additional Info: ${record.details.additional_info || 'N/A'}
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
      
      {/* {((record.documents && record.documents.length > 0) || record.filePath) && ( */}
      {/* {(((type==="academic" ? record.certificate_path : record.license_path) && (record.certificate_path.length > 0 || record.license_path.length > 0)) || record.filePath) */}
      { (docsFor(record).length > 0 || record.filePath) }
        
        <Menu.Item 
          key="1" 
          icon={<FilePdfOutlined />} 
          onClick={() => handleDownloadDocuments(record)}
        >
          Download Documents
        </Menu.Item>
      
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
      dataIndex: type === 'academic' ? 'degree' : 'qualification_name',
      key: 'qualification',
      render: (text) => text || 'N/A',
    },
    // {
    //   title: type === 'academic' ? 'Major' : 'Field',
    //   dataIndex: type === 'academic' ? 'major' : 'field',
    //   key: 'field',
    //   render: (text) => text || 'N/A',
    // },
    {
      title: 'Year',
      dataIndex: 'year_obtained',
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
      // render: (_, record) => {
      //   // const hasDocuments = (record.documents && record.documents.length > 0) || record.filePath;
      //   const hasDocuments = ("academic" === type && record.certificate_path && record.certificate_path.length > 0) || ("professional" === type && record.license_path && record.license_path.length > 0) || record.filePath;
      //   return hasDocuments ? (
      //     <div className="file-actions">
      //       <Button 
      //         type="text"
      //         icon={<EyeOutlined />} 
      //         onClick={() => handleViewDocuments(record)}
      //         className="view-file-button"
      //       />
      //       <Dropdown overlay={downloadMenu(record)}>
      //         <Button 
      //           type="text"
      //           icon={<DownloadOutlined />}
      //           className="download-file-button"
      //         />
      //       </Dropdown>
      //     </div>
      //   ) : <span>No documents</span>;
      // },
      render: (_, record) => {
        // const raw = type === 'academic'
        //   ? record.certificate_path
        //   : record.license_path;
        // const map = parsePaths(raw);
        // const has = Object.keys(map).length > 0;
        const docsArray = docsFor(record);
        const has = docsArray.length > 0 || record.filePath;
        return has ? (
          <>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => openDocs(record, 'view')}
            />
             <Dropdown overlay={downloadMenu(record)}>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              className="download-file-button"
              onClick={() => openDocs(record, 'download')}
            />
            </Dropdown>
          </>
        ) : <Text type="secondary">No docs</Text>;
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
        // dataSource={data} 
        dataSource={Array.isArray(data) ? data : []}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="custom-table"
        locale={{ emptyText: `No ${type} qualifications found` }}
      />

      {/* Modal for previewing a single document */}
      {/* <Modal
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
      {/* <Modal
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
      >  */}

      {/* Single‐file preview */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
      >
        {previewFile && (
          <iframe
            src={previewFile.url || previewFile}
            style={{ width: '100%', height: '70vh', border: 'none' }}
          />
        )}
      </Modal>

      {/* Documents list */}
      <Modal
        visible={docModalVisible}
        title={docMode === 'view' ? 'View Documents' : 'Download Documents'}
        footer={[
          <Button key="close" onClick={() => setDocModalVisible(false)}>
            Close
          </Button>
        ]}
        onCancel={() => setDocModalVisible(false)}
        width={600}
      >

        {/* <List
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
          )} */}
          <List
          dataSource={docList}
          renderItem={doc => (
            <List.Item
              actions={[
                docMode === 'view' ? (
                  <Button onClick={() => showPreview(doc)}>View</Button>
                ) : (
                  <Button onClick={() => downloadBlob(doc)}>Download</Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={doc.name}
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
              {type === 'academic' ? currentDetails.degree : currentDetails.qualification_name || 'N/A'}
            </Descriptions.Item>
           
            <Descriptions.Item label="Year Obtained">{currentDetails.year_obtained || 'N/A'}</Descriptions.Item>
            
            {/* {type === 'academic' ? (
              <>
                <Descriptions.Item label="GPA">{currentDetails.details.gpa || 'N/A'}</Descriptions.Item>
               
              </>
            ) : (
              <>
               
              </>
            )} */}

{type === 'academic' && (
              <Descriptions.Item label="GPA">
                {currentDetails.details?.gpa ?? 'N/A'}
              </Descriptions.Item>
            )}
            {type === 'professional' && (
              // If you have other custom detail fields, show them here.
              <Descriptions.Item label="Additional Info">
                {currentDetails.details?.additional_info ?? 'N/A'}
                {/* {currentDetails.details?.id ?? 'N/A'} */}
              
              </Descriptions.Item>
            )}
            
            {/* {((currentDetails.documents && currentDetails.documents.length > 0) || currentDetails.filePath) && ( */}

{/* {(((type==="academic" ? currentDetails.certificate_path : currentDetails.license_path) && (currentDetails.certificate_path.length > 0 || currentDetails.license_path.length > 0)) || currentDetails.filePath)
   

&& (
              <Descriptions.Item label="Documents">
                <div className="document-section">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => {
                      // if (currentDetails.documents && currentDetails.documents.length > 0) {
                      if (type === 'academic' && currentDetails.certificate_path && currentDetails.certificate_path.length > 0) {
                        // Handle multiple documents
                        // setCurrentDocuments(currentDetails.certificate_path);
                        // setDocumentListMode('view');
                        // setDocumentsListVisible(true);

                        // setDocList(currentDetails.certificate_path);
                      

                        setDocMode('view');
                        setDocModalVisible(true);
                      
                      } else if (type === 'professional' && currentDetails.license_path && currentDetails.license_path.length > 0) {
                        // setCurrentDocuments(currentDetails.license_path);
                        // setDocumentListMode('view');
                        // setDocumentsListVisible(true);

                        setDocMode('view');
                        setDocModalVisible(true);
                      }
                       
                      else if (currentDetails.filePath) {
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
            )} */}

            {/* new: get a docs array once */}
            {(() => {
              const docs = docsFor(currentDetails);
              const hasLegacy = !!currentDetails.filePath;
              return (docs.length > 0 || hasLegacy) ? (
                  <Descriptions.Item label="Documents">
                  <div className="document-section">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => {
                        if (docs.length > 0) {
                          // show the list in the same way your "Download" / "View" modals do
                          setDocList(docs);
                          setDocMode('view');
                          setDocModalVisible(true);
                        } else if (hasLegacy) {
                          handlePreview({
                            url: currentDetails.filePath,
                            name: `${type}_qualification_${currentDetails.id}`,
                          });
                        }
                      }}
                    >
                      View Documents
                    </Button>
                    <Dropdown overlay={downloadMenu(currentDetails)} style={{ marginLeft: 8 }}>
                      <Button icon={<DownloadOutlined />}>Download</Button>
                    </Dropdown>
                  </div>
                </Descriptions.Item>
              ) : null;
           })()}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default QualificationsTable;