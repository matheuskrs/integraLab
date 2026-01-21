import "./login.css";
import logo from "../../assets/integraLabLogo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/useToast";

export default function LoginPage() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isFormValid =
    email.trim() !== "" && isEmailValid && password.trim() !== "";
  const togglePassword = () => setShowPassword(!showPassword);
  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      var message = "Verifique os campos preenchidos e tente novamente.";
      if (!isEmailValid)
        message =
          "O formato do email está inválido, verifique e tente novamente.";
      toast.error("Erro", message);
      return;
    }
    toast.success("Sucesso", "Autenticação concluída com sucesso!");
    navigate("/access");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("suporte@unesp.edu.br");
    toast.success("Sucesso", "Copiado para a área de transferência!");
  }
  return (
    <form className="login-card" onSubmit={handleLogin}>
      <img src={logo} alt="IntegraLab" className="login-logo" />
      <div className="field">
        <label>E-mail</label>
        <input
          type="email"
          tabIndex={1}
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email && !isEmailValid ? "input-error" : ""}
          autoComplete="email"
        />
      </div>

      <div className="field password-field">
        <label>Senha</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            tabIndex={2}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span
            className="toggle-password"
            onClick={togglePassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
      </div>

      <div className="login-options">
        <div className="remember-container">
          <input
            type="checkbox"
            name="check-remember"
            id="check-remember"
            tabIndex={4}
          />
          <label className="remember" htmlFor="check-remember">
            Lembrar-me
          </label>
        </div>

        <a href="#" className="forgot" tabIndex={5}>
          Esqueci minha senha
        </a>
      </div>

      <button className="login-button" onClick={handleLogin} tabIndex={6}>
        Entrar
      </button>

      <footer className="login-footer">
        Versão 1.0.0 · 
        <span className="footer-support-email" onClick={copyToClipboard}> 
          suporte@unesp.edu.br
          <FontAwesomeIcon icon={faCopy}/>
        </span>
      </footer>
    </form>
  );
}
