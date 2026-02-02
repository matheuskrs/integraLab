import Modal from "~/components/Modal/Modal";
import styles from "./confirmationDialog.module.css";

export default function ConfirmationDialog({
  open,
  title = "Confirmar ação",
  message = "Tem certeza?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm?.();
    onClose?.();
  };

  return (
    <Modal open={open} title={title} onClose={handleCancel}>
      {(close) => (
        <div className={styles["confirm-body"]}>
          <p className={styles["confirm-message"]}>{message}</p>

          <div className={styles["confirm-actions"]}>
            <button
              className={`${styles.btn} ${
                destructive ? styles["btn-danger"] : styles["btn-primary"]
              }`}
              onClick={handleConfirm}
              disabled={loading}
              autoFocus
            >
              {loading ? "Processando..." : confirmText}
            </button>
            <button
              className={styles.btn}
              onClick={() => close()}
              disabled={loading}
            >
              {cancelText}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
