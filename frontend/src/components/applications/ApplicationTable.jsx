import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../utils/format";

const ApplicationTable = ({ applications, onDelete, deletingId }) => {
  if (!applications?.length) {
    return (
      <div className="px-6 py-12 text-center text-sm text-slate-500">
        No applications found. Try adjusting your filters or add a new application.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Source</th>
            <th className="px-6 py-3 font-medium">Applied</th>
            <th className="px-6 py-3 font-medium">Follow-up</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50/80">
              <td className="px-6 py-4 font-medium text-slate-900">{app.companyName}</td>
              <td className="px-6 py-4 text-slate-600">{app.jobTitle}</td>
              <td className="px-6 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 text-slate-600">{app.source || "—"}</td>
              <td className="px-6 py-4 text-slate-600">{formatDate(app.appliedDate)}</td>
              <td className="px-6 py-4 text-slate-600">{formatDate(app.followUpDate)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/applications/${app.id}/edit`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(app.id)}
                    disabled={deletingId === app.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === app.id ? "..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
