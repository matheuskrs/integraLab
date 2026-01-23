import styles from "./login.module.css";
import logo from "../../assets/SInLabsLogo.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/useToast";
import { useGlobalLoading } from "../../components/Loading/GlobalLoadingContext";


export default function LoginPage() {
const { showLoading, hideLoading } = useGlobalLoading();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isFormValid = email.trim() !== "" && isEmailValid && password.trim() !== "";
  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    showLoading("Autenticando e redirecionando");
    e.preventDefault();
    if (!isFormValid) {
      let message = "Verifique os campos preenchidos e tente novamente.";
      if (!isEmailValid)
        message = "O formato do email está inválido, verifique e tente novamente.";
      toast.error("Erro", message);
      return;
    }
    navigate("/access");
    setTimeout(() => {
      toast.success("Sucesso", "Autenticação concluída com sucesso!");
      hideLoading();
    }, 1500)
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("suporte@unesp.edu.br");
    toast.success("Sucesso", "Copiado para a área de transferência!");
  };
  return (
    <form className={styles["login-card"]} onSubmit={handleLogin}>
      <img src={logo} alt={import.meta.env.VITE_APP_NAME} className={styles["login-logo"]} />

      <div className={styles.field}>
        <label>E-mail</label>
        <input
          type="email"
          tabIndex={1}
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email && !isEmailValid ? styles["input-error"] : ""}
          autoComplete="email"
        />
      </div>

      <div className={`${styles.field} ${styles["password-field"]}`}>
        <label>Senha</label>
        <div className={styles["password-input-container"]}>
          <input
            type={showPassword ? "text" : "password"}
            tabIndex={2}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span className={styles["toggle-password"]} onClick={togglePassword}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
      </div>

      <div className={styles["login-options"]}>
        <div className={styles["remember-container"]}>
          <input
            type="checkbox"
            name="check-remember"
            id="check-remember"
            tabIndex={4}
          />
          <label className={styles.remember} htmlFor="check-remember">
            Lembrar-me
          </label>
        </div>

        <a href="#" className={styles.forgot} tabIndex={5}>
          Esqueci minha senha
        </a>
      </div>

      <button className={styles["login-button"]} type="submit" tabIndex={6}>
        Entrar
      </button>

      <footer className={styles["login-footer"]}>
        Versão 1.0.0 ·{" "}
        <span
          className={styles["footer-support-email"]}
          onClick={copyToClipboard}
        >
          suporte@unesp.edu.br <FontAwesomeIcon icon={faCopy} />
        </span>
      </footer>
    </form>
  );
}
