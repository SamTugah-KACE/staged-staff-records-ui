// src/components/ExpandableSection.js
import React, { useState } from 'react';
import './ExpandableSection.css';
import { FaChevronDown, FaChevronUp, FaUser, FaGraduationCap, FaBook, FaBriefcase, FaBuilding } from 'react-icons/fa';
import { GiMoneyStack } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineWork } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { HistoryOutlined, CreditCardOutlined,PhoneOutlined} from '@ant-design/icons';
// You may use a library like FontAwesome for icons.
// import { FaChevronDown, FaChevronUp, FaIcon } from 'react-icons/fa';


const iconMap = {
  user: <FaUser />,
  'graduation-cap': <FaGraduationCap />,
  book: <FaBook />,
  briefcase: <FaBriefcase />,
  building: <FaBuilding />,
  money: <GiMoneyStack style={{ fontWeight: "bolder", fontSize: 20 }}/>,
  history: <HistoryOutlined style={{ fontWeight: 'bold' }}/>,
  credit: <CreditCardOutlined style={{ fontWeight: 'bold',fontSize: 20 }}/>,
  team: <BsFillPeopleFill  style={{ fontWeight: 'bold',fontSize: 20 }}/>,
  phone: <PhoneOutlined style={{ fontWeight: 'bold',fontSize: 20 }}/>,
};

const ExpandableSection = ({ title, icon, children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(prev => !prev);


  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpanded}>
        <div className="section-title">
          {/* Render the icon from the map, if provided */}
          { iconMap[icon] && <span className="section-icon">{iconMap[icon]}</span> }
          <span>{title}</span>
        </div>
        <div className="section-toggle">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {expanded && <div className="section-content">{children}</div>}
    </div>
  );
};

export default ExpandableSection;


//   return (
//     <div className="expandable-section">
//       <div className="section-header" onClick={toggleExpanded}>
//         <div className="section-title">
//           {/* Replace with your icon component, for example: */}
//           <i className={`fa fa-${icon}`}></i>
//           <span>{title}</span>
//         </div>
//         <div className="section-toggle">
//           {expanded ? <FaChevronUp /> : <FaChevronDown />}
//         </div>
//       </div>
//       {expanded && <div className="section-content">{children}</div>}
//     </div>
//   );
// };

// export default ExpandableSection;
