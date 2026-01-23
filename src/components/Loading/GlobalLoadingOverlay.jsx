export default function GlobalLoadingOverlay({ visible, text }) {
  return (
    <div id="global-loading" className={visible ? "" : "hidden"}>
      <div className="spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}
