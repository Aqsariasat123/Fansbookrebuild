import { type ReactNode } from 'react';
import { AdminTable } from './AdminTable';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminPagination } from './AdminPagination';
import { type FieldDef } from './MasterFormModal';
import { MasterCrudModals } from './MasterCrudModals';
import { useMasterCrud } from './useMasterCrud';

interface Column {
  key: string;
  header: string;
  render?: (row: Record<string, unknown>) => ReactNode;
}

interface Props {
  title: string;
  apiPath: string;
  columns: Column[];
  addLabel?: string;
  onAdd?: () => void;
  extraButtons?: ReactNode;
  fields?: FieldDef[];
}

type Row = Record<string, unknown>;

function buildActionColumn(onEdit: (r: Row) => void, onDelete: (r: Row) => void): Column {
  return {
    key: 'action',
    header: 'Action',
    render: (row: Row) => (
      <div className="flex items-center gap-[5px]">
        <button title="Edit" onClick={() => onEdit(row)}>
          <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
        </button>
        <button title="Delete" className="text-red-500" onClick={() => onDelete(row)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    ),
  };
}

function getColumns(
  columns: Column[],
  fields: FieldDef[] | undefined,
  crud: ReturnType<typeof useMasterCrud>,
): Column[] {
  if (!fields) return columns;
  return [
    ...columns.filter((c) => c.key !== 'action'),
    buildActionColumn(crud.setEditItem, crud.setDeleteItem),
  ];
}

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
  </div>
);

export function MasterListPage({
  title,
  apiPath,
  columns,
  addLabel,
  onAdd,
  extraButtons,
  fields,
}: Props) {
  const crud = useMasterCrud(apiPath);
  const handleAdd = fields ? () => crud.setShowAdd(true) : onAdd;
  const modalTitle = title.split('>').pop()?.trim() || '';
  const finalColumns = getColumns(columns, fields, crud);

  if (crud.initialLoading) return <Spinner />;

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">{title}</p>
      <AdminSearchBar
        value={crud.search}
        onChange={crud.setSearch}
        onAdd={handleAdd}
        addLabel={addLabel || (fields ? 'Add' : undefined)}
      >
        {extraButtons}
      </AdminSearchBar>
      {crud.loading ? <Spinner /> : <AdminTable columns={finalColumns} data={crud.items} />}
      <AdminPagination page={crud.page} totalPages={crud.totalPages} onPageChange={crud.setPage} />
      {fields && (
        <MasterCrudModals
          fields={fields}
          modalTitle={modalTitle}
          editItem={crud.editItem}
          showAdd={crud.showAdd}
          deleteItem={crud.deleteItem}
          saving={crud.saving}
          initialData={crud.initialData}
          onSave={crud.handleSave}
          onCloseForm={() => {
            crud.setShowAdd(false);
            crud.setEditItem(null);
          }}
          onCloseDelete={() => crud.setDeleteItem(null)}
          onConfirmDelete={crud.handleDelete}
        />
      )}
    </div>
  );
}
