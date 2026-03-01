import { MasterListPage } from '../../components/admin/MasterListPage';
import type { FieldDef } from '../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'content', label: 'Content', type: 'textarea' },
  {
    key: 'isActive',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ],
    required: false,
  },
];

const columns = [
  { key: 'title', header: 'Title' },
  {
    key: 'content',
    header: 'Content',
    render: (r: Record<string, unknown>) => {
      const text = String(r.content || '');
      return text.length > 60 ? text.slice(0, 60) + '…' : text;
    },
  },
  {
    key: 'isActive',
    header: 'Status',
    render: (r: Record<string, unknown>) => (
      <span className={`text-[12px] ${r.isActive ? 'text-[#28a745]' : 'text-[#5d5d5d]'}`}>
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (r: Record<string, unknown>) => new Date(r.createdAt as string).toLocaleDateString(),
  },
];

export default function AdminAnnouncements() {
  return (
    <MasterListPage
      title="Announcements"
      apiPath="/admin/announcements"
      columns={columns}
      fields={fields}
    />
  );
}
