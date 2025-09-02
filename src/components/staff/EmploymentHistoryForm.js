import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Upload, message, Modal, List, Typography } from 'antd';
import { UploadOutlined, FilePdfOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';
import './EmploymentHistory.css';

const { Text, Link } = Typography;

const EmploymentHistoryForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      start_date: initialValues.start_date ? dayjs(initialValues.start_date) : null,
      end_date: initialValues.end_date ? dayjs(initialValues.end_date) : null,
    });

    if (initialValues.documents_path && Array.isArray(initialValues.documents_path)) {
      const formatted = initialValues.documents_path.map((doc, index) => ({
        uid: index,
        name: doc.name || `Document ${index + 1}`,
        status: 'done',
        url: doc.url || doc, // handle both URL and file name strings
      }));
      setFileList(formatted);
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      start_date: values.start_date?.format('YYYY-MM-DD'),
      end_date: values.end_date?.format('YYYY-MM-DD'),
      documents_path: fileList,
    };

    // Extract new uploads for backend
    const newFiles = fileList.filter(f => f.originFileObj).map(f => f.originFileObj);

    onFinish(formatted, newFiles);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isAllowedType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      if (!isAllowedType) {
        message.error('You can only upload PDF, JPG, or PNG files!');
        return Upload.LIST_IGNORE;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      // Update the fileList state when files are added or removed
      setFileList(newFileList);
    },
    fileList,
    multiple: true,
    listType: "text",
  };

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].some(ext => fileName.toLowerCase().endsWith(ext))) {
      return <FileImageOutlined style={{ color: '#1890ff' }} />;
    } else {
      return <FileOutlined style={{ color: '#52c41a' }} />;
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className="custom-form">
      <Form.Item label="Job Title" name="job_title" rules={[{ required: true, message: 'Please enter job title' }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Company" name="company" rules={[{ required: true, message: 'Please enter company name' }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: 'Please select start date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="End Date" name="end_date">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Details" name="details">
        <Input.TextArea rows={3} />
      </Form.Item>
      
      <Form.Item 
        label="Documents"
        name="documents_path"
        valuePropName="fileList"
        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
      >
        <Upload {...uploadProps}
        multiple={true}
        beforeUpload={false}
        >
          <Button icon={<UploadOutlined />}>Upload Documents</Button>
        </Upload>
      </Form.Item>
      
      <div className="form-actions">
        <Button type="primary" htmlType="submit" className="save-button">Save</Button>
        <Button onClick={onCancel} className="cancel-button">Cancel</Button>
      </div>
    </Form>
  );
};

export default EmploymentHistoryForm;