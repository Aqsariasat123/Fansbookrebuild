interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: number;
  color?: string;
}

export function StatCard({ icon, label, value, trend, color = '#01adf1' }: StatCardProps) {
  return (
    <div className="rounded-[16px] bg-white p-[20px] shadow-sm border border-[#e8e8e8]">
      <div className="flex items-center gap-[12px] mb-[12px]">
        <div
          className="size-[40px] rounded-[10px] flex items-center justify-center text-[20px]"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
        <p className="font-outfit text-[13px] text-[#5d5d5d]">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="font-outfit text-[28px] font-semibold text-black">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {trend !== undefined && (
          <span
            className={`text-[13px] font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}
