import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer py-3">
      <div className="container">
        {/* Copyright */}
        <div className="copyright-bar mt-2 pt-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0">&copy; 2025 Red Ram Gadgets. All Rights Reserved.</p>
            </div>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;