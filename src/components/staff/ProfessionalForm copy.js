import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, InputNumber, Tag, Tooltip, Modal, List } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import './Form.css';

const ProfessionalForm = ({ onSave, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publicationLinks, setPublicationLinks] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef(null);

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

  // Qualification options for dropdown
  const qualificationOptions = [
    "CCNA (Cisco Certified Network Associate)",
    "CCNP (Cisco Certified Network Professional)",
    "CCIE (Cisco Certified Internetwork Expert)",
    "MCSA (Microsoft Certified Solutions Associate)",
    "MCSE (Microsoft Certified Solutions Expert)",
    "Azure Certifications ( Azure Administrator, Azure Developer)",
    "Certified Information Systems Security Professional (CISSP)",
    "Certified Ethical Hacker (CEH)",
    "Oracle Certifications ( Oracle Database Administrator)",
    "Project Management Professional (PMP)"
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

  // Issuing organization options for dropdown
  const issuingOrgOptions = [
    "EC-Council",
    "Cisco Systems",
    "CompTIA",
    "(ISC)²",
    "Project Management Institute (PMI)",
    "Microsoft"
  ];

  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Initialize publications from initialValues if available
    if (initialValues?.publications) {
      setPublicationLinks(initialValues.publications.split(',').map(p => p.trim()).filter(p => p));
    }

    // Initialize fileList from initialValues
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
      console.log('Submitting:', values);
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
      
      // Create qualification object
      const qualification = {
        ...values,
        id: initialValues?.id || Date.now().toString(),
        publications: publicationLinks.join(', '),
        documents: documents
      };
      
      console.log("Saving professional qualification with documents:", qualification);
      
      await onSave(qualification);
      
      form.resetFields();
      setFileList([]);
      setPublicationLinks([]);
      message.success('Professional qualification saved successfully');
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
    setPublicationLinks([]);
    onCancel();
  };

  // Publication links tag handlers
  const handleClose = removedLink => {
    const newLinks = publicationLinks.filter(link => link !== removedLink);
    setPublicationLinks(newLinks);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !publicationLinks.includes(inputValue)) {
      setPublicationLinks([...publicationLinks, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
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
        yearObtained: initialValues?.yearObtained ? parseInt(initialValues.yearObtained) : undefined,
        experience: initialValues?.experience ? parseInt(initialValues.experience) : 0
      }}
      onFinish={onFinish}
      layout="vertical"
      className="qualification-form"
    >
      <h2>{initialValues ? 'Edit' : 'Add'} Professional Qualification</h2>
      
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
        name="qualification" 
        label="Qualification" 
        rules={[{ required: true, message: 'Please select the qualification!' }]}
      >
        <Select
          showSearch
          placeholder="Select a qualification"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {qualificationOptions.map(qualification => (
            <Select.Option key={qualification} value={qualification}>
              {qualification}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        name="field" 
        label="Field of Study" 
        rules={[{ required: true, message: 'Please select the field of study!' }]}
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
        rules={[{ required: true, message: 'Please select the year obtained!' }]}
      >
        <Select placeholder="Select year">
          {yearOptions.map(year => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="experience" label="Years of Experience">
        <InputNumber 
          min={0} 
          max={50}
          addonBefore={<Button icon={<MinusCircleOutlined style={{ color: '#ff4d4f' }} />} onClick={() => {
            const exp = form.getFieldValue('experience') || 0;
            form.setFieldsValue({ experience: Math.max(0, exp - 1) });
          }} />}
          addonAfter={<Button icon={<PlusOutlined style={{ color: '#1890ff' }} />} onClick={() => {
            const exp = form.getFieldValue('experience') || 0;
            form.setFieldsValue({ experience: exp + 1 });
          }} />}
        />
      </Form.Item>

      <Form.Item name="formerCompany" label="Former Company">
        <Input />
      </Form.Item>

      <Form.Item name="leavingReason" label="Reason for Leaving">
        <Input />
      </Form.Item>

      <Form.Item 
        name="issuingOrg" 
        label="Issuing Organization"
      >
        <Select
          showSearch
          placeholder="Select issuing organization"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {issuingOrgOptions.map(org => (
            <Select.Option key={org} value={org}>
              {org}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Publication Links (Optional)">
        <div className="publication-links">
          {publicationLinks.map(link => (
            <Tag
              key={link}
              closable
              onClose={() => handleClose(link)}
              className="publication-tag"
            >
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link.length > 30 ? link.substring(0, 30) + '...' : link}
              </a>
            </Tag>
          ))}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="url"
              size="small"
              className="link-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              placeholder="Enter URL and press Enter"
            />
          ) : (
            <Tag onClick={showInput} className="add-link-tag">
              <PlusOutlined style={{ color: '#1890ff' }} /> Add Publication Link
            </Tag>
          )}
        </div>
      </Form.Item>

      <Form.Item
        label={<span>Upload Documents <Tooltip title="Document proof is required for certification verification">*</Tooltip></span>}
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

export default ProfessionalForm;