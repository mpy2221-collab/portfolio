import { useNavigate, useLocation } from "react-router-dom";
import "./default.css";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const MOBILE_BREAKPOINT = 968;

const MEMBER_MENUS = [
  { url: "/member/info", text: "내 정보" },
  { url: "/member/pw", text: "비밀번호 변경" },
  { url: "/member/simple-review", text: "심플 리뷰" },
  { url: "/member/board-review", text: "게시글 리뷰" },
];

const ADMIN_MENUS = [
  { url: "/admin/member", text: "회원 관리" },
  { url: "/admin/simple-review", text: "심플 리뷰 관리" },
  { url: "/admin/board-review", text: "게시글 리뷰 관리" },
  { url: "/admin/user-pick", text: "유저픽 영화 관리" },
];

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = props.isLogin;
  const logoutFunction = props.logoutFunction;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  const drawerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const isMemberPage = location.pathname.startsWith("/member");
  const isAdminPage = location.pathname.startsWith("/admin");

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);
  const isExactActive = (path) => location.pathname === path;

  const getNavClassName = (path) => {
    return "nav-item" + (isActive(path) ? " active" : "");
  };

  const getSubNavClassName = (path) => {
    return "nav-item sub-nav-item" + (isExactActive(path) ? " active" : "");
  };

  const go = (path) => {
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    closeMenu();
    logoutFunction();
  };

  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          if (res.data.message == "success") {
            if (res.data.data.memberType == 1) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        })
        .catch((err) => {
          console.error("회원 정보 조회 실패:", err);
        });
    } else {
      setIsAdmin(false);
    }
  }, [isLogin, backServer]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen && !guideOpen) return;
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (guideOpen) setGuideOpen(false);
      else closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, guideOpen, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const onTouchStart = (e) => {
    if (!isMobile || !menuOpen) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const onTouchEnd = (e) => {
    if (!isMobile || !menuOpen) return;
    if (touchStartX.current === null) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -60) {
      closeMenu();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const mainNav = (
    <nav className="header-nav">
      <button
        className={getNavClassName("/board/popular")}
        onClick={() => go("/board/popular/list")}
        type="button"
      >
        인기 영화
      </button>
      <button
        className={getNavClassName("/board/user-pick")}
        onClick={() => go("/board/user-pick/list")}
        type="button"
      >
        유저픽
      </button>
      <button
        className={getNavClassName("/board/review")}
        onClick={() => go("/board/review/list")}
        type="button"
      >
        리뷰 게시판
      </button>
    </nav>
  );

  const userMenu = (
    <div className="header-user-menu">
      {isLogin ? (
        <>
          {isAdmin && (
            <button
              className="user-menu-btn admin-btn"
              onClick={() => go("/admin/member")}
              type="button"
            >
              관리자페이지
            </button>
          )}
          <button
            className="user-menu-btn"
            onClick={() => go("/member/info")}
            type="button"
          >
            마이페이지
          </button>
          <button
            className="user-menu-btn logout-btn"
            onClick={handleLogout}
            type="button"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <button
            className="user-menu-btn login-btn"
            onClick={() => go("/login")}
            type="button"
          >
            로그인
          </button>
          <button
            className="user-menu-btn join-btn"
            onClick={() => go("/join")}
            type="button"
          >
            회원가입
          </button>
        </>
      )}
    </div>
  );

  const sectionMenus = isMemberPage
    ? MEMBER_MENUS
    : isAdminPage
      ? ADMIN_MENUS
      : null;

  const sectionTitle = isMemberPage
    ? "마이페이지 메뉴"
    : isAdminPage
      ? "관리자페이지 메뉴"
      : null;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-logo" onClick={() => go("/")}>
            <span className="logo-text">MOVIE</span>
            <span className="logo-subtext">PORTFOLIO</span>
          </div>
          <button
            className="header-guide-btn"
            type="button"
            onClick={() => setGuideOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={guideOpen}
          >
            <span className="header-guide-icon" aria-hidden="true">
              ?
            </span>
            안내+
          </button>
        </div>

        <div className="header-desktop-menu">
          {mainNav}
          {userMenu}
        </div>

        <button
          className={"hamburger-btn" + (menuOpen ? " open" : "")}
          type="button"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      <div
        className={"mobile-menu-overlay" + (menuOpen ? " open" : "")}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <div
        ref={drawerRef}
        className={"mobile-menu-drawer" + (menuOpen ? " open" : "")}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
      >
        <div className="mobile-menu-drawer-header">
          <span className="mobile-menu-title">메뉴</span>
          <button
            className="mobile-menu-close"
            type="button"
            aria-label="메뉴 닫기"
            onClick={closeMenu}
          >
            ✕
          </button>
        </div>
        <div className="mobile-menu-body">
          {mainNav}

          {sectionMenus && (
            <div className="mobile-section-menu">
              <p className="mobile-section-title">{sectionTitle}</p>
              <nav className="header-nav mobile-section-nav">
                {sectionMenus.map((menu) => (
                  <button
                    key={menu.url}
                    className={getSubNavClassName(menu.url)}
                    onClick={() => go(menu.url)}
                    type="button"
                  >
                    {menu.text}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {userMenu}
        </div>
        <p className="mobile-menu-hint">← 왼쪽으로 밀어서 닫기</p>
      </div>

      {guideOpen && (
        <div
          className="guide-modal-overlay"
          onClick={() => setGuideOpen(false)}
          role="presentation"
        >
          <div
            className="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="guide-modal-title" className="guide-modal-title">
              MOVIE PORTFOLIO 안내
            </h2>
            <p className="guide-modal-desc">
              영화를 추천하고 리뷰를 공유하는 커뮤니티입니다. TMDB 인기 영화를
              조회하고, 심플 리뷰·게시글 리뷰를 작성하면 유저픽에 반영됩니다.
              일반 회원은 리뷰·댓글 작성, 관리자는 회원·리뷰·유저픽 관리와
              통계를 이용할 수 있습니다.
            </p>
            <div className="guide-modal-accounts">
              <p>
                <strong>관리자</strong>
                <br />
                아이디 <strong>admin</strong> · 비밀번호 <strong>1234</strong>
              </p>
              <p>
                <strong>일반 회원</strong>
                <br />
                아이디 <strong>user01</strong> · 비밀번호 <strong>1234</strong>
                <br />
                user01~user15 계정으로도 로그인할 수 있습니다.
              </p>
            </div>
            <div className="guide-modal-actions">
              <button
                className="guide-modal-confirm"
                type="button"
                onClick={() => setGuideOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
