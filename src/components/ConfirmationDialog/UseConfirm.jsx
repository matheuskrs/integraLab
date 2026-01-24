import { useState, useRef, useCallback, useMemo } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});
  const resolverRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    setOptions(opts);
    setOpen(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback((value) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setOpen(false);
    resolve?.(value);
  }, []);

  const ConfirmDialog = useMemo(
    () => (
      <ConfirmationDialog
        open={open}
        title={options.title ?? "Confirmar"}
        message={options.message ?? "Tem certeza?"}
        confirmText={options.confirmText ?? "Confirmar"}
        cancelText={options.cancelText ?? "Cancelar"}
        destructive={Boolean(options.destructive)}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
        onClose={() => close(false)}
      />
    ),
    [open, options, close],
  );

  return { confirm, ConfirmDialog };
}
