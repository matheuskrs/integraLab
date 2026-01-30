import { useMemo, useRef, useState, useEffect } from "react";
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
import styles from "./laboratories.module.css";
import Tooltip from "../../components/Tooltip/Tooltip";
import { useGlobalLoading } from "../../providers/GlobalLoading/GlobalLoadingContext";
import { useToast } from "../../providers/Toast/useToast";
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

  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    return () => {
      if (previewImg && previewImg.startsWith("blob:"))
        URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === "phone") value = maskPhone(value);
    else if (key === "cep") value = maskCEP(value);
    else if (key === "cnpj") value = maskCNPJ(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));

    if (!file)
      return;

    if (previewImg && previewImg.startsWith("blob:"))
      URL.revokeObjectURL(previewImg);
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  };

  const onSearchCEP = async () => {
    const cep = (form.cep || "").replace(/\D/g, "");
    if (cep.length !== 8) {
      toast.error("Erro", "CEP inválido");
      return;
    }

    try {
      showLoading("Buscando CEP");
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (!res.ok || data.erro) {
        toast.error(
          "Erro",
          "CEP não encontrado, verifique se o valor informado é válido.",
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        address: data.logradouro || prev.address,
        city: data.localidade || prev.city,
        uf: data.uf || prev.uf,
      }));
      toast.success("CEP encontrado com sucesso!");
    } catch {
      toast.error("Erro", "Falha ao buscar CEP");
    } finally {
      hideLoading();
    }
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
    setPreviewImg("");
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
    setPreviewImg("");
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
    showLoading("Excluindo laboratório");
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

  const maskCNPJ = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 14);

    if (value.length >= 3) {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    }
    if (value.length >= 6) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (value.length >= 9) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
    }
    if (value.length >= 13) {
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return value;
  };

  return (
    <div>
      <div className={styles["header-wrapper"]}>
        {!isMobile && (
          <div className={styles["header-img-wrapper"]}>
            <img src={laboratoryImg} />
          </div>
        )}
        <div className={styles["header-content-wrapper"]}>
          <h1 className={styles["laboratories-title"]}>Laboratórios</h1>
          <p className={styles["laboratories-subtitle"]}>
            Gerencie os laboratórios do sistema
          </p>
        </div>
      </div>

      <div className={styles["lab-card-wrapper"]}>
        <div className={styles["grid-header-wrapper"]}>
          <div className={styles["search-with-icon"]}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles["search-icon"]} />
            <input
              type="text"
              className={styles["laboratories-search"]}
              placeholder="Buscar laboratórios..."
              name="laboratories-search"
            />
          </div>

          {!isMobile && (
            <Select
              className={styles["select-filter"]}
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
              className={styles["select-filter"]}
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
              className={styles["btn-new-laboratory"]}
              onClick={onOpenNew}
              type="button"
            >
              Novo laboratório
            </button>
          )}
        </div>

        <div className={styles["cards-container"]}>
          {laboratories.map((lab) => (
            <div className={styles["laboratory-card"]} key={lab.id}>
              <div className={styles["laboratory-card-top"]}>
                <div className={styles["laboratory-card-left-icon"]}>
                  <FontAwesomeIcon icon={faBuilding} />
                </div>

                <div className={styles["laboratory-card-main"]}>
                  <div className={styles["laboratory-card-title-row"]}>
                    <h3 className={styles["laboratory-name"]}>{lab.name}</h3>
                    <span
                      className={styles["laboratory-status"]}
                      style={{ backgroundColor: lab.status.color }}
                    >
                      {lab.status.description}
                    </span>
                  </div>
                  <div className={styles["laboratory-uf"]}>{lab.uf}</div>
                </div>
              </div>

              <div className={styles["laboratory-card-info"]}>
                <div className={styles["laboratory-info-row"]}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{lab.address}</span>
                </div>
                <div className={styles["laboratory-info-row"]}>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{lab.phone}</span>
                </div>
                <div className={styles["laboratory-info-row"]}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>{lab.email}</span>
                </div>
              </div>

              <hr />

              <div className={styles["laboratory-actions"]}>
                <button
                  type="button"
                  className={styles["lab-edt-crt"]}
                  onClick={() => onOpenEdit(lab)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
                <Tooltip content="Remover">
                  <button
                    type="button"
                    className={styles["lab-remove"]}
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
        <div className={styles["wrapper-btn-new-laboratory-mobile"]}>
          <button
            className={styles["btn-new-laboratory-mobile"]}
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
          <div className={styles.wrapper}>
            <form id="lab-form" className={styles["modal-form"]} onSubmit={onSubmitModal}>
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
                    <img className={styles["modal-avatar-preview"]} src={previewImg} />
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
                    placeholder="Nome do laboratório"
                    required
                    value={form.name}
                    onChange={setField("name")}
                    maxLength={100}
                  />
                </div>
                <div className={styles.field}>
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

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>CEP *</label>
                  <div className={styles["cep-row"]}>
                    <input
                      type="text"
                      placeholder="00000-000"
                      required
                      value={form.cep}
                      onChange={setField("cep")}
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      className={styles["btn-cep-search"]}
                      onClick={onSearchCEP}
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Responsável</label>
                  <input
                    type="text"
                    placeholder="Nome do responsável"
                    value={form.responsible}
                    onChange={setField("responsible")}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className={`${styles["modal-row"]} ${styles.single}`}>
                <div className={styles.field}>
                  <label>Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, número, complemento"
                    value={form.address}
                    onChange={setField("address")}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>Cidade</label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={form.city}
                    onChange={setField("city")}
                    maxLength={100}
                  />
                </div>
                <div className={styles.field}>
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

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>Telefone</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={form.phone}
                    onChange={setField("phone")}
                  />
                </div>
                <div className={styles.field}>
                  <label>Email *</label>
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
                  <label>Status</label>
                  <Select
                    className={styles["select-modal"]}
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
                  <div className={styles.field}>
                    <label>Coordenadas GPS</label>
                    <input
                      type="text"
                      placeholder="Coordenadas"
                      value={form.coordinates}
                      onChange={setField("coordinates")}
                      maxLength={80}
                    />
                  </div>
                )}
              </div>
            </form>
            <div className={styles["modal-actions"]}>
              <button
                form="lab-form"
                type="submit"
                className={styles["btn-submit-laboratory"]}
              >
                Salvar
              </button>
              <button type="button" className={styles["btn-cancel"]} onClick={close}>
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
