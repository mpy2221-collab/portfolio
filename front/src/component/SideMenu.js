import { useNavigate } from "react-router-dom";
import "./formFrm.css";

const SideMenu = (props) => {
  const navigate = useNavigate();
  const menus = props.menus;
  const setMenus = props.setMenus;

  const handleMenuClick = (index, url) => {
    // 모든 메뉴의 active를 false로 설정
    const updatedMenus = menus.map((menu, i) => ({
      ...menu,
      active: i === index,
    }));
    setMenus(updatedMenus);
    navigate("/member/" + url);
  };

  return (
    <div className="mypage-sidebar">
      <h2 className="sidebar-title">마이페이지</h2>
      <nav className="sidebar-menu">
        <ul className="sidebar-menu-list">
          {menus.map((menu, index) => {
            const getSidebarClassName = () => {
              const baseClass = "sidebar-menu-link";
              const activeClass = menu.active ? " active" : "";
              return baseClass + activeClass;
            };

            return (
              <li key={index} className="sidebar-menu-item">
                <button
                  className={getSidebarClassName()}
                  onClick={() => handleMenuClick(index, menu.url)}
                  type="button"
                >
                  {menu.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;


