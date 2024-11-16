import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection
    const tables = await prisma.$queryRaw`SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
      AND table_type='BASE TABLE';`
    
    console.log('Available tables:', tables)
    
    const products = await prisma.product.findMany()
    console.log('Products:', products)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
} 