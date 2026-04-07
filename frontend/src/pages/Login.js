import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function Login() {
  const { t: translate } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("auth/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);

      const role = res.data.role?.toLowerCase();
      if (role === "owner" || role === "Owner" || role === "OWNER") navigate("/owner");
      else if (role === "driver" || role === "Driver" || role === "DRIVER") navigate("/driver");
      else toast.error(translate("unknown_role"));

    } catch {
      toast.error(translate("invalid_credentials"));
    }
  };

  return (
    <div className="auth-wrapper">
  
  <div className="language-top">
    <select
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      defaultValue={i18n.language}
    >
      <option value="en">English</option>
      <option value="mr">मराठी</option>
    </select>
  </div>

  <div className="auth-card">
        <h3 className="auth-title">{translate("login")}</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder={translate("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="position-relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder={translate("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? translate("hide") : translate("show")}
            </span>
          </div>

          <button className="btn btn-primary w-100">
            {translate("login")}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            {translate("dont_have_account")}{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              {translate("register")}
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}