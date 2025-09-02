// import React, { useState, useEffect } from 'react';
import React, { useEffect } from 'react';
import './PaymentForm.css'; // add your styling
import { Field, ErrorMessage, useFormikContext } from 'formik';




const PaymentForm = () => {
  const { values, setFieldValue } = useFormikContext();

  // Update amountToBePaid from the billing amount (if needed)
  useEffect(() => {
    setFieldValue("amountToBePaid", values.billAmount || 0);
    // Also set paymentDate to current date if not set
    if (!values.paymentDate) {
      setFieldValue("paymentDate", new Date().toISOString().slice(0, 10));
    }
  }, [values.billAmount, setFieldValue, values.paymentDate]);

  return (
    <div className="payment-form">
      <div className="form-group">
        <label>Amount to be paid:</label>
        <Field name="amountToBePaid" type="number" readOnly />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <Field name="paymentDate" type="date" readOnly />
      </div>
      <div className="form-group">
        <label>Payment Methods*:</label>
        <Field
          name="paymentMethod"
          type="text"
          placeholder="e.g., Credit Card, PayPal"
          required
        />
        <ErrorMessage name="paymentMethod" component="div" className="error" />
      </div>
    </div>
  );
};

export default PaymentForm;


// const PaymentForm = ({ data, updateData, billingData }) => {
//   const [localData, setLocalData] = useState({
//     amountToBePaid: billingData.billAmount || 0,
//     paymentDate: new Date().toISOString().slice(0, 10),
//     paymentMethod: ''
//   });

//   useEffect(() => {
//     // Update the amount when billingData changes
//     setLocalData((prev) => ({
//       ...prev,
//       amountToBePaid: billingData.billAmount || 0
//     }));
//   }, [billingData.billAmount]);

//   useEffect(() => {
//     updateData(localData);
//   }, [localData, updateData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="payment-form">
//       <div className="form-group">
//         <label>Amount to be paid:</label>
//         <input type="number" name="amountToBePaid" value={localData.amountToBePaid} readOnly />
//       </div>
//       <div className="form-group">
//         <label>Date:</label>
//         <input type="date" name="paymentDate" value={localData.paymentDate} readOnly />
//       </div>
//       <div className="form-group">
//         <label>Payment Methods*:</label>
//         <input
//           type="text"
//           name="paymentMethod"
//           value={localData.paymentMethod}
//           onChange={handleChange}
//           required
//           placeholder="e.g., Credit Card, PayPal"
//         />
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;
