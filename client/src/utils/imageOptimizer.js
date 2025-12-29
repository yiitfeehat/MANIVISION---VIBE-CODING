export const compressAndResizeImage = async (blobOrUrl, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Ensure we can draw to canvas without tainting if it's a URL

        // Handle Blob or URL
        if (blobOrUrl instanceof Blob) {
            img.src = URL.createObjectURL(blobOrUrl);
        } else {
            img.src = blobOrUrl;
        }

        img.onload = () => {
            // Release Object URL if we created one
            if (blobOrUrl instanceof Blob) {
                // Fix: Do not revoke immediately to prevent ERR_FILE_NOT_FOUND during race conditions
                // URL.revokeObjectURL(img.src);
            }

            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxWidth) {
                    width = Math.round((width * maxWidth) / height);
                    height = maxWidth;
                }
            }

            // Draw to Canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed JPEG
            canvas.toBlob((blob) => {
                if (blob) {
                    console.log(`Image compressed: ${Math.round(blob.size / 1024)}KB (Original was larger)`);
                    resolve(blob);
                } else {
                    reject(new Error("Canvas to Blob failed"));
                }
            }, 'image/jpeg', quality);
        };

        img.onerror = (err) => {
            reject(new Error("Failed to load image for compression"));
        };
    });
};
