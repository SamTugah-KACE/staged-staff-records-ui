import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { BiSolidDashboard } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield } from "react-icons/fa";
import { BsBuildingAdd } from "react-icons/bs";
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar, isDarkMode }) => {
  console.log('Sidebar rendering - isCollapsed:', isCollapsed, 'isDarkMode:', isDarkMode);
  
  const navigate = useNavigate();
  const location = useLocation();
  console.log('Current path:', location.pathname);

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <BiSolidDashboard />, 
      path: '/Dashboard',
      subItems: [] 
    },
    { 
      name: 'Organization Registration', 
      icon: <BsBuildingAdd />, 
      path: '/organization-registration',
      subItems: [] 
    },
    { 
      name: 'Account Recovery', 
      icon: <FaUserShield />, 
      path: '/account-recovery',
      subItems: [] 
    },
  ];

  const isActive = (path) => {
    const active = location.pathname === path;
    console.log(`Checking if ${path} is active:`, active);
    return active;
  };

  const handleMenuItemClick = (path) => {
    console.log('Menu item clicked, navigating to:', path);
    navigate(path);
  };

  const handleToggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isCollapsed);
    toggleSidebar();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="collapse-button" onClick={handleToggleSidebar}>
        {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
      <ul className="menu-list">
        {menuItems.map((item, index) => {
          console.log(`Rendering menu item ${item.name} with path ${item.path}`);
          return (
            <li 
              key={index} 
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.path)}
            >
              <div className="menu-item-header">
                <span className="menu-icon">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;