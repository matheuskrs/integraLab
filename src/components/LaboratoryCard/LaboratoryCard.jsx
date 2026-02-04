import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faLocationDot,
  faPhone,
  faEnvelope,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "~/components/Tooltip/Tooltip";
import styles from "./laboratoryCard.module.css";

export default function LaboratoryCard({ lab, onEdit, onRemove }) {
  return (
    <div className={styles["laboratory-card"]}>
      <div className={styles["laboratory-card-top"]}>
        <div className={styles["laboratory-card-left-icon"]}>
          <FontAwesomeIcon icon={faBuilding} />
        </div>

        <div className={styles["laboratory-card-main"]}>
          <div className={styles["laboratory-card-title-row"]}>
            <h3 className={styles["laboratory-name"]}>{lab.name}</h3>
            <span
              className={styles["laboratory-status"]}
              style={{ backgroundColor: lab.status?.color ?? "#999" }}
            >
              {lab.status?.description ?? "Sem status"}
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
          onClick={() => onEdit(lab)}
        >
          <FontAwesomeIcon icon={faEdit} /> Editar
        </button>

        <Tooltip content="Remover">
          <button
            type="button"
            className={styles["lab-remove"]}
            onClick={() => onRemove(lab)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
