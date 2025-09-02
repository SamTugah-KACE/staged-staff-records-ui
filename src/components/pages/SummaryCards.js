/* -------------------- SummaryCards.js -------------------- */
import React, { useState, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
// import slick CSS for proper rendering
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SummaryCard.css';
import * as Icons from 'react-icons/fa';

export default function SummaryCards({ data, loading, error }) {
  const [slidesToShow, setSlidesToShow] = useState(4);
  useEffect(() => {
    const updateSlides = () => {
      const w = window.innerWidth;
      if (w < 500) setSlidesToShow(1);
      else if (w < 768) setSlidesToShow(2);
      else if (w < 1024) setSlidesToShow(3);
      else setSlidesToShow(4);
    };
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const keys = useMemo(() => data ? Object.keys(data) : [], [data]);
  const settings = {
    dots: true,
    infinite: keys.length > slidesToShow,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  if (loading) return <div className="summary-skeletons">Loading...</div>;
  if (error) return <div className="summary-error">Error loading summary data.</div>;
  if (!Object.keys(data).length  || !keys.length ) return <div className="no-summary">No summary data available.</div>;

  const renderCard = key => {
    const iconName = `Fa${key.replace(/(^\w|_\w)/g, m => m.replace('_','').toUpperCase())}`;
    const IconComp = Icons[iconName] || Icons.FaClipboardList;
    return (
      <div key={key} className="card">
        <div className="card-header">
          <IconComp className="icon" />
          <span className="card-title">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
        </div>
        <p className="card-value">{data[key]}</p>
      </div>
    );
  };

  return (
    <div className="summary-cards">
      <Slider {...settings} className="cards-slider">
        {keys.map(renderCard)}
      </Slider>
    </div>
  );
}

// Uncomment below to use the original code with Slider





  // return (
  //   <div className="summary-cards">
  //     {data && Object.keys(data).length > 0 ? (
  //       <Slider {...settings}>
  //         {Object.entries(data).map(([key, value]) => (
  //           <div key={key} className="card">
  //             <h3>
  //               {ICON_MAP[key] || <FaClipboardList />}{" "}
  //               {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
  //             </h3>
  //             <p className="card-value">{value}</p>
  //           </div>
  //         ))}
  //       </Slider>
  //     ) : (
  //       <div className="no-data">No summary data available</div> // or just leave empty
  //     )}
  //   </div>
  // );
 

  // return (
  //   <div className="summary-cards">
  //     <Slider {...settings}>
  //       {Object.entries(data).map(([key, value]) => (
          
  //         <div key={key} className="card">
  //           <h3>
  //             {ICON_MAP[key] || <FaClipboardList />}{" "}
  //             {key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
  //           </h3>
  //           <p className="card-value">{value}</p>
  //         </div>
  //       ))}
  //     </Slider>
  //   </div>
  // );
// }




// import React, { useState, useEffect } from 'react';
// import Slider from 'react-slick';
// import './SummaryCard.css';
// import {
//   FaUserCheck, FaUserTimes, FaBuilding, FaSitemap,
//   FaUsers, FaClipboardList, FaFileInvoiceDollar, FaMoneyBillWave
// } from 'react-icons/fa';

// const ICON_MAP = {
//   branches:    <FaBuilding />,
//   departments: <FaSitemap />,
//   ranks:       <FaClipboardList />,
//   roles:       <FaUsers />,
//   users:       <FaUserCheck />,
//   employees:   <FaUserTimes />,
//   promotion_policies: <FaClipboardList />,
//   tenancies:   <FaFileInvoiceDollar />,
//   bills:       <FaFileInvoiceDollar />,
//   payments:    <FaMoneyBillWave />,
// };

// export default function SummaryCards({ data }) {
//   const [slidesToShow, setSlidesToShow] = useState(4);

//   useEffect(() => {
//     function handleResize() {
//       const width = window.innerWidth;
//       if (width < 500)        setSlidesToShow(1);
//       else if (width < 768)   setSlidesToShow(2);
//       else if (width < 1024)  setSlidesToShow(3);
//       else                    setSlidesToShow(4);
//     }
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   if (!data) return null;
//   const entries = Object.entries(data);

//   const settings = {
//     dots: true,
//     infinite: entries.length > slidesToShow,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     arrows: true,
//     swipeToSlide: true,
//     adaptiveHeight: true,
//   };

//   return (
//     <div className="summary-cards">
//       <Slider {...settings}>
//         {entries.map(([key, value]) => (
//           <div key={key} className="card">
//             <h3>
//               {ICON_MAP[key] || <FaClipboardList />}{" "}
//               {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//             </h3>
//             <p className="card-value">{value}</p>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }







// import React from 'react';
// import './SummaryCard.css';
// import { FaUserCheck, FaUserTimes, FaBuilding } from 'react-icons/fa'; // using react-icons
// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css'; // npm install react-multi-carousel

// const SummaryCards = () => {
//   // Dummy data
//   const accountSummary = {
//     active: { male: 20, female: 25 },
//     inactive: { male: 5, female: 7 },
//     total: 57
//   };
//   const departmentSummary = {
//     departments: ['HR', 'IT', 'Finance', 'Sales'],
//     total: 4
//   };

  

//   return (
//     <div className="summary-cards">
//       <div className="card">
//         <h3>
//           <FaUserCheck className="icon" /> Accounts
//         </h3>
//         <div className="card-details">
//           <div>
//             <strong>Active:</strong>
//             <br />
//             Male: {accountSummary.active.male}
//             <br />
//             Female: {accountSummary.active.female}
//           </div>
//           <div>
//             <strong>Inactive:</strong>
//             <br />
//             Male: {accountSummary.inactive.male}
//             <br />
//             Female: {accountSummary.inactive.female}
//           </div>
//         </div>
//         <p>
//           <strong>Total: {accountSummary.total}</strong>
//         </p>
//       </div>
//       <div className="card">
//         <h3>
//           <FaBuilding className="icon" /> Departments
//         </h3>
//         <ul>
//           {departmentSummary.departments.map((dept, i) => (
//             <li key={i}>{dept}</li>
//           ))}
//         </ul>
//         <p>
//           <strong>Total: {departmentSummary.total}</strong>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SummaryCards;
