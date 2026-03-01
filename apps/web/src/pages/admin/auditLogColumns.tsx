const actionColors: Record<string, string> = {
  CREATE: 'bg-[#28a745]',
  UPDATE: 'bg-[#f0ad4e]',
  DELETE: 'bg-[#dc3545]',
  REGISTER: 'bg-[#17a2b8]',
  LOGIN: 'bg-[#6f42c1]',
  LOGOUT: 'bg-[#6c757d]',
  POST_CREATE: 'bg-[#28a745]',
  POST_UPDATE: 'bg-[#f0ad4e]',
  POST_DELETE: 'bg-[#dc3545]',
  POST_LIKE: 'bg-[#e83e8c]',
  POST_UNLIKE: 'bg-[#6c757d]',
  POST_PIN: 'bg-[#fd7e14]',
  COMMENT: 'bg-[#20c997]',
  TIP: 'bg-[#ffc107]',
  PPV_UNLOCK: 'bg-[#007bff]',
  FOLLOW: 'bg-[#28a745]',
  UNFOLLOW: 'bg-[#6c757d]',
  MESSAGE_SEND: 'bg-[#17a2b8]',
  MESSAGE_DELETE: 'bg-[#dc3545]',
  PROFILE_UPDATE: 'bg-[#f0ad4e]',
  PASSWORD_CHANGE: 'bg-[#fd7e14]',
  AVATAR_UPLOAD: 'bg-[#6f42c1]',
  COVER_UPLOAD: 'bg-[#6f42c1]',
};

const roleBgMap: Record<string, string> = {
  ADMIN: 'bg-[#dc3545]',
  CREATOR: 'bg-[#6f42c1]',
  FAN: 'bg-[#17a2b8]',
};

type Row = Record<string, unknown>;

const fmt = (d: string) => {
  const dt = new Date(d);
  return `${dt.toLocaleDateString()}\n${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

function UserCell({ r }: { r: Row }) {
  const user = r.admin as { username: string; displayName: string; role: string };
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="font-medium text-[#15191c]">
        {user?.displayName || user?.username || '-'}
      </span>
      {user?.role && (
        <span
          className={`inline-flex w-fit items-center rounded-[26px] px-[6px] py-[1px] text-[9px] font-medium text-white ${roleBgMap[user.role] || 'bg-[#6c757d]'}`}
        >
          {user.role}
        </span>
      )}
    </div>
  );
}

function DetailsCell({ r }: { r: Row }) {
  const d = r.details;
  if (!d) return <span className="text-[#5d5d5d]">-</span>;
  const str = JSON.stringify(d);
  return (
    <span className="text-[#5d5d5d]" title={str}>
      {str.length > 40 ? str.slice(0, 40) + '...' : str}
    </span>
  );
}

export const auditLogColumns = [
  {
    key: 'createdAt',
    header: 'Date & Time',
    render: (r: Row) => <span className="whitespace-pre-wrap">{fmt(r.createdAt as string)}</span>,
  },
  {
    key: 'admin',
    header: 'User',
    render: (r: Row) => <UserCell r={r} />,
  },
  {
    key: 'action',
    header: 'Action',
    render: (r: Row) => (
      <span
        className={`inline-flex h-[19px] items-center rounded-[26px] px-[8px] text-[10px] font-medium text-[#f8f8f8] ${actionColors[r.action as string] || 'bg-[#5d5d5d]'}`}
      >
        {(r.action as string).replace(/_/g, ' ')}
      </span>
    ),
  },
  {
    key: 'targetType',
    header: 'Target',
    render: (r: Row) => <span className="text-[#15191c]">{(r.targetType as string) || '-'}</span>,
  },
  {
    key: 'details',
    header: 'Details',
    render: (r: Row) => <DetailsCell r={r} />,
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (r: Row) => <span className="text-[#5d5d5d]">{(r.ipAddress as string) || '-'}</span>,
  },
];

export const actionFilterOptions = [
  { value: 'REGISTER', label: 'Register' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'POST_CREATE', label: 'Post Create' },
  { value: 'POST_DELETE', label: 'Post Delete' },
  { value: 'POST_LIKE', label: 'Post Like' },
  { value: 'COMMENT', label: 'Comment' },
  { value: 'TIP', label: 'Tip' },
  { value: 'PPV_UNLOCK', label: 'PPV Unlock' },
  { value: 'FOLLOW', label: 'Follow' },
  { value: 'UNFOLLOW', label: 'Unfollow' },
  { value: 'MESSAGE_SEND', label: 'Message Send' },
  { value: 'PROFILE_UPDATE', label: 'Profile Update' },
  { value: 'PASSWORD_CHANGE', label: 'Password Change' },
  { value: 'CREATE', label: 'Admin Create' },
  { value: 'UPDATE', label: 'Admin Update' },
  { value: 'DELETE', label: 'Admin Delete' },
];
