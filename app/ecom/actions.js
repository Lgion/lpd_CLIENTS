import { getPostsBy } from '../_/Blog/_/lib/api'

export async function getEcommerceData() {
    try {
        const categoryPosts = await getPostsBy("category", "librairie")
        return { categoryPosts }
    } catch (error) {
        console.error('Error fetching ecommerce data:', error)
        return { categoryPosts: [] }
    }
}
