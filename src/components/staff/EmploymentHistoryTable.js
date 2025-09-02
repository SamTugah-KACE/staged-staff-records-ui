// src/components/EmploymentHistoryTable.js
import React, { useState } from 'react';
import { Table, Button, Modal, Descriptions, List, Dropdown, Menu, Alert } from 'antd';
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import EmploymentHistoryModal from './EmploymentHistoryModal';
import EmploymentHistoryDetailsModal from './EmploymentHistoryDetailsModal';
import DocumentViewerModal from './DocumentViewerModal';

export default function EmploymentHistoryTable({
  data = [],
  pending,
  onRequestChange,
  onEdit,
  onDelete
}) {
  const [detailRec, setDetailRec] = useState(null);
  const [docList, setDocList] = useState([]);
  const [docMode, setDocMode] = useState('view'); // or 'download'
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);


  // parse a JSON‐string or object into { filename: url } map
function parsePaths(raw) {
    if (!raw) return {};
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); }
      catch { return {}; }
    }
    return raw;
  }

   // helper: build your canonical docs array for a record
   const docsFor = (record) => {
    const raw = record.documents_path;
    const map = parsePaths(raw);
    return Object.entries(map).map(([name, url]) => ({ name, url }));
  };

  // parse stringified JSON to [{name,url},…]
//   const docsFor = raw => {
//     try { return raw ? JSON.parse(raw) : []; }
//     catch { return []; }
//   };

  const showDocs = (rec, mode) => {
    setDocList(docsFor(rec));
    setDocMode(mode);
    setDocModalVisible(true);
  };

  const openDocs = (record, mode) => {
    console.log('record:: ', record);
    // pick the correct field
    const raw = record.documents_path;
    console.log("raw:: ", raw);
    const map = parsePaths(raw);
    console.log("doc map:: ", map)
    const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
    console.log("object docs: ", docs);
    setDocList(docs);
    setDocMode(mode);
    setDocModalVisible(true);
  };

  const handleDownloadDocuments = (record) => {
    const raw = record.documents_path;

    const map = parsePaths(raw);
    const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
    setDocList(docs);
    setDocMode('download');
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


  const downloadDoc = ({ url, name }) => {
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a);
    a.click(); document.body.removeChild(a);
  };

  const showPreview = file => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };


  

  const detailMenu = rec => (
    <Menu>
      {docsFor(rec.documents_path).length > 0 && (
        <Menu.Item
          icon={<FilePdfOutlined />}
          onClick={() => showDocs(rec, 'download')}
        >
          Download Documents
        </Menu.Item>
      )}
      <Menu.Item
        icon={<FileTextOutlined />}
        onClick={() => {
          const txt = `
Company: ${rec.company}
Job Title: ${rec.job_title}
Start: ${rec.start_date}
End: ${rec.end_date || 'Present'}
Details: ${rec.details || '—'}
`;
          const blob = new Blob([txt], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `employment_history_${rec.id}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
      >
        Download Details
      </Menu.Item>
    </Menu>
  );

  //   // Function to convert object details to downloadable text
  const downloadDetails = (record) => {
    const getDetailString = () => {
        return `
\t\t\t\t\tEmployee Employment History:
------------------------------------------------------------------------------------------------------------------------------------------------------
Company			 |         Job Title		 |         Appointment Date	         | End Date			 | Reason for Leaving 
\n
-------------------------|-------------------------------|---------------------------------------|-------------------------------|---------------------\n
${record.company || 'N/A'} \t\t|${record.job_title || 'N/A'}\t\t|\t\t${record.start_date || 'N/A'}\t\t\t|${record.end_date || 'N/A'}\t\t| Details
        `;
    };

    const element = document.createElement('a');
    const file = new Blob([getDetailString()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `employee_employment_history_${record.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title' },
    {
      title: 'Start Date', dataIndex: 'start_date', key: 'start_date',
      render: d => d ? dayjs(d).format('YYYY-MM-DD') : '—'
    },
    {
      title: 'End Date', dataIndex: 'end_date', key: 'end_date',
      render: d => d ? dayjs(d).format('YYYY-MM-DD') : 'Present'
    },
    {
      title: 'Details', key: 'details',
      render: (_, rec) => (
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => setDetailRec(rec)}
        //   disabled={pending}
        />
      )
    },
    {
      title: 'Documents', key: 'documents',
      render: (_, rec) => {
        const docsArray = docsFor(rec);
        const has = docsArray.length > 0 || rec.filePath;
        return has ? (
        <>
              <Button
              type='text'
                icon={<EyeOutlined />}
                onClick={() => openDocs(rec, 'view')}
                // disabled={pending}
              />
             <Dropdown overlay={downloadMenu(rec)}>
                         <Button
                           type="text"
                           icon={<DownloadOutlined />}
                           className="download-file-button"
                           onClick={() => openDocs(rec, 'download')}
                         />
            </Dropdown>
            </>
         ) : '—';
      }
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, rec) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(rec)}
            disabled={pending}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(rec.id)}
            disabled={pending}
          />
        </>
      )
    }
  ];

  return (
    <div>
      {pending && <Alert type="warning" message="Changes pending approval" showIcon />}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Details Modal */}
      <Modal
        visible={!!detailRec}
        title="Employment Record Details"
        footer={null}
        onCancel={() => setDetailRec(null)}
        width={600}
      >
        {detailRec && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Company">{detailRec.company}</Descriptions.Item>
            <Descriptions.Item label="Job Title">{detailRec.job_title}</Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {dayjs(detailRec.start_date).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {detailRec.end_date ? dayjs(detailRec.end_date).format('YYYY-MM-DD') : 'Present'}
            </Descriptions.Item>
             <Descriptions.Item label="Details">
   {typeof detailRec.details === 'object'
     ? (detailRec.details.details || JSON.stringify(detailRec.details.details))
     : detailRec.details 
       || '—'}
 </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

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

      {/* Documents Viewer / Downloader Modal */}
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



      {/* <Modal
        visible={docModalVisible}
        title={docMode === 'view' ? 'View Documents' : 'Download Documents'}
        footer={<Button onClick={() => setDocModalVisible(false)}>Close</Button>}
        onCancel={() => setDocModalVisible(false)}
      >
        <List
          dataSource={docList}
          renderItem={doc => (
            <List.Item
              actions={[
                docMode === 'view'
                  ? <Button onClick={() => showDocs(doc, 'view')}>View</Button>
                  
                  : <Button onClick={() => downloadDoc(doc)}>Download</Button>
              ]}
            >
              {doc.name}
            </List.Item>
          )}
        />
      </Modal> */}
    </div>
  );
}



// // src/components/EmployeeEmploymentHistoryTable.js
// import React, { useState } from 'react';
// import { Table, Button, Space, Alert, Tag, Tooltip, Modal, List, message,Menu, Dropdown } from 'antd';
// import { PlusOutlined, InfoCircleOutlined, DeleteOutlined, PaperClipOutlined, DownloadOutlined, EditOutlined, FileOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import EmploymentHistoryModal from './EmploymentHistoryModal';
// import EmploymentHistoryDetailsModal from './EmploymentHistoryDetailsModal';
// import DocumentViewerModal from './DocumentViewerModal';

// const EmploymentHistoryTable = ({
//   data,
//   pending,
//   onRequestChange,
//   dataType = 'employment_history',
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [viewMode, setViewMode] = useState(false);
//   const [docListVisible, setDocListVisible] = useState(false);
//   const [activeFiles, setActiveFiles] = useState([]);
//   const [iframeModalVisible, setIframeModalVisible] = useState(false);
//   const [iframeUrl, setIframeUrl] = useState('');


//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [selectedDetails, setSelectedDetails] = useState(null);

//   const [documentModalVisible, setDocumentModalVisible] = useState(false);
//   const [currentFileUrl, setCurrentFileUrl] = useState(null);


//   const openModal = (item = null) => {
//     setEditingItem(item);
//     setModalVisible(true);
//   };

// // const openModal = (item = null, readOnly = false) => {
// //     setEditingItem(item);
// //     setViewMode(readOnly);
// //     setModalVisible(true);
// //   };

//   const handleSave = (record) => {
//     onRequestChange({
//       data: record,
//       requestType: editingItem ? 'update' : 'save',
//       dataType,
//     });
//     setModalVisible(false);
//   };

//   const handleDelete = (id) => {
//     onRequestChange({
//       data: { id },
//       requestType: 'delete',
//       dataType,
//     });
//   };

//   const handleViewDocuments = (record) => {
//     if (record?.files?.length > 0) {
//       setActiveFiles(record.files);
//       setDocListVisible(true);
//     } else {
//       message.warning('No documents found.');
//     }
//   };

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handlePreview = (url) => {
//     setIframeUrl(url);
//     setIframeModalVisible(true);
//   };


//   const openDetailsModal = (record) => {
//     setSelectedDetails(record);
//     setDetailsModalVisible(true);
//   };

//   const openViewer = (url) => {
//     setCurrentFileUrl(url);
//     setDocumentModalVisible(true);
//   };

//   const renderDocumentsMenu = (files) => (
//     <Menu>
//       <Menu.ItemGroup title="View Documents">
//         {files.map((file, idx) => (
//           <Menu.Item key={`view-${idx}`} icon={<EyeOutlined />} onClick={() => openViewer(file.path)}>
//             {file.name}
//           </Menu.Item>
//         ))}
//       </Menu.ItemGroup>
//       <Menu.ItemGroup title="Download Documents">
//         {files.map((file, idx) => (
//           <Menu.Item key={`download-${idx}`} icon={<DownloadOutlined />}>
//             <a href={file.path} target="_blank" rel="noopener noreferrer" download>
//               {file.name}
//             </a>
//           </Menu.Item>
//         ))}
//       </Menu.ItemGroup>
//     </Menu>
//   );

//   const columns = [
//     {
//       title: 'Company',
//       dataIndex: 'company',
//       key: 'company',
//     },
//     {
//       title: 'Job Title',
//       dataIndex: 'job_title',
//       key: 'job_title',
//     },
//     {
//       title: 'Start Date',
//       dataIndex: 'start_date',
//       key: 'start_date',
//       render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
//     },
//     {
//       title: 'End Date',
//       dataIndex: 'end_date',
//       key: 'end_date',
//       render: (date) =>
//         date ? dayjs(date).format('YYYY-MM-DD') : <Tag color="green">Present</Tag>,
//     },
//     {
//       title: 'Details',
//       dataIndex: 'details',
//       key: 'details',
//       render: (_, record) => (
//         <Tooltip title="View Full Details">
//           <Button
//             type="link"
//             icon={<InfoCircleOutlined />}
//             onClick={() => openDetailsModal(record)}
//           />
//         </Tooltip>
//       ),
//     },
//     {
//       title: 'Document',
//       dataIndex: 'documents_path',
//       key: 'documents_path',
//     //   render: (_, record) => (
//     //     record.files && record.files.length > 0 ? (
//     //       <Button
//     //         icon={<FileOutlined />}
//     //         type="link"
//     //         onClick={() => handleViewDocuments(record)}
//     //       >
//     //         View / Download
//     //       </Button>
//     //     ) : '—'
//     //   ),
//     render: (_, record) => {
//         const files = record.files || [];
//         if (!files.length) return '—';
//         return (
//           <Dropdown overlay={renderDocumentsMenu(files)} trigger={['click']}>
//             <Button icon={<PaperClipOutlined />}>Documents</Button>
//           </Dropdown>
//         );
//       },

//     //   render: (path) =>
//     //     path ? (
//     //       <Tooltip title="Download Document">
//     //         <a href={path} target="_blank" rel="noreferrer">
//     //           <PaperClipOutlined />
//     //         </a>
//     //       </Tooltip>
//     //     ) : '—',
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//             <Tooltip title="Edit">
//             <Button
//               type="text"
//               icon={<EditOutlined />}
//               onClick={() => openModal(record)}
//             />
//             </Tooltip>
         
//             <Tooltip title="Delete">
//             <Button
//               type="text"
//               icon={<DeleteOutlined />}
//               danger
//               onClick={() => handleDelete(record.id)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       {pending && (
//         <Alert
//           message="You have pending changes awaiting approval."
//           type="warning"
//           showIcon
//           style={{ marginBottom: 16 }}
//         />
//       )}

//       <div className='action-buttons'>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => openModal()}
//           disabled={pending}
//           className='add-button'
//         >
//           Add Employment History
//         </Button>
//       </div>

//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={false}
//       />

//       <EmploymentHistoryModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onSubmit={handleSave}
//         initialValues={editingItem}
//       />

// <EmploymentHistoryDetailsModal
//         visible={detailsModalVisible}
//         onClose={() => setDetailsModalVisible(false)}
//         record={selectedDetails || {}}
//       />

//       <DocumentViewerModal
//         visible={documentModalVisible}
//         onClose={() => setDocumentModalVisible(false)}
//         fileUrl={currentFileUrl}
//       />

//     </>
//   );
// };

// export default EmploymentHistoryTable;




{/* ===========================================================================================================================================*/ }

// import React, { useState } from 'react';
// import { Table, Button, Modal, Space, Menu, Dropdown, List, Descriptions, Tag, Tooltip, Typography } from 'antd';
// import { 
//   EyeOutlined, 
//   DownloadOutlined, 
//   EditOutlined, 
//   DeleteOutlined, 
//   InfoCircleOutlined,
//   FilePdfOutlined,
//   FileTextOutlined,
//   FileImageOutlined,
//   FileOutlined,
//   PlusOutlined
// } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import EmploymentHistoryModal from './EmploymentHistoryModal';
// import EmploymentHistoryDetailsModal from './EmploymentHistoryDetailsModal';
// import DocumentViewerModal from './DocumentViewerModal';

// const { Text } = Typography;

// // parse a JSON‐string or object into { filename: url } map
// function parsePaths(raw) {
//   if (!raw) return {};
//   if (typeof raw === 'string') {
//     try { return JSON.parse(raw); }
//     catch { return {}; }
//   }
//   return raw;
// }


// const EmploymentHistoryTable = ({ data, pending, onRequestChange, onEdit, onDelete }) => {
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [detailsVisible, setDetailsVisible] = useState(false);
//   const [currentDetails, setCurrentDetails] = useState(null);
//   const [documentsListVisible, setDocumentsListVisible] = useState(false);
//   const [currentDocuments, setCurrentDocuments] = useState([]);
//   const [documentListMode, setDocumentListMode] = useState('view'); // 'view' or 'download'
//     const [editingItem, setEditingItem] = useState(null);

//   const [docList, setDocList] = useState([]);
//   const [docModalVisible, setDocModalVisible] = useState(false);
//   const [docMode, setDocMode] = useState('view'); // or 'download'
//  const [modalFile, setModalFile] = useState(null);
//  const [showModal, setShowModal] = useState(false);

//    // Employment History state
//    const [employmentHistory, setEmploymentHistory] = useState([]);
//    const [currentHistory, setCurrentHistory] = useState(null);
//      const [showHistoryForm, setShowHistoryForm] = useState(false);
  
//    // helper: build your canonical docs array for a record
//    const docsFor = (record) => {
//     const raw = record.documents_path;
//     const map = parsePaths(raw);
//     return Object.entries(map).map(([name, url]) => ({ name, url }));
//   };

  
//   const handlePreview = (file) => {
//     setPreviewFile(file);
//     setPreviewVisible(true);
//   };

//   const handleDetails = (record) => {
//     setCurrentDetails(record);
//     setDetailsVisible(true);
//   };

//   const showPreview = file => {
//     setPreviewFile(file);
//     setPreviewVisible(true);
//   };

//   const openDocs = (record, mode) => {
//     // pick the correct field
//     const raw =  record.documents_path;
//     const map = parsePaths(raw);
//     const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
//     setDocList(docs);
//     setDocMode(mode);
//     setDocModalVisible(true);
//   };


//   const downloadBlob = ({ url, name }) => {
//     const a = document.createElement('a');
//     a.href = url;
//     a.target = '_blank';
//     a.rel = 'noopener noreferrer';
//     a.download = name;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };


//   const handleViewDocuments = (record) => {
//     // Handle multiple documents
//     const docsArray = docsFor(record);
//   if (docsArray.length > 0) {
//       setCurrentDocuments(record.documents_path);
//       setDocumentListMode('view');
//       setDocumentsListVisible(true);
//     } 



//     else if (record.filePath) {
//       // Backward compatibility for single file
//       handlePreview({
//         url: record.filePath,
//         name: `employment_history__document_${record.id}`
//       });
//     } else {
//       // No documents
//       Modal.info({
//         title: 'No Documents',
//         content: 'No documents are available for this qualification.',
//       });
//     }
//   };

//   const handleDownloadDocuments = (record) => {
 
//     const raw = record.documents_path;

//     const map = parsePaths(raw);
//     const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
//     setDocList(docs);
//     setDocMode('download');
//     setDocModalVisible(true);
//   };

//   // Employment History handlers
//   const handleEditHistory = (record) => {
//     setCurrentHistory({
//       ...record,
//       documents_path: record.documents_path || []
//     });
//     setShowHistoryForm(true);
//   };

//   const handleAddHistory = () => {
//     setCurrentHistory({
//       id: null,
//       job_title: '',
//       company: '',
//       start_date: '',
//       end_date: '',
//       details: '',
//       documents_path: []
//     });
//     setShowHistoryForm(true);
//   };

//   const handleDeleteHistory = (id) => {
//     setEmploymentHistory(employmentHistory.filter(job => job.id !== id));
//   };

  
//   // Mock file upload function - replace with actual API call
//   const uploadFile = async (file) => {
//     // Simulate file upload delay
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(`/documents/employment/${Date.now()}_${file.name}`);
//       }, 1000);
//     });
//   };


//   const handleSaveHistory = async (values, files) => {
//     let documentPaths = [];
    
//     // Handle file uploads if new files were added
//     if (values.documents_path && values.documents_path.length > 0) {
//       for (const file of values.documents_path) {
//         if (file.originFileObj) {
//           // New file upload
//           const documentPath = await uploadFile(file.originFileObj);
//           documentPaths.push({ 
//             uid: `-${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             name: file.originFileObj.name,
//             status: 'done',
//             url: documentPath
//           });
//         } else if (file.url) {
//           // Existing file
//           documentPaths.push(file);
//         }
//       }
//     }

//     const newEntry = {
//       ...values,
//       documents_path: documentPaths
//     };

//     if (currentHistory?.id) {
//       setEmploymentHistory(employmentHistory.map(job => 
//         job.id === currentHistory.id ? newEntry : job
//       ));
//     } else {
//       setEmploymentHistory([
//         ...employmentHistory,
//         {
//           ...newEntry,
//           id: Date.now().toString()
//         }
//       ]);
//     }

//     onRequestChange(values, currentHistory?.id ? 'update' : 'save', files);

   
    
//     // setShowHistoryForm(false);/
//     setCurrentHistory(null);
//   };

    
//   // Cancel handlers
//   const handleCancelHistoryForm = () => {
//     setShowHistoryForm(false);
//     setCurrentHistory(null);
//   };

//   const downloadDocument = (document) => {
//     const link = document.createElement('a');
//     link.target = '_blank';
//     link.rel = 'noopener noreferrer';
//     link.href = document.url || document.filePath;
//     link.download = document.name || `document_${Date.now()}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Function to convert object details to downloadable text
//   const downloadDetails = (record) => {
//     const getDetailString = () => {
//         return `
// \t\t\t\t\tEmployee Employment History:
// ------------------------------------------------------------------------------------------------------------------------------------------------------
// Company			 |         Job Title		 |         Appointment Date	         | End Date			 | Reason for Leaving 
// \n
// -------------------------|-------------------------------|---------------------------------------|-------------------------------|---------------------\n
// ${record.company || 'N/A'} \t\t|${record.job_title || 'N/A'}\t\t|\t\t${record.start_date || 'N/A'}\t\t\t|${record.end_date || 'N/A'}\t\t| Details
//         `;
//     };

//     const element = document.createElement('a');
//     const file = new Blob([getDetailString()], {type: 'text/plain'});
//     element.href = URL.createObjectURL(file);
//     element.download = `employee_employment_history_${record.id}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

  

//   const downloadMenu = (record) => (
//     <Menu>
      
//       { (docsFor(record).length > 0 || record.filePath) }
        
//         <Menu.Item 
//           key="1" 
//           icon={<FilePdfOutlined />} 
//           onClick={() => handleDownloadDocuments(record)}
//         >
//           Download Documents
//         </Menu.Item>
      
//       <Menu.Item 
//         key="2" 
//         icon={<FileTextOutlined />} 
//         onClick={() => downloadDetails(record)}
//       >
//         Download Details as Text
//       </Menu.Item>

//     </Menu>
//   );

  


//   const handleCancel = () => {
//     setShowModal(false);
//     setCurrentDetails(null);
//   };


//     const columns = [
//     {
//       title: 'Company',
//       dataIndex: 'company',
//       key: 'company',
//     },
//     {
//       title: 'Job Title',
//       dataIndex: 'job_title',
//       key: 'job_title',
//     },
//     {
//       title: 'Start Date',
//       dataIndex: 'start_date',
//       key: 'start_date',
//       render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
//     },
//     {
//       title: 'End Date',
//       dataIndex: 'end_date',
//       key: 'end_date',
//       render: (date) =>
//         date ? dayjs(date).format('YYYY-MM-DD') : <Tag color="green">Present</Tag>,
//     },
//     {
//       title: 'Details',
//       key: 'details',
//       render: (_, record) => (
//         <Button 
//           type="text"
//           icon={<InfoCircleOutlined />} 
//           onClick={() => handleDetails(record)}
//           className="view-button"
//         />
//       ),
//     },
//     {
//       title: 'Documents',
//       key: 'documents',
//       render: (_, record) => {
//         const docsArray = docsFor(record);
//         const has = docsArray.length > 0 || record.filePath;
//         return has ? (
//           <>
//             <Button
//               type="text"
//               icon={<EyeOutlined />}
//               onClick={() => openDocs(record, 'view')}
//             />
//              <Dropdown overlay={downloadMenu(record)}>
//             <Button
//               type="text"
//               icon={<DownloadOutlined />}
//               className="download-file-button"
//               // onClick={() => openDocs(record, 'download')}
//             />
//             </Dropdown>
//           </>
//         ) : <Text type="secondary">No docs</Text>;
//       },

//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <div className="actions">
//           <Button 
//             type="text"
//             icon={<EditOutlined />} 
//             onClick={() => onEdit(record)} 
//             className="employment-history-edit-button"
//           />
//           <Button 
//             type="text"
//             icon={<DeleteOutlined />} 
//             onClick={() => {
//               if (window.confirm('Are you sure you want to delete this record?')) {
//                 onDelete(record.id);
//               }
//             }}
//             className="delete-button"
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="custom-table-container">
//         {pending && (
//         <div className="pending-banner">
//           ⚠️ Your changes to your Employment History are pending approval
//         </div>
//       )}
//       <Table 
//         columns={columns} 
//         // dataSource={data} 
//         dataSource={Array.isArray(data) ? data : []}
//         rowKey="id"
//         pagination={{ pageSize: 5 }}
//         className="custom-table"
//         locale={{ emptyText: `No History found` }}
//       />

//         <EmploymentHistoryModal
//       open={showHistoryForm}                // ① use `open` not `visible`
//       initialValues={currentHistory ?? {}}
//       onFinish={(values, files) => {        // ② call your save handler
//         handleSaveHistory(values, files);
//       }}
//       onCancel={handleCancelHistoryForm}     // ③ unified closing
//     /> 

      
      {/* Single‐file preview */}
      {/* <Modal
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
      </Modal> */}

      {/* Documents list */}
      {/* <Modal
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
      </Modal> */}

      {/* Modal for qualification details */}
      {/* <Modal
        visible={detailsVisible}
        title={`Employment History Details`}
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
             <Descriptions.Item label="Company">{currentDetails.company}</Descriptions.Item>
                    <Descriptions.Item label="Job Title">{currentDetails.job_title}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{dayjs(currentDetails.start_date).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{currentDetails.end_date ? dayjs(currentDetails.end_date).format('YYYY-MM-DD') : 'Present'}</Descriptions.Item>
                    <Descriptions.Item label="Details">{currentDetails.details || '—'}</Descriptions.Item>
                   */}

            {/* new: get a docs array once */}
            {/* {(() => {
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
                            name: `employment_history_${currentDetails.id}`,
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
      </Modal> */}
//     </div>
//   );
// };

// export default EmploymentHistoryTable;


{/*======================================================================================================================== */}

