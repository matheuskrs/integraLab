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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function Sidebar({ activePage }) {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);
  const navigator = useNavigate();
  const toast = useToast();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { showLoading, hideLoading } = useGlobalLoading();
  const MENU_ITEMS = [
    {
      id: "perfis",
      label: "Perfis de acesso",
      icon: faShield,
      path: "/access",
    },
    {
      id: "usuarios",
      label: "Usuários",
      icon: faUserFriends,
      path: "/usuarios",
    },
    {
      id: "laboratorios",
      label: "Laboratórios",
      icon: faBuilding,
      path: "/laboratorios",
    },
    { id: "sistemas", label: "Sistemas", icon: faBox, path: "/sistemas" },
    {
      id: "associacao",
      label: "Associação",
      icon: faLink,
      path: "/associacao",
    },
    {
      id: "downloads",
      label: "Download de Sistemas",
      icon: faDownload,
      path: "/downloads",
    },
    { id: "feed", label: "Feed de notícias", icon: faNewspaper, path: "/feed" },
    {
      id: "gestao",
      label: "Gestão de Acessos",
      icon: faChartLine,
      path: "/gestao",
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
              <Tippy
                key={item.id}
                content={item.label}
                placement="right"
                disabled={!collapsed}
              >
                <li
                  key={item.id}
                  className={activePage === item.id ? "active" : ""}
                  onClick={() =>
                    activePage != item.id ? navigator(item.path) : ""
                  }
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {!collapsed && item.label}
                </li>
              </Tippy>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Tippy
          key="sidebar-user"
          content="Seu Usuário - Matheus Rodrigues"
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
        </Tippy>
        <Tippy
          key="sidebar-help"
          content="Ajuda"
          placement="right"
          disabled={!collapsed}
        >
          <button className="sidebar-help">
            <FontAwesomeIcon icon={faQuestionCircle} /> {!collapsed && "Ajuda"}
          </button>
        </Tippy>
        <Tippy
          key="sidebar-logout"
          content="Sair"
          placement="right"
          disabled={!collapsed}
        >
          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Sair"}
          </button>
        </Tippy>
      </div>
    </aside>
  );
}
