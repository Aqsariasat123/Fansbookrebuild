import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function CmsList() {
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
    <MasterListPage title="Masters > CMS List" apiPath="/admin/masters/cms" columns={columns} />
  );
}
