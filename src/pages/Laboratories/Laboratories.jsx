import { useMemo, useRef, useState } from "react";
import { useMediaQuery, Select, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faBuilding,
  faLocationDot,
  faPhone,
  faEnvelope,
  faTrash,
  faEdit,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import laboratoryImg from "../../assets/Laboratories/laboratoryImg.png";
import Modal from "../../components/Modal/Modal";
import "./laboratories.css";
import Tooltip from "../../components/Tooltip/Tooltip";
import { useGlobalLoading } from "../../components/Loading/GlobalLoadingContext";
import { useToast } from "../../contexts/useToast";
import { useConfirm } from "../../components/ConfirmationDialog/UseConfirm";

export default function Laboratories() {
  const isMobile = useMediaQuery("(max-width:700px)");
  const toast = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [laboratoryId, setLaboratoryId] = useState(0);

  const [cityFilter, setCityFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const [isNew, setIsNew] = useState(true);
  const laboratories = [
    {
      id: 1,
      name: "Laboratório Central",
      cnpj: "12.345.678/0001-90",
      cep: "01001-000",
      responsible: "João da Silva",
      address: "Rua Fulano de Tal, 456",
      city: "São Paulo",
      uf: "SP",
      phone: "(11) 91234-5678",
      email: "central@labs.com.br",
      avatar: null,
      status: { id: 1, color: "#24b92b", description: "Ativo" },
      coordinates: "teste",
    },
    {
      id: 2,
      name: "Laboratório Norte",
      cnpj: "98.765.432/0001-11",
      cep: "22040-020",
      responsible: "Maria Oliveira",
      address: "Av. Atlântica, 1200",
      city: "Rio de Janeiro",
      uf: "RJ",
      phone: "(21) 99876-5432",
      email: "norte@labs.com.br",
      avatar: null,
      status: { id: 2, color: "#fd2a2a", description: "Inativo" },
      coordinates: "teste",
    },
    {
      id: 3,
      name: "Laboratório Minas",
      cnpj: "45.678.912/0001-55",
      cep: "30130-010",
      responsible: "Carlos Pereira",
      address: "Rua das Acácias, 90",
      city: "Belo Horizonte",
      uf: "MG",
      phone: "(31) 93456-7890",
      email: "minas@labs.com.br",
      avatar: null,
      status: { id: 1, color: "#24b92b", description: "Ativo" },
      coordinates: "teste",
    },
    {
      id: 4,
      name: "Laboratório Sul",
      cnpj: "11.222.333/0001-44",
      cep: "90010-150",
      responsible: "Fernanda Costa",
      address: "Rua dos Andradas, 800",
      city: "Porto Alegre",
      uf: "RS",
      phone: "(51) 91234-0000",
      email: "sul@labs.com.br",
      avatar: null,
      status: { id: 1, color: "#24b92b", description: "Ativo" },
      coordinates: "teste",
    },
    {
      id: 5,
      name: "Laboratório Nordeste",
      cnpj: "66.777.888/0001-22",
      cep: "40020-000",
      responsible: "Rafael Santos",
      address: "Av. Sete de Setembro, 250",
      city: "Salvador",
      uf: "BA",
      phone: "(71) 99888-7766",
      email: "nordeste@labs.com.br",
      avatar: null,
      status: { id: 2, color: "#fd2a2a", description: "Inativo" },
      coordinates: "teste",
    },
    {
      id: 6,
      name: "Laboratório Centro-Oeste",
      cnpj: "33.444.555/0001-99",
      cep: "70040-010",
      responsible: "Lucas Almeida",
      address: "Eixo Monumental, Bloco B",
      city: "Brasília",
      uf: "DF",
      phone: "(61) 95555-3333",
      email: "centrooeste@labs.com.br",
      avatar: null,
      status: { id: 1, color: "#24b92b", description: "Ativo" },
      coordinates: "teste",
    },
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const statusOptions = useMemo(
    () => [
      { id: 1, description: "Ativo" },
      { id: 2, description: "Inativo" },
    ],
    [],
  );

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    cep: "",
    responsible: "",
    address: "",
    city: "",
    uf: "",
    phone: "",
    email: "",
    statusId: 1,
    file: null,
    coordinates: "",
  });

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === "phone") value = maskPhone(value);
    if (key === "cep") value = maskCEP(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
  };

  const onOpenNew = () => {
    setLaboratoryId(0);
    setIsNew(true);
    setForm({
      name: "",
      cnpj: "",
      cep: "",
      responsible: "",
      address: "",
      city: "",
      uf: "",
      phone: "",
      email: "",
      statusId: 1,
      file: null,
      coordinates: "",
    });
    setOpenModal(true);
  };

  const onOpenEdit = (lab) => {
    setLaboratoryId(lab.id);
    setIsNew(false);
    setForm({
      name: lab.name || "",
      cnpj: lab.cnpj || "",
      cep: lab.cep || "",
      responsible: lab.responsible || "",
      address: lab.address || "",
      city: lab.city || "",
      uf: lab.uf || "",
      phone: lab.phone || "",
      email: lab.email || "",
      statusId: lab.status?.id ?? 1,
      file: null,
      coordinates: lab.coordinates,
    });
    setOpenModal(true);
  };

  const onSubmitModal = async (e) => {
    e.preventDefault();
    showLoading(
      laboratoryId == 0 ? "Criando Laboratório" : "Editando laboratório",
    );
    await sleep(1500);
    hideLoading();
    toast.success(
      "Sucesso",
      laboratoryId == 0
        ? "Laboratório criado com sucesso!"
        : "Laboratório editado com sucesso!",
    );
    setOpenModal(false);
  };

  const requestLabRemoval = async (lab) => {
    const ok = await confirm({
      title: "Excluir",
      message: `Tem certeza que deseja excluir o laboratório "${lab.name}"?`,
    });
    if (!ok) return;
    showLoading("Excluíndo laboratório");
    await sleep(1500);
    toast.success("Sucesso", "Laboratório excluído com sucesso!");
    hideLoading();
  };

  const maskPhone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    if (value.length >= 2) {
      value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    }
    if (value.length >= 7) {
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value;
  };

  const maskCEP = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    return value;
  };

  return (
    <div>
      <div className="header-wrapper">
        {!isMobile && (
          <div className="header-img-wrapper">
            <img src={laboratoryImg} />
          </div>
        )}
        <div className="header-content-wrapper">
          <h1 className="laboratories-title">Laboratórios</h1>
          <p className="laboratories-subtitle">
            Gerencie os laboratórios do sistema
          </p>
        </div>
      </div>

      <div className="lab-card-wrapper">
        <div className="grid-header-wrapper">
          <div className="search-with-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              className="laboratories-search"
              placeholder="Buscar laboratórios..."
              name="laboratories-search"
            />
          </div>

          {!isMobile && (
            <Select
              className="select-filter"
              size="small"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <MenuItem value={0}>Todas as cidades</MenuItem>
              <MenuItem value={1}>São Paulo - SP</MenuItem>
              <MenuItem value={2}>Rio de Janeiro - RJ</MenuItem>
              <MenuItem value={3}>Belo Horizonte - MG</MenuItem>
            </Select>
          )}

          {!isMobile && (
            <Select
              className="select-filter"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value={0}>Todos os status</MenuItem>
              <MenuItem value={1}>Ativo</MenuItem>
              <MenuItem value={2}>Inativo</MenuItem>
            </Select>
          )}

          {!isMobile && (
            <button
              className="btn-new-laboratory"
              onClick={onOpenNew}
              type="button"
            >
              Novo laboratório
            </button>
          )}
        </div>

        <div className="cards-container">
          {laboratories.map((lab) => (
            <div className="laboratory-card" key={lab.id}>
              <div className="laboratory-card-top">
                <div className="laboratory-card-left-icon">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>

                <div className="laboratory-card-main">
                  <div className="laboratory-card-title-row">
                    <h3 className="laboratory-name">{lab.name}</h3>
                    <span
                      className="laboratory-status"
                      style={{ backgroundColor: lab.status.color }}
                    >
                      {lab.status.description}
                    </span>
                  </div>
                  <div className="laboratory-uf">{lab.uf}</div>
                </div>
              </div>

              <div className="laboratory-card-info">
                <div className="laboratory-info-row">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{lab.address}</span>
                </div>
                <div className="laboratory-info-row">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{lab.phone}</span>
                </div>
                <div className="laboratory-info-row">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>{lab.email}</span>
                </div>
              </div>

              <hr />

              <div className="laboratory-actions">
                <button
                  type="button"
                  className="lab-edt-crt"
                  onClick={() => onOpenEdit(lab)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
                <Tooltip content="Remover">
                  <button
                    type="button"
                    className="lab-remove"
                    onClick={() => requestLabRemoval(lab)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="wrapper-btn-new-laboratory-mobile">
          <button
            className="btn-new-laboratory-mobile"
            onClick={onOpenNew}
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      <Modal
        open={openModal}
        title={laboratoryId === 0 ? "Novo laboratório" : "Editar laboratório"}
        onClose={() => setOpenModal(false)}
      >
        {(close) => (
          <div className="wrapper">
            <form id="lab-form" className="modal-form" onSubmit={onSubmitModal}>
              <div className="modal-avatar-row">
                <div
                  className="modal-avatar"
                  onClick={onPickFile}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " " ? onPickFile() : null
                  }
                >
                  <span className="modal-avatar-upload">
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

              <div className="modal-row">
                <div className="field">
                  <label>Nome *</label>
                  <input
                    type="text"
                    placeholder="Nome do laboratório"
                    required
                    value={form.name}
                    onChange={setField("name")}
                  />
                </div>
                <div className="field">
                  <label>CNPJ *</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    required
                    value={form.cnpj}
                    onChange={setField("cnpj")}
                  />
                </div>
              </div>

              <div className="modal-row">
                <div className="field">
                  <label>CEP *</label>
                  <div className="cep-row">
                    <input
                      type="text"
                      placeholder="00000-000"
                      required
                      value={form.cep}
                      onChange={setField("cep")}
                      inputMode="numeric"
                    />
                    <button type="button" className="btn-cep-search">
                      Buscar
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>Responsável</label>
                  <input
                    type="text"
                    placeholder="Nome do responsável"
                    value={form.responsible}
                    onChange={setField("responsible")}
                  />
                </div>
              </div>

              <div className="modal-row single">
                <div className="field">
                  <label>Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, número, complemento"
                    value={form.address}
                    onChange={setField("address")}
                  />
                </div>
              </div>

              <div className="modal-row">
                <div className="field">
                  <label>Cidade</label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={form.city}
                    onChange={setField("city")}
                  />
                </div>
                <div className="field">
                  <label>Estado (UF)</label>
                  <input
                    type="text"
                    placeholder="UF"
                    maxLength={2}
                    value={form.uf}
                    onChange={setField("uf")}
                  />
                </div>
              </div>

              <div className="modal-row">
                <div className="field">
                  <label>Telefone</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={form.phone}
                    onChange={setField("phone")}
                  />
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    required
                    value={form.email}
                    onChange={setField("email")}
                  />
                </div>
              </div>

              <div className="modal-row">
                <div className="field">
                  <label>Status</label>
                  <Select
                    className="select-modal"
                    size="small"
                    value={form.statusId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, statusId: e.target.value }))
                    }
                  >
                    {statusOptions.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.description}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {isNew && (
                  <div className="field">
                    <label>Coordenadas GPS</label>
                    <input
                      type="text"
                      placeholder="Coordenadas"
                      required
                      value={form.coordinates}
                      onChange={setField("coordinates")}
                    />
                  </div>
                )}
              </div>
            </form>
            <div className="modal-actions">
              <button
                form="lab-form"
                type="submit"
                className="btn-submit-laboratory"
              >
                Salvar
              </button>
              <button type="button" className="btn-cancel" onClick={close}>
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
