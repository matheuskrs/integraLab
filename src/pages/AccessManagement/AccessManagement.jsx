import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../components/CommonGridCSS/commonGrid.css";
import Modal from "../../components/Modal/Modal";
import { useConfirm } from "../../components/ConfirmationDialog/UseConfirm";
import "./accessManagement.css";
import { useMediaQuery } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobalLoading } from "../../components/Loading/GlobalLoadingContext";
import { useToast } from "../../contexts/useToast";

export default function AccessManagement() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [profileId, setProfileId] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileStatus, setProfileStatus] = useState(true);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();
  useEffect(() => {
    (async () => {
      const rowsData = [
        {
          id: 1,
          perfil: "Administrador",
          descricao: "Acesso total ao sistema",
          permissoesAtivas: 3,
          dataCriacao: "2025-01-15",
          status: true,
        },
        {
          id: 2,
          perfil: "Coordenador",
          descricao: "Gerencia Laboratórios e usuários",
          permissoesAtivas: 2,
          dataCriacao: "2025-02-10",
          status: true,
        },
        {
          id: 3,
          perfil: "Técnico",
          descricao: "Acesso aos sistemas e downloads",
          permissoesAtivas: 2,
          dataCriacao: "2025-03-05",
          status: false,
        },
      ];
      showLoading("Carregando perfis");
      try {
        // const data = await api.get("/profiles"); (para integração no futuro, será assim)
        setRows(rowsData);
      } catch (e) {
        toast.error("Erro", e.message);
      } finally {
        hideLoading();
      }
    })();
  }, [showLoading, hideLoading, toast]);
  const isMobile = useMediaQuery("(max-width:700px)");
  const desktopColumns = [
    {
      field: "perfil",
      headerName: "Perfil",
      flex: 1,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "permissoesAtivas",
      headerName: "Permissões ativas",
      minWidth: 160,
      renderCell: (params) => <span>{params.value} permissões</span>,
    },
    {
      field: "dataCriacao",
      headerName: "Data de criação",
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
      maxWidth: 160,
      renderCell: (params) => {
        const isActive = Boolean(params.value);

        return (
          <span
            className="status-btn"
            style={{
              backgroundColor: isActive ? "#24b92b" : "#fd2a2a",
            }}
          >
            {isActive ? "Ativo" : "Inativo"}
          </span>
        );
      },
    },

    {
      field: "actions",
      headerName: "Ações",
      minWidth: 80,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <div className="grid-actions">
          <button title="Editar">
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button title="Remover" className="danger">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  const mobileColumns = [
    desktopColumns.find((col) => col.field === "perfil"),
    desktopColumns.find((col) => col.field === "status"),
    desktopColumns.find((col) => col.field === "actions"),
  ];

  const onOpenNew = () => {
    setProfileId(0);
    setProfileName("");
    setProfileDescription("");
    setProfileStatus(true);
    setOpenModal(true);
  };

  const onOpenEdit = (row) => {
    setProfileId(row.id);
    setProfileName(row.perfil || "");
    setProfileDescription(row.descricao || "");
    setProfileStatus(Boolean(row.status));
    setOpenModal(true);
  };

  const confirmDelete = async (row) => {
    try {
      const ok = await confirm({
        title: "Excluir",
        message: `Tem certeza que deseja excluir o perfil "${row.perfil}"?`,
      });
      if (!ok) return;
      toast.success("Sucesso", "Perfil excluído com sucesso!");
    } catch (error) {
      toast.error("Erro", error);
    }
  };

  const onSubmitModal = async (e) => {
    e.preventDefault();
    e.preventDefault();
    var mensagem =
      profileId == 0
        ? "Criando perfil de acesso"
        : "Atualizando perfil de acesso";
    showLoading(mensagem);
    setTimeout(function () {
      if (profileId === 0) {
        setOpenModal(false);
        hideLoading();
        return;
      }
      setOpenModal(false);
      hideLoading();
    }, 1000);
  };

  return (
    <div>
      <h1 className="access-title">Perfis de Acesso</h1>
      <p className="access-subtitle">
        Gerencie os perfis e permissões de acesso do sistema
      </p>
      <div className="grid-wrapper">
        <div className="grid-header-wrapper">
          <input
            type="text"
            className="access-search"
            placeholder="Buscar perfil..."
            name="access-search"
          />
          {!isMobile && (
            <Select
              className="select-user-state-list"
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
            <button className="btn-new-profile" onClick={onOpenNew}>
              Novo perfil
            </button>
          )}
        </div>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={(isMobile ? mobileColumns : desktopColumns).map((col) =>
            col.field !== "actions"
              ? col
              : {
                  ...col,
                  renderCell: (params) => (
                    <div className="grid-actions">
                      <button
                        title="Editar"
                        onClick={() => onOpenEdit(params.row)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        title="Remover"
                        className="danger"
                        onClick={() => confirmDelete(params.row)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ),
                },
          )}
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
        <div className="wrapper-btn-new-profile-mobile">
          <button className="btn-new-profile-mobile" onClick={onOpenNew}>
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
          <form className="modal-form" onSubmit={onSubmitModal}>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                placeholder="Nome do Perfil"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Descrição</label>
              <input
                type="text"
                placeholder="Descrição do Perfil"
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="switch-row">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={profileStatus}
                    onChange={(e) => setProfileStatus(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
                <span className="switch-label">Ativo</span>
              </div>

              <div className="permissions-box">
                <label className="perm-item">
                  <input type="checkbox" /> Gestão de usuários
                </label>
                <label className="perm-item">
                  <input type="checkbox" /> Gestão de sistemas
                </label>
                <label className="perm-item">
                  <input type="checkbox" /> Feed de notícias
                </label>
                <label className="perm-item">
                  <input type="checkbox" /> Gestão de laboratórios
                </label>
                <label className="perm-item">
                  <input type="checkbox" /> Downloads
                </label>
                <label className="perm-item">
                  <input type="checkbox" /> Gestão de acessos
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-submit-profile">
                Salvar
              </button>
              <button type="button" className="btn-cancel" onClick={close}>
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
