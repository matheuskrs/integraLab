import { useState, useEffect, useRef } from "react";
import "./sidebar.css";
import logo from "../../assets/integraLabLogo.png";
import miniLogo from "../../assets/integraLabMiniLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircleUser,
  faQuestionCircle,
  faRightFromBracket,
  faShield,
  faUserFriends,
  faBuilding,
  faBoxOpen as faBox,
  faLink,
  faDownload,
  faNewspaper,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ activePage }) {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
    >
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
      </button>
      <div className="sidebar-top">
        <div className="logo-container" >
          <img src={collapsed ? miniLogo : logo} alt="IntegraLab" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li title="Perfis de acesso" className={activePage === "perfis" ? "active" : ""}>
              <FontAwesomeIcon icon={faShield} />
              {!collapsed && "Perfis de acesso"}
            </li>
            <li title="Usuários" className={activePage === "usuarios" ? "active" : ""}>
              <FontAwesomeIcon icon={faUserFriends} />
              {!collapsed && "Usuários"}
            </li>
            <li title="Laboratórios" className={activePage === "laboratorios" ? "active" : ""}>
              <FontAwesomeIcon icon={faBuilding} />
              {!collapsed && "Laboratórios"}
            </li>
            <li title="Sistemas" className={activePage === "sistemas" ? "active" : ""}>
              <FontAwesomeIcon icon={faBox} />
              {!collapsed && "Sistemas"}
            </li>
            <li title="Associação" className={activePage === "associacao" ? "active" : ""}>
              <FontAwesomeIcon icon={faLink} />
              {!collapsed && "Associação"}
            </li>
            <li title="Download de Sistemas" className={activePage === "downloads" ? "active" : ""}>
              <FontAwesomeIcon icon={faDownload} />
              {!collapsed && "Download de Sistemas"}
            </li>
            <li title="Feed de notícias" className={activePage === "feed" ? "active" : ""}>
              <FontAwesomeIcon icon={faNewspaper} />
              {!collapsed && "Feed de notícias"}
            </li>
            <li title="Gestão de Acessos" className={activePage === "gestao" ? "active" : ""}>
              <FontAwesomeIcon icon={faChartLine} />
              {!collapsed && "Gestão de Acessos"}
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-info">
          <FontAwesomeIcon icon={faCircleUser} className="user-avatar" />
          {!collapsed && (
            <div className="info-details">
              <span>Administrador</span>
              <strong className="user-name">João Silva</strong>
            </div>
          )}
        </div>
        <button className="sidebar-help">
          <FontAwesomeIcon icon={faQuestionCircle} /> {!collapsed && "Ajuda"}
        </button>
        <button className="sidebar-logout">
          <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
}
