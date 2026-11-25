import React from 'react';
import {
  FileVideo,
  FileText,
  FileImage,
  FileAudio,
  FileArchive,
  FileCode,
  File,
} from 'lucide-react';
import { getFileCategory } from './formatters';

export function FileIcon({ mimetype = '', filename = '', className = 'w-6 h-6' }) {
  const category = getFileCategory(mimetype, filename);

  switch (category) {
    case 'video':
      return <FileVideo className={`${className} text-rose-500`} />;
    case 'image':
      return <FileImage className={`${className} text-blue-500`} />;
    case 'audio':
      return <FileAudio className={`${className} text-purple-500`} />;
    case 'document':
      return <FileText className={`${className} text-emerald-500`} />;
    case 'archive':
      return <FileArchive className={`${className} text-amber-500`} />;
    default:
      return <File className={`${className} text-slate-500`} />;
  }
}

export function FileTypeBadge({ mimetype = '', filename = '' }) {
  const category = getFileCategory(mimetype, filename);
  const ext = filename.split('.').pop().toUpperCase() || category.toUpperCase();

  const styles = {
    video: 'bg-rose-50 text-rose-600 border-rose-200',
    image: 'bg-blue-50 text-blue-600 border-blue-200',
    audio: 'bg-purple-50 text-purple-600 border-purple-200',
    document: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    archive: 'bg-amber-50 text-amber-600 border-amber-200',
    file: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
        styles[category] || styles.file
      }`}
    >
      {ext}
    </span>
  );
}
