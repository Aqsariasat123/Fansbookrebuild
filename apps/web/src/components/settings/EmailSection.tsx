import { useState } from 'react';
import { MailIcon } from './SettingsIcons';
import { SmallBtn } from './SettingsShared';

interface EmailSectionProps {
  email: string | undefined;
  secondaryEmail: string | null | undefined;
  emailMsg: string;
  onAdd: (email: string) => void;
  onDelete: () => void;
}

export function EmailSection({
  email,
  secondaryEmail,
  emailMsg,
  onAdd,
  onDelete,
}: EmailSectionProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  function handleAdd() {
    onAdd(newEmail);
    setNewEmail('');
    setShowEmailForm(false);
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[16px] text-foreground mb-[8px]">Contact Email</p>
          <p className="text-[12px] text-muted-foreground mb-[4px]">Email</p>
          <div className="border border-muted rounded-[8px] flex items-center gap-[10px] px-[10px] py-[8px] w-[332px]">
            <MailIcon />
            <p className="text-[12px] text-foreground">{email || ''}</p>
          </div>
        </div>
        {!secondaryEmail && (
          <SmallBtn label="Add another email" onClick={() => setShowEmailForm(true)} />
        )}
      </div>
      {!!secondaryEmail && (
        <div className="flex items-center gap-[10px]">
          <div className="border border-muted rounded-[8px] flex items-center gap-[10px] px-[10px] py-[8px] w-[332px]">
            <MailIcon />
            <p className="text-[12px] text-foreground">{secondaryEmail}</p>
          </div>
          <SmallBtn label="Remove" onClick={onDelete} />
        </div>
      )}
      {showEmailForm && (
        <div className="flex items-center gap-[10px] mt-[4px]">
          <div className="border border-muted rounded-[8px] flex items-center gap-[10px] px-[10px] py-[8px] w-[332px]">
            <MailIcon />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="bg-transparent text-[12px] text-foreground outline-none w-full placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-[#01adf1] hover:bg-[#0195cc] text-foreground text-[12px] font-medium px-[16px] py-[8px] rounded-[9px] transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setShowEmailForm(false);
              setNewEmail('');
            }}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      {emailMsg && <span className="text-[12px] text-primary">{emailMsg}</span>}
    </div>
  );
}
