import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../components/CommonGridCSS/commonGrid.css";
import Modal from "../../components/Modal/Modal";
import "./accessManagement.css";
import { useMediaQuery } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
export default function AccessManagement() {
  const rows = [
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

  const [status, setStatus] = useState(0);
  const [openModal, setOpenModal] = useState(false);

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
            <button
              className="btn-new-profile"
              onClick={() => setOpenModal(true)}
            >
              Novo perfil
            </button>
          )}
        </div>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={isMobile ? mobileColumns : desktopColumns}
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
          <button
            className="btn-new-profile-mobile"
            onClick={() => setOpenModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}
      <Modal
        open={openModal}
        title="Novo perfil de acesso"
        onClose={() => setOpenModal(false)}
      >
        <form className="modal-form">
          <div className="field">
            <label>Nome</label>
            <input type="text" placeholder="Nome do Perfil" />
          </div>

          <div className="field">
            <label>Descrição</label>
            <input type="text" placeholder="Descrição do Perfil" />
          </div>

          <div className="field">
            <div className="switch-row">
              <label className="switch">
                <input type="checkbox" defaultChecked htmlFor="switch" />
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
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
