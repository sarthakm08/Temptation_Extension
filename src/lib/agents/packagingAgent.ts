import JSZip from 'jszip';
import { GeneratedFile } from '@/types/extension';

export async function packageExtensionToZip(files: GeneratedFile[]): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    if (file.language === 'image') {
      // Decode base64 image data
      zip.file(file.path, file.content, { base64: true });
    } else {
      zip.file(file.path, file.content);
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  return blob;
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
