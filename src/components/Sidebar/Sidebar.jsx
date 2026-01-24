import { useState, useEffect, useRef } from "react";
import "./sidebar.css";
import logo from "../../assets/SInLabsLogo.png";
import miniLogo from "../../assets/SInLabsMiniLogo.png";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/useToast";
import { useGlobalLoading } from "../Loading/GlobalLoadingContext";
import Tooltip from "../Tooltip/Tooltip";

export default function Sidebar({ activePage }) {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);
  const navigator = useNavigate();
  const toast = useToast();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { showLoading, hideLoading } = useGlobalLoading();
  const MENU_ITEMS = [
    {
      id: "access",
      label: "Perfis de acesso",
      icon: faShield,
      path: "/access",
    },
    {
      id: "users",
      label: "Usuários",
      icon: faUserFriends,
      path: "/users",
    },
    {
      id: "laboratories",
      label: "Laboratórios",
      icon: faBuilding,
      path: "/laboratories",
    },
    { id: "sistemas", label: "Sistemas", icon: faBox, path: "/sistemas" },
    {
      id: "association",
      label: "Associação",
      icon: faLink,
      path: "/association",
    },
    {
      id: "downloads",
      label: "Download de Sistemas",
      icon: faDownload,
      path: "/downloads",
    },
    { id: "feed", label: "Feed de notícias", icon: faNewspaper, path: "/feed" },
    {
      id: "management",
      label: "Gestão de Acessos",
      icon: faChartLine,
      path: "/management",
    },
  ];

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
  const handleLogout = async () => {
    try {
      showLoading("Desconectando sessão");
      navigator("/", { replace: true });
      await sleep(1500);
      toast.success("Sucesso", "Você desconectou de sua conta.");
    } catch (error) {
      toast.error("Erro", error);
    } finally {
      hideLoading();
    }
  };

  const handleNavigate = async (path) => {
    showLoading("Carregando página");
    navigator(path);
    setTimeout(() => hideLoading(), 150);
  };
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
        <div className="logo-container">
          <img
            src={collapsed ? miniLogo : logo}
            alt="SInLabs"
            className="sidebar-logo"
          />
        </div>
        <nav className="sidebar-nav">
          <ul>
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={activePage === item.id ? "active" : ""}
                onClick={() =>
                  activePage !== item.id && handleNavigate(item.path)
                }
              >
                <Tooltip
                  content={item.label}
                  placement="right"
                  disabled={!collapsed}
                >
                  <span className="menu-item-ref">
                    <FontAwesomeIcon icon={item.icon} />
                    {!collapsed && item.label}
                  </span>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Tooltip
          content="Seu Usuário - Matheus Rodrigues (Administrador)"
          placement="right"
          disabled={!collapsed}
        >
          <div className="user-info">
            <FontAwesomeIcon icon={faCircleUser} className="user-avatar" />
            {!collapsed && (
              <div className="info-details">
                <span>Administrador</span>
                <strong className="user-name">Matheus Rodrigues</strong>
              </div>
            )}
          </div>
        </Tooltip>

        <Tooltip content="Ajuda" placement="right" disabled={!collapsed}>
          <button className="sidebar-help">
            <FontAwesomeIcon icon={faQuestionCircle} /> {!collapsed && "Ajuda"}
          </button>
        </Tooltip>

        <Tooltip content="Sair" placement="right" disabled={!collapsed}>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Sair"}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
