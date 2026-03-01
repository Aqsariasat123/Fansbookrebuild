import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function CountryFormList() {
  const columns = [
    { key: 'inputTitle', header: 'Input Title' },
    { key: 'inputType', header: 'Input Type' },
    { key: 'countryNames', header: 'Country Name' },
    {
      key: 'status',
      header: 'Status',
      render: (r: Record<string, unknown>) => (
        <span className="text-[12px] text-[#28a745]">{String(r.status || 'Active')}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <div className="flex items-center gap-[5px]">
          <button title="Edit">
            <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
          </button>
          <button title="Delete" className="text-red-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];
  return (
    <MasterListPage
      title="Masters > Country Forms List"
      apiPath="/admin/masters/country-forms"
      columns={columns}
      addLabel="Add"
      onAdd={() => {}}
      extraButtons={
        <button className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[14px] py-[6px] font-outfit text-[13px] text-white">
          Export Bank Sheet
        </button>
      }
    />
  );
}
