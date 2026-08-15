import "./default.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-simple">
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} 영화 추천 사이트. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
