import "./default.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">영화 추천 사이트</h3>
          <p className="footer-description">
            TMDB API를 활용한 영화 추천 서비스
          </p>
          <p className="footer-description">
            유저가 직접 리뷰를 작성하고 공유할 수 있는 커뮤니티 서비스
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            TMDB 공식 사이트 링크
          </a>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">기술 스택</h4>
          <p className="footer-text">
            React.js, Java, Spring Boot, Oracle, MyBatis, AWS(EC2)
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">연락처</h4>
          <div
            style={{ pointerEvents: "none", cursor: "default" }}
            className="footer-text"
          >
            Email: mpy2221@gmail.com
          </div>
          <a
            href="https://github.com/mpy2221-collab/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub: 박근열
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} 영화 추천 사이트. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
