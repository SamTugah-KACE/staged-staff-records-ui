import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Upload, message, Select, Tag, Tooltip, Modal, List } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import './Form.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// parse a JSON‐string or object into { filename: url } map
function parsePaths(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); }
    catch { return {}; }
  }
  return raw;
}


// Title‐case helper
const toTitleCase = str =>
  str.replace(/\b\w+/g, txt =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );

const AcademicForm = ({ onSave, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview]   = useState(null);
  const [showOtherInstitution, setShowOtherInstitution] = useState(false);
  const [showOtherDegree, setShowOtherDegree]       = useState(false);
  
  // const fileInputRef = useRef(null)
  // Institution options for dropdown
  const institutionOptions = [
    "Kwame Nkrumah University of Science and Technology (KNUST)",
    "University of Ghana (UG), Legon",
    "University of Cape Coast (UCC)",
    "University of Education, Winneba (UEW)",
    "Ghana Communication Technology University (GCTU)",
    "Kumasi Technical University (KsTU)",
    "Takoradi Technical University (TTU)",
    "Ashesi University",
    "Regent University College of Science & Technology",
    "Ghana Institute of Management and Public Administration (GIMPA)",
    "BlueCrest College Ghana",
    "Academic City University College",
    "IPMC College of Technology",
    "NIIT Ghana",
    "Other"
  ];

  // Degree options for dropdown
  const degreeOptions = [
    "HND Computer Science",
    "BSc Computer Science",
    "PhD Computer Science",
    "HND IT",
    "Diploma in IT",
    "BSc IT",
    "MSc IT",
    "BSc IT Education",
    "BSc MIS",
    "Diploma in Software Engineering",
    "BSc AI & Robotics",
    "Other"
  ];

  // Field of study options for dropdown
  const fieldOptions = [
    "Data Science and Analytics",
    "Networking and Systems Administration",
    "Cybersecurity",
    "Software Engineering",
    "Information Technology",
    "Computer Science",
    "Information Systems",
    "Mobile Application Development"
  ];

  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    console.log('Initial values:', initialValues);
    // Set form fields from initialValues if available

    console.log("initialValues?.details: ", initialValues?.details);  
    console.log("initialValues?.details.gpa: ", initialValues?.details?.gpa);
    form.setFieldsValue({
      institution: initialValues?.institution,
      degree:      initialValues?.degree,
      year_obtained: initialValues?.year_obtained,
      gpa:         initialValues?.details?.gpa || '',
    })
   console.log("initialValues?.documents: ", initialValues?.documents);
   console.log("initialValues.documents: ", initialValues.documents);
    // Initialize fileList from initialValues if available
     // existing docs → keep their URLs
    //  if (initialValues?.documents) {
      if (initialValues?.documents) {
      setFileList(
        initialValues.documents.map((doc, i) => ({
          uid:  doc.uid || `old-${i}`,
          name: doc.name,
          url:  doc.url || doc.filePath,
          status: 'done'
        }))
      );
    } else {
      setFileList([]);
    }
    console.log('File list:', fileList);
  }, [initialValues, form]);

  const beforeUpload = file => {
    if (file.size > MAX_FILE_SIZE) {
      message.error(`${file.name} is larger than 10MB.`);
      return Upload.LIST_IGNORE;
    }
    return false; // prevent auto‐upload
  };


  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      setLoading(true);
      
      let documents = [];
      // let fileUpload = [];
      // // 1️⃣ Pull out any brand-new files (the ones with originFileObj)
      // // Process files if they exist in fileList
      // if (fileList.length > 0) {
      //   documents = fileList.map(file => {
      //     if (file.originFileObj) {
      //       // This is a newly uploaded file
      //       return {
      //         uid: file.uid,
      //         name: file.name,
      //         // filePath: URL.createObjectURL(file.originFileObj),
      //         file: file
      //       };
            
      //     } else {
      //       // This is an existing file
      //       return {
      //         uid: file.uid,
      //         name: file.name,
      //         filePath: file.url
      //       };
      //     }
      //   });
      //   console.log('documents:', documents);
      // }
      
      console.log('fileList:', fileList);
      // 1️⃣ Separate brand-new File objects from pre-existing URLs
      // Process files if they exist in fileList
      if (fileList.length > 0) {
        documents = fileList.map(file => {
          if (file.originFileObj) {
            // This is a newly uploaded file
            return {
              uid: file.uid,
              name: file.name,
              filePath: URL.createObjectURL(file.originFileObj),
              file: file
            };
          } else {
            // This is an existing file
            return {
              uid: file.uid,
              name: file.name,
              filePath: file.url
            };
          }
        });
        console.log('documents:', documents);
      }
      console.log('fileList:', fileList);

      // 1️⃣ New Files only:
    const newFiles = fileList
      .filter(f => f.originFileObj)
      .map(f => f.originFileObj);

      console.log('New files:', newFiles);
      // documents = newFiles.map(file => ({
      //   uid: file.uid || Date.now().toString(),
      //   name: file.name,
      //   file: file,
      //   filePath: URL.createObjectURL(file),
      //   status: 'done'
      // }));

    // 2️⃣ Existing docs:
    const existingDocs = fileList
      .filter(f => !f.originFileObj)
      .map(f => ({ uid: f.uid, name: f.name, url: f.url }));


      // Create the qualification object
      // const qualification = {
      //   ...values,
      //   id: initialValues?.id || Date.now().toString(),
      //   documents: existingDocs.length ? existingDocs : undefined
      // };

      // const qualification = {
      //   ...values,
      //   // id: initialValues?.id || Date.now().toString(),
      //   id: initialValues?.id || '',
      //   documents: existingDocs.length ? existingDocs : undefined
      // };

      // fileUpload = fileList.forEach(file => {
      //   if (file.originFileObj) {
      //     // This is a newly uploaded file
      //     console.log('Newly uploaded file:', file);
      //     return file;
      //   } else {
      //     // This is an existing file
      //     console.log('Existing file:', file);
      //     return {
      //       uid: file.uid,
      //       name: file.name,
      //       filePath: file.url
      //     };
      //   }
      // });

      
        const institution = values.institution === 'Other'
    ? values.institutionOther
    : values.institution;

  const degree = values.degree === 'Other'
    ? values.degreeOther
    : values.degree;

  // now build your final payload
  const qualification = {
    id:           initialValues?.id || '',
    institution,
    degree,
    year_obtained: values.year_obtained,
    gpa:           values.gpa,
    documents:     existingDocs.length ? existingDocs : undefined
  };

  console.log("Saving qualification with documents:", qualification);
     
      // Call the parent's onSave function
      await onSave(qualification, newFiles? newFiles : documents);
      console.log('Files to upload in academicform:', newFiles[0]);
      
      // Reset form and state
      form.resetFields();
      setFileList([]);
      console.log('documents:', documents);
      console.log('documents.file:', documents["file"]);
      message.success('Qualification saved successfully');
    } catch (error) {
      console.error('Error saving qualification:', error);
      message.error('Failed to save qualification');
    } finally {
      setLoading(false);
    }
  };


  // const onFinish = async (values) => {
  //   setLoading(true)
  //   try {
  //     // 1️⃣ Separate brand-new File objects from pre-existing URLs
  //     const newFiles = fileInputRef.current.files
  //       ? Array.from(fileInputRef.current.files)
  //       : []

  //     const existingDocs = fileList
  //       .filter(d => d.url && !d.file)  
  //       .map(d => ({ name: d.name, url: d.url }))

  //       console.log("newFiles: ", newFiles)
  //       console.log("existingdods: ", existingDocs)
  //     // 2️⃣ Build the JSON payload (no blob URLs)
  //     const payload = {
  //       ...values,
  //       id:        initialValues?.id || Date.now().toString(),
  //       documents: existingDocs.length ? existingDocs : undefined,
  //     }

  //     // 3️⃣ Hand back both JSON + new File objects
  //     await onSave(payload, newFiles)
  //     form.resetFields()
  //     setFileList([])
  //     if (fileInputRef.current) fileInputRef.current.value = ''
  //     message.success('Qualification saved')
  //   } catch (err) {
  //     console.error(err)
  //     message.error('Save failed')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };



  // Preview documents modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);

  const handlePreview = (file) => {
    setCurrentPreviewFile(file);
    setPreviewVisible(true);
  };



  const [docList, setDocList] = useState([]);
    const [docModalVisible, setDocModalVisible] = useState(false);
    const [docMode, setDocMode] = useState('view'); // or 'download'
  const [previewFile, setPreviewFile] = useState(null);
    

  
    const showPreview = file => {
      setPreviewFile(file);
      setPreviewVisible(true);
    };
  
    const openDocs = (record, mode) => {
      // pick the correct field
      const raw = record.certificate_path;
      const map = parsePaths(raw);
      const docs = Object.entries(map).map(([name, url]) => ({ name, url }));
      setDocList(docs);
      setDocMode(mode);
      setDocModalVisible(true);
    };
  
    const downloadBlob = ({ url, name }) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
  


  return (
    <Form
      form={form}
      initialValues={{
        ...initialValues,
        year_obtained: initialValues?.year_obtained ? parseInt(initialValues.year_obtained) : undefined
      }}
      onFinish={onFinish}
      layout="vertical"
      className="qualification-form"
    >
      <h2>{initialValues ? 'Edit' : 'Add'} Academic Qualification</h2>
      
      <Form.Item 
        name="institution" 
        label="Institution" 
        rules={[{ required: true, message: 'Please select the institution!' }]}
      >
        <Select
          showSearch
          placeholder="Select an institution"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={val => {
             setShowOtherInstitution(val === 'Other');
             form.setFieldsValue({ institutionOther: undefined });
           }}
        >
          {institutionOptions.map(institution => (
            <Select.Option key={institution} value={institution}>
              {institution}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {showOtherInstitution && (
        <Form.Item
          name="institutionOther"
          label="Please specify Institution"
          rules={[{ required: true }]}
        >
          <Input
            onChange={e =>
              form.setFieldsValue({
                institutionOther: toTitleCase(e.target.value)
              })
            }
          />
        </Form.Item>
      )}

      <Form.Item 
        name="degree" 
        label="Degree" 
        rules={[{ required: true, message: 'Please select the degree!' }]}
      >
        <Select
          showSearch
          placeholder="Select a degree"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
           onChange={val => {
             setShowOtherDegree(val === 'Other');
             form.setFieldsValue({ degreeOther: undefined });
           }}
        >
          {degreeOptions.map(degree => (
            <Select.Option key={degree} value={degree}>
              {degree}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
            {showOtherDegree && (
        <Form.Item
          name="degreeOther"
          label="Please specify Degree"
          rules={[{ required: true }]}
        >
          <Input
            onChange={e =>
              form.setFieldsValue({
                degreeOther: toTitleCase(e.target.value)
              })
            }
          />
        </Form.Item>
      )}
      
      <Form.Item 
        name="year_obtained" 
        label="Year Obtained" 
        rules={[{ required: true, message: 'Please select the year!' }]}
      >
        <Select placeholder="Select year">
          {yearOptions.map(year => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="gpa" label="GPA">
        <Input  />
      </Form.Item>

    

      <Form.Item 
        label={<span>Upload Documents <Tooltip title="Document proof is required for degree verification">*</Tooltip></span>}
        rules={[{ required: !initialValues?.documents?.length, message: 'Please upload proof of qualification!' }]}
      >
        <Upload 
          // beforeUpload={() => false}
          beforeUpload={beforeUpload}
          multiple={true}
          fileList={fileList}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList);
          }}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          listType="picture"
          onRemove={(file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
          }}
          onPreview={(file) => handlePreview(file)}
        >
          <Button icon={<UploadOutlined style={{ color: '#1890ff' }} />}>Select Files</Button>
        </Upload>
      

        {fileList.length > 0 && (
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => setPreviewVisible(true)}
            style={{ marginTop: 8 }}
          >
            Preview All Documents
          </Button>
        )}
      </Form.Item>

      <div className="form-actions">
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          disabled={loading}
        >
          Save
        </Button>
      </div>

      {/* Modal for previewing documents */}
      <Modal
        visible={previewVisible}
        title="Document Preview"
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          setCurrentPreviewFile(null);
        }}
        width={800}
      >
        {currentPreviewFile && currentPreviewFile.originFileObj && (
          <div style={{ textAlign: 'center' }}>
            <iframe
              // src={URL.createObjectURL(currentPreviewFile.originFileObj)}
              alt="Preview"
              style={{ width: '100%', height: '70vh' }}
              src={URL.createObjectURL(currentPreviewFile.originFileObj)}
            />
          </div>
        )}
        {currentPreviewFile && currentPreviewFile.url && (
          <div style={{ textAlign: 'center' }}>
            <iframe
              // src={URL.createObjectURL(currentPreviewFile.originFileObj)}
              alt="Preview"
              style={{ width: '100%', height: '70vh' }}
              src={currentPreviewFile.url}
            />
          </div>
        )}
        {currentPreviewFile && currentPreviewFile.preview && (
          <div style={{ textAlign: 'center' }}>
            <iframe
              // src={URL.createObjectURL(currentPreviewFile.originFileObj)}
              alt="Preview"
              style={{ width: '100%', height: '70vh' }}
              src={currentPreviewFile.preview}
            />
          </div>
        )}
        {currentPreviewFile ? (
          // Preview single file
          <iframe 
            src={currentPreviewFile.url || currentPreviewFile.preview || currentPreviewFile  ||  currentPreviewFile.originFileObj} 
            style={{ width: '100%', height: '70vh' }} 
            title="Document Preview"
          />
        ) : (
          // List all files
          <List
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
                    onClick={() => handlePreview(item)}
                  >
                    View
                  </Button>,
                  <Button 
                    icon={<DownloadOutlined style={{ color: '#1890ff' }} />}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      link.href = item.url || URL.createObjectURL(item.originFileObj);
                      link.download = item.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Type: ${item.type || 'Document'}`}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </Form>
  );
};

export default AcademicForm;