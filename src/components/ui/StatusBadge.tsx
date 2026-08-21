type Status = "On Track" | "Minor Delay" | "Attention Required";

const statusClasses: Record<Status, string> = {
  "On Track": "bg-[#e7f5ec] text-status-ontrack",
  "Minor Delay": "bg-gold-100 text-status-minor",
  "Attention Required": "bg-[#fbe9e8] text-status-attention",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
