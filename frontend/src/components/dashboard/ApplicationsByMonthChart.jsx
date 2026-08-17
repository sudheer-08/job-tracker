import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ApplicationsByMonthChart = ({ data }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">Applications By Month</h3>
    <p className="mt-1 text-sm text-slate-500">New applications over the last 6 months</p>
    <div className="mt-4 h-72">
      {data?.length ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          No data yet
        </div>
      )}
    </div>
  </div>
);

export default ApplicationsByMonthChart;
