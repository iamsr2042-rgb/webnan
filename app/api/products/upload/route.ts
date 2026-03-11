import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { jwtSecret } from '@/lib/env';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'products');
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['application/zip', 'application/x-rar-compressed', 'application/gzip', 'application/x-tar'];
const ALLOWED_EXTENSIONS = ['.zip', '.rar', '.tar.gz', '.tar'];

interface FileUploadResponse {
  message?: string;
  error?: string;
  fileUrl?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<FileUploadResponse>> {
  try {
    // Verify admin authentication
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(accessToken, jwtSecret);
    if (!payload || payload.role !== 'ADMIN') {
      console.warn('[v0] Non-admin attempted file upload');
      return NextResponse.json(
        { error: 'Forbidden - admin access required' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = ALLOWED_TYPES.includes(file.type);

    if (!hasValidExtension || !hasValidMimeType) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: zip, rar, tar.gz, tar' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to admin
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate unique filename to prevent conflicts
    const fileExtension = fileName.split('.').slice(-2).join('.');
    const uniqueFileName = `${productId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, uniqueFileName);

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      console.error('[v0] Failed to create upload directory:', error);
    }

    // Read file as buffer and save
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Update product with file URL
    const fileUrl = `/uploads/products/${uniqueFileName}`;
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { fileUrl },
    });

    console.log('[v0] ✓ File uploaded successfully for product:', productId);
    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        fileUrl: fileUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
