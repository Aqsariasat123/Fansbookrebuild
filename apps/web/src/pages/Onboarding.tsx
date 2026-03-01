import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

type Step = 1 | 2 | 3 | 4;

const INTEREST_OPTIONS = [
  'Photography',
  'Fitness',
  'Music',
  'Art',
  'Fashion',
  'Travel',
  'Gaming',
  'Cooking',
  'Dance',
  'Comedy',
  'Beauty',
  'Tech',
  'Writing',
  'Yoga',
  'Sports',
  'Film',
  'Education',
  'Lifestyle',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<Step>(1);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const toggleInterest = (tag: string) => {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (avatar) fd.append('avatar', avatar);
      if (cover) fd.append('cover', cover);
      fd.append('bio', bio);
      fd.append('location', location);
      fd.append('website', website);
      fd.append('interests', JSON.stringify(interests));
      const res = await api.put('/profile/onboarding', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.data) setUser(res.data.data);
      navigate('/feed');
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => navigate('/feed');

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="flex flex-col gap-[20px]">
        <p className="text-[24px] font-semibold text-foreground">Set Up Your Profile</p>
        <div className="flex gap-[4px]">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-[4px] flex-1 rounded-full ${step >= s ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651]' : 'bg-muted'}`}
            />
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground">Step {step} of 4</p>

        <div className="rounded-[22px] bg-card p-[20px]">
          {step === 1 && (
            <StepPhotos
              avatarPreview={avatarPreview}
              coverPreview={coverPreview}
              avatarRef={avatarRef}
              coverRef={coverRef}
              onAvatar={(f) => {
                setAvatar(f);
                setAvatarPreview(URL.createObjectURL(f));
              }}
              onCover={(f) => {
                setCover(f);
                setCoverPreview(URL.createObjectURL(f));
              }}
            />
          )}
          {step === 2 && (
            <StepBio
              bio={bio}
              setBio={setBio}
              location={location}
              setLocation={setLocation}
              website={website}
              setWebsite={setWebsite}
            />
          )}
          {step === 3 && <StepInterests selected={interests} toggle={toggleInterest} />}
          {step === 4 && <StepSuggested />}
        </div>

        <div className="flex gap-[12px]">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-muted-foreground"
          >
            Skip
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 3 && interests.length < 3}
              className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
            >
              {submitting ? 'Completing...' : 'Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepPhotos({
  avatarPreview,
  coverPreview,
  avatarRef,
  coverRef,
  onAvatar,
  onCover,
}: {
  avatarPreview: string | null;
  coverPreview: string | null;
  avatarRef: React.RefObject<HTMLInputElement | null>;
  coverRef: React.RefObject<HTMLInputElement | null>;
  onAvatar: (f: File) => void;
  onCover: (f: File) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Profile Photos</p>
      <div className="flex items-center gap-[16px]">
        <button
          onClick={() => avatarRef.current?.click()}
          className="relative size-[80px] shrink-0 overflow-hidden rounded-full bg-muted"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
        </button>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])}
        />
        <div>
          <p className="text-[14px] text-foreground">Avatar</p>
          <p className="text-[12px] text-muted-foreground">Square photo, min 200x200px</p>
        </div>
      </div>
      <button
        onClick={() => coverRef.current?.click()}
        className="relative h-[120px] w-full overflow-hidden rounded-[12px] bg-muted"
      >
        {coverPreview ? (
          <img src={coverPreview} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-[12px]">Cover Photo</p>
          </div>
        )}
      </button>
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onCover(e.target.files[0])}
      />
    </div>
  );
}

function StepBio({
  bio,
  setBio,
  location,
  setLocation,
  website,
  setWebsite,
}: {
  bio: string;
  setBio: (s: string) => void;
  location: string;
  setLocation: (s: string) => void;
  website: string;
  setWebsite: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] font-medium text-foreground">About You</p>
      <div>
        <label className="text-[13px] text-muted-foreground">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 500))}
          placeholder="Tell people about yourself..."
          className="mt-[4px] min-h-[100px] w-full resize-none rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
        />
        <p className="text-right text-[11px] text-muted-foreground">{bio.length}/500</p>
      </div>
      <div>
        <label className="text-[13px] text-muted-foreground">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. New York, USA"
          className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
        />
      </div>
      <div>
        <label className="text-[13px] text-muted-foreground">Website</label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yoursite.com"
          className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
        />
      </div>
    </div>
  );
}

function StepInterests({ selected, toggle }: { selected: string[]; toggle: (s: string) => void }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] font-medium text-foreground">Your Interests</p>
      <p className="text-[13px] text-muted-foreground">
        Select at least 3 interests to personalize your feed.
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {INTEREST_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`rounded-[50px] px-[16px] py-[8px] text-[13px] font-medium transition-colors ${
              selected.includes(tag)
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">{selected.length} selected (min 3)</p>
    </div>
  );
}

function StepSuggested() {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] font-medium text-foreground">Suggested Creators</p>
      <p className="text-[13px] text-muted-foreground">Follow creators that interest you.</p>
      <p className="py-[40px] text-center text-[14px] text-muted-foreground">
        Suggested creators will appear here based on your interests.
      </p>
    </div>
  );
}
