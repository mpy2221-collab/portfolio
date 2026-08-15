import { useNavigate, useLocation } from "react-router-dom";
import "./formFrm.css";

const SideMenu = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = props.menus;
  const basePath = props.basePath;
  const title = props.title;

  const handleMenuClick = (url) => {
    navigate(basePath + "/" + url);
  };

  return (
    <div className="mypage-sidebar sidebar-desktop">
      <h2 className="sidebar-title">{title}</h2>
      <nav className="sidebar-menu">
        <ul className="sidebar-menu-list">
          {menus.map((menu, index) => {
            const currentPath = location.pathname;
            const isActive = currentPath === `${basePath}/${menu.url}`;
            const className = "sidebar-menu-link" + (isActive ? " active" : "");

            return (
              <li key={index} className="sidebar-menu-item">
                <button
                  className={className}
                  onClick={() => handleMenuClick(menu.url)}
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
