// Format bytes to human readable string (KB, MB, GB)
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format 6-digit key with a clean space in between: e.g. "482 910"
export function formatKey(key) {
  if (!key) return '';
  const clean = key.toString().replace(/\s+/g, '');
  if (clean.length === 6) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  return clean;
}

// Format milliseconds into MM:SS
export function formatTimeRemaining(ms) {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Categorize file by mimetype or extension
export function getFileCategory(mimetype = '', filename = '') {
  const type = mimetype.toLowerCase();
  const ext = filename.split('.').pop().toLowerCase();

  if (type.startsWith('video/') || ['mp4', 'mkv', 'avi', 'mov', 'webm', '3gp'].includes(ext)) {
    return 'video';
  }
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(ext)) {
    return 'image';
  }
  if (type.startsWith('audio/') || ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac'].includes(ext)) {
    return 'audio';
  }
  if (
    type.includes('pdf') ||
    type.includes('word') ||
    type.includes('excel') ||
    type.includes('sheet') ||
    type.includes('presentation') ||
    type.includes('text') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf'].includes(ext)
  ) {
    return 'document';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(ext)) {
    return 'archive';
  }
  return 'file';
}
