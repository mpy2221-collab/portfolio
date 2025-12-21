import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./default.css";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = props.isLogin;
  const logoutFunction = props.logoutFunction;
  const isAdmin = false;

  // 현재 경로가 활성화된 메뉴인지 확인
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // className 생성 헬퍼 함수
  const getNavClassName = (path) => {
    const baseClass = "nav-item";
    const activeClass = isActive(path) ? " active" : "";
    return baseClass + activeClass;
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* 로고/사이트명 */}
        <div className="header-logo" onClick={() => navigate("/")}>
          <span className="logo-text">MOVIE</span>
          <span className="logo-subtext">PORTFOLIO</span>
        </div>

        {/* 메인 메뉴 */}
        <nav className="header-nav">
          <button
            className={getNavClassName("/board/popular")}
            onClick={() => navigate("/board/popular/list")}
          >
            인기 영화
          </button>
          <button
            className={getNavClassName("/board/user-pick")}
            onClick={() => navigate("/board/user-pick/list")}
          >
            유저픽
          </button>
          <button
            className={getNavClassName("/board/review")}
            onClick={() => navigate("/board/review/list")}
          >
            리뷰 게시판
          </button>
        </nav>

        {/* 사용자 메뉴 */}
        <div className="header-user-menu">
          {isLogin ? (
            <>
              {isAdmin && (
                <button
                  className="user-menu-btn admin-btn"
                  onClick={() => navigate("/admin/member")}
                >
                  관리자페이지
                </button>
              )}
              <button
                className="user-menu-btn"
                onClick={() => navigate("/member/info")}
              >
                마이페이지
              </button>
              <button
                className="user-menu-btn logout-btn"
                onClick={logoutFunction}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                className="user-menu-btn login-btn"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
              <button
                className="user-menu-btn join-btn"
                onClick={() => navigate("/join")}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
