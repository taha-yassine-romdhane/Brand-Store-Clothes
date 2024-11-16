import { prisma } from '../lib/db'

const products = [
  {
    id: 1,
    name: "Classic White Tee",
    price: 49.99,
    salePrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    category: "Tops"
  },
  {
    id: 2,
    name: "Comfy Crewneck Sweatshirt",
    price: 59.99,
    salePrice: 49.99,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Navy"],
    category: "Tops"
  },
  {
    id: 3,
    name: "Slim Fit Chinos",
    price: 69.99,
    salePrice: 25.26,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Khaki", "Black", "Olive"],
    category: "Bottoms"
  },
  {
    id: 4,
    name: "Denim Jacket",
    price: 89.99,
    salePrice: 79.99,
    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=600",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    category: "Outerwear"
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 120.00,
    salePrice: 99.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Red"],
    category: "Footwear"
  },
  {
    id: 6,
    name: "Graphic Print T-Shirt",
    price: 29.99,
    salePrice: 19.99,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue"],
    category: "Tops"
  },
  {
    id: 7,
    name: "Leather Belt",
    price: 39.99,
    salePrice: 29.95,
    image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=600",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    category: "Accessories"
  },
  {
    id: 8,
    name: "Puffer Vest",
    price: 79.99,
    salePrice: 69.99,
    image: "https://images.unsplash.com/photo-1557418669-db3f781a58c0?auto=format&fit=crop&q=80&w=600",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Navy", "Olive"],
    category: "Outerwear"
  },
  {
    id: 9,
    name: "Casual Sneakers",
    price: 89.99,
    salePrice: 74.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Gray", "Beige"],
    category: "Footwear"
  },
  {
    id: 10,
    name: "Wool Beanie",
    price: 24.99,
    salePrice: 19.99,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600",
    sizes: ["One Size"],
    colors: ["Gray", "Black", "Burgundy"],
    category: "Accessories"
  }
]

async function main() {
  console.log('Start seeding...')
  
  // Clear existing products
  await prisma.product.deleteMany()
  
  // Create new products
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product
    })
    console.log(`Created product with id: ${createdProduct.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 