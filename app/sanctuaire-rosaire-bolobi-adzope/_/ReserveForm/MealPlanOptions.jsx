"use client"
import {useEffect} from 'react';

export default function MealPlanOptions({ mealPlan, handleMealPlanChange }) {

    useEffect(() => {

    }, [])
    
    return (
        <div className="mealPlanOptions">
            <style jsx>{`
                .mealPlanOptions {
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-radius: 0.25rem;
                }

                .mealPlanOptions h5 {
                    margin-bottom: 0.5rem;
                    color: #495057;
                }

                .mealPlanOptions .form-check {
                    margin-bottom: 0.5rem;
                }
            `}</style>
            <h5>Choisissez votre formule de repas:</h5>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="mealPlan"
                    id="oneMeal"
                    value="1"
                    checked={mealPlan === 1}
                    onChange={handleMealPlanChange}
                />
                <label className="form-check-label" htmlFor="oneMeal">
                    1 repas (<b>Diner</b>) + petit déjeuner offert (<b>2000 Fcfa/jour</b>)
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="mealPlan"
                    id="twoMeals"
                    value="2"
                    checked={mealPlan === 2}
                    onChange={handleMealPlanChange}
                />
                <label className="form-check-label" htmlFor="twoMeals">
                    2 repas (<b>Déjeuner et Diner</b>) + petit déjeuner offert (<b>3000 Fcfa/jour</b>)
                </label>
            </div>
        </div>
    );
}
