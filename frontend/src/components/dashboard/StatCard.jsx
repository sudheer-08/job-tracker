const StatCard = ({ label, value, badge, badgeColor = "bg-emerald-100 text-emerald-700", accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      {badge && (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    {accent && (
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${accent}`} style={{ width: "65%" }} />
      </div>
    )}
  </div>
);

export default StatCard;
