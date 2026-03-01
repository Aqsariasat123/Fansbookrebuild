import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'content', label: 'Content', type: 'textarea' },
];

const columns = [{ key: 'title', header: 'Title' }];

export default function CmsList() {
  return (
    <MasterListPage
      title="Masters > CMS List"
      apiPath="/admin/masters/cms"
      columns={columns}
      fields={fields}
    />
  );
}
