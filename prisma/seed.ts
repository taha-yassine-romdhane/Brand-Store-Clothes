import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client with the testing database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:opL64TCJjZDV@ep-red-block-a5iim96t.us-east-2.aws.neon.tech/testing?sslmode=require"
    }
  }
})

async function main() {
  console.log('Starting database seed...')

  // First, clean up existing data
  console.log('Cleaning existing data...')
  await prisma.productImage.deleteMany({})
  await prisma.product.deleteMany({})

  // Product 1 - Casual Skirt Suit (Multiple Colors)
  const product1Colors = [
    { 
      name: 'Chocolate', 
      dir: 'Product1-chocolate-Emna', 
      collaborateur: 'Emna',
      images: [
        'chocolate casual skirt suit 1.jpg',
        'chocolate casual skirt suit 2.jpg',
        'chocolate casual skirt suit 3.jpg',
        'chocolate casual skirt suit 4.jpg'
      ]
    },
    { 
      name: 'White', 
      dir: 'Product1-white-Emna',
      collaborateur: 'Emna',
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
      dir: 'product1-caramel-Emna',
      collaborateur: 'Emna',
      images: [
        'Caramel casual skirt suit 1.jpg',
        'Caramel casual skirt suit 2.jpg',
        'Caramel casual skirt suit 3.jpg',
        'Caramel casual skirt suit 4.jpg'
      ]
    },
    { 
      name: 'Mint Green', 
      dir: 'product1-mintgreen-Emna',
      collaborateur: 'Emna',
      images: [
        'mintgreen casual skirt suit 1.jpg',
        'mintgreen casual skirt suit 2.jpg',
        'mintgreen casual skirt suit 3.jpg'
      ]
    }
  ]

  console.log('Creating products...')
  
  for (const color of product1Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Casual Skirt Suit - ${color.name}`,
        description: 'Elegant casual skirt suit perfect for any occasion. Features a tailored blazer and matching skirt.',
        price: 129.99,
        category: 'Suits',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        collaborateur: color.collaborateur,
        images: {
          create: color.images.map((image, index) => ({
            url: `/images/${color.dir}/${image}`,
            mimeType: 'image/jpeg',
            isMain: index === 0
          }))
        }
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  // Product 2 - Straight-cut Long Dress (Multiple Colors)
  const product2Colors = [
    { 
      name: 'Caramel', 
      dir: 'product2-Caramel-Aya',
      collaborateur: 'Aya',
      images: [
        'Caramel stright-cut long dress 1 .jpg',
        'Caramel stright-cut long dress 2.jpg',
        'Caramel stright-cut long dress 3.jpg'
      ]
    },
    { 
      name: 'Burgundy', 
      dir: 'product2-burgandi-Emna',
      collaborateur: 'Emna',
      images: [
        'burgendi stright-cut long dress 1.jpg',
        'burgendi stright-cut long dress 2.jpg',
        'burgendi stright-cut long dress 3.jpg'
      ]
    },
    { 
      name: 'Green', 
      dir: 'product2-green-Aya',
      collaborateur: 'Aya',
      images: [
        'green stright-cut long dress 1 .jpg',
        'green stright-cut long dress 2.jpg'
      ]
    },
    { 
      name: 'Off White', 
      dir: 'product2-offwhite-Emna',
      collaborateur: 'Emna',
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
        collaborateur: color.collaborateur,
        images: {
          create: color.images.map((image, index) => ({
            url: `/images/${color.dir}/${image}`,
            mimeType: 'image/jpeg',
            isMain: index === 0
          }))
        }
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  // Product 3 - Luxury Coat (Multiple Colors)
  const product3Colors = [
    { 
      name: 'Greyish', 
      dir: 'product3-greysh-Aya',
      collaborateur: 'Aya',
      images: [
        'greysh Luxury coat1.jpg',
        'greysh Luxury coat2.jpg'
      ]
    },
    { 
      name: 'White', 
      dir: 'product3-white-Aya',
      collaborateur: 'Aya',
      images: [
        'white Luxury coat1.jpg',
        'white Luxury coat2.jpg'
      ]
    }
  ]

  for (const color of product3Colors) {
    const product = await prisma.product.create({
      data: {
        name: `Luxury Coat - ${color.name}`,
        description: 'Premium luxury coat made from high-quality materials. Perfect for cold weather and formal occasions.',
        price: 299.99,
        category: 'Outerwear',
        colors: [color.name],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        collaborateur: color.collaborateur,
        images: {
          create: color.images.map((image, index) => ({
            url: `/images/${color.dir}/${image}`,
            mimeType: 'image/jpeg',
            isMain: index === 0
          }))
        }
      },
    })
    console.log(`Created product: ${product.name}`)
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
      collaborateur: 'Aya',
      images: {
        create: [
          {
            url: '/images/product4-Aya/Business formal outfit 1.jpg',
            mimeType: 'image/jpeg',
            isMain: true
          },
          {
            url: '/images/product4-Aya/Business formal outfit  2.jpg',
            mimeType: 'image/jpeg',
            isMain: false
          },
          {
            url: '/images/product4-Aya/Business formal outfit  3.jpg',
            mimeType: 'image/jpeg',
            isMain: false
          },
          {
            url: '/images/product4-Aya/Business formal outfit 4 .jpg',
            mimeType: 'image/jpeg',
            isMain: false
          }
        ]
      }
    },
  })
  console.log(`Created product: ${product4.name}`)

  // Product 5 - Short Sporty Coat (Multiple Colors)
  const product5Colors = [
    { 
      name: 'Pink',
      dir: 'product5-pink-Aya',
      collaborateur: 'Aya',
      images: [
        'Pink short sporty coat1.jpg'
      ]
    },
    { 
      name: 'Greyish',
      dir: 'product5-greysh-Aya',
      collaborateur: 'Aya',
      images: [
        'greysh short sporty coat1 .jpg',
        'greysh short sporty coat2.jpg',
        'greysh short sporty coat3 .jpg'
      ]
    },
    { 
      name: 'Sky Blue',
      dir: 'product5-skyblue-Aya',
      collaborateur: 'Aya',
      images: [
        'skybleu short sporty coat 1.jpg'
      ]
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
        collaborateur: color.collaborateur,
        images: {
          create: color.images.map((image, index) => ({
            url: `/images/${color.dir}/${image}`,
            mimeType: 'image/jpeg',
            isMain: index === 0
          }))
        }
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  // Accessory
  const accessory = await prisma.product.create({
    data: {
      name: 'Elegant Neck Cover - Blue',
      description: 'A beautiful neck cover in royal blue.',
      price: 49.99,
      category: 'Accessories',
      colors: ['Blue'],
      sizes: ['One Size'],
      collaborateur: 'Emna',
      images: {
        create: [
          {
            url: '/images/Accessoire1/neck-cover-blue.jpg',
            mimeType: 'image/jpeg',
            isMain: true
          }
        ]
      }
    },
  })
  console.log(`Created product: ${accessory.name}`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })