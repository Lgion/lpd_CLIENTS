'use client'

import { useState, useEffect } from 'react'
import { articles, articles_img_table } from '@/assets/datas/articles'

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
        <div className="ecommerce-admin">
            <div className="ecommerce-admin__header">
                <h1>Gestion des Produits</h1>
                <button
                    className="ecommerce-admin__add-btn"
                    onClick={() => {
                        setEditMode(false)
                        setFormData(defaultProduct)
                        setVisible(true)
                    }}
                >
                    <span>+</span> Ajouter un Produit
                </button>
            </div>

            <div className="ecommerce-admin__search-container">
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="ecommerce-admin__search-input"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="ecommerce-admin__grid">
                {filteredProducts.map((product) => (
                    <div className="product-card" key={product.id_produits}>
                        <div className="product-card__image-container">
                            <img
                                src={`/img/vente-religieuse/min/${articles_img_table[product.nom]}/${product.img}.webp`}
                                alt={product.fr}
                                className="product-card__image"
                            />
                        </div>
                        <div className="product-card__content">
                            <div className="product-card__badges">
                                <span className="product-card__category">
                                    {product.nom}
                                </span>
                                <span className={`product-card__type product-card__type--${product.user_name}`}>
                                    {product.user_name}
                                </span>
                            </div>
                            <div
                                className="product-card__title"
                                dangerouslySetInnerHTML={{ __html: product.fr }}
                            />
                            <div className="product-card__info">
                                {product.auteur && (
                                    <div className="product-card__author">Par {product.auteur}</div>
                                )}
                            </div>
                            <div className="product-card__footer">
                                <div className="product-card__price">{product.prix} FCFA</div>
                                <div className="product-card__actions">
                                    <button
                                        className="product-card__btn product-card__btn--edit"
                                        onClick={() => {
                                            setEditMode(true)
                                            setFormData(product)
                                            setVisible(true)
                                        }}
                                        title="Modifier"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className="product-card__btn product-card__btn--delete"
                                        onClick={() => deleteProduct(product.id_produits)}
                                        title="Supprimer"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visible && (
                <div className="admin-modal">
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h3>
                                {editMode ? "Modifier le Produit" : "Ajouter un Produit"}
                            </h3>
                            <button
                                className="admin-modal__close-btn"
                                onClick={() => setVisible(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="admin-modal__body">
                            <div className="admin-form">
                                <div className="admin-form__group">
                                    <label className="admin-form__label">Catégorie</label>
                                    <select
                                        className="admin-form__select"
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

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Type</label>
                                    <select
                                        className="admin-form__select"
                                        value={formData.user_name}
                                        onChange={(e) => handleInputChange(e, 'user_name')}
                                    >
                                        <option value="">Sélectionner un type</option>
                                        <option value="objet">Objet</option>
                                        <option value="publication">Publication</option>
                                    </select>
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Auteur</label>
                                    <input
                                        type="text"
                                        className="admin-form__input"
                                        value={formData.auteur}
                                        onChange={(e) => handleInputChange(e, 'auteur')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Prix</label>
                                    <input
                                        type="text"
                                        className="admin-form__input"
                                        value={formData.prix}
                                        onChange={(e) => handleInputChange(e, 'prix')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Image</label>
                                    <input
                                        type="text"
                                        className="admin-form__input"
                                        value={formData.img}
                                        onChange={(e) => handleInputChange(e, 'img')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Description (FR)</label>
                                    <textarea
                                        className="admin-form__textarea"
                                        rows="3"
                                        value={formData.fr}
                                        onChange={(e) => handleInputChange(e, 'fr')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Description (EN)</label>
                                    <textarea
                                        className="admin-form__textarea"
                                        rows="3"
                                        value={formData.en}
                                        onChange={(e) => handleInputChange(e, 'en')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Description (ES)</label>
                                    <textarea
                                        className="admin-form__textarea"
                                        rows="3"
                                        value={formData.es}
                                        onChange={(e) => handleInputChange(e, 'es')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Taille</label>
                                    <input
                                        type="text"
                                        className="admin-form__input"
                                        value={formData.taille}
                                        onChange={(e) => handleInputChange(e, 'taille')}
                                    />
                                </div>

                                <div className="admin-form__group">
                                    <label className="admin-form__label">Matériaux</label>
                                    <input
                                        type="text"
                                        className="admin-form__input"
                                        value={formData.materiaux}
                                        onChange={(e) => handleInputChange(e, 'materiaux')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal__footer">
                            <button
                                className="admin-modal__btn admin-modal__btn--cancel"
                                onClick={() => setVisible(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="admin-modal__btn admin-modal__btn--save"
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