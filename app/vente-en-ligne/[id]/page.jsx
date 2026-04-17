import dbConnect from "../../../pages/api/lib/dbConnect";
import Articles from "../../../pages/api/_/models/Articles";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

// SEO Dynamique
export async function generateMetadata({ params }) {
    await dbConnect();
    const { id } = await params;
    // Recherche par le champ personnalisé id_produits
    const article = await Articles.findOne({ id_produits: id }).catch(() => null);

    if (!article) return { title: "Produit non trouvé" };

    return {
        title: `${article.nom} | Librairie Puissance Divine`,
        description: article.fr1 || article.fr || `Découvrez ${article.nom} sur la boutique officielle du Sanctuaire de Bolobi.`,
        openGraph: {
            images: [article.img],
        },
    };
}

export default async function ProductPage({ params }) {
    await dbConnect();
    const { id } = await params;
    
    // Recherche par le champ personnalisé id_produits
    const article = await Articles.findOne({ id_produits: id }).lean();

    if (!article) {
        notFound();
    }

    // Conversion des objets Mongo en types simples pour passage au client
    const serializedArticle = JSON.parse(JSON.stringify(article));

    return (
        <main className="product-page">
            <ProductClient article={serializedArticle} />
        </main>
    );
}
