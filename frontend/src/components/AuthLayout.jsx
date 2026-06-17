import { Link } from "react-router-dom";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

export const AuthField = ({ label, id, type = "text", value, onChange, placeholder, autoComplete }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    />
  </div>
);

export const AuthError = ({ message }) =>
  message ? (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
      {message}
    </div>
  ) : null;

export const AuthFooter = ({ text, linkText, linkTo }) => (
  <p className="mt-6 text-center text-sm text-slate-500">
    {text}{" "}
    <Link to={linkTo} className="font-medium text-indigo-600 hover:text-indigo-500">
      {linkText}
    </Link>
  </p>
);

export default AuthLayout;
