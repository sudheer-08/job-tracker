import { formatStatus } from "../../utils/format";

const STAGE_COLORS = {
  APPLIED: "bg-sky-400",
  SCREENING: "bg-blue-500",
  INTERVIEW: "bg-violet-500",
  OFFER: "bg-emerald-500",
};

const PipelineFunnelChart = ({ data }) => {
  const total = data?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Pipeline Funnel</h3>
      <p className="mt-1 text-sm text-slate-500">Recruitment stages overview</p>

      <div className="mt-6 space-y-4">
        {data?.map((item) => {
          const width = total > 0 ? Math.max((item.count / total) * 100, item.count > 0 ? 8 : 0) : 0;
          return (
            <div key={item.stage}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{formatStatus(item.stage)}</span>
                <span className="font-semibold text-slate-900">{item.count}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${STAGE_COLORS[item.stage]}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineFunnelChart;
