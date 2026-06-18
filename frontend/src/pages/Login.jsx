import { useNavigate } from "react-router-dom";
import { Mail, Lock, Box } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <div className="login-logo">
        <Box size={30} />
      </div>

      <h1>Inicia sesión</h1>

      <p className="register-text">
        ¿No tienes una cuenta? <a href="#registro">Regístrate aquí</a>
      </p>

      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault();
          navigate("/catalogo");
        }}
      >
        <label>Correo electrónico</label>
        <div className="login-input">
          <Mail size={24} />
          <input type="email" placeholder="tu@correo.com" />
        </div>

        <label>Contraseña</label>
        <div className="login-input">
          <Lock size={24} />
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="login-options">
          <label className="remember">
            <input type="checkbox" />
            <span>Recordarme</span>
          </label>

          <a href="#recuperar">¿Olvidaste tu contraseña?</a>
        </div>

        <button className="login-btn" type="submit">
          Iniciar Sesión
        </button>
      </form>
    </main>
  );
}

export default Login;