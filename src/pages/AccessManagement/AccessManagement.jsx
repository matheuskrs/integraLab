import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "~/components/CommonGridCSS/commonGrid.css";
import Modal from "~/components/Modal/Modal";
import { useConfirm } from "~/components/ConfirmationDialog/UseConfirm";
import styles from "./accessManagement.module.css";
import { useMediaQuery } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { useEffect, useMemo, useCallback, useState } from "react";
import Tooltip from "~/components/Tooltip/Tooltip";
import { useGlobalLoading } from "~/providers/GlobalLoading/GlobalLoadingContext";
import { useToast } from "~/providers/Toast/useToast";
import profileAccessImg from "~/assets/AccessManagement/ProfileAccessImg.png";
export default function AccessManagement() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [profileId, setProfileId] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileStatus, setProfileStatus] = useState(true);
  const [profilePermissions, setProfilePermissions] = useState([]);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();
  const MAX_NAME_LENGTH = 60;
  const MAX_DESCRIPTION_LENGTH = 200;

  const permissions = useMemo(
    () => [
      { id: 1, description: "Gestão de usuários" },
      { id: 2, description: "Gestão de sistemas" },
      { id: 3, description: "Feed de notícias" },
      { id: 4, description: "Gestão de laboratórios" },
      { id: 5, description: "Downloads" },
      { id: 6, description: "Gestão de acessos" },
    ],
    [],
  );

  useEffect(() => {
    setRows([
      {
        id: 1,
        perfil: "Administrador",
        descricao: "Acesso total ao sistema",
        dataCriacao: "2025-01-15",
        status: true,
        permissions: [1, 2, 6],
      },
      {
        id: 2,
        perfil: "Coordenador",
        descricao: "Gerencia Laboratórios e usuários",
        dataCriacao: "2025-02-10",
        status: true,
        permissions: [1, 4],
      },
      {
        id: 3,
        perfil: "Técnico",
        descricao: "Acesso aos sistemas e downloads",
        dataCriacao: "2025-03-05",
        status: false,
        permissions: [2, 5],
      },
    ]);
  }, []);

  const isMobile = useMediaQuery("(max-width:700px)");
  const desktopColumns = useMemo(
    () => [
      {
        field: "perfil",
        headerName: "Perfil",
        flex: 1,
        minWidth: isMobile ? 100 : 120,
        renderCell: (params) => {
          const text = String(params.value ?? "");
          const disabled = !text.trim();

          return (
            <Tooltip content={text} placement="top" disabled={disabled}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        field: "descricao",
        headerName: "Descrição",
        flex: 1,
        minWidth: 220,
        renderCell: (params) => {
          const text = String(params.value ?? "");
          const disabled = !text.trim();

          return (
            <Tooltip content={text} placement="top" disabled={disabled}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        field: "permissions",
        headerName: "Permissões ativas",
        minWidth: 160,
        renderCell: (params) => {
          const qtd = params.value?.length ?? 0;
          const text = `${qtd} ${qtd === 1 ? "permissão" : "permissões"}`;
          return (
            <Tooltip content={text} placement="top" disabled={false}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        field: "dataCriacao",
        headerName: "Data de criação",
        minWidth: 150,
        renderCell: (params) => {
          const text = String(params.value ?? "");
          const disabled = !text.trim();
          return (
            <Tooltip content={text} placement="top" disabled={disabled}>
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 80,
        maxWidth: 160,
        valueFormatter: (value) => (value ? "Ativo" : "Inativo"),

        renderCell: (params) => {
          const isActive = Boolean(params.value);
          const text = isActive ? "Ativo" : "Inativo";

          return (
            <Tooltip content={text} placement="top" disabled={false}>
              <span
                className={styles["status-btn"]}
                style={{
                  backgroundColor: isActive ? "#24b92b" : "#fd2a2a",
                }}
              >
                {text}
              </span>
            </Tooltip>
          );
        },
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
      desktopColumns.find((col) => col.field === "perfil"),
      desktopColumns.find((col) => col.field === "status"),
      desktopColumns.find((col) => col.field === "actions"),
    ],
    [desktopColumns],
  );

  const onOpenNew = () => {
    setProfileId(0);
    setProfileName("");
    setProfileDescription("");
    setProfileStatus(true);
    setProfilePermissions([]);
    setOpenModal(true);
  };

  const onOpenEdit = useCallback((row) => {
    setProfileId(row.id);
    setProfileName(row.perfil || "");
    setProfileDescription(row.descricao || "");
    setProfileStatus(Boolean(row.status));
    setProfilePermissions(row.permissions || []);
    setOpenModal(true);
  }, []);

  const confirmDelete = useCallback(
    async (row) => {
      try {
        const ok = await confirm({
          title: "Excluir",
          message: `Tem certeza que deseja excluir o perfil "${row.perfil}"?`,
        });
        if (!ok) return;

        showLoading("Excluindo perfil");
        setTimeout(function () {
          hideLoading();
          toast.success("Sucesso", "Perfil excluído com sucesso!");
        }, 400);
      } catch (error) {
        toast.error("Erro", error);
      }
    },
    [confirm, toast, showLoading, hideLoading],
  );

  const togglePermission = (permission) => {
    setProfilePermissions((prev) =>
      prev.includes(permission.id)
        ? prev.filter((p) => p !== permission.id)
        : [...prev, permission.id],
    );
  };

  const onSubmitModal = async (e) => {
    e.preventDefault();

    const name = (profileName || "").trim();
    const description = (profileDescription || "").trim();

    if (!name) {
      toast.error("Erro", "O campo Nome é obrigatório.");
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      toast.error(
        "Erro",
        `O campo Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
      );
      return;
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(
        "Erro",
        `O campo Descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`,
      );
      return;
    }
    if (!profilePermissions || profilePermissions.length === 0) {
      toast.error("Erro", "Selecione ao menos uma permissão para o perfil.");
      return;
    }

    var mensagem =
      profileId == 0
        ? "Criando perfil de acesso"
        : "Atualizando perfil de acesso";
    var mensagemSucesso =
      profileId == 0
        ? "Perfil de acesso criado com sucesso!"
        : "Perfil de acesso atualizado com sucesso!";
    showLoading(mensagem);
    setTimeout(function () {
      setOpenModal(false);
      hideLoading();
      toast.success("Sucesso", mensagemSucesso);
    }, 1000);
  };
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
                  <button onClick={() => onOpenEdit(params.row)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </Tooltip>
                <Tooltip content="Remover" placement="right" disabled={false}>
                  <button
                    className={styles.danger}
                    onClick={() => confirmDelete(params.row)}
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
          <h1 className={styles["access-title"]}>Perfis de Acesso</h1>
          <p className={styles["access-subtitle"]}>
            Gerencie os perfis e permissões de acesso do sistema
          </p>
        </div>
      </div>
      <div className="grid-wrapper">
        <div className="grid-header-wrapper">
          <input
            type="text"
            className={styles["access-search"]}
            placeholder="Buscar perfil..."
            name="access-search"
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
            <button className={styles["btn-new-profile"]} onClick={onOpenNew}>
              Novo perfil
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
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}
      <Modal
        open={openModal}
        title={
          profileId === 0 ? "Novo perfil de acesso" : "Editar perfil de acesso"
        }
        onClose={() => setOpenModal(false)}
      >
        {(close) => (
          <form className={styles["modal-form"]} onSubmit={onSubmitModal}>
            <div className={styles.field}>
              <label>Nome *</label>
              <input
                type="text"
                maxLength={MAX_NAME_LENGTH}
                placeholder="Nome do Perfil"
                value={profileName}
                required
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Descrição</label>
              <input
                type="text"
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="Descrição do Perfil"
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <div className={styles["switch-row"]}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={profileStatus}
                    onChange={(e) => setProfileStatus(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
                <span className={styles["switch-label"]}>Ativo</span>
              </div>

              <div className={styles["permissions-box"]}>
                {permissions.map((permission) => (
                  <label key={permission.id} className={styles["perm-item"]}>
                    <input
                      type="checkbox"
                      checked={profilePermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission)}
                    />
                    {permission.description}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles["modal-actions"]}>
              <button type="submit" className={styles["btn-submit-profile"]}>
                Salvar
              </button>
              <button
                type="button"
                className={styles["btn-cancel"]}
                onClick={close}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
      {ConfirmDialog}
    </div>
  );
}
