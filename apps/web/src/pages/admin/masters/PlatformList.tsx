import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [{ key: 'name', label: 'Platform Name', type: 'text' }];

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
];

export default function PlatformList() {
  return (
    <MasterListPage
      title="Masters > Platform List"
      apiPath="/admin/masters/platforms"
      columns={columns}
      fields={fields}
    />
  );
}
