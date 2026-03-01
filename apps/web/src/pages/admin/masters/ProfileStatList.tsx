import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'profileStatTypeId', label: 'Profile Stat Type', type: 'text' },
];

const columns = [
  { key: 'name', header: 'Profile Type' },
  { key: 'profileStatTypeName', header: 'Profile Star Type' },
  {
    key: 'status',
    header: 'Status',
    render: (r: Record<string, unknown>) => (
      <span className="text-[12px] text-[#28a745]">{String(r.status || 'Active')}</span>
    ),
  },
];

export default function ProfileStatList() {
  return (
    <MasterListPage
      title="Masters > Profile Stat List"
      apiPath="/admin/masters/profile-stats"
      columns={columns}
      fields={fields}
    />
  );
}
