import { removeBackground } from '@imgly/background-removal';

/**
 * Removes the background from an image source using @imgly/background-removal.
 * 
 * @param {Blob | File | HTMLImageElement | string} imageSrc 
 * @param {function} onProgress Callback for tracking loading progress
 * @returns {Promise<string>} A promise that resolves to an object URL of the processed image
 */
export async function removeImageBackground(imageSrc, onProgress) {
  try {
    const config = {
      model: 'isnet',
      output: { format: 'image/png' },
      progress: (key, current, total) => {
        if (onProgress) {
          // Calculate rough overall progress
          let progressStr = `Loading model ${key}...`;
          if (total) {
            const percent = Math.round((current / total) * 100);
            progressStr = `Loading ${key}: ${percent}%`;
          }
          onProgress(progressStr);
        }
      }
    };
    
    // removeBackground returns a Blob
    const imageBlob = await removeBackground(imageSrc, config);
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
}

/**
 * Helper to read a file as a data URL for preview.
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
