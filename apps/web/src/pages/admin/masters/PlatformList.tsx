import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function PlatformList() {
  const columns = [
    { key: 'name', header: 'Platform Name' },
    {
      key: 'imageUrl',
      header: 'Platform Image',
      render: (r: Record<string, unknown>) =>
        r.imageUrl ? (
          <img src={String(r.imageUrl)} alt="" className="size-[24px] object-contain" />
        ) : (
          '-'
        ),
    },
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
      title="Masters > Platform List"
      apiPath="/admin/masters/platforms"
      columns={columns}
      addLabel="Add"
      onAdd={() => {}}
    />
  );
}
