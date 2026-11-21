import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface DeleteConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps): JSX.Element {
  return (
    <Modal
      open={open}
      hideHeader
      title="Удаление товара"
      onClose={onCancel}
      footer={
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-base font-medium text-pink-dark transition-colors hover:bg-pink-soft active:bg-[#FFE0F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
          >
            Отмена
          </button>
          <Button onClick={onConfirm}>Да</Button>
        </div>
      }
    >
      <p className="text-base leading-6 text-ink">
        Вы уверены, что хотите удалить?
      </p>
    </Modal>
  );
}
