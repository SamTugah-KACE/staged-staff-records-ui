import logo from './assets/5.png';
import { IoSunny, IoMoon } from "react-icons/io5";
import './Header.css';

const Header = ({ toggleDarkMode, isDarkMode }) => {


  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="company logo" />
      
      <div className="header-text">NEXUS COMPUTING</div>
      
      <div className="header-controls">
        <button 
          className="theme-toggle-button" 
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <IoSunny className="theme-icon" />
          ) : (
            <IoMoon className="theme-icon" />
          )}
        </button>

        
      </div>
    </header>
  );
};

export default Header;