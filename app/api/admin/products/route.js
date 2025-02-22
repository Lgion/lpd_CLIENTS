import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ARTICLES_FILE_PATH = path.join(process.cwd(), 'assets', 'datas', 'articles.js')

// Fonction utilitaire pour lire le fichier articles.js
async function readArticlesFile() {
    try {
        const content = await fs.readFile(ARTICLES_FILE_PATH, 'utf-8')
        // Extraire les données entre les crochets []
        const match = content.match(/data":\s*\[([\s\S]*?)\]/)
        if (match && match[1]) {
            // Convertir le contenu en tableau d'objets
            const dataString = `[${match[1]}]`
            return JSON.parse(dataString)
        }
        return []
    } catch (error) {
        console.error('Error reading articles file:', error)
        return []
    }
}

// Fonction utilitaire pour écrire dans le fichier articles.js
async function writeArticlesFile(products) {
    try {
        const content = await fs.readFile(ARTICLES_FILE_PATH, 'utf-8')
        const newContent = content.replace(
            /data":\s*\[([\s\S]*?)\]/,
            `data": ${JSON.stringify(products, null, 4)}`
        )
        await fs.writeFile(ARTICLES_FILE_PATH, newContent, 'utf-8')
    } catch (error) {
        console.error('Error writing articles file:', error)
        throw error
    }
}

// GET /api/admin/products
export async function GET() {
    try {
        const products = await readArticlesFile()
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

// POST /api/admin/products
export async function POST(request) {
    try {
        const newProduct = await request.json()
        const products = await readArticlesFile()
        
        // Générer un nouvel ID
        const maxId = Math.max(...products.map(p => parseInt(p.id_produits)))
        newProduct.id_produits = (maxId + 1).toString()
        
        products.push(newProduct)
        await writeArticlesFile(products)
        
        return NextResponse.json(newProduct, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}

// PUT /api/admin/products/[id]
export async function PUT(request, { params }) {
    try {
        const updatedProduct = await request.json()
        const products = await readArticlesFile()
        
        const index = products.findIndex(p => p.id_produits === updatedProduct.id_produits)
        if (index === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }
        
        products[index] = updatedProduct
        await writeArticlesFile(products)
        
        return NextResponse.json(updatedProduct)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request, { params }) {
    try {
        const { id } = params
        const products = await readArticlesFile()
        
        const index = products.findIndex(p => p.id_produits === id)
        if (index === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }
        
        products.splice(index, 1)
        await writeArticlesFile(products)
        
        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
