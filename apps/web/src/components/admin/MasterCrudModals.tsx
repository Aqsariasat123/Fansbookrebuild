import { MasterFormModal, type FieldDef } from './MasterFormModal';
import { ConfirmModal } from './ConfirmModal';

type Row = Record<string, unknown>;

interface Props {
  fields: FieldDef[];
  modalTitle: string;
  editItem: Row | null;
  showAdd: boolean;
  deleteItem: Row | null;
  saving: boolean;
  initialData?: Record<string, string>;
  onSave: (data: Record<string, string>) => Promise<void>;
  onCloseForm: () => void;
  onCloseDelete: () => void;
  onConfirmDelete: () => Promise<void>;
}

export function MasterCrudModals({
  fields,
  modalTitle,
  editItem,
  showAdd,
  deleteItem,
  saving,
  initialData,
  onSave,
  onCloseForm,
  onCloseDelete,
  onConfirmDelete,
}: Props) {
  return (
    <>
      <MasterFormModal
        open={showAdd || !!editItem}
        title={editItem ? `Edit ${modalTitle}` : `Add ${modalTitle}`}
        fields={fields}
        initialData={initialData}
        onSave={onSave}
        onClose={onCloseForm}
        saving={saving}
      />
      <ConfirmModal
        open={!!deleteItem}
        title="Confirm Delete"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={onConfirmDelete}
        onClose={onCloseDelete}
        loading={saving}
      />
    </>
  );
}
