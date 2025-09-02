import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Tag, Space, Alert, Select, Switch } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './EmployeePaymentDetail.css';

const { Title } = Typography;

const EmployeePaymentDetailTable = ({ data, pending, onRequestChange, dataType='payment_details' }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding, or record being edited
    const [form] = Form.useForm();

    // const handleViewDetails = (record) => {
    //     setSelectedRecord(record);
    //     form.setFieldsValue({
    //         additional_info: record.additional_info || '',
    //     });
    //     setIsModalVisible(true);
    // };

    // const handleSave = () => {
    //     form.validateFields()
    //         .then(values => {
    //             // Here you would typically update the record in your backend
    //             const updatedRecord = {
    //                 ...selectedRecord,
    //                 additional_info: values.additional_info
    //             };
    //             console.log('Updated record:', updatedRecord);
    //             setIsModalVisible(false);
    //         })
    //         .catch(info => {
    //             console.log('Validate Failed:', info);
    //         });
    // };



    // whenever we start editing, patch the form
  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue(editing || {
        payment_mode: data.payment_mode || undefined,
        bank_name: data.bank_name || undefined,
        account_number: data.account_number || undefined,
        mobile_money_provider: data.mobile_money_provider || undefined,
        wallet_number: data.wallet_number || undefined,
        is_verified: data.is_verified,
        additional_info: data.additional_info || '',
      });
    }
  }, [modalVisible, editing, form, data]);

const handleAdd = () => {
    setEditing(null);
    // form.resetFields();
    setModalVisible(true);
  };


    const columns = [
       
        {
            title: 'Payment Mode',
            dataIndex: 'payment_mode',
            key: 'payment_mode',
            render: (payment_method) =>   <Tag color={payment_method ? 'geekblue' : 'green'}>{payment_method}</Tag>,
        },
        {
            title: 'Bank Name',
            dataIndex: 'bank_name',
            key: 'bank_name',
            render: (text, record) => 
                record.bank_name ? text : 'N/A',
        },
        {
            title: 'Account Number',
            dataIndex: 'account_number',
            key: 'account_number',
            render: (text, record) => 
                record.account_number ? text : 'N/A',
        },
        {
            title: 'Mobile Money Provider',
            dataIndex: 'mobile_money_provider',
            key: 'mobile_money_provider',
            render: (text, record) => 
                record.mobile_money_provider  ? text : 'N/A',
        },
        {
            title: 'Wallet Number',
            dataIndex: 'wallet_number',
            key: 'wallet_number',
            render: (text, record) => 
                record.wallet_number  ? text : 'N/A',
        },
        {
            title: 'Verified',
            dataIndex: 'is_verified',
            key: 'is_verified',
            render: (value) => (
                <Tag color={value ? 'green' : 'volcano'}>
                    {value ? 'Verified' : 'Not Verified'}
                </Tag>
            ),
        },
        // {
        //     title: 'Additional Info',
        //     key: 'additional_info',
        //     render: (_, record) => (
        //         <Button
        //             type="text"
        //             icon={<InfoCircleOutlined />}
        //             onClick={() => handleViewDetails(record)}
        //             className="info-button"
        //         />
        //     ),
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, rec) => (
              <Space>
                <Button
                  type="text"
                  icon={<InfoCircleOutlined />}
                  onClick={() => { 
                    setEditing(rec); 
                    form.setFieldsValue(rec)
                    setModalVisible(true); }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    onRequestChange({
                      data: { id: rec.id },
                      requestType: 'delete',
                      dataType,
                    });
                  }}
                />
              </Space>
            ),
          },
    ];

  

    const handleSave = () => {
        form.validateFields()
          .then(values => {
            const payload = editing
              ? { ...editing, ...values }
              : values;
            onRequestChange({
              data: payload,
              requestType: editing ? 'update' : 'save',
              dataType,
            });
            setModalVisible(false);
          })
          .catch(() => { /* validation failed */ });
      };

    // return (
    //     <div className="payment-detail-container">
    //          {pending && (
    //     <Alert
    //       type="warning"
    //       showIcon
    //       message="You have pending changes awaiting approval."
    //       style={{ marginBottom: 16 }}
    //     />
    //   )}



    //         {/* <Title level={4} className="table-title">Employee Payment Details</Title> */}
    //         <Table 
    //             dataSource={data} 
    //             columns={columns} 
    //             rowKey="employee_id" 
    //             className="custom-table"
    //             pagination={false}
    //             bordered
    //         />

    //         <Modal
    //             title={`Payment Details - Employee ID: ${selectedRecord?.employee_id}`}
    //             visible={isModalVisible}
    //             onOk={handleSave}
    //             onCancel={() => setIsModalVisible(false)}
    //             okText="Save"
    //             cancelText="Cancel"
    //             width={700}
    //         >
    //             <div className="payment-details-content">
    //                 <div className="basic-info">
    //                     <p><strong>Payment Mode:</strong> {selectedRecord?.payment_mode}</p>
    //                     {selectedRecord?.payment_mode === 'Bank Transfer' ? (
    //                         <>
    //                             <p><strong>Bank Name:</strong> {selectedRecord?.bank_name}</p>
    //                             <p><strong>Account Number:</strong> {selectedRecord?.account_number}</p>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <p><strong>Mobile Money Provider:</strong> {selectedRecord?.mobile_money_provider}</p>
    //                             <p><strong>Wallet Number:</strong> {selectedRecord?.wallet_number}</p>
    //                         </>
    //                     )}
    //                     <p><strong>Verification Status:</strong> 
    //                         <Tag color={selectedRecord?.is_verified ? 'green' : 'volcano'} style={{ marginLeft: 8 }}>
    //                             {selectedRecord?.is_verified ? 'Verified' : 'Not Verified'}
    //                         </Tag>
    //                     </p>
    //                 </div>

    //                 <Form form={form} layout="vertical">
    //                     <Form.Item
    //                         name="additional_info"
    //                         label="Additional Information"
    //                     >
    //                         <Input.TextArea 
    //                             rows={4} 
    //                             placeholder="Enter any additional payment details..."
    //                         />
    //                     </Form.Item>
    //                 </Form>
    //             </div>
    //         </Modal>
    //     </div>
    // );

    return (
        <div className="payment-detail-container">
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
              onClick={handleAdd}
              disabled={pending}
              className="add-button" 
            >
              Add Payment
            </Button>
          </Space>
    
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={false}
            bordered
          />
    
          <Modal
            title={editing ? 'Edit Payment Detail' : 'Add Payment Detail'}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleSave}
            okText="Save"
            cancelText="Cancel"
            width={600}
          >
            {/* <Form form={form} layout="vertical"> */}
            {/* *** pass editing as initialValues *** */}
           <Form
              form={form}
              layout="vertical"
              initialValues={editing || {}}
            >
              <Form.Item
                name="payment_mode"
                label="Payment Mode"
                rules={[{ required: true, message: 'Select a mode' }]}
              >
                <Select>
                  <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                  <Select.Option value="Mobile Money">Mobile Money</Select.Option>
                </Select>
              </Form.Item>
    
              {/* <Form.Item noStyle shouldUpdate>
                {() => {
                  const mode = form.getFieldValue('payment_mode');
                  if (mode === 'Bank Transfer') {
                    return (
                      <>
                        <Form.Item
                          name="bank_name"
                          label="Bank Name"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="account_number"
                          label="Account Number"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  } else if (mode === 'Mobile Money') {
                    return (
                      <>
                        <Form.Item
                          name="mobile_money_provider"
                          label="Provider"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="wallet_number"
                          label="Wallet Number"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  }
                  return null;
                }}
              </Form.Item> */}

              {/* conditional bank vs momo fields, now with dependencies so they show on open */}
              <Form.Item 
                noStyle 
                dependencies={['payment_mode']}
              >
                {({ getFieldValue }) => {
                  const mode = getFieldValue('payment_mode');
                  if (mode === 'Bank Transfer') {
                    return (
                      <>
                        <Form.Item
                          name="bank_name"
                          label="Bank Name"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="account_number"
                          label="Account Number"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  }
                  if (mode === 'Mobile Money') {
                    return (
                      <>
                        <Form.Item
                          name="mobile_money_provider"
                          label="Provider"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="wallet_number"
                          label="Wallet Number"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  }
                  return null;
                }}
              </Form.Item>
    
               {/* read-only verification status */}
          <Form.Item label="Verified">
            {editing?.is_verified
              ? <Tag color="green">Verified</Tag>
              : <Tag color="red">Not Verified</Tag>
            }
          </Form.Item>
    
              <Form.Item
                name="additional_info"
                label="Additional Info"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );

};

export default EmployeePaymentDetailTable;