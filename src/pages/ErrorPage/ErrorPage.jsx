import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import "./errorPage.css";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  let status = 500;
  let title = "Erro inesperado";
  let message = "Algo deu errado. Tente novamente mais tarde.";

  if (isRouteErrorResponse(error)) {
    status = error.status;

    switch (error.status) {
      case 401:
        title = "Não autenticado";
        message = "Você precisa estar logado para acessar esta página.";
        break;
      case 403:
        title = "Acesso negado";
        message = "Você não tem permissão para acessar este conteúdo.";
        break;
      case 404:
        title = "Página não encontrada";
        message = "A página que você tentou acessar não existe.";
        break;
      default:
        title = `Erro ${error.status}`;
        message = error.statusText || message;
    }
  }

  if (error instanceof Error) {
    status = 500;
    title = "Erro interno";
    message = error.message || message;
  }

  return (
    <div className="notfound-container">
      <h1>{status}</h1>
      <h2>{title}</h2>
      <p>{message}</p>

      <button onClick={() => navigate("/")}>
        Voltar para o início
      </button>
    </div>
  );
}
