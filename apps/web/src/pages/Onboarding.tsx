import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import StepPhotos from '../components/onboarding/StepPhotos';
import StepBio from '../components/onboarding/StepBio';
import StepInterests from '../components/onboarding/StepInterests';
import StepSuggested from '../components/onboarding/StepSuggested';

type Step = 1 | 2 | 3 | 4;

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
          {step === 4 && <StepSuggested interests={interests} />}
        </div>

        <div className="flex gap-[12px]">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-muted-foreground"
            >
              Back
            </button>
          )}
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
