'use client'

import { useState, useEffect } from 'react'
import { articles, articles_img_table } from '@/assets/datas/articles'
import "./style.scss"

export default function EcommerceAdmin() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [visible, setVisible] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const categories = Object.keys(articles_img_table).map(key => ({
        label: key,
        value: key
    }))

    const defaultProduct = {
        id_produits: '',
        nom: '',
        user_name: '',
        auteur: '',
        prix: '',
        img: '',
        fr: '',
        en: '',
        es: '',
        fr1: '',
        en1: '',
        es1: '',
        taille: '',
        materiaux: ''
    }

    const [formData, setFormData] = useState(defaultProduct)

    const handleInputChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        })
    }

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)
        
        if (!term) {
            setFilteredProducts(products)
            return
        }

        const filtered = products.filter(product => 
            product.nom.toLowerCase().includes(term) ||
            product.user_name.toLowerCase().includes(term) ||
            product.auteur.toLowerCase().includes(term) ||
            product.fr?.toLowerCase().includes(term)
        )
        setFilteredProducts(filtered)
    }

    const saveProduct = async () => {
        try {
            const url = editMode 
                ? `/api/admin/products/${formData.id_produits}`
                : '/api/admin/products'
            
            const method = editMode ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                loadProducts()
                setVisible(false)
                setFormData(defaultProduct)
            } else {
                console.error('Error saving product')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const deleteProduct = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                const response = await fetch(`/api/admin/products/${id}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    loadProducts()
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
    }

    const loadProducts = () => {
        try {
            console.log("Données chargées:", articles.data);
            setProducts(articles.data)
            setFilteredProducts(articles.data)
        } catch (error) {
            console.error('Error loading products:', error)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Gestion des Produits</h1>
                <button 
                    className="bg-black hover:bg-gray-800 text-white text-lg font-bold py-3 px-6 rounded flex items-center gap-2"
                    onClick={() => {
                        setEditMode(false)
                        setFormData(defaultProduct)
                        setVisible(true)
                    }}
                >
                    <span className="text-2xl">+</span> Ajouter un Produit
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full px-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id_produits}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-16 h-16 relative">
                                        <img
                                            src={`/img/vente-religieuse/min/${articles_img_table[product.nom]}/${product.img}.webp`}
                                            alt={product.fr}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: product.fr }} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.nom}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.user_name === 'objet' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {product.user_name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.auteur}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.prix} FCFA</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            className="edit_btn bg-black hover:bg-gray-800 text-white text-xl font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                setEditMode(true)
                                                setFormData(product)
                                                setVisible(true)
                                            }}
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="delete_btn bg-black hover:bg-gray-800 text-white text-xl font-bold py-2 px-4 rounded"
                                            onClick={() => deleteProduct(product.id_produits)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {visible && (
                <div className="fixed left-0 right-0 bottom-0 inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium">
                                {editMode ? "Modifier le Produit" : "Ajouter un Produit"}
                            </h3>
                            <button 
                                className="close text-3xl text-black hover:text-gray-700"
                                onClick={() => setVisible(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.nom}
                                    onChange={(e) => handleInputChange(e, 'nom')}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.user_name}
                                    onChange={(e) => handleInputChange(e, 'user_name')}
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="objet">Objet</option>
                                    <option value="publication">Publication</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Auteur</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.auteur}
                                    onChange={(e) => handleInputChange(e, 'auteur')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prix</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.prix}
                                    onChange={(e) => handleInputChange(e, 'prix')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.img}
                                    onChange={(e) => handleInputChange(e, 'img')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (FR)</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.fr}
                                    onChange={(e) => handleInputChange(e, 'fr')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (EN)</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.en}
                                    onChange={(e) => handleInputChange(e, 'en')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (ES)</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.es}
                                    onChange={(e) => handleInputChange(e, 'es')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Taille</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.taille}
                                    onChange={(e) => handleInputChange(e, 'taille')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Matériaux</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.materiaux}
                                    onChange={(e) => handleInputChange(e, 'materiaux')}
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button 
                                className="bg-black hover:bg-gray-800 text-white text-lg font-bold py-2 px-6 rounded"
                                onClick={() => setVisible(false)}
                            >
                                Annuler
                            </button>
                            <button 
                                className="bg-black hover:bg-gray-800 text-white text-lg font-bold py-2 px-6 rounded"
                                onClick={saveProduct}
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}