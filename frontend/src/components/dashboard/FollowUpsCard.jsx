import { formatDate } from "../../utils/format";

const FollowUpsCard = ({ followUps, followUpsDue }) => {
  const items = [...(followUps?.overdue || []), ...(followUps?.dueToday || [])].slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Follow-ups</h3>
          <p className="mt-1 text-sm text-slate-500">Due today and overdue</p>
        </div>
        {followUpsDue > 0 && (
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
            {followUpsDue} DUE
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{item.companyName}</p>
                <p className="text-xs text-slate-500">{item.jobTitle}</p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {formatDate(item.followUpDate)}
              </span>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">No follow-ups due</p>
        )}
      </div>
    </div>
  );
};

export default FollowUpsCard;
