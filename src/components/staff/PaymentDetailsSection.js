// paymentDetailsSection.js

// import React, { useState, useEffect } from 'react';
// import './PaymentDetailsSection.css';
// import request from "../request"; // Adjust the import based on your project structure
// import { toast } from 'react-toastify';

// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Adjust the import based on your project structure

// import { getAuthToken } from '../context/auth'; // Adjust the import based on your project structure
// import { getOrgSlug } from '../context/auth'; // Adjust the import based on your project structure


// const PaymentDetailsSection = ({ paymentDetails }) => {
//   const { staffId } = useParams(); // Get the staffId from the URL parameters
//   const { user } = useAuth(); // Get the user from the AuthContext
//   const orgSlug = getOrgSlug(); // Get the organization slug from the AuthContext
//   const token = getAuthToken(); // Get the auth token from the AuthContext
//   const [paymentData, setPaymentData] = useState({
//     salary: '',
//     bank_account: '',
//     bank_name: '',
//     account_number: '',
//     payment_method: '',
//     payment_frequency: '',
//     payment_date: '',
//     payment_status: '',
//     payment_history: [],
//     payment_proof: '',
//     payment_proof_path: '',
//     payment_proof_url: '',
//     payment_proof_name: '',
//     payment_proof_type: '',
//     payment_proof_size: '',
//     payment_proof_last_modified: '',

//     payment_proof_uploaded_by: '',
//     payment_proof_uploaded_at: '',
//     payment_proof_verified_by: '',
//     payment_proof_verified_at: '',   })

//we just passed the payment details data not staffID as props to the component, so we don't need to fetch it again
// //   const fetchPaymentDetails = async () => {
// //     try {
// //       const response = await request.get(`/staff/${staffId}/payment-details`);