import type { LiveFilterParams } from '@fansbook/shared';
import { Dropdown } from './Dropdown';

interface FilterOptions {
  categories?: string[];
  genders?: string[];
  countries?: string[];
}

interface Props {
  pending: LiveFilterParams;
  onChange: (updater: (f: LiveFilterParams) => LiveFilterParams) => void;
  onApply: () => void;
  onReset: () => void;
  filterOptions: FilterOptions | undefined;
}

function sortByLabel(sortBy: string | undefined): string {
  if (sortBy === 'viewers') return 'Most Viewers';
  if (sortBy === 'newest') return 'Newest';
  return '';
}

function parseSortBy(val: string): 'viewers' | 'newest' | undefined {
  if (val === 'Most Viewers') return 'viewers';
  if (val === 'Newest') return 'newest';
  return undefined;
}

export function MobileFilterBar({ pending, onChange, onApply, onReset, filterOptions }: Props) {
  return (
    <div className="flex w-full items-center gap-[16px] lg:hidden">
      <div className="flex flex-1 items-center gap-[16px] rounded-[8px] bg-muted px-[24px] py-[12px]">
        <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
        <Dropdown
          label="Filters"
          value={pending.category || ''}
          options={filterOptions?.categories || []}
          onChange={(val) => onChange((f) => ({ ...f, category: val || undefined }))}
        />
      </div>
      <div className="flex items-center gap-[12px]">
        <button
          onClick={onApply}
          className="rounded-[4px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-foreground"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="rounded-[4px] border border-foreground px-[14px] py-[10px] font-outfit text-[16px] font-normal text-foreground"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function DesktopFilterSidebar({
  pending,
  onChange,
  onApply,
  onReset,
  filterOptions,
}: Props) {
  return (
    <div className="hidden lg:flex h-[596px] w-[281px] shrink-0 items-center rounded-[22px] bg-card px-[24px] py-[14px]">
      <div className="flex w-[161px] flex-col items-start gap-[70px]">
        <div className="flex w-[122px] flex-col items-start gap-[40px]">
          <div className="flex items-center gap-[10px] p-[10px]">
            <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
            <span className="font-outfit text-[16px] font-normal text-foreground">Filters:</span>
          </div>
          <div className="flex w-full flex-col items-start gap-[40px]">
            <Dropdown
              label="Category"
              value={pending.category || ''}
              options={filterOptions?.categories || []}
              onChange={(val) => onChange((f) => ({ ...f, category: val || undefined }))}
            />
            <Dropdown
              label="Gender"
              value={pending.gender || ''}
              options={filterOptions?.genders || []}
              onChange={(val) => onChange((f) => ({ ...f, gender: val || undefined }))}
            />
            <Dropdown
              label="Region"
              value={pending.region || ''}
              options={filterOptions?.countries || []}
              onChange={(val) => onChange((f) => ({ ...f, region: val || undefined }))}
            />
            <Dropdown
              label="Sort By"
              value={sortByLabel(pending.sortBy)}
              options={['Most Viewers', 'Newest']}
              onChange={(val) => onChange((f) => ({ ...f, sortBy: parseSortBy(val) }))}
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-[21px]">
          <button
            onClick={onApply}
            className="rounded-[4px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-foreground"
          >
            Apply
          </button>
          <button
            onClick={onReset}
            className="rounded-[4px] border border-foreground px-[14px] py-[10px] font-outfit text-[16px] font-normal text-foreground"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
