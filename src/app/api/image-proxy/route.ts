import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.status} ${response.statusText} for ${imageUrl}`);
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
        }

        const blob = await response.blob();
        const headers = new Headers();
        
        // Pass through the content type if available, otherwise default to image/png
        const contentType = response.headers.get('Content-Type');
        if (contentType) {
            headers.set('Content-Type', contentType);
        } else {
            // Try to infer from URL if possible, otherwise default
            headers.set('Content-Type', 'image/png');
        }

        // Cache for 1 day
        headers.set('Cache-Control', 'public, max-age=86400');
        
        // Ensure CORS is allowed for the frontend to use it with Konva/Canvas
        headers.set('Access-Control-Allow-Origin', '*');

        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Failed to proxy image', { status: 500 });
    }
}
