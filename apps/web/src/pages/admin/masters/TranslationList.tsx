import { MasterListPage } from '../../../components/admin/MasterListPage';
import type { FieldDef } from '../../../components/admin/MasterFormModal';

const fields: FieldDef[] = [
  { key: 'textKey', label: 'Text Key', type: 'text' },
  { key: 'textValue', label: 'Text Value', type: 'textarea' },
];

const columns = [
  { key: 'textKey', header: 'Text Key' },
  { key: 'textValue', header: 'Text Value' },
];

export default function TranslationList() {
  return (
    <MasterListPage
      title="Masters > Translation List"
      apiPath="/admin/masters/translations"
      columns={columns}
      fields={fields}
    />
  );
}
