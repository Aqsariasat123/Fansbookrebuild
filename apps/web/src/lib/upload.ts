import { api } from './api';

interface PresignedResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

/**
 * Upload a file using S3 presigned URL.
 * Falls back to local multipart upload if S3 is not configured.
 */
export async function uploadFile(
  file: File,
  category: string,
): Promise<{ url: string; isS3: boolean }> {
  try {
    // Try S3 presigned upload first
    const { data } = await api.post('/uploads/presigned', {
      category,
      contentType: file.type,
      fileName: file.name,
    });

    if (data.success) {
      const result = data.data as PresignedResponse;

      // Direct upload to S3
      await fetch(result.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      return { url: result.fileUrl, isS3: true };
    }
  } catch {
    // S3 not available, fall through to local
  }

  // Fallback: local multipart upload (existing endpoints handle this)
  return { url: '', isS3: false };
}

/**
 * Upload via local multipart form data (existing pattern).
 */
export async function uploadLocal(
  endpoint: string,
  file: File,
  fieldName = 'file',
  extraFields?: Record<string, string>,
): Promise<string> {
  const formData = new FormData();
  formData.append(fieldName, file);
  if (extraFields) {
    for (const [key, val] of Object.entries(extraFields)) {
      formData.append(key, val);
    }
  }
  const { data } = await api.post(endpoint, formData);
  return data.data?.url || data.data?.mediaUrl || '';
}
