import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function Register() {
  const { t: translate } = useTranslation();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "OWNER",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error(translate("all_fields_required"));
      return;
    }

    try {
      await api.post("auth/register/", form);
      toast.success(translate("registration_success"));
      navigate("/login");
    } catch (err) {
      toast.error(translate("registration_failed"));
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
        <h3 className="auth-title">{translate("register")}</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder={translate("username")}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <div className="position-relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder={translate("password")}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? translate("hide") : translate("show")}
            </span>
          </div>

          <div className="d-flex justify-content-between mb-4">
            <h6 className="mb-0">{translate("select_role")}</h6>

            <div
              className={`role-badge ${
                form.role === "OWNER" ? "active" : ""
              }`}
              onClick={() => setForm({ ...form, role: "OWNER" })}
            >
              {translate("truck_owner")}
            </div>

            <div
              className={`role-badge ${
                form.role === "DRIVER" ? "active" : ""
              }`}
              onClick={() => setForm({ ...form, role: "DRIVER" })}
            >
              {translate("driver")}
            </div>
          </div>

          <button className="btn btn-success w-100">
            {translate("register")}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            {translate("already_have_account")}{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              {translate("login")}
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}