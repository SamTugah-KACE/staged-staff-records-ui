// src/components/EmploymentHistoryModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function EmploymentHistoryModal({
  open,
  initialValues = {},
  onCancel,
  onFinish
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        company:   initialValues.company || '',
        job_title: initialValues.job_title || '',
        start_date: initialValues.start_date
          ? dayjs(initialValues.start_date)
          : null,
        end_date: initialValues.end_date
          ? dayjs(initialValues.end_date)
          : null,
        // details:   initialValues.details.details || ''
        details: (
                    typeof initialValues.details === 'object'
                      ? initialValues.details.details
                      : initialValues.details
                  ) || ''
      });
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(vals => {
      const payload = {
        ...initialValues,
        ...vals,
        start_date: vals.start_date.format('YYYY-MM-DD'),
        end_date: vals.end_date
          ? vals.end_date.format('YYYY-MM-DD')
          : null
      };
      const uploaded = form.getFieldValue('documents') || [];
      const files = uploaded
        .filter(f => f.originFileObj)
        .map(f => f.originFileObj);
      onFinish(payload, files);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues?.id ? 'Edit Employment Record' : 'Add Employment Record'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: 'Company is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Job Title"
          name="job_title"
          rules={[{ required: true, message: 'Job title is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="start_date"
          rules={[{ required: true, message: 'Start date is required' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="End Date" name="end_date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Details" name="details">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Attach Documents"
          name="documents"
          getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            multiple
            beforeUpload={() => false}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Select File(s)</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}



// // src/components/EmploymentHistoryModal.js
// import React, { useEffect } from 'react';
// import { Modal, Form, Input, DatePicker, Upload, Button } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const EmploymentHistoryModal = ({
//   open,            // v5: use `open` not `visible`
//   initialValues = {},
//   onCancel,        // unified closing callback
//   onFinish,        // (values, files) => void
// }) => {
//   const [form] = Form.useForm();

//   // Whenever we open or get new initialValues, patch form
//   useEffect(() => {
//     if (open) {
//     const iv = initialValues || {};  // guard against null
//       form.setFieldsValue({
//         company:    iv.company || '',
//         job_title:  iv.job_title || '',
//         start_date: iv.start_date ? dayjs(iv.start_date) : null,
//         end_date:   iv.end_date   ? dayjs(iv.end_date)   : null,
//         details:    iv.details    || '',
//       });
//     }
//   }, [open, initialValues, form]);

//   // Submit handler
//   const handleOk = () => {
//     form
//       .validateFields()
//       .then(values => {
//         const iv = initialValues || {};
//         const payload = {
//           ...iv,
//           ...values,
//           start_date: values.start_date.format('YYYY-MM-DD'),
//           end_date:   values.end_date   ? values.end_date.format('YYYY-MM-DD') : null,
//         };
//         // Extract files from Upload component:
//         const uploadField = form.getFieldValue('documents') || [];
//         const newFiles = uploadField
//           .filter(f => f.originFileObj)
//           .map(f => f.originFileObj);

//         onFinish(payload, newFiles);
//         form.resetFields();
//       })
//       .catch(() => {/* validation failed */});
//   };

//   return (
//     <Modal
//       title={initialValues?.id ? 'Edit Employment Record' : 'Add Employment Record'}
//       open={open}
//       onCancel={onCancel}
//       onOk={handleOk}
//       okText="Save"
//       cancelText="Cancel"
//       destroyOnClose
//       width={600}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           label="Company"
//           name="company"
//           rules={[{ required: true, message: 'Please enter company name' }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Job Title"
//           name="job_title"
//           rules={[{ required: true, message: 'Please enter job title' }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Start Date"
//           name="start_date"
//           rules={[{ required: true, message: 'Please select start date' }]}
//         >
//           <DatePicker style={{ width: '100%' }} />
//         </Form.Item>

//         <Form.Item
//           label="End Date"
//           name="end_date"
//         >
//           <DatePicker style={{ width: '100%' }} />
//         </Form.Item>

//         <Form.Item
//           label="Details"
//           name="details"
//         >
//           <Input.TextArea rows={3} placeholder="Optional" />
//         </Form.Item>

//         <Form.Item
//           label="Attach Documents"
//           name="documents"
//           // e => e.fileList
//           getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
//         >
//           <Upload
//             multiple
//             beforeUpload={() => false}
//             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//             listType="text"
//           >
//             <Button icon={<UploadOutlined />}>Select File(s)</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default EmploymentHistoryModal;
