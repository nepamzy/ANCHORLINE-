const classes: Record<string, string> = {
  Pending: "bg-gold-100 text-status-minor",
  "In Progress": "bg-navy-100 text-navy-800",
  Completed: "bg-[#e7f5ec] text-status-ontrack",
  Active: "bg-[#e7f5ec] text-status-ontrack",
  Paid: "bg-[#e7f5ec] text-status-ontrack",
  Unpaid: "bg-gold-100 text-status-minor",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${classes[status] ?? "bg-navy-100 text-navy-800"}`}>
      {status}
    </span>
  );
}
