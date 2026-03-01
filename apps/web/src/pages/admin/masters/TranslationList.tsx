import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function TranslationList() {
  const columns = [
    { key: 'textKey', header: 'Text Key' },
    { key: 'textValue', header: 'Text Value' },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <button title="Edit">
          <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
        </button>
      ),
    },
  ];
  return (
    <MasterListPage
      title="Masters > Translation List"
      apiPath="/admin/masters/translations"
      columns={columns}
      addLabel="Add"
      onAdd={() => {}}
    />
  );
}
