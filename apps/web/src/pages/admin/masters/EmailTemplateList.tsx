import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'content', label: 'Content', type: 'textarea' },
];

const columns = [{ key: 'title', header: 'Title' }];

export default function EmailTemplateList() {
  return (
    <MasterListPage
      title="Masters > Email Template List"
      apiPath="/admin/masters/email-templates"
      columns={columns}
      fields={fields}
    />
  );
}
