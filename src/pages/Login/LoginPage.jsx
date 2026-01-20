import "./login.css";
import logo from '../../assets/integraLabLogo.png';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="login-card">
      <img src={logo} alt="IntegraLab" className="login-logo" />

      <div className="field">
        <label>E-mail</label>
        <input type="email" placeholder="seu@email.com" />
      </div>

      <div className="field password-field">
        <label>Senha</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
          />
          <span className="toggle-password" onClick={togglePassword}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
      </div>

      <div className="login-options">
        <div className="remember-container">
          <input type="checkbox" name="check-remember" id="check-remember"/>
          <label className="remember" htmlFor="check-remember">
            Lembrar-me
          </label>
        </div>

        <a href="#" className="forgot">
          Esqueci minha senha
        </a>
      </div>

      <button className="login-button">Entrar</button>

      <footer className="login-footer">
        Versão 1.0.0 · suporte@unesp.edu.br
      </footer>
    </div>
  );
}
