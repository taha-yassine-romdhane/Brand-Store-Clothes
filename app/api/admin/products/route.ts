import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : null;
    const category = formData.get('category') as string;
    const colors = JSON.parse(formData.get('colors') as string);
    const sizes = JSON.parse(formData.get('sizes') as string);
    const collaborateur = formData.get('collaborateur') as string || null;
    const imageUrls = formData.getAll('images') as string[];
    const mainImageIndex = parseInt(formData.get('mainImageIndex') as string);

    // Create product with images
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        salePrice,
        category,
        colors,
        sizes,
        collaborateur,
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            isMain: index === mainImageIndex
          }))
        }
      },
      include: {
        images: true
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/collections');

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const salePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : null;
    const category = formData.get('category') as string;
    const colors = JSON.parse(formData.get('colors') as string);
    const sizes = JSON.parse(formData.get('sizes') as string);
    const collaborateur = formData.get('collaborateur') as string || null;
    const newImageUrls = formData.getAll('newImages') as string[];
    const mainImageIndex = parseInt(formData.get('mainImageIndex') as string);
    const existingImages = JSON.parse(formData.get('existingImages') as string);

    // Handle existing images
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
        NOT: {
          id: {
            in: existingImages.map((img: any) => img.id)
          }
        }
      }
    });

    // Update existing images' isMain status
    for (const img of existingImages) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { isMain: img.isMain }
      });
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        salePrice,
        category,
        colors,
        sizes,
        collaborateur,
        images: {
          create: newImageUrls.map((url, index) => ({
            url,
            isMain: index + existingImages.length === mainImageIndex
          }))
        }
      },
      include: {
        images: true
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/collections');
    revalidatePath(`/product/${id}`);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Delete all images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/collections');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
