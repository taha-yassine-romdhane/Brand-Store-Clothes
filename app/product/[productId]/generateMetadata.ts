import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.productId) },
    include: {
      images: true
    }
  });

  if (!product) {
    return {
      title: 'Product Not Found - LAMASETTE',
      description: 'The requested product could not be found.',
    };
  }

  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const priceText = product.salePrice 
    ? `${product.salePrice}€ (Regular: ${product.price}€)`
    : `${product.price}€`;

  const description = `${product.description} - ${product.category} by ${product.collaborateur || 'LAMASETTE'}. Available in sizes: ${product.sizes.join(', ')}. ${priceText}`;

  return {
    title: `${product.name} - ${product.category} | LAMASETTE`,
    description: description,
    keywords: `${product.name}, ${product.category}, fashion, clothing, ${product.colors.join(', ')}, LAMASETTE`,
    openGraph: {
      title: `${product.name} - LAMASETTE`,
      description: description,
      type: 'website',
      images: [
        {
          url: mainImage ? mainImage.url : '/default-product-image.jpg',
          width: 800,
          height: 600,
          alt: `${product.name} - ${product.category} by LAMASETTE`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
