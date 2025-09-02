import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Upload, message, Select, Tag, Tooltip, Modal, List } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import './Form.css';

const AcademicForm = ({ onSave, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [honors, setHonors] = useState([]);
  const [honorInputVisible, setHonorInputVisible] = useState(false);
  const [honorInputValue, setHonorInputValue] = useState('');
  const honorInputRef = useRef(null);

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
    "NIIT Ghana"
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
    "BSc AI & Robotics"
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
    // Initialize honors from initialValues if available
    if (initialValues?.honors) {
      setHonors(initialValues.honors.split(',').map(h => h.trim()).filter(h => h));
    }

    // Initialize fileList from initialValues if available
    if (initialValues?.documents) {
      setFileList(initialValues.documents.map((doc, index) => ({
        uid: doc.uid || `-${index}`,
        name: doc.name || doc.filePath.split('/').pop() || `document_${index}.pdf`,
        status: 'done',
        url: doc.url || doc.filePath
      })));
    } else {
      setFileList([]);
    }
  }, [initialValues]);

  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      setLoading(true);
      
      let documents = [];
      
      // Process files if they exist in fileList
      if (fileList.length > 0) {
        documents = fileList.map(file => {
          if (file.originFileObj) {
            // This is a newly uploaded file
            return {
              uid: file.uid,
              name: file.name,
              filePath: URL.createObjectURL(file.originFileObj),
              file: file.originFileObj
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
      }
      
      // Create the qualification object
      const qualification = {
        ...values,
        id: initialValues?.id || Date.now().toString(),
        honors: honors.join(', '),
        documents: documents
      };

      console.log("Saving qualification with documents:", qualification);
      
      // Call the parent's onSave function
      await onSave(qualification);
      
      // Reset form and state
      form.resetFields();
      setFileList([]);
      setHonors([]);
      message.success('Qualification saved successfully');
    } catch (error) {
      console.error('Error saving qualification:', error);
      message.error('Failed to save qualification');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setHonors([]);
    onCancel();
  };

  // Honor/Distinction tag handlers
  const handleCloseHonor = removedHonor => {
    const newHonors = honors.filter(honor => honor !== removedHonor);
    setHonors(newHonors);
  };

  const showHonorInput = () => {
    setHonorInputVisible(true);
    setTimeout(() => honorInputRef.current?.focus(), 0);
  };

  const handleHonorInputChange = e => {
    setHonorInputValue(e.target.value);
  };

  const handleHonorInputConfirm = () => {
    if (honorInputValue && !honors.includes(honorInputValue)) {
      setHonors([...honors, honorInputValue]);
    }
    setHonorInputVisible(false);
    setHonorInputValue('');
  };

  // Preview documents modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState(null);

  const handlePreview = (file) => {
    setCurrentPreviewFile(file);
    setPreviewVisible(true);
  };

  return (
    <Form
      form={form}
      initialValues={{
        ...initialValues,
        yearObtained: initialValues?.yearObtained ? parseInt(initialValues.yearObtained) : undefined
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
        >
          {institutionOptions.map(institution => (
            <Select.Option key={institution} value={institution}>
              {institution}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

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
        >
          {degreeOptions.map(degree => (
            <Select.Option key={degree} value={degree}>
              {degree}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        name="major" 
        label="Major/Field of Study" 
        rules={[{ required: true, message: 'Please select the major/field!' }]}
      >
        <Select
          showSearch
          placeholder="Select a field of study"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {fieldOptions.map(field => (
            <Select.Option key={field} value={field}>
              {field}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        name="yearObtained" 
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
        <Input />
      </Form.Item>

      <Form.Item label="Honors/Distinctions">
        <div className="honor-tags">
          {honors.map(honor => (
            <Tag
              key={honor}
              closable
              onClose={() => handleCloseHonor(honor)}
              className="honor-tag"
            >
              {honor}
            </Tag>
          ))}
          {honorInputVisible ? (
            <Input
              ref={honorInputRef}
              type="text"
              size="small"
              className="honor-input"
              value={honorInputValue}
              onChange={handleHonorInputChange}
              onBlur={handleHonorInputConfirm}
              onPressEnter={handleHonorInputConfirm}
            />
          ) : (
            <Tag onClick={showHonorInput} className="add-honor-tag">
              <PlusOutlined style={{ color: '#1890ff' }} /> Add Honor/Distinction
            </Tag>
          )}
        </div>
      </Form.Item>

      <Form.Item
        label={<span>Upload Documents <Tooltip title="Document proof is required for degree verification">*</Tooltip></span>}
        rules={[{ required: !initialValues?.documents?.length, message: 'Please upload proof of qualification!' }]}
      >
        <Upload 
          beforeUpload={() => false}
          multiple={true}
          fileList={fileList}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList);
          }}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
        {currentPreviewFile ? (
          // Preview single file
          <iframe 
            src={currentPreviewFile.url || currentPreviewFile.preview} 
            style={{ width: '100%', height: '500px' }} 
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