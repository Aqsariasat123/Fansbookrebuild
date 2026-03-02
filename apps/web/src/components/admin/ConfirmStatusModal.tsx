export function ConfirmStatusModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[360px] rounded-[22px] bg-[#f8f8f8] p-[32px] text-center shadow-lg">
        <p className="font-outfit text-[20px] font-normal text-black">
          Are You Sure Want To Change Status?
        </p>
        <div className="mt-[24px] flex justify-center gap-[16px]">
          <button
            onClick={onConfirm}
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] font-outfit text-[16px] text-[#f8f8f8]"
          >
            YES
          </button>
          <button
            onClick={onCancel}
            className="rounded-[80px] border border-[#15191c] px-[32px] py-[10px] font-outfit text-[16px] text-[#15191c]"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
