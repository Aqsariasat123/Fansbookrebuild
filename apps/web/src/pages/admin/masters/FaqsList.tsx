import { MasterListPage } from '../../../components/admin/MasterListPage';

export default function FaqsList() {
  const columns = [
    {
      key: 'sequence',
      header: 'Sequence',
      render: (_r: Record<string, unknown>) =>
        String((_r as { sequence?: number }).sequence || '-'),
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
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <div className="flex items-center gap-[5px]">
          <button title="Edit">
            <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
          </button>
          <button title="View">
            <img src="/icons/admin/eye.png" alt="View" className="size-[20px]" />
          </button>
          <button title="Delete" className="text-red-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];
  return (
    <MasterListPage
      title="Masters > FAQs List"
      apiPath="/admin/masters/faqs"
      columns={columns}
      addLabel="Add"
      onAdd={() => {}}
    />
  );
}
