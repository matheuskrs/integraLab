import { useNavigate } from "react-router-dom";
import "./notFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você tentou acessar não existe.</p>

      <button onClick={() => navigate("/")}>Voltar para o início</button>
    </div>
  );
}
