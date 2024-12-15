import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log('Starting file upload...');
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    console.log(`Processing ${files.length} files...`);
    const uploadedImages = [];

    for (const file of files) {
      console.log(`Processing file: ${file.name}`);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-').toLowerCase();
      console.log(`Generated filename: ${filename}`);
      
      // Save file to public/images/autres directory
      const publicPath = path.join(process.cwd(), 'public', 'images', 'autres');
      await writeFile(path.join(publicPath, filename), new Uint8Array(buffer));
      
      // Return the URL
      const imageUrl = `/images/autres/${filename}`;
      console.log(`File saved, URL: ${imageUrl}`);
      
      // Just return the URL string directly
      uploadedImages.push(imageUrl);
    }

    console.log('Upload complete. Uploaded images:', uploadedImages);
    return NextResponse.json({ 
      success: true, 
      images: uploadedImages 
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
