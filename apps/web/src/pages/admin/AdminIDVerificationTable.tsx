import { useState } from 'react';
import { api } from '../../lib/api';
import { RejectModal } from './AdminIDVerificationRejectModal';

export interface VerificationItem {
  id: string;
  status: string;
  diditSessionId: string | null;
  submittedAt: string;
  rejectionReason: string | null;
  retryCount: number;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    email: string;
  };
  reviewedBy: { username: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  MANUAL_REVIEW: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export function VerificationTable({
  items,
  loading,
  onRefresh,
}: {
  items: VerificationItem[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function doAction(
    id: string,
    action: 'approve' | 'reject' | 'request-resubmit',
    reason?: string,
  ) {
    setActionLoading(id + action);
    try {
      if (action === 'reject') {
        await api.patch(`/admin/verifications/${id}/reject`, { reason });
      } else {
        await api.patch(`/admin/verifications/${id}/${action}`);
      }
      onRefresh();
    } catch {
      // swallow
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-[60px]">
        <div className="size-7 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );
  }

  if (!items.length) {
    return <p className="py-[40px] text-center text-[13px] text-gray-500">No records found</p>;
  }

  return (
    <>
      <RejectModal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget) doAction(rejectTarget, 'reject', reason);
          setRejectTarget(null);
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[12px] text-gray-500 bg-gray-50">
              <th className="px-[20px] py-[10px] font-medium">User</th>
              <th className="px-[14px] py-[10px] font-medium">Submitted</th>
              <th className="px-[14px] py-[10px] font-medium">Status</th>
              <th className="px-[14px] py-[10px] font-medium">Session ID</th>
              <th className="px-[14px] py-[10px] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isPendingLike = item.status === 'PENDING' || item.status === 'MANUAL_REVIEW';
              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-[20px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      {item.user.avatar ? (
                        <img
                          src={item.user.avatar}
                          className="size-[32px] rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="flex size-[32px] items-center justify-center rounded-full bg-gray-200 text-[13px] text-gray-700">
                          {item.user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">
                          {item.user.displayName}
                        </p>
                        <p className="text-[11px] text-gray-500">@{item.user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-[14px] py-[12px] text-[12px] text-gray-500">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-[14px] py-[12px]">
                    <span
                      className={`rounded-full px-[10px] py-[3px] text-[11px] font-medium ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-[14px] py-[12px] text-[11px] text-gray-400 font-mono max-w-[120px] truncate">
                    {item.diditSessionId ?? '—'}
                  </td>
                  <td className="px-[14px] py-[12px]">
                    {isPendingLike ? (
                      <div className="flex gap-[8px]">
                        <button
                          disabled={!!actionLoading}
                          onClick={() => doAction(item.id, 'approve')}
                          className="rounded-full bg-green-600 px-[12px] py-[5px] text-[11px] font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={!!actionLoading}
                          onClick={() => setRejectTarget(item.id)}
                          className="rounded-full bg-red-600 px-[12px] py-[5px] text-[11px] font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          disabled={!!actionLoading}
                          onClick={() => doAction(item.id, 'request-resubmit')}
                          className="rounded-full border border-gray-300 px-[12px] py-[5px] text-[11px] text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          Resubmit
                        </button>
                      </div>
                    ) : item.status === 'APPROVED' ? (
                      <span className="text-[13px] text-green-600 font-medium">✓ Approved</span>
                    ) : (
                      <span
                        className="text-[11px] text-gray-500 max-w-[160px] block truncate"
                        title={item.rejectionReason ?? ''}
                      >
                        {item.rejectionReason ?? '—'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
