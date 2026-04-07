import i18n from "i18next";

export default function LanguageSwitcher() {
  return (
    <select
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      defaultValue={i18n.language}
      style={{
        padding: "6px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    >
      <option value="en">English</option>
      <option value="mr">मराठी</option>
    </select>
  );
}