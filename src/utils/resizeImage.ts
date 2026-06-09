/**
 * Utilitaire de redimensionnement d'image côté client via canvas.
 * Retourne un base64 (sans le préfixe data URI) et le type MIME.
 * Typé strictement — aucun `any`.
 */

export type SupportedMime = 'image/png' | 'image/jpeg' | 'image/webp';

export interface ResizedImage {
  dataBase64: string;
  mime: SupportedMime;
}

const ALLOWED_MIME: SupportedMime[] = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 512 * 1024; // 512 Ko

/** Valide le type MIME du fichier. Lève une erreur si non supporté. */
export function assertSupportedMime(file: File): SupportedMime {
  const mime = file.type as SupportedMime;
  if (!ALLOWED_MIME.includes(mime)) {
    throw new Error(`Format non supporté : ${file.type}. Utilisez PNG, JPEG ou WEBP.`);
  }
  return mime;
}

/**
 * Redimensionne l'image en carré (crop centré + resize) à `size` px.
 * Encode en JPEG pour limiter le poids (qualité 0.88).
 */
export async function resizeImageToSquare(
  file: File,
  size = 256,
): Promise<ResizedImage> {
  assertSupportedMime(file);

  if (file.size > MAX_BYTES * 2) {
    throw new Error('Image trop lourde (max ~1 Mo avant compression).');
  }

  return new Promise<ResizedImage>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas non disponible')); return; }

      // Crop centré pour obtenir un carré
      const src = img.width < img.height ? img.width : img.height;
      const sx = (img.width - src) / 2;
      const sy = (img.height - src) / 2;

      ctx.drawImage(img, sx, sy, src, src, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      // dataUrl = "data:image/jpeg;base64,<base64>"
      const base64 = dataUrl.split(',')[1];
      if (!base64) { reject(new Error('Erreur lors de l\'encodage base64')); return; }

      resolve({ dataBase64: base64, mime: 'image/jpeg' });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de charger l\'image.'));
    };

    img.src = url;
  });
}
