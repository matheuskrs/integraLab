import styles from "./users.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalLoading } from "~/providers/GlobalLoading/GlobalLoadingContext.jsx";
import { useConfirm } from "~/components/ConfirmationDialog/UseConfirm.jsx";
import { useToast } from "~/providers/Toast/useToast.jsx";
import { MenuItem, Select, useMediaQuery } from "@mui/material";
import Tooltip from "~/components/Tooltip/Tooltip.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import profileAccessImg from "~/assets/Users/usersImg.png";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Modal from "~/components/Modal/Modal.jsx";
import "~/components/CommonGridCSS/commonGrid.css";
import Avatar from "~/assets/Users/Avatar.png";
import Avatar1 from "~/assets/Users/Avatar1.png";
import Avatar2 from "~/assets/Users/Avatar2.png";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();

  const isMobile = useMediaQuery("(max-width:700px)");

  useEffect(() => {
    const load = async () => {
      setRows([
        {
          id: 1,
          name: "Camila Alves",
          avatarUrl: Avatar,
          email: "camila.alves@unesp.com.br",
          profile: "Administrador",
          laboratories: [
            { id: 10, name: "Laboratório Central" },
            { id: 11, name: "Laboratório Minas" },
          ],
          statuses: [{ id: 1, name: "Ativo", color: "#24b92b" }],
          lastAccess: "2025-01-15",
        },
        {
          id: 2,
          name: "Thais Morais",
          avatarUrl: Avatar1,
          email: "thais.morais@unesp.com.br",
          profile: "Coordenador",
          laboratories: [{ id: 12, name: "Laboratório Norte" }],
          statuses: [{ id: 2, name: "Inativo", color: "#fd2a2a" }],
          lastAccess: "2025-02-10",
        },
        {
          id: 3,
          name: "Ana Antunes",
          avatarUrl: Avatar2,
          email: "ana.antunes@unesp.com.br",
          profile: "Técnico",
          laboratories: [
            { id: 11, name: "Laboratório Minas" },
            { id: 13, name: "Laboratório Centro-Oeste" },
          ],
          statuses: [{ id: 1, name: "Ativo", color: "#24b92b" }],
          lastAccess: "2025-03-05",
        },
      ]);
    };
    load();
  }, []);

  const onOpenNew = () => {
    setOpenModal(true);
  };

  const onOpenEdit = useCallback(
    (/*row*/) => {
      // depois você pluga aqui a lógica de preencher o modal com dados do usuário
      setOpenModal(true);
    },
    [],
  );

  const confirmDelete = useCallback(
    async (row) => {
      try {
        const ok = await confirm({
          title: "Excluir",
          message: `Tem certeza que deseja excluir o usuário "${row.name}"?`,
        });
        if (!ok) return;

        showLoading("Excluindo usuário");
        setTimeout(() => {
          hideLoading();
          toast.success("Sucesso", "Usuário excluído com sucesso!");
        }, 400);
      } catch (error) {
        toast.error("Erro", error);
      }
    },
    [confirm, toast, showLoading, hideLoading],
  );

  const desktopColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Usuário",
        flex: 1,
        minWidth: isMobile ? 160 : 220,
        renderCell: (params) => {
          const name = params.row?.name ?? "";
          const avatarUrl = params.row?.avatarUrl ?? "";

          return (
            <div className={styles.userCell}>
              <img className={styles.userAvatar} src={avatarUrl} alt={name} />
              <span className={styles.userName}>{name}</span>
            </div>
          );
        },
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 220,
      },
      {
        field: "profile",
        headerName: "Perfil",
        flex: 1,
        minWidth: 160,
      },
      {
        field: "laboratories",
        headerName: "Laboratórios",
        flex: 1,
        minWidth: 220,
        renderCell: (params) => {
          const labs = Array.isArray(params.value) ? params.value : [];
          const text = labs
            .map((x) => x?.name)
            .filter(Boolean)
            .join(", ");
          return <span title={text}>{text}</span>;
        },
      },
      {
        field: "statuses",
        headerName: "Status",
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => {
          return (
            <div>
              {params.value.map((s) => (
                <span
                  key={s.id}
                  className={styles["status-btn"]}
                  style={{ backgroundColor: s.color }}
                  title={s.name}
                >
                  {s.name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        field: "lastAccess",
        headerName: "Último Acesso",
        minWidth: 140,
      },
      {
        field: "actions",
        headerName: "Ações",
        minWidth: 80,
        sortable: false,
        filterable: false,
      },
    ],
    [isMobile],
  );

  const mobileColumns = useMemo(
    () => [
      desktopColumns.find((c) => c.field === "name"),
      desktopColumns.find((c) => c.field === "statuses"),
      desktopColumns.find((c) => c.field === "actions"),
    ],
    [desktopColumns],
  );

  const columns = useMemo(() => {
    const base = isMobile ? mobileColumns : desktopColumns;

    return base.map((col) =>
      col.field !== "actions"
        ? col
        : {
            ...col,
            renderCell: (params) => (
              <div className={"grid-actions"}>
                <Tooltip content="Editar" placement="right" disabled={false}>
                  <button onClick={() => onOpenEdit(params.row)} type="button">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </Tooltip>
                <Tooltip content="Remover" placement="right" disabled={false}>
                  <button
                    className={styles.danger}
                    onClick={() => confirmDelete(params.row)}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </Tooltip>
              </div>
            ),
          },
    );
  }, [isMobile, mobileColumns, desktopColumns, onOpenEdit, confirmDelete]);

  return (
    <div>
      <div className={styles["header-wrapper"]}>
        {!isMobile && (
          <div className={styles["header-img-wrapper"]}>
            <img src={profileAccessImg} />
          </div>
        )}
        <div className={styles["header-content-wrapper"]}>
          <h1 className={styles["access-title"]}>Usuários</h1>
          <p className={styles["access-subtitle"]}>
            Gerencie usuários, perfis e acessos do sistema
          </p>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="grid-header-wrapper">
          <input
            type="text"
            className={styles["access-search"]}
            placeholder="Buscar usuário..."
            name="users-search"
          />

          {!isMobile && (
            <Select
              className={styles["select-user-state-list"]}
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={0}>Todos os status</MenuItem>
              <MenuItem value={1}>Ativo</MenuItem>
              <MenuItem value={2}>Inativo</MenuItem>
            </Select>
          )}

          {!isMobile && (
            <button
              className={styles["btn-new-profile"]}
              onClick={onOpenNew}
              type="button"
            >
              Novo usuário
            </button>
          )}
        </div>

        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          rowSelection={false}
          disableRowSelectionOnClick
          disableColumnMenu
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />
      </div>

      {isMobile && (
        <div className={styles["wrapper-btn-new-profile-mobile"]}>
          <button
            className={styles["btn-new-profile-mobile"]}
            onClick={onOpenNew}
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      <Modal
        open={openModal}
        title={"Usuário"}
        onClose={() => setOpenModal(false)}
      >
        {(close) => (
          <form
            className={styles["modal-form"]}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles["modal-actions"]}>
              <button
                type="button"
                className={styles["btn-cancel"]}
                onClick={close}
              >
                Fechar
              </button>
            </div>
          </form>
        )}
      </Modal>

      {ConfirmDialog}
    </div>
  );
}
