import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  idDocumentUrl: string | null;
  selfieUrl: string | null;
  verificationStatus: string;
  createdAt: string;
}

export default function AdminVerification() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/verification', {
        params: { status: filter, q: search || undefined },
      });
      setCreators(data.data);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [filter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    try {
      await api.put(`/admin/verification/${userId}/${action}`);
      fetchData();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Creator Verification</h1>

      <div className="flex gap-3 flex-wrap">
        {['PENDING', 'VERIFIED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-[#1a1d21] text-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search creators..."
          className="ml-auto px-4 py-2 rounded-lg bg-[#1a1d21] text-white border border-gray-700 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : creators.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No creators found</div>
      ) : (
        <div className="space-y-4">
          {creators.map((c) => (
            <div key={c.id} className="bg-[#1a1d21] rounded-xl p-4 flex items-center gap-4">
              <img
                src={c.avatar || '/icons/dashboard/person.svg'}
                alt=""
                className="w-12 h-12 rounded-full object-cover bg-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{c.displayName}</p>
                <p className="text-sm text-gray-400">
                  @{c.username} &middot; {c.email}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {c.idDocumentUrl && (
                  <a
                    href={c.idDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    ID Doc
                  </a>
                )}
                {c.selfieUrl && (
                  <a
                    href={c.selfieUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    Selfie
                  </a>
                )}
              </div>
              {filter === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(c.id, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(c.id, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
              {filter !== 'PENDING' && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.verificationStatus === 'VERIFIED'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {c.verificationStatus}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
