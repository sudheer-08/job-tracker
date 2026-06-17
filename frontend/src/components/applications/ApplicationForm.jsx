import { APPLICATION_SOURCES, APPLICATION_STATUSES } from "../../constants/application";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const ApplicationForm = ({ form, onChange, onSubmit, submitting, submitLabel, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...form, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company Name *
          </label>
          <input
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Google"
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className={labelClass}>
            Job Title *
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className={labelClass}>
            Source
          </label>
          <select
            id="source"
            name="source"
            value={form.source}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select source</option>
            {APPLICATION_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source.charAt(0) + source.slice(1).toLowerCase().replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appliedDate" className={labelClass}>
            Applied Date
          </label>
          <input
            id="appliedDate"
            name="appliedDate"
            type="date"
            value={form.appliedDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="followUpDate" className={labelClass}>
            Follow-up Date
          </label>
          <input
            id="followUpDate"
            name="followUpDate"
            type="date"
            value={form.followUpDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="jobUrl" className={labelClass}>
            Job URL
          </label>
          <input
            id="jobUrl"
            name="jobUrl"
            type="url"
            value={form.jobUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export const emptyApplicationForm = {
  companyName: "",
  jobTitle: "",
  status: "APPLIED",
  source: "",
  appliedDate: "",
  followUpDate: "",
  jobUrl: "",
};

export const applicationToForm = (app) => ({
  companyName: app.companyName || "",
  jobTitle: app.jobTitle || "",
  status: app.status || "APPLIED",
  source: app.source || "",
  appliedDate: app.appliedDate ? app.appliedDate.split("T")[0] : "",
  followUpDate: app.followUpDate ? app.followUpDate.split("T")[0] : "",
  jobUrl: app.jobUrl || "",
});

export const formToPayload = (form) => ({
  companyName: form.companyName,
  jobTitle: form.jobTitle,
  status: form.status,
  source: form.source || undefined,
  jobUrl: form.jobUrl || undefined,
  appliedDate: form.appliedDate || null,
  followUpDate: form.followUpDate || null,
});

export default ApplicationForm;
