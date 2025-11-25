import React, { useState, useEffect } from "react";

export type DateRange = {
  startDate: string | null;
  endDate: string | null;
  label: string;
};

const toISODate = (d: Date) => d.toISOString().split("T")[0];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

interface DateRangeFilterProps {
  onChange?: (range: DateRange) => void;
  initial?: DateRange;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onChange,
  initial,
  className = "",
}) => {
  const today = new Date();

  const [label, setLabel] = useState(initial?.label ?? "This Month");
  const [startDate, setStartDate] = useState(
    initial?.startDate ?? toISODate(startOfMonth(today))
  );
  const [endDate, setEndDate] = useState(initial?.endDate ?? toISODate(today));
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    onChange?.({ startDate, endDate, label });
  }, [startDate, endDate, label]);

  const applyPreset = (preset: string) => {
    const now = new Date();
    let start: string | null = null;
    let end: string | null = null;

    switch (preset) {
      case "7d":
        end = toISODate(now);
        start = toISODate(new Date(now.getTime() - 6 * 864e5));
        setLabel("Last 7 Days");
        break;
      case "30d":
        end = toISODate(now);
        start = toISODate(new Date(now.getTime() - 29 * 864e5));
        setLabel("Last 30 Days");
        break;
      case "this_month":
        start = toISODate(startOfMonth(now));
        end = toISODate(now);
        setLabel("This Month");
        break;
      case "last_month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        start = toISODate(startOfMonth(lastMonth));
        end = toISODate(endOfMonth(lastMonth));
        setLabel("Last Month");
        break;
      default:
        start = null;
        end = null;
        setLabel("All Time");
    }

    setStartDate(start);
    setEndDate(end);
    setCustomOpen(false);
  };

  const handleApplyCustom = () => {
    if (!startDate || !endDate) return;

    if (new Date(startDate) > new Date(endDate)) {
      const temp = startDate;
      setStartDate(endDate);
      setEndDate(temp);
    }
    setLabel("Custom Range");
    setCustomOpen(false);
  };

  const baseBtn =
    "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap";

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Pills row */}
      <div className="flex overflow-x-auto flex-nowrap gap-2 pb-1 scrollbar-hide -mx-1 px-1">
        {[
          { key: "7d", lbl: "Last 7 Days", showMobile: true },
          { key: "30d", lbl: "Last 30 Days", showMobile: true },
          { key: "this_month", lbl: "This Month", showMobile: false },
          { key: "last_month", lbl: "Last Month", showMobile: false },
          { key: "all", lbl: "All Time", showMobile: true },
        ].map(({ key, lbl, showMobile }) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={` 
            ${baseBtn}
            ${
              label === lbl
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10"
            }
            ${
              showMobile ? "" : "hidden sm:inline-flex"
            }   /* 👈 HIDE ON MOBILE */
            `}
          >
            {lbl.replace("Last ", "").replace("This ", "")}
          </button>
        ))}
        <button
          onClick={() => setCustomOpen(!customOpen)}
          className={`${baseBtn} bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10`}
        >
          Custom
        </button>
      </div>

      {/* Active label */}
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
        {startDate && endDate && (
          <span className="ml-2 text-slate-700 dark:text-slate-300">
            {startDate} → {endDate}
          </span>
        )}
        {!startDate && !endDate && <span className="ml-1">• All Time</span>}
      </div>

      {/* Custom */}
      {customOpen && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/70 dark:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => setStartDate(e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate ?? ""}
              onChange={(e) => setEndDate(e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium focus:ring-2 focus:ring-pink-200"
            />
          </div>

          <div className="flex gap-2 items-end">
            <button
              onClick={() => setCustomOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCustom}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
