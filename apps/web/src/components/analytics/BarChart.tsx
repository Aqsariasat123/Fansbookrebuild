interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
  prefix?: string;
  gradient?: boolean;
}

export function BarChart({ title, data, prefix = '', gradient = false }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
      <p className="mb-[16px] text-[16px] text-[#f8f8f8]">{title}</p>
      <div className="flex items-end gap-[8px] md:gap-[16px]" style={{ height: 160 }}>
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] text-[#f8f8f8]">
              {prefix}
              {d.value.toFixed(0)}
            </span>
            <div
              className={`w-full rounded-t-[4px] ${gradient ? 'bg-gradient-to-t from-[#01adf1] to-[#a61651]' : 'bg-[#01adf1]'}`}
              style={{ height: `${Math.max((d.value / maxVal) * 120, 4)}px` }}
            />
            <span className="text-[10px] text-[#5d5d5d]">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
