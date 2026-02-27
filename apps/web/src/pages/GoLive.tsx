import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoLive() {
  const navigate = useNavigate();
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [comments, setComments] = useState('');
  const [privateShow, setPrivateShow] = useState(false);
  const [streamExt, setStreamExt] = useState(false);

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Broadcasting Info */}
      <div className="flex flex-col items-center gap-[16px] rounded-[22px] bg-[#0e1012] px-[20px] py-[32px]">
        <p className="text-[20px] font-semibold text-[#f8f8f8]">Start Your broadcasting now</p>
        <p className="max-w-[800px] text-center text-[14px] leading-[1.8] text-[#a0a0a0]">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer
          took a galley of type and scrambled it to make a type specimen book.
        </p>

        {/* Policy checkbox */}
        <label className="flex cursor-pointer items-center gap-[10px]">
          <button onClick={() => setPolicyAgreed(!policyAgreed)} className="shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {policyAgreed ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#5d5d5d" strokeWidth="2" />
              )}
            </svg>
          </button>
          <span className="text-[14px] text-[#f8f8f8]">
            I have accepted the &quot;
            <span className="font-bold underline">Live Broadcast Policy</span>&quot;.
          </span>
        </label>
      </div>

      {/* Comments Section */}
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] font-medium text-[#f8f8f8]">Please add your comments</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="min-h-[140px] w-full resize-none rounded-[8px] border border-[#f8f8f8] bg-transparent px-[16px] py-[14px] text-[14px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-[32px]">
        <label className="flex cursor-pointer items-center gap-[10px]">
          <button onClick={() => setPrivateShow(!privateShow)} className="shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {privateShow ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#5d5d5d" strokeWidth="2" />
              )}
            </svg>
          </button>
          <span className="text-[14px] text-[#f8f8f8]">Available for the private show</span>
        </label>

        <label className="flex cursor-pointer items-center gap-[10px]">
          <button onClick={() => setStreamExt(!streamExt)} className="shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {streamExt ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#5d5d5d" strokeWidth="2" />
              )}
            </svg>
          </button>
          <span className="text-[14px] text-[#f8f8f8]">Stream Extension</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-[20px]">
        <button
          disabled={!policyAgreed}
          className="w-[240px] rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Go Live
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-[240px] rounded-[8px] border border-[#5d5d5d] py-[14px] text-[16px] text-[#f8f8f8] transition-colors hover:border-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
