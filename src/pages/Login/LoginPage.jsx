import "./login.css";
import logo from "../../assets/integraLabLogo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
  const isFormValid = email.trim() !== "" && isEmailValid && password.trim() !== "";
  const togglePassword = () => setShowPassword(!showPassword);
  const handleLogin = () => {
    if (!isFormValid) {
      var message = "Verifique os campos preenchidos e tente novamente.";
      if(!isEmailValid)
        message = "O formato do email está inválido, verifique e tente novamente.";
      toast.error("Erro", message);
      return;
    }
    toast.success("Sucesso", "Autenticação concluída com sucesso!");
    navigate("/access");
  };
  return (
    <div className="login-card">
      <img src={logo} alt="IntegraLab" className="login-logo" />
      <div className="field">
        <label>E-mail</label>
        <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={email && !isEmailValid ? "input-error" : ""}/>
      </div>

      <div className="field password-field">
        <label>Senha</label>
        <div className="password-input-container">
          <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <span className="toggle-password" onClick={togglePassword}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
      </div>

      <div className="login-options">
        <div className="remember-container">
          <input type="checkbox" name="check-remember" id="check-remember" />
          <label className="remember" htmlFor="check-remember">
            Lembrar-me
          </label>
        </div>

        <a href="#" className="forgot">
          Esqueci minha senha
        </a>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Entrar
      </button>

      <footer className="login-footer">
        Versão 1.0.0 · suporte@unesp.edu.br
      </footer>
    </div>
  );
}
