import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../components/CommonGridCSS/commonGrid.css";
import "./accessManagement.css";

export default function AccessManagement() {
  const rows = [
    {
      id: 1,
      perfil: "Administrador",
      descricao: "Acesso total ao sistema",
      permissoesAtivas: 3,
      dataCriacao: "2025-01-15",
      status: { id: 1, label: "Ativo", color: "#24b92b" },
    },
    {
      id: 2,
      perfil: "Coordenador",
      descricao: "Gerencia Laboratórios e usuários",
      permissoesAtivas: 2,
      dataCriacao: "2025-02-10",
      status: { id: 1, label: "Ativo", color: "#24b92b" },
    },
    {
      id: 3,
      perfil: "Técnico",
      descricao: "Acesso aos sistemas e downloads",
      permissoesAtivas: 2,
      dataCriacao: "2025-03-05",
      status: { id: 2, label: "Inativo", color: "#fd2a2a" },
    },
  ];

  const columns = [
    {
      field: "perfil",
      headerName: "Perfil",
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      flex: 2,
      minWidth: 220,
    },
    {
      field: "permissoesAtivas",
      headerName: "Permissões ativas",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => <span>{params.value} permissões</span>,
    },
    {
      field: "dataCriacao",
      headerName: "Data de criação",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const status = params.value;
        return (
          <span
            className="status-btn"
            style={{ backgroundColor: status.color }}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      minWidth: 120,
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

  return (
    <div className="access-container">
      <h1 className="access-title">Perfis de Acesso</h1>
      <p className="access-subtitle">
        Gerencie os perfis e permissões de acesso do sistema
      </p>

      <input
        type="text"
        className="access-search"
        placeholder="Buscar perfil..."
      />

      <div className="grid-wrapper">
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
          sx={{
            border: "none",
            fontSize: 14,

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f7f8fa",
              fontWeight: 600,
              borderTop: "1px solid #e0e0e0",
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "block",
              color: "#e0e0e0",
            },

            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },

            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#fafafa",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f5ff",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e0e0e0",
            },

            "& .MuiDataGrid-filler": {
              display: "none",
            },
          }}
        />
      </div>
    </div>
  );
}
