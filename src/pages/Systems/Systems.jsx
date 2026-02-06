import { useRef, useState, useEffect } from "react";
import { useMediaQuery, Select, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faUpload,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import systemImg from "~/assets/Systems/systemImg.png";
import Modal from "~/components/Modal/Modal";
import styles from "./systems.module.css";
import { useGlobalLoading } from "~/providers/GlobalLoading/GlobalLoadingContext";
import { useToast } from "~/providers/Toast/useToast";
import { useConfirm } from "~/components/ConfirmationDialog/UseConfirm";
import {
  getSystems,
  getSystemCategories,
} from "~/services/Systems/systemsService.api";
import SystemCard from "~/components/SystemCard/SystemCard";

export default function Systems() {
  const isMobile = useMediaQuery("(max-width:700px)");
  const toast = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [systemId, setSystemId] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { confirm, ConfirmDialog } = useConfirm();
  const [systems, setSystems] = useState([]);
  const [systemCategories, setSystemCategories] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const page = 1;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    async function loadSystems() {
      const data = await getSystems();
      setSystems(data);
    }
    loadSystems();

    async function loadSystemCategories() {
      const data = await getSystemCategories();
      setSystemCategories(Array.isArray(data) ? data : []);
    }
    loadSystemCategories();
  }, []);

  const fileRef = useRef(null);
  const coverFileRef = useRef(null);
  const systemFileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    version: "",
    categoryId: systemCategories[0]?.id,
    size: "",
    coverFile: null,
    systemFile: null,
    description: "",
    file: null,
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
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPickFile = () => fileRef.current?.click();
  const onPickCoverFile = () => coverFileRef.current?.click();
  const onPickSystemFile = () => systemFileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));

    if (!file) return;

    if (previewImg && previewImg.startsWith("blob:"))
      URL.revokeObjectURL(previewImg);
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
  };

  const onCoverFileChange = (e) => {
    const coverFile = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, coverFile }));
  };

  const onSystemFileChange = (e) => {
    const systemFile = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, systemFile }));
  };

  const onOpenNew = () => {
    setSystemId(0);
    setForm({
      name: "",
      version: "",
      categoryId: systemCategories[0]?.id ?? "",
      size: "",
      coverFile: null,
      systemFile: null,
      description: "",
      file: null,
    });
    setPreviewImg("");
    setOpenModal(true);
  };

  const onOpenEdit = (sys) => {
    setSystemId(sys.id);
    setForm({
      name: sys.name || "",
      version: sys.version || "",
      categoryId: sys.categoryId ?? systemCategories[0]?.id,
      size: sys.size || "",
      coverFile: null,
      systemFile: null,
      description: sys.description || "",
      file: null,
    });
    setPreviewImg("");
    setOpenModal(true);
  };

  const onSubmitModal = async (e) => {
    e.preventDefault();
    showLoading(systemId == 0 ? "Criando Sistema" : "Editando sistema");
    await sleep(1500);
    hideLoading();
    toast.success(
      "Sucesso",
      systemId == 0
        ? "Sistema criado com sucesso!"
        : "Sistema editado com sucesso!",
    );
    setOpenModal(false);
  };

  const requestSysRemoval = async (sys) => {
    const ok = await confirm({
      title: "Excluir",
      message: `Tem certeza que deseja excluir o sistema "${sys.name}"?`,
    });
    if (!ok) return;
    showLoading("Excluindo sistema");
    await sleep(1500);
    toast.success("Sucesso", "Sistema excluído com sucesso!");
    hideLoading();
  };

  const filteredSystems = systems.filter((sys) => {
    const term = (searchFilter || "").trim().toLowerCase();
    const matchSearch = !term || (sys.name || "").toLowerCase().includes(term);

    const matchCategory = categoryFilter === 0 ? true : true;

    return matchSearch && matchCategory;
  });

  const totalItems = filteredSystems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedSystems = filteredSystems.slice(startIndex, startIndex + pageSize);
  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pagedSystems.length, totalItems);
  const showingText = `Mostrando ${showingFrom} a ${showingTo} de ${totalItems} sistemas`;

  return (
    <div>
      <div className={styles["header-wrapper"]}>
        {!isMobile && (
          <div className={styles["header-img-wrapper"]}>
            <img src={systemImg} />
          </div>
        )}
        <div className={styles["header-content-wrapper"]}>
          <h1 className={styles["systems-title"]}>Sistemas</h1>
          <p className={styles["systems-subtitle"]}>
            Gerencie os sistemas disponíveis
          </p>
        </div>
      </div>

      <div className={styles["sys-card-wrapper"]}>
        <div className={styles["grid-header-wrapper"]}>
          <div className={styles["search-with-icon"]}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles["search-icon"]}
            />
            <input
              type="text"
              className={styles["systems-search"]}
              placeholder="Buscar sistemas..."
              name="systems-search"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          {!isMobile && (
            <Select
              className={styles["select-filter"]}
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value={0}>Todas as categorias</MenuItem>
              {systemCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          )}

          {!isMobile && (
            <button
              className={styles["btn-new-system"]}
              onClick={onOpenNew}
              type="button"
            >
              Novo sistema
            </button>
          )}
        </div>

        <div className={styles["cards-container"]}>
          {pagedSystems.length === 0 ? (
            <div className={styles["empty-state"]}>
              <h3>Nenhum sistema encontrado</h3>
              <p>
                Ainda não há sistemas cadastrados
                {searchFilter ? " para esse filtro" : ""}. Clique em <strong>Novo sistema</strong> para adicionar o primeiro.
              </p>
            </div>
          ) : (
            pagedSystems.map((sys) => (
              <SystemCard
                key={sys.id}
                sys={sys}
                onEdit={onOpenEdit}
                onRemove={requestSysRemoval}
              />
            ))
          )}
        </div>

        <div className={styles["pagination-wrapper"]}>
          <div className={styles["pagination-left"]}>
            Itens por página:
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
          {showingText && (
            <span className={styles["pagination-text"]}>{showingText}</span>
          )}
        </div>
      </div>

      {isMobile && (
        <div className={styles["wrapper-btn-new-system-mobile"]}>
          <button
            className={styles["btn-new-system-mobile"]}
            onClick={onOpenNew}
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      <Modal
        open={openModal}
        title={systemId === 0 ? "Novo sistema" : "Editar sistema"}
        onClose={() => setOpenModal(false)}
      >
        {(close) => (
          <div className={styles.wrapper}>
            <form
              id="sys-form"
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
                    placeholder="Nome do sistema"
                    required
                    value={form.name}
                    onChange={setField("name")}
                    maxLength={100}
                  />
                </div>

                <div className={styles.field}>
                  <label>Versão *</label>
                  <input
                    type="text"
                    placeholder="1.0.0"
                    required
                    value={form.version}
                    onChange={setField("version")}
                    maxLength={20}
                  />
                </div>
              </div>

              <div className={styles["modal-row"]}>
                <div className={styles.field}>
                  <label>Categoria</label>
                  <Select
                    className={styles["select-modal"]}
                    size="small"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  >
                    {systemCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className={styles.field}>
                  <label>Tamanho</label>
                  <input
                    type="text"
                    placeholder="100MB"
                    value={form.size}
                    onChange={setField("size")}
                    maxLength={20}
                  />
                </div>
              </div>

              <div className={`${styles["modal-row"]} ${styles.single}`}>
                <div className={styles.field}>
                  <label>Imagem de capa</label>
                  <button
                    type="button"
                    className={styles["btn-upload-file"]}
                    onClick={onPickCoverFile}
                  >
                    <FontAwesomeIcon icon={faBox} />
                    Upload de Arquivo
                  </button>
                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    onChange={onCoverFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className={`${styles["modal-row"]} ${styles.single}`}>
                <div className={styles.field}>
                  <label>Arquivo do Sistema</label>
                  <button
                    type="button"
                    className={styles["btn-upload-file"]}
                    onClick={onPickSystemFile}
                  >
                    <FontAwesomeIcon icon={faBox} />
                    Upload de Arquivo
                  </button>
                  <input
                    ref={systemFileRef}
                    type="file"
                    onChange={onSystemFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className={`${styles["modal-row"]} ${styles.single}`}>
                <div className={styles.field}>
                  <label>Descrição *</label>
                  <textarea
                    placeholder="Descrição do sistema"
                    required
                    value={form.description}
                    onChange={setField("description")}
                    maxLength={500}
                    rows={4}
                  />
                </div>
              </div>
            </form>

            <div className={styles["modal-actions"]}>
              <button
                form="sys-form"
                type="submit"
                className={styles["btn-submit-system"]}
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
