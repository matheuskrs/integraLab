import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCircle } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@mui/material";
import Tooltip from "~/components/Tooltip/Tooltip";
import styles from "./systemCard.module.css";

export default function SystemCard({ sys, onEdit, onRemove }) {
  const isMobile = useMediaQuery("(max-width:700px)");

  return (
    <div className={styles["system-card"]}>
      <div className={styles["system-card-top"]}>
        <div className={styles["system-card-left-image"]}>
          <img src={sys.imageUrl} alt={sys.name} />
        </div>

        <div className={styles["system-card-main"]}>
          <div className={styles["system-card-title-row"]}>
            <Tooltip content={sys.name} disabled={!isMobile}>
              <h3 className={styles["system-name"]}>{sys.name}</h3>
            </Tooltip>
          </div>
          <div className={styles["system-version"]}>
            <span>Versão {sys.version}</span>
            <FontAwesomeIcon
              icon={faCircle}
              className={styles["system-version-dot"]}
            />
            <span>{sys.size}</span>
          </div>
        </div>
      </div>

      <div className={styles["system-card-description"]}>{sys.description}</div>

      <hr />

      <div className={styles["system-actions"]}>
        <button
          type="button"
          className={styles["sys-edit"]}
          onClick={() => onEdit(sys)}
        >
          <FontAwesomeIcon icon={faEdit} /> Editar
        </button>

        <Tooltip content="Remover">
          <button
            type="button"
            className={styles["sys-remove"]}
            onClick={() => onRemove(sys)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
