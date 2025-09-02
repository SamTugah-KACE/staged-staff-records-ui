// src/components/Staff.js
import { FaSpinner } from 'react-icons/fa';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../pages/Header';
import Footer from '../Footer';
import ProfileCard from '../pages/ProfileCard';
import SearchBar from './SearchBar';
import ExpandableSection from './ExpandableSection';
import BioDataSection from './BioDataSection';
import QualificationsSection from './QualificationsSection';
import EmploymentDetailsSection from './EmploymentDetailsSection';
import PaymentDetailsSection from './PaymentDetailsSection';
import EmploymentHistoryTable from './EmploymentHistoryTable';
import EmployeePaymentDetailTable from './EmployeePaymentDetailTable';
import NextOfKinTable from './NextOfKinTable';
import SalaryPaymentTable from './SalaryPaymentTable';
import EmploymentHistoryModal from './EmploymentHistoryModal';
import EmployeePaymentDetailModal from './EmployeePaymentDetailModal';
import NextOfKinModal from './NextOfKinModal';
import SalaryPaymentModal from './SalaryPaymentModal';
import EmploymentDetailsModal from './EmploymentDetailsModal';
import './Staff.css';
import LogoutConfirmationModal from '../pages/LogoutConfirmationModal';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../request'; // Adjust the import based on your project structure
import { useOrganization } from '../../context/OrganizationContext'; // Adjust the import based on your project structure
import inputService from './employeeDataInputService';
import SecondaryHeader from './SecondaryHeader';
import EmergencyContactTable from './EmergencyContactTable';
import EmergencyContactModal from './EmergencyContactModal';
import OthersSectionForm from './OthersSectionForm';



const Staff = () => {
  const { auth, logout } = useAuth();
   const { organization } = useOrganization();
    const navigate = useNavigate();
  const { orgSlug } = useParams();

  const organizationId = organization?.id; 
  // || "7b36f817-0c88-4c68-80a0-203ea9936fe6";

  // const staffId = 'e00803f1-4f13-43bf-8051-86190dac50b8';
  const staffId = auth.emp && auth.emp.id;
 
  // const token = auth.token;
  const token = auth.token || localStorage.getItem('authToken'); // Adjust based on your auth context
  const [employeeData, setEmployeeData] = useState(null);
  const [wsError, setWsError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingInputs, setPendingInputs] = useState([]);
  const wsRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Employment‑details edit modal
  const [showEmpModal, setShowEmpModal] = useState(false);

    // Employment Details state
    const [employmentDetails, setEmploymentDetails] = useState({});
    
    const [showEmploymentDetailsModal, setShowEmploymentDetailsModal] = useState(false);

    // Employment Details handlers
    const handleEditEmploymentDetails = () => {
      setShowEmploymentDetailsModal(true);
    };

  const handleCancelEmploymentDetailsForm = () => {
    setShowEmploymentDetailsModal(false);
  };

  // Employment History state
  const [employmentHistory, setEmploymentHistory] = useState([]);

    // Form visibility states
    const [showHistoryForm, setShowHistoryForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [currentHistory, setCurrentHistory] = useState(null);
    const [currentPayment, setCurrentPayment] = useState(null);
     // Payment Details state
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);

     // Payment Details handlers
  const handleEditPayment = (record) => {
    setCurrentPayment(record);
    setShowPaymentForm(true);
  };

  const handleAddPayment = () => {
    setCurrentPayment({
      employee_id: '',
      payment_mode: '',
      bank_name: '',
      account_number: '',
      mobile_money_provider: '',
      wallet_number: '',
      is_verified: false,
      additional_info: ''
    });
    setShowPaymentForm(true);
  };

  const handleDeletePayment = (employeeId) => {
    setPaymentDetails(paymentDetails.filter(payment => payment.employee_id !== employeeId));
  };

  const handleSavePayment = (values) => {
    if (currentPayment?.employee_id) {
      setPaymentDetails(paymentDetails.map(payment => 
        payment.employee_id === currentPayment.employee_id ? values : payment
      ));
    } else {
      setPaymentDetails([...paymentDetails, values]);
    }
    setShowPaymentForm(false);
  };

  const handleCancelPaymentForm = () => {
    setShowPaymentForm(false);
    setCurrentPayment(null);
  };
  

  // Employment History handlers
  const handleEditHistory = (record) => {
    setCurrentHistory({
      ...record,
      documents_path: record.documents_path || []
    });
    setShowHistoryForm(true);
  };

  const handleAddHistory = () => {
    setCurrentHistory({
      id: null,
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      details: '',
      documents_path: []
    });
    setShowHistoryForm(true);
  };

  const handleDeleteHistory = (id) => {
    setEmploymentHistory(employmentHistory.filter(job => job.id !== id));
  };

  
  // Mock file upload function - replace with actual API call
  const uploadFile = async (file) => {
    // Simulate file upload delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`/documents/employment/${Date.now()}_${file.name}`);
      }, 1000);
    });
  };


  const handleSaveHistory = async (values, files) => {
    let documentPaths = [];
    
    // Handle file uploads if new files were added
    if (values.documents_path && values.documents_path.length > 0) {
      for (const file of values.documents_path) {
        if (file.originFileObj) {
          // New file upload
          const documentPath = await uploadFile(file.originFileObj);
          documentPaths.push({ 
            uid: `-${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.originFileObj.name,
            status: 'done',
            url: documentPath
          });
        } else if (file.url) {
          // Existing file
          documentPaths.push(file);
        }
      }
    }

    const newEntry = {
      ...values,
      documents_path: documentPaths
    };

    if (currentHistory?.id) {
      setEmploymentHistory(employmentHistory.map(job => 
        job.id === currentHistory.id ? newEntry : job
      ));
    } else {
      setEmploymentHistory([
        ...employmentHistory,
        {
          ...newEntry,
          id: Date.now().toString()
        }
      ]);
    }

    submitChangeRequest({
      data:        values,
      requestType: currentHistory?.id ? 'update' : 'save',
      dataType:    sectionToDataType['Employment-history'],
      files,
    });
    
    setShowHistoryForm(false);
    setCurrentHistory(null);
  };

    
  // Cancel handlers
  const handleCancelHistoryForm = () => {
    setShowHistoryForm(false);
    setCurrentHistory(null);
  };


  // Emergency Contacts state
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const handleEditContact = (record) => {
    setCurrentContact({
      ...record});
    setShowContactModal(true);
  };

  const handleAddContact = () => {
    setCurrentContact({
      name: '',
      relation: '',
      emergency_phone: '',
      emergency_address: '',
      details: ''
    });
    setShowContactModal(true);
  }
  
  const handleSaveContact = (values) => {
    if (currentContact?.id) {
      setEmergencyContacts(emergencyContacts.map(contact =>
        contact.id === currentContact.id ? values : contact
      ));
    } else {
      setEmergencyContacts([...emergencyContacts, { ...values, id: Date.now().toString() }]);
    }

    setShowContactModal(false);
  };

 
  // Next of Kin state
  const [nextOfKins, setNextOfKins] = useState([]);
  const [currentNextOfKin, setCurrentNextOfKin] = useState(null);
  const [showNextOfKinForm, setShowNextOfKinForm] = useState(false);

  const handleEditNextOfKin = (record) => {
    setCurrentNextOfKin({
      ...record,
    });
    setShowNextOfKinForm(true);
  };

  const handleAddNextOfKin = () => {
    setCurrentNextOfKin({
      id: null,
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    });

    setShowNextOfKinForm(true);
  };

  const handleDeleteNextOfKin = (id) => {
    setNextOfKins(nextOfKins.filter(kin => kin.id !== id));
  };
  const handleSaveNextOfKin = (values) => {
    if (currentNextOfKin?.id) {
      setNextOfKins(nextOfKins.map(kin =>
        kin.id === currentNextOfKin.id ? values : kin
      ));
    } else {
      setNextOfKins([...nextOfKins, { ...values, id: Date.now().toString() }]);
    }
    setShowNextOfKinForm(false);
  };

  const handleCancelNextOfKinForm = () => {
    setShowNextOfKinForm(false);
    setCurrentNextOfKin(null);
  };

  // Salary Payments state
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [currentSalary, setCurrentSalary] = useState(null);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  {/* if organization type is Private show Salary Payment section else don't show its section, just skip */}
  
  const isPrivateOrg = organization?.type === 'Private';
  console.log("isPrivateOrg: ", isPrivateOrg);
  const handleEditSalary = (record) => {
    setCurrentSalary(record);
    setShowSalaryForm(true);
  };
  const handleAddSalary = () => {
    setCurrentSalary({
      id: null,
      amount: '',
      date: '',
      payment_method: '',
      status: '',
      notes: ''
    });
    setShowSalaryForm(true);
  };
  const handleDeleteSalary = (id) => {
    setSalaryPayments(salaryPayments.filter(payment => payment.id !== id));
  };
  const handleSaveSalary = (values) => {
    if (currentSalary?.id) {
      setSalaryPayments(salaryPayments.map(payment =>
        payment.id === currentSalary.id ? values : payment
      ));
    } else {
      setSalaryPayments([...salaryPayments, { ...values, id: Date.now().toString() }]);
    }
    setShowSalaryForm(false);
  };
  const handleCancelSalaryForm = () => {
    setShowSalaryForm(false);
    setCurrentSalary(null);
  };

  console.log("org type: ", organization?.type);
  console.log("org slug: ", orgSlug);
  console.log("org slug in staff: ", orgSlug);

// ─── DOWNLOAD EMPLOYEE DATA ─────────────────────────────────────────
   const handleDownload = useCallback(async () => {
    if (!staffId || !organizationId) {
      toast.error('Missing staff or organization identifier.');
      return;
    }
    setIsDownloading(true);
    try {
      const url = `/download-employee-data/${staffId}/download`;
       const response = await request.get(url, {
        params: { organization_id: organizationId },
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = new Blob([response.data], { type: response.data.type });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `employee_${staffId}_data.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
      toast.error('Failed to download employee data.');
    }finally {
     setIsDownloading(false);
   }
  }, [staffId, organizationId, token]);




  //  Fetch all pending change-requests once on mount
useEffect(() => {
  if (!staffId) return;

  (async () => {
    try {
      const pend = await inputService.fetchPending(staffId);
      console.log("fetched pending inputs:", pend);
      setPendingInputs(pend);
    } catch (err) {
      console.error("fetchPending failed", err);
    }
  })();
}, [staffId]);

  // 2️⃣ Load employee data
  // Open WebSocket once on mount
  useEffect(() => {
    if (!staffId) return;

    // inputService.fetchPending(staffId)
    //   .then(setPendingInputs)
    //   .catch(err => console.error(err));
    console.log("pending in staff:: ", pendingInputs);
    // const token = auth.token;
    const wsUrl = `${process.env.REACT_APP_API_WS_URL || 'ws://localhost:8000'}/ws/employee/${organizationId}/${staffId}?token=${token}`;
    console.log("wsUrl: ", wsUrl);
    // const ws = new WebSocket(wsUrl, token ? [ `Bearer ${token}` ] : undefined);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WS connected');
      setWsError(null);            // clear any prior error
    };
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      console.log("\n\nweb sock payload: ", msg.payload);
      // if (['initial','update'].includes(msg.type)) {
      //   setEmployeeData(msg.payload);
      // }

        switch (msg.type) {
    case 'initial':
    case 'update':
      setEmployeeData(msg.payload);
      break;
    // case 'update':
    //   setEmployeeData(msg.payload);
    //      // Ensure bio‑data pending banner is cleared on any full refresh
    //      setPendingInputs(curr =>
    //        curr.filter(pi => pi.data_type !== 'employees')
    //      );
    //      break;

    case 'change_request':
  const { request_id, data_type, status } = msg.payload;

  // 1️⃣ Remove **all** pendingInputs for this data_type
  setPendingInputs(curr =>
    curr.filter(pi =>
      // normalize types: both as strings
      String(pi.data_type) !== String(data_type)
    )
  );

  // setPendingInputs(curr =>
  //   curr
  //     .map(pi =>
  //       pi.id === msg.payload.request_id
  //         ? { ...pi, status: msg.payload.status, comments: msg.payload.comments }
  //         : pi
  //     )
  //     .filter(pi =>
  //       // pi => pi.id !== msg.payload.request_id
  //       String(pi.data_type) !== String(data_type) //&&
  //       // String(pi.id)       !== String(request_id)
      
  //     )
  // );
  toast.success(`Your change request was ${msg.payload.status.toLowerCase()}.`);
  break;

    default:
      console.warn('Unknown WS message type', msg.type);
  }


    };
    ws.onerror = (err) => {
      console.error('WS error', err);
      setWsError('WebSocket connection error.');
    };
    ws.onclose = (ev) => {
      console.log('WS closed', ev.code, ev.reason);
    };

    wsRef.current = ws;
    return () => ws.close();
  }, [ staffId]   ); /*staffId, auth.token*/ // Adjust based on your auth context

  const handleRefresh = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('refresh');
    }
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal((prev) => !prev);
  };

  // 3️⃣ Submit any section’s change
  const submitChangeRequest = async ({ data, requestType, dataType, files }) => {
    try {
      console.log("data in staff - submitChangeRequest: ", data);
      console.log("files in staff - submitChangeRequest: ", files);
      console.log("data.files in staff - submitChangeRequest: ", data.files);
      // console.log("files.length in staff - submitChangeRequest: ", files.length);
      // console.log("files[0] in staff - submitChangeRequest: ", files[0]);
      const pi = await inputService.submit({
        employeeId:   staffId,
        organizationId: organizationId,
        data,
        requestType,
        dataType,
        files: files && files.length > 0 ? files : data.files,
      });
      setPendingInputs(p => [...p, pi]);
      toast.info('Your changes are pending approval.');
    } catch {
      toast.error('Failed to submit changes.');
    }
  };
  

  // 4️⃣ Section-specific save handlers
  const handleSaveEmploymentDetails = values => {
    submitChangeRequest({ data: values, type: 'update', dataType: 'employment_details' });
    setShowEmpModal(false);
  };


    //  ─── MAP UI section “keys” to back-end data_type ──────────────
    const sectionToDataType = {
      'Bio-data':               'employees',
      'Academic-qualifications':'academic_qualifications',
      'Professional-qualifications':'professional_qualifications',
      'Employment-details':     'employment_details',
      'Payment-details':        'employee_payment_details',
      'Employment-history':     'employment_history',
      'Emergency-contacts':     'emergency_contacts',
      'Next-of-kin':            'next_of_kin',
      'Salary-payments':        'salary_payments',
      'Others':                 'others',
    };
  
    //  ─── helper to check pendingInputs for any given dataType ────
    const isPending = (dataType) =>
      pendingInputs.some(pi => pi.data_type === dataType);

  
    // Unified data getter for all sections
  const getSectionData = key => {
    if (!employeeData) {
      return key === 'Others'
        ? { custom_data: {}, dynamic_data: {} }
        : Array.isArray(employeeData?.[key])
        ? []
        : {};
    }
    // pick raw
    let raw;
    if (key in employeeData) raw = employeeData[key];
    else if (employeeData.Qualifications && key in employeeData.Qualifications)
      raw = employeeData.Qualifications[key];
    else raw = key === 'Others' ? { custom_data: {}, dynamic_data: {} } : Array.isArray(employeeData?.[key]) ? [] : {};

    const pend = pendingInputs
      .filter(pi => pi.data_type === sectionToDataType[key])
      .map(pi => ({ ...pi.data, pending: true }));

    if (key === 'Others') {
      const base = { custom_data: raw.custom_data || {}, dynamic_data: raw.dynamic_data || {} };
      const merged = pend.reduce((acc, d) => ({ ...acc, ...d }), {});
      return {
        custom_data: { ...base.custom_data, ...merged },
        dynamic_data: { ...base.dynamic_data, ...merged }
      };
    }

    if (Array.isArray(raw)) return [...raw, ...pend];
    // object merge for single-object sections
    return { ...raw, ...pend.reduce((acc, d) => ({ ...acc, ...d }), {}) };
  };
  

  if (!employeeData && !wsError) return <div>Loading employee data…</div>;
  if (wsError) return (
    <div className="error-box">
      <p>{wsError}</p>
      <button onClick={handleRefresh}>Retry</button>
    </div>
  );


  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="dashboard-container">
      <Header className="main-header" />
      <SecondaryHeader title="" 
       extras={(
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="download-button"
            title="Download Employee Data"
          >
            {isDownloading
            ? <FaSpinner className="spin" />
             : '↓ Download Data'}
          </button>
        )}
      />
     
      <main className="dashboard-content">
      
      <div className="block-section">
          <div className="search-section">
            <SearchBar />
          </div>
          </div>
      

       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Bio-Data" icon="user">
           {/* <BioDataSection staffData={employeeData['Bio-data']} /> */}
           <BioDataSection
            staffData={getSectionData('Bio-data')}
            pending={ isPending(sectionToDataType['Bio-data']) }
            onRequestChange={data =>
              submitChangeRequest({ data, requestType: 'update', dataType: 'employees' })
            }
          />
          </ExpandableSection>
        </div>

          {/* Qualifications: two nested tables */}
       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Qualifications" icon="graduation-cap">
            {/* <div className="nested-blocks">
              <div className="nested-section"> */}
               <div className="qualifications-vertical">
               <div className="qualification-section-full">
                <ExpandableSection title="Academic" icon="book">
                  
                  <QualificationsSection
                type="academic"
                items={getSectionData('Academic-qualifications')}
                pending={ isPending(sectionToDataType['Academic-qualifications']) }
              
                onRequestChange={({data, requestType, files}) =>
                  submitChangeRequest({
                    data,
                    requestType,
                    // requestType: data?.id ? 'update' : 'save',
                    dataType: 'academic_qualifications',
                    files
                  })
                }
              />
                </ExpandableSection>
              </div>
              {/* <div className="nested-section">/ */}
              <div className="qualification-section-full">
                <ExpandableSection title="Professional" icon="briefcase">
                  {/* <QualificationsSection type="professional"  items={employeeData.Qualifications['Professional-qualifications']}/> */}
                  <QualificationsSection
                type="professional"
                items={getSectionData('Professional-qualifications')}
                pending={ isPending(sectionToDataType['Professional-qualifications']) }
                onRequestChange={({data, requestType, files }) =>
                  submitChangeRequest({
                    data,
                    requestType,
                    // requestType: data.id ? 'update' : 'save',
                    dataType: 'professional_qualifications',
                    files
                  })
                }
              />
                </ExpandableSection>
              </div>
            </div>
          </ExpandableSection>
        </div>

       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Employment Details" icon="building">
            <EmploymentDetailsSection employmentDetails={employeeData['Employment-details']} onEdit={handleEditEmploymentDetails}/>
            <EmploymentDetailsModal
              visible={showEmploymentDetailsModal}
              initialValues={employeeData['Employment-details']}
              onFinish={handleSaveEmploymentDetails}
              onCancel={handleCancelEmploymentDetailsForm}
            />

          </ExpandableSection>
        </div>
       
      

       {/* Payment Details Section */}
      <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Payment Details" icon="credit">
            {/* <div className="action-buttons">
              <button 
                className="add-button" 
                onClick={handleAddPayment}
              >
                Add Payment Details
              </button>
            </div> */}
            <EmployeePaymentDetailTable 
              data={getSectionData('Payment-details')}
              pending={isPending(sectionToDataType['Payment-details'])}
              onRequestChange={({ data, requestType }) =>
                submitChangeRequest({
                  data,
                  requestType,
                  dataType: sectionToDataType['Payment-details']
                })
              }
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
            />
            <EmployeePaymentDetailModal
              visible={showPaymentForm}
              initialValues={currentPayment}
              onFinish={handleSavePayment}
              onCancel={handleCancelPaymentForm}
            />
          </ExpandableSection>
        </div>
        
       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Employment History" icon="history">
            <div className="action-buttons">
            <button
            className="add-button"
            // onClick = {handleAddHistory}
            onClick={() => {
              setCurrentHistory({});           // empty = Add
              setShowHistoryForm(true);
            }}
            disabled={isPending('employment_history')}
          >
                Add Employment Record
              </button>
            </div>
            <EmploymentHistoryTable 
              data={getSectionData('Employment-history')}
              pending={isPending(sectionToDataType['Employment-history'])}
              onRequestChange={({ data, requestType, files }) =>
                submitChangeRequest({
                  data,
                  requestType,
                  dataType: sectionToDataType['Employment-history'],
                  files,
                })
             }
             onEdit ={record => {
              setCurrentHistory(record);
              setShowHistoryForm(true);
            }}
            onDelete={id => submitChangeRequest({
              data: { id },
              requestType: 'delete',
              dataType: 'employment_history'
            })}
            />
           <EmploymentHistoryModal
          open={showHistoryForm}
          initialValues={currentHistory}
          onCancel={() => setShowHistoryForm(false)}
          onFinish={(values, files) => {
            submitChangeRequest({
              data: values,
              requestType: values.id ? 'update' : 'save',
              dataType: 'employment_history',
              files
            });
            setShowHistoryForm(false);
          }}
        />
          </ExpandableSection>
        </div>

       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Emergency Contacts" icon="phone">
            <div className="action-buttons">
              <button 
                className="add-button" 
                // onClick = {handleAddContact}
                onClick={() => {
                  setCurrentContact({});             // empty → add
                  setShowContactModal(true);
                }}
                disabled={isPending('emergency_contacts')}
              >
                Add Emergency Contact
              </button>
            </div>
            <EmergencyContactTable 
              data={getSectionData('Emergency-contacts')}
              pending={isPending(sectionToDataType['Emergency-contacts'])}
              onEdit={record => {
                setCurrentContact(record);
                setShowContactModal(true);
              }}
              onDelete={id =>
                submitChangeRequest({
                  data: { id },
                  requestType: 'delete',
                  dataType: sectionToDataType['Emergency-contacts']
                })
              }
            />

            <EmergencyContactModal
              open={showContactModal}
              initialValues={currentContact}
              onCancel={() => setShowContactModal(false)}
              onFinish={values => {
                submitChangeRequest({
                  data: values,
                  requestType: values.id ? 'update' : 'save',
                  dataType: sectionToDataType['Emergency-contacts']
                });
                setShowContactModal(false);
              }}
              
            />
          </ExpandableSection>
        </div>


        {/* Next of Kin Section */}
        <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Next of Kin" icon="team">
            <div className="action-buttons">
              <button 
                className="add-button" 
                onClick={() => {
                  setCurrentNextOfKin({});             // empty → add
                  setShowNextOfKinForm(true);
                }}
                disabled={isPending('Next-of-kin')}
              >
                Add Next of Kin
              </button>
            </div>
            <NextOfKinTable 
              data={getSectionData('Next-of-kin')}
              pending={isPending(sectionToDataType['Next-of-kin'])}
              onEdit={record => {
                setCurrentNextOfKin(record);
                setShowNextOfKinForm(true);
              }}
              onDelete={id =>
                submitChangeRequest({
                  data: { id },
                  requestType: 'delete',
                  dataType: sectionToDataType['Next-of-kin']
                })
              }
            />
            <NextOfKinModal 
              visible={showNextOfKinForm}
              initialValues={currentNextOfKin}
              onFinish={values => {
                submitChangeRequest({
                  data: values,
                  requestType: values.id ? 'update' : 'save',
                  dataType: sectionToDataType['Next-of-kin']
                });
                setShowNextOfKinForm(false);
                // setShowContactModal(false);
              }}
              onCancel={handleCancelNextOfKinForm}
            />
          </ExpandableSection>
        </div>

        {/* Salary Payment Section */}
        {isPrivateOrg && (
        <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Salary Payments" icon="money">
            <div className="action-buttons">
              {/* <button
                className="add-button"
                onClick={handleAddSalary}
              >
                Add Salary Payment
              </button> */}
            </div>
            <SalaryPaymentTable
              data={getSectionData('Salary-payments')}
              onEdit={handleEditSalary}
              onDelete={handleDeleteSalary}
            />
            {/* <SalaryPaymentModal
              visible={showSalaryForm}
              initialValues={currentSalary}
              onFinish={handleSaveSalary}
              onCancel={handleCancelSalaryForm}
              ranks={employeeData['Employment-details'].rank}
              users={employeeData['Employment-details'].users}
            /> */}
          </ExpandableSection>
        </div>
        )}
        {/* Other Information Section */}
       {/* Other Information */}
       <div className="block-section" style={{color:"black"}}>
          <ExpandableSection title="Other Information" icon="info-circle">
            <OthersSectionForm
              customData={getSectionData('Others').custom_data}
              dynamicData={getSectionData('Others').dynamic_data}
              onSubmit={values => submitChangeRequest({ data: values, requestType: 'update', dataType: sectionToDataType['Others'], files: values.files })}
            />
          </ExpandableSection>
        </div>


<button className="scroll-top-btn" onClick={scrollToTop}>↑ Top</button>


      </main>
      <Footer />
    </div>
  );
};

export default Staff;











// // src/components/Staff.js
// import React from 'react';
// import { useAuth } from '../../context/AuthContext';
// import Header from '../pages/Header';
// import Footer from '../Footer';
// import ProfileCard from '../pages/ProfileCard';
// import SearchBar from './SearchBar';
// import ExpandableSection from './ExpandableSection';
// import BioDataSection from './BioDataSection';
// import QualificationsSection from './QualificationsSection';
// import EmploymentDetailsSection from './EmploymentDetailsSection';
// // import PaymentDetailsSection from './PaymentDetailsSection';
// // import NextOfKinSection from './NextOfKinSection';
// // import EmergencyContactSection from './EmergencyContactSection';
// // import EmploymentHistorySection from './EmploymentHistorySection';
// import './Staff.css';

// const Staff = () => {

//     const { auth } = useAuth();
//     const staffId = auth.emp && auth.emp.id; // Adjust depending on how your user model is structured

//   return (
//     <div className="dashboard-container">
//       <Header />
//       <div className="dashboard-content">
//       <div className="section-block">
//           <ProfileCard />
//         </div>
//         <div className="section-block">
//           <SearchBar />
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Bio-Data" icon="user">
//             <BioDataSection staffId={staffId} />
//           </ExpandableSection>
//         </div>

//         <div className="section-block">
//           <ExpandableSection title="Qualifications" icon="graduation-cap">
//             <div className="qualifications-container">
//               <div className="section-block">
//                 <ExpandableSection title="Academic" icon="book">
//                   <QualificationsSection type="academic" />
//                 </ExpandableSection>
//               </div>
//               <div className="section-block">
//                 <ExpandableSection title="Professional" icon="briefcase">
//                   <QualificationsSection type="professional" />
//                 </ExpandableSection>
//               </div>
//             </div>
//           </ExpandableSection>
//         </div>

//         <div className="section-block">
//           <ExpandableSection title="Employment Details" icon="building">
//             <EmploymentDetailsSection />
//           </ExpandableSection>
//         </div>
//         {/*
//         Uncomment and add additional sections as required:
//         <div className="section-block">
//           <ExpandableSection title="Payment Details" icon="money">
//             <PaymentDetailsSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Next of Kin" icon="users">
//             <NextOfKinSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Emergency Contact" icon="phone">
//             <EmergencyContactSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Employment History" icon="history">
//             <EmploymentHistorySection />
//           </ExpandableSection>
//         </div>
//         */}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Staff;
