import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'name', label: 'Country Name', type: 'text' },
  { key: 'code', label: 'Country Code', type: 'text' },
];

const columns = [
  { key: 'name', header: 'Country Name' },
  { key: 'code', header: 'Country Code' },
  {
    key: 'status',
    header: 'Status',
    render: (r: Record<string, unknown>) => (
      <span className="text-[12px] text-[#28a745]">{String(r.status || 'Active')}</span>
    ),
  },
];

export default function CountryList() {
  return (
    <MasterListPage
      title="Masters > Country List"
      apiPath="/admin/masters/countries"
      columns={columns}
      fields={fields}
    />
  );
}
