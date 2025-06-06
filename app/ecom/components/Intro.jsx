const Intro = ({ selectedCategory, setSelectedCategory, categories }) => {


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
                    <button
                        key="all"
                        onClick={() => setSelectedCategory('all')}
                        className={`category-badge neutral${selectedCategory === 'all' ? ' active' : ''}`}
                    >
                        Toutes
                    </button>{' '}
                    {categories.map((category, index) => (
                        <>
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category.label)}
                                className={`category-badge ${category.color}${selectedCategory === category.label ? ' active' : ''}`}
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
