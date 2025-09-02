import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import './NextOfKin.css';

const NextOfKinModal = ({ visible, initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    
    // useEffect(() => {
    //     if (visible) {
    //         form.setFieldsValue(initialValues);
    //     }
    // }, [visible, initialValues, form]);

     useEffect(() => {
        if (visible) {
          form.setFieldsValue({
            name: initialValues.name || '',
            relation: initialValues.relation || '',
            nok_phone: initialValues.nok_phone || '',
            nok_address: initialValues.nok_address || '',
            details: initialValues.details || ''
    
          });
        } 
        
      }, [visible, initialValues, form]);
    
      const handleSubmit = (values) => {
        const contacts ={
          ...values,
          id: initialValues?.id || '',
        }
        onFinish(contacts);
        form.resetFields();
      };

    const handleFinish = (values) => {
        onFinish(values);
        form.resetFields();
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={initialValues?.id ? "Edit Next of Kin" : "Add Next of Kin"}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
            className="custom-modal"
        >
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleSubmit} 
                className="custom-form"
                initialValues={initialValues}
            >
                <Form.Item 
                    label="Name" 
                    name="name" 
                    rules={[{ required: true, message: 'Please enter name' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item 
                    label="Relation" 
                    name="relation" 
                    rules={[{ required: true, message: 'Please enter relation' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item 
                    label="Phone" 
                    name="nok_phone" 
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item 
                    label="Address" 
                    name="nok_address"
                >
                    <Input />
                </Form.Item>
                
                <Form.Item 
                    label="Additional Details" 
                    name="details"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                
                <div className="form-actions">
                    <Button type="default" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" className="save-button">
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default NextOfKinModal;