import { STATUS_COLORS } from "../../constants/application";
import { formatStatus } from "../../utils/format";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
      STATUS_COLORS[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {formatStatus(status)}
  </span>
);

export default StatusBadge;
