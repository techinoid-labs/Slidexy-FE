export async function loadImage(src: string): Promise<HTMLImageElement> {
    try {
        // First, try to load it directly, which is fast and works for most URLs
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(err);
        });
        return img;
    } catch (e) {
        console.warn(`Direct image load failed for ${src}, trying fetch...`, e);

        // If direct loading fails (e.g., CORS, Content-Disposition),
        // fetch the image data and create an object URL
        const response = await fetch(src);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.src = objectUrl;
            image.onload = () => {
                // It's good practice to revoke the object URL when it's no longer needed
                // to avoid memory leaks. We can do it after the image has loaded.
                URL.revokeObjectURL(objectUrl);
                resolve(image);
            };
            image.onerror = (err) => {
                URL.revokeObjectURL(objectUrl);
                reject(err);
            };
        });
        return img;
    }
}

export async function processKonvaElements(elements: any[]): Promise<void> {
    for (const el of elements) {
        if (el.type === 'Image' && el.image && typeof el.image === 'string') {
            const originalUrl = el.image;
            const proxiedUrl = originalUrl.startsWith('http')
                ? `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
                : originalUrl;
            try {
                const img = await loadImage(proxiedUrl);
                el.image = img;
            } catch (err) {
                console.warn("Failed to load image", proxiedUrl, err);
                
                // create a simple placeholder image via canvas so Konva can still render something
                const canvas = document.createElement("canvas");
                canvas.width = el.width || 100;
                canvas.height = el.height || 100;
                const ctx = canvas.getContext("2d")!;
                ctx.fillStyle = "#e0e0e0";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#666";
                ctx.font = "14px Arial";
                ctx.fillText("Image failed", 8, 20);

                const placeholder = new Image();
                placeholder.src = canvas.toDataURL();
                await new Promise((res) => {
                    placeholder.onload = () => res(null);
                    placeholder.onerror = () => res(null);
                });
                el.image = placeholder as any;
            }
        } else if (el.type === 'Group' && el.children) {
            await processKonvaElements(el.children);
        }
    }
}
