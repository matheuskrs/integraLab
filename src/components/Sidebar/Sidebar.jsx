import { useState, useEffect, useRef } from "react";
import styles from "./sidebar.module.css";
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
import { useToast } from "../../providers/Toast/useToast";
import { useGlobalLoading } from "../../providers/GlobalLoading/GlobalLoadingContext";
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
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
    >
      <button
        className={styles["sidebar-toggle"]}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
      </button>
      <div className={styles["sidebar-top"]}>
        <div className={styles["logo-container"]}>
          <img
            src={collapsed ? miniLogo : logo}
            alt="SInLabs"
            className={styles["sidebar-logo"]}
          />
        </div>
        <nav className={styles["sidebar-nav"]}>
          <ul>
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={activePage === item.id ? styles.active : ""}
                onClick={() =>
                  activePage !== item.id && handleNavigate(item.path)
                }
              >
                <Tooltip
                  content={item.label}
                  placement="right"
                  disabled={!collapsed}
                >
                  <span className={styles["menu-item-ref"]}>
                    <FontAwesomeIcon icon={item.icon} />
                    {!collapsed && item.label}
                  </span>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles["sidebar-bottom"]}>
        <Tooltip
          content="Seu Usuário - Matheus Rodrigues (Administrador)"
          placement="right"
          disabled={!collapsed}
        >
          <div className={styles["user-info"]}>
            <FontAwesomeIcon icon={faCircleUser} className={styles["user-avatar"]} />
            {!collapsed && (
              <div className={styles["info-details"]}>
                <span>Administrador</span>
                <strong className={styles["user-name"]}>Matheus Rodrigues</strong>
              </div>
            )}
          </div>
        </Tooltip>

        <Tooltip content="Ajuda" placement="right" disabled={!collapsed}>
          <button className={styles["sidebar-help"]}>
            <FontAwesomeIcon icon={faQuestionCircle} /> {!collapsed && "Ajuda"}
          </button>
        </Tooltip>

        <Tooltip content="Sair" placement="right" disabled={!collapsed}>
          <button className={styles["sidebar-logout"]} onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Sair"}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
