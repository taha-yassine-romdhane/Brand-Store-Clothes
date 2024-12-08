import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // First, clean up existing data
  await prisma.productImage.deleteMany({})
  await prisma.product.deleteMany({})

  // Product 1 - Casual Skirt Suit (Multiple Colors)
  const product1Colors = [
    { 
      name: 'Chocolate', 
      dir: 'Product1-chocolate', 
      images: [
        'chocolate casual skirt suit 1.jpg',
        'chocolate casual skirt suit 2.jpg',
        'chocolate casual skirt suit 3.jpg',
        'chocolate casual skirt suit 4.jpg'
      ]
    },
    { 
      name: 'White', 
      dir: 'Product1-white', 
      images: [
        'white casual skirt suit 1.jpg',
        'white casual skirt suit 2.jpg',
        'white casual skirt suit 3.jpg',
        'white casual skirt suit4 .jpg',
        'white casual skirt suit 5.jpg'
      ]
    },
    { 
      name: 'Caramel', 
      dir: 'product1-caramel', 
      images: [
        'Caramel casual skirt suit 1.jpg',
        'Caramel casual skirt suit 2.jpg',
        'Caramel casual skirt suit 3.jpg',
        'Caramel casual skirt suit 4.jpg'
      ]
    },
    { 
      name: 'Mint Green', 
      dir: 'product1-mintgreen', 
      images: [
        'mintgreen casual skirt suit 1.jpg',
        'mintgreen casual skirt suit 2.jpg',
        'mintgreen casual skirt suit 3.jpg'
      ]
    }
  ]

  for (const color of product1Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Casual Skirt Suit - ${color.name}`,
        description: 'Elegant casual skirt suit perfect for any occasion. Features a tailored blazer and matching skirt.',
        price: 129.99,
        category: 'Suits',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
    })

    // Add images for each color variant
    for (const image of color.images) {
      await prisma.productImage.create({
        data: {
          url: `/images/${color.dir}/${image}`,
          isMain: image.includes('1.jpg'),
          productId: product.id,
        },
      })
    }
  }

  // Product 2 - Straight-cut Long Dress (Multiple Colors)
  const product2Colors = [
    { 
      name: 'Caramel', 
      dir: 'product2-Caramel', 
      images: [
        'Caramel stright-cut long dress 1 .jpg',
        'Caramel stright-cut long dress 2.jpg',
        'Caramel stright-cut long dress 3.jpg'
      ]
    },
    { 
      name: 'Burgundy', 
      dir: 'product2-burgandi', 
      images: [
        'burgendi stright-cut long dress 1.jpg',
        'burgendi stright-cut long dress 2.jpg',
        'burgendi stright-cut long dress 3.jpg'
      ]
    },
    { 
      name: 'Green', 
      dir: 'product2-green', 
      images: [
        'green stright-cut long dress 1 .jpg',
        'green stright-cut long dress 2.jpg'
      ]
    },
    { 
      name: 'Off White', 
      dir: 'product2-offwhite', 
      images: [
        'offwhite stright-cut long dress 1.jpg',
        'offwhite stright-cut long dress  2.jpg',
        'offwhite stright-cut long dress  3.jpg'
      ]
    }
  ]

  for (const color of product2Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Straight-cut Long Dress - ${color.name}`,
        description: 'Elegant straight-cut long dress perfect for formal occasions. Features a sleek design and premium fabric.',
        price: 159.99,
        category: 'Dresses',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
    })

    for (const image of color.images) {
      await prisma.productImage.create({
        data: {
          url: `/images/${color.dir}/${image}`,
          isMain: image.includes('1'),
          productId: product.id,
        },
      })
    }
  }

  // Product 3 - Luxury Coat (Multiple Colors)
  const product3Colors = [
    { 
      name: 'Greyish', 
      dir: 'product3-greysh', 
      images: [
        'greysh Luxury coat1.jpg',
        'greysh Luxury coat2.jpg'
      ]
    },
    { 
      name: 'White', 
      dir: 'product3-white', 
      images: [
        'white Luxury coat 1.jpg',
        'white Luxury coat 2.jpg',
        'white Luxury coat 3.jpg',
        'white Luxury coat 4.jpg'
      ]
    }
  ]

  for (const color of product3Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Luxury Coat - ${color.name}`,
        description: 'Premium luxury coat made with the finest materials. Perfect for making a statement.',
        price: 299.99,
        category: 'Outerwear',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
    })

    for (const image of color.images) {
      await prisma.productImage.create({
        data: {
          url: `/images/${color.dir}/${image}`,
          isMain: image.includes('1'),
          productId: product.id,
        },
      })
    }
  }

  // Product 4 - Business Formal Outfit
  const product4 = await prisma.product.create({
    data: {
      name: 'Business Formal Outfit',
      description: 'Professional business formal outfit perfect for the modern workplace.',
      price: 189.99,
      category: 'Suits',
      colors: ['Black'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
  })

  const product4Images = [
    'Business formal outfit 1.jpg',
    'Business formal outfit  2.jpg',
    'Business formal outfit  3.jpg',
    'Business formal outfit 4 .jpg'
  ]

  for (const image of product4Images) {
    await prisma.productImage.create({
      data: {
        url: `/images/product4/${image}`,
        isMain: image.includes('1'),
        productId: product4.id,
      },
    })
  }

  // Product 5 - Short Sporty Coat (Multiple Colors)
  const product5Colors = [
    { 
      name: 'Pink', 
      images: ['Pink short sporty coat1.jpg']
    },
    { 
      name: 'Greyish', 
      images: [
        'greysh short sporty coat1 .jpg',
        'greysh short sporty coat2.jpg',
        'greysh short sporty coat3 .jpg'
      ]
    },
    { 
      name: 'Sky Blue', 
      images: ['skybleu short sporty coat 1.jpg']
    }
  ]

  for (const color of product5Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Short Sporty Coat - ${color.name}`,
        description: 'Stylish and comfortable short sporty coat, perfect for casual outings.',
        price: 149.99,
        category: 'Outerwear',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
    })

    for (const image of color.images) {
      await prisma.productImage.create({
        data: {
          url: `/images/product5/${image}`,
          isMain: true,
          productId: product.id,
        },
      })
    }
  }

  // Accessories - Neck Cover
  const accessory = await prisma.product.create({
    data: {
      name: 'Elegant Neck Cover - Blue',
      description: 'Stylish neck cover in a beautiful blue shade. Perfect for adding elegance to any outfit.',
      price: 29.99,
      category: 'Accessories',
      colors: ['Blue'],
      sizes: ['One Size'],
    },
  })

  await prisma.productImage.create({
    data: {
      url: '/images/Accessoire1/neck-cover-blue.jpg',
      isMain: true,
      productId: accessory.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })