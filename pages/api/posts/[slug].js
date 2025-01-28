import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method === 'GET') {
    try {
      const postsDirectory = path.join(process.cwd(), '_posts')
      const fullPath = path.join(postsDirectory, `${slug}.md`)

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'Article non trouvé' })
      }

      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const post = {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        date: data.date,
        author: data.author,
        content: content,
      }

      res.status(200).json(post)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error)
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
