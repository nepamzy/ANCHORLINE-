"use client";

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy-900">{label}</label>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-control border border-line bg-paper px-3 py-2 text-ink"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label={`Remove item ${i + 1}`}
              className="rounded-control border border-line px-3 text-slate hover:border-status-attention hover:text-status-attention"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 text-sm font-semibold text-navy-800 hover:text-navy-900"
      >
        + Add item
      </button>
    </div>
  );
}
