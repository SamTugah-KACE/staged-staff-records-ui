import logo from './assets/5.png';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={logo} alt="Footer Logo" className="footer-logo" />
      <div className="footer-text">Copyright © {new Date().getFullYear()} My Website</div>
    </footer>
  );
};

export default Footer;