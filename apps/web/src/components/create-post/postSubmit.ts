import type { Visibility } from './CreatePostParts';

interface PostFields {
  text: string;
  visibility: Visibility;
  ppvPrice: string;
  isPinned: boolean;
  hashtags: string[];
}

export function buildPostFormData(fields: PostFields, images: { file: File }[]): FormData {
  const fd = new FormData();
  fd.append('text', fields.text);
  // PPV maps to PUBLIC visibility on the backend + ppvPrice gate
  fd.append('visibility', fields.visibility === 'PPV' ? 'PUBLIC' : fields.visibility);
  if (fields.visibility === 'PPV' && fields.ppvPrice) fd.append('ppvPrice', fields.ppvPrice);
  if (fields.isPinned) fd.append('isPinned', 'true');
  if (fields.hashtags.length) fd.append('hashtags', fields.hashtags.join(','));
  images.forEach((img) => fd.append('media', img.file));
  return fd;
}

export function extractErrorMessage(err: unknown): string {
  const e = err as {
    response?: { data?: { error?: string; message?: string } };
    message?: string;
  };
  return (
    e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? 'Failed to create post'
  );
}
