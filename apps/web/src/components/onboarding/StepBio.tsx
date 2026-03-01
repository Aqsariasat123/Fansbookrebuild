export default function StepBio({
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
