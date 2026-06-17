import StatusBadge from "../applications/StatusBadge";
import { formatRelativeTime } from "../../utils/format";

const RecentActivityTable = ({ activities }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-6 py-4">
      <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
      <p className="mt-1 text-sm text-slate-500">Latest updates across your pipeline</p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {activities?.length ? (
            activities.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-900">{item.companyName}</td>
                <td className="px-6 py-4 text-slate-600">{item.jobTitle}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-slate-500">{formatRelativeTime(item.updatedAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                No recent activity
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentActivityTable;
