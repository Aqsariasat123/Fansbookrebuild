import { useState } from 'react';
import { PasswordField } from './SettingsShared';

interface PasswordSectionProps {
  pwdMsg: string;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

export function PasswordSection({ pwdMsg, onChangePassword }: PasswordSectionProps) {
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);

  function handleSubmit() {
    onChangePassword(curPwd, newPwd);
    setCurPwd('');
    setNewPwd('');
  }

  return (
    <>
      <p className="text-[16px] text-foreground mb-[8px]">Password</p>
      <div className="flex gap-[20px]">
        <PasswordField
          label="Current Password"
          value={curPwd}
          onChange={setCurPwd}
          show={showCur}
          onToggle={() => setShowCur(!showCur)}
        />
        <PasswordField
          label="New Password"
          value={newPwd}
          onChange={setNewPwd}
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
        />
      </div>
      <div className="flex items-center gap-[12px] mt-[12px]">
        <button
          onClick={handleSubmit}
          className="bg-[#01adf1] hover:bg-[#0195cc] text-foreground text-[12px] font-medium px-[20px] py-[10px] rounded-[9px] transition-colors"
        >
          Change Password
        </button>
        {pwdMsg && (
          <span
            className={`text-[12px] ${pwdMsg.includes('success') ? 'text-primary' : 'text-red-400'}`}
          >
            {pwdMsg}
          </span>
        )}
      </div>
    </>
  );
}
