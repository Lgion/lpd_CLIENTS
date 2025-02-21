const Intro = ({ handleProductsDisplay }) => {
    const categories = [
        { name: "Bibles", color: "purple" },
        { name: "Livres de prière", color: "blue" },
        { name: "Chapelets", color: "green" },
        { name: "Livres spirituels", color: "orange" },
        { name: "Objets de dévotion", color: "red" },
        { name: "Médailles religieuses", color: "teal" }
    ];

    return (
        <section className="intro-section">
            <div className="intro-container">
                <h2 className="intro-title">Librairie Puissance Divine d'Amour</h2>
                <p className="intro-description">
                    Découvrez notre sélection d'articles religieux soigneusement choisis pour nourrir votre foi 
                    et enrichir votre vie spirituelle.
                </p>
                <p className="intro-categories">
                    Explorez nos catégories : {' '}
                    {categories.map((category, index) => (
                        <>
                            <button
                                key={index}
                                onClick={() => handleProductsDisplay(category.name.toLowerCase())}
                                className={`category-badge ${category.color}`}
                            >
                                {category.name}
                            </button>
                            {index < categories.length - 1 && ' '}
                        </>
                    ))}
                </p>
            </div>
        </section>
    );
};

export default Intro;
