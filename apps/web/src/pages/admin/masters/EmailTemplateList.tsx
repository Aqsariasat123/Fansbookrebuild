import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function EmailTemplateList() {
  const columns = [
    { key: 'title', header: 'Title' },
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
      title="Masters > Email Template List"
      apiPath="/admin/masters/email-templates"
      columns={columns}
    />
  );
}
