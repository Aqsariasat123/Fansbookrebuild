interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  isActive: boolean;
}

interface TierCardProps {
  tier: Tier;
  onEdit: () => void;
  onDelete: () => void;
}

export function TierCard({ tier, onEdit, onDelete }: TierCardProps) {
  return (
    <div className="rounded-[22px] bg-card p-[20px] md:p-[26px] flex flex-col gap-[12px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[10px]">
          <p className="text-[18px] font-semibold text-foreground">{tier.name}</p>
          <span
            className={`rounded-[20px] px-[10px] py-[2px] text-[11px] font-medium ${
              tier.isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-muted-foreground/20 text-muted-foreground'
            }`}
          >
            {tier.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-[22px] font-bold text-primary">
          ${tier.price.toFixed(2)}
          <span className="text-[12px] font-normal text-muted-foreground">/month</span>
        </p>
      </div>

      {tier.description && (
        <p className="text-[13px] leading-[1.6] text-muted-foreground">{tier.description}</p>
      )}

      {tier.benefits.length > 0 && (
        <ul className="flex flex-col gap-[6px]">
          {tier.benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-[8px] text-[13px] text-foreground">
              <span className="text-green-400">&#10003;</span>
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-[4px] flex gap-[10px]">
        <button
          onClick={onEdit}
          className="h-[36px] rounded-[8px] bg-muted px-[18px] text-[13px] text-foreground hover:bg-[#1e2328] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="h-[36px] rounded-[8px] bg-red-500/10 px-[18px] text-[13px] text-red-400 hover:bg-red-500/20 transition-colors"
        >
          {tier.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
