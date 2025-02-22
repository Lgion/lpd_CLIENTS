import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ARTICLES_FILE_PATH = path.join(process.cwd(), 'assets', 'datas', 'articles.js')

async function readArticlesFile() {
    try {
        const content = await fs.readFile(ARTICLES_FILE_PATH, 'utf-8')
        const match = content.match(/data":\s*\[([\s\S]*?)\]/)
        if (match && match[1]) {
            const dataString = `[${match[1]}]`
            return JSON.parse(dataString)
        }
        return []
    } catch (error) {
        console.error('Error reading articles file:', error)
        return []
    }
}

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

export async function PUT(request, { params }) {
    try {
        const { id } = params
        const updatedProduct = await request.json()
        const products = await readArticlesFile()
        
        const index = products.findIndex(p => p.id_produits === id)
        if (index === -1) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }
        
        products[index] = { ...products[index], ...updatedProduct }
        await writeArticlesFile(products)
        
        return NextResponse.json(products[index])
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

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
