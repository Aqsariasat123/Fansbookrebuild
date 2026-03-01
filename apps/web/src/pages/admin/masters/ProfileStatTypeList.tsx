import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [{ key: 'name', label: 'Name', type: 'text' }];

const columns = [
  { key: 'name', header: 'Profile Type' },
  {
    key: 'status',
    header: 'Status',
    render: (r: Record<string, unknown>) => (
      <span className="text-[12px] text-[#28a745]">{String(r.status || 'Active')}</span>
    ),
  },
];

export default function ProfileStatTypeList() {
  return (
    <MasterListPage
      title="Masters > Profile Stat Type List"
      apiPath="/admin/masters/profile-stat-types"
      columns={columns}
      fields={fields}
    />
  );
}
