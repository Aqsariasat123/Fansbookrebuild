import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function SubscriptionPlanList() {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'duration', header: 'Duration' },
    {
      key: 'price',
      header: 'Price',
      render: (r: Record<string, unknown>) => `$${Number(r.price || 0).toFixed(2)}`,
    },
    { key: 'description', header: 'Description' },
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
          <button title="View">
            <img src="/icons/admin/eye.png" alt="View" className="size-[20px]" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <MasterListPage
      title="Masters > Subscription Plan List"
      apiPath="/admin/masters/subscription-plans"
      columns={columns}
    />
  );
}
