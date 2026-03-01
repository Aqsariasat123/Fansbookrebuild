import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function ProfileStatTypeList() {
  const columns = [
    { key: 'name', header: 'Profile Type' },
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
        <button title="Edit">
          <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
        </button>
      ),
    },
  ];
  return (
    <MasterListPage
      title="Masters > Profile Stat Type List"
      apiPath="/admin/masters/profile-stat-types"
      columns={columns}
      addLabel="Add"
      onAdd={() => {}}
    />
  );
}
