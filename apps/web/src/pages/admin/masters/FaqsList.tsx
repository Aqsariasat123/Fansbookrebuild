import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'question', label: 'Question', type: 'text' },
  { key: 'answer', label: 'Answer', type: 'textarea' },
  { key: 'sequence', label: 'Sequence', type: 'number', required: false },
];

const columns = [
  {
    key: 'sequence',
    header: 'Sequence',
    render: (r: Record<string, unknown>) => String((r as { sequence?: number }).sequence || '-'),
  },
  { key: 'question', header: 'Question' },
  { key: 'answer', header: 'Answer' },
  {
    key: 'status',
    header: 'Status',
    render: (r: Record<string, unknown>) => (
      <span className="text-[12px] text-[#28a745]">{String(r.status || 'Active')}</span>
    ),
  },
];

export default function FaqsList() {
  return (
    <MasterListPage
      title="Masters > FAQs List"
      apiPath="/admin/masters/faqs"
      columns={columns}
      fields={fields}
    />
  );
}
