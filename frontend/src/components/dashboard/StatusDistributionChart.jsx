import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "../../constants/application";
import { formatStatus } from "../../utils/format";

const StatusDistributionChart = ({ data }) => {
  const chartData = data?.filter((item) => item.count > 0) || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Status Distribution</h3>
      <p className="mt-1 text-sm text-slate-500">Breakdown by application status</p>
      <div className="mt-4 h-72">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={CHART_COLORS[entry.status] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, formatStatus(name)]} />
              <Legend formatter={(value) => formatStatus(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No data yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDistributionChart;
