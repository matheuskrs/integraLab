import styles from "./users.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "~/providers/GlobalLoading/GlobalLoadingContext.jsx";
import { useConfirm } from "~/components/ConfirmationDialog/UseConfirm.jsx";
import { useToast } from "~/providers/Toast/useToast.jsx";
import { MenuItem, Select, useMediaQuery } from "@mui/material";
import Tooltip from "~/components/Tooltip/Tooltip.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import profileAccessImg from "~/assets/Users/usersImg.png";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Modal from "~/components/Modal/Modal.jsx";
import "~/components/CommonGridCSS/commonGrid.css";
import { getUsers, getUserStatus } from "../../services/Users/usersService.api";
import { getAccessProfiles } from "../../services/AccessManagement/accessService.api";
import { getLaboratories } from "../../services/Laboratories/laboratoriesService.api";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);
  const [headerLaboratoryOptions, setLaboratories] = useState([]);
  const [userStatusOptions, setUserStatusOptions] = useState([]);
  const [profileFilter, setProfileFilter] = useState(0);
  const [laboratoryFilter, setLaboratoryFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(0);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();
  const isMobile = useMediaQuery("(max-width:700px)");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsers();
      setRows(data);
    }
    loadUsers();

    async function loadProfiles() {
      const data = await getAccessProfiles();
      setProfileOptions(data);
    }
    loadProfiles();

    async function loadUserStatus() {
      const data = await getUserStatus();
      setUserStatusOptions(data);
    }
    loadUserStatus();

    async function loadLaboratories() {
      const data = await getLaboratories();
      setLaboratories(data);
    }
    loadLaboratories();
  }, []);

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileId: "",
    statusId: 1,
    expiresAt: "",
    file: null,
  });

  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    return () => {
      if (previewImg && previewImg.startsWith("blob:"))
        URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const maskPhone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    if (value.length >= 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length >= 7) value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const maskCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    if (value.length >= 4) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    if (value.length >= 7)
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length >= 10)
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    return value;
  };

  const maskDateBR = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 8);

    if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, "$1/$2");
    if (value.length >= 6)
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

    return value;
  };

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === "phone") value = maskPhone(value);
    else if (key === "cpf") value = maskCPF(value);
    else if (key === "expiresAt") value = maskDateBR(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));

    if (!file) return;

    if (previewImg && previewImg.startsWith("blob:"))
      URL.revokeObjectURL(previewImg);
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  };

  const onOpenNew = () => {
    setUserId(0);
    setForm({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      password: "",
      confirmPassword: "",
      profileId: "",
      statusId: 1,
      expiresAt: "",
      file: null,
    });
    setPreviewImg("");
    setOpenModal(true);
  };

  const onOpenEdit = useCallback(
    (row) => {
      setUserId(row.id);
      const profileId =
        profileOptions.find((p) => p.name === row.profile)?.id ?? "";

      setForm({
        name: row.name || "",
        email: row.email || "",
        cpf: row.cpf || "",
        phone: row.phone || "",
        password: "",
        confirmPassword: "",
        profileId,
        statusId: row.status?.id ?? 1,
        expiresAt: row.expiresAt || "",
        file: null,
      });
      setPreviewImg((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return row.avatarUrl || "";
      });
      setOpenModal(true);
    },
    [profileOptions],
  );

  const onSubmitModal = async (e) => {
    e.preventDefault();
    const name = (form.name || "").trim();
    const email = (form.email || "").trim();
    const cpf = (form.cpf || "").replace(/\D/g, "");
    const phone = (form.phone || "").replace(/\D/g, "");
    const password = String(form.password || "");
    const confirmPassword = String(form.confirmPassword || "");
    const profileId = form.profileId;
    const isEditing = userId != 0;

    if (!name) {
      toast.error("Erro", "O campo Nome é obrigatório.");
      return;
    }

    if (!email) {
      toast.error("Erro", "O campo E-mail é obrigatório.");
      return;
    }

    if (cpf.length !== 11) {
      toast.error("Erro", "CPF inválido.");
      return;
    }

    if (phone.length < 10) {
      toast.error("Erro", "Telefone inválido.");
      return;
    }

    if (!profileId) {
      toast.error("Erro", "Selecione um perfil de acesso.");
      return;
    }

    if (!isEditing) {
      if (!password) {
        toast.error("Erro", "O campo Senha é obrigatório.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Erro", "As senhas não conferem.");
        return;
      }
    }

    showLoading(userId === 0 ? "Criando usuário" : "Editando usuário");
    await sleep(1000);
    hideLoading();
    toast.success(
      "Sucesso",
      userId == 0
        ? "Usuário criado com sucesso!"
        : "Usuário editado com sucesso!",
    );
    setOpenModal(false);
  };

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
          const disabled = !String(name).trim();

          return (
            <Tooltip content={String(name)} placement="top" disabled={disabled}>
              <div className={styles.userCell}>
                <img className={styles.userAvatar} src={avatarUrl} alt={name} />
                <span className={styles.userName}>{name}</span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        field: "email",
        headerName: "Email",
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
        field: "profile",
        headerName: "Perfil",
        flex: 1,
        minWidth: 160,
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

          const disabled = !String(text).trim();

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
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => {
          const s = params.value;
          const text = String(s?.name ?? "");
          const disabled = !text.trim();

          if (!s) {
            return (
              <Tooltip content="" placement="top" disabled={true}>
                <span>-</span>
              </Tooltip>
            );
          }

          return (
            <Tooltip content={text} placement="top" disabled={disabled}>
              <span
                className={styles["status-btn"]}
                style={{ backgroundColor: s.color }}
              >
                {text}
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: "lastAccess",
        headerName: "Último Acesso",
        minWidth: 140,
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
      desktopColumns.find((c) => c.field === "status"),
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
            <Tooltip content="Todos os perfis">
              <Select
                className={styles["select-user-state-list"]}
                size="small"
                value={profileFilter}
                onChange={(e) => setProfileFilter(e.target.value)}
              >
                <MenuItem value={0}>Todos os perfis</MenuItem>
                {profileOptions.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          )}
          {!isMobile && (
            <Tooltip content="Todos os laboratórios">
              <Select
                className={styles["select-user-state-list"]}
                size="small"
                value={laboratoryFilter}
                onChange={(e) => setLaboratoryFilter(e.target.value)}
              >
                <MenuItem value={0}>Todos os Laboratórios</MenuItem>
                {headerLaboratoryOptions.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          )}
          {!isMobile && (
            <Tooltip content="Todos os status">
              <Select
                className={styles["select-user-state-list"]}
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value={0}>Todos os status</MenuItem>
                {userStatusOptions.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
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
        title={userId == 0 ? "Novo usuário" : "Editar usuário"}
        onClose={() => setOpenModal(false)}
      >
        {(close) => (
          <div className={styles.wrapper}>
            <form
              id="user-form"
              className={styles["modal-form"]}
              onSubmit={onSubmitModal}
            >
              <div className={styles["modal-avatar-row"]}>
                <div
                  className={styles["modal-avatar"]}
                  onClick={onPickFile}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " " ? onPickFile() : null
                  }
                >
                  {previewImg && (
                    <img
                      className={styles["modal-avatar-preview"]}
                      src={previewImg}
                    />
                  )}
                  <span className={styles["modal-avatar-upload"]}>
                    <FontAwesomeIcon icon={faUpload} />
                  </span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>Nome *</label>
                  <input
                    type="text"
                    placeholder="Nome do usuário"
                    required
                    value={form.name}
                    onChange={setField("name")}
                    maxLength={100}
                  />
                </div>
                <div className={styles.field}>
                  <label>E-mail *</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    required
                    value={form.email}
                    onChange={setField("email")}
                    maxLength={70}
                  />
                </div>
              </div>

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    required
                    value={form.cpf}
                    onChange={setField("cpf")}
                    inputMode="numeric"
                  />
                </div>
                <div className={styles.field}>
                  <label>Telefone *</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    required
                    value={form.phone}
                    onChange={setField("phone")}
                  />
                </div>
              </div>

              {userId == 0 && (
                <div className={styles["modal-row"]}>
                  <div className={styles.field}>
                    <label>Senha *</label>
                    <input
                      type="password"
                      placeholder="Senha"
                      required
                      value={form.password}
                      onChange={setField("password")}
                      maxLength={60}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Confirmar senha *</label>
                    <input
                      type="password"
                      placeholder="Confirmar senha"
                      required
                      value={form.confirmPassword}
                      onChange={setField("confirmPassword")}
                      maxLength={60}
                    />
                  </div>
                </div>
              )}
              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>Perfil de acesso</label>

                  <Select
                    className={styles["select-modal"]}
                    size="small"
                    value={form.profileId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        profileId: e.target.value,
                      }))
                    }
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) return "Selecione...";
                      return (
                        profileOptions.find((p) => p.id === selected)?.name ??
                        "Selecione..."
                      );
                    }}
                  >
                    <MenuItem value="">
                      <em>Selecione...</em>
                    </MenuItem>

                    {profileOptions.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className={styles.field}>
                  <label>Status</label>
                  <Select
                    className={styles["select-modal"]}
                    size="small"
                    value={form.statusId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, statusId: e.target.value }))
                    }
                  >
                    {userStatusOptions.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              {userId == 0 && (
                <div className={`${styles["modal-row"]} ${styles.single}`}>
                  <div className={styles.field}>
                    <label>Data de expiração de acesso (opcional)</label>
                    <input
                      type="text"
                      placeholder="00/00/0000"
                      value={form.expiresAt}
                      onChange={setField("expiresAt")}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}
            </form>
            <div className={styles["modal-actions"]}>
              <button
                form="user-form"
                type="submit"
                className={styles["btn-submit-user"]}
              >
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
          </div>
        )}
      </Modal>

      {ConfirmDialog}
    </div>
  );
}
