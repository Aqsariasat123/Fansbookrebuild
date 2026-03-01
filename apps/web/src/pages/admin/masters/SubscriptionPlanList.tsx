import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'duration', label: 'Duration', type: 'text', required: false },
  { key: 'description', label: 'Description', type: 'textarea', required: false },
];

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
];

export default function SubscriptionPlanList() {
  return (
    <MasterListPage
      title="Masters > Subscription Plan List"
      apiPath="/admin/masters/subscription-plans"
      columns={columns}
      fields={fields}
    />
  );
}
