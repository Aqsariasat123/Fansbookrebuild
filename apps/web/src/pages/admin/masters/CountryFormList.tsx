import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'inputTitle', label: 'Input Title', type: 'text' },
  {
    key: 'inputType',
    label: 'Input Type',
    type: 'select',
    options: [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'textarea', label: 'Textarea' },
    ],
  },
];

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
];

export default function CountryFormList() {
  return (
    <MasterListPage
      title="Masters > Country Forms List"
      apiPath="/admin/masters/country-forms"
      columns={columns}
      fields={fields}
      extraButtons={
        <button className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[14px] py-[6px] font-outfit text-[13px] text-white">
          Export Bank Sheet
        </button>
      }
    />
  );
}
