import type { Food, Recipe } from "../types";

const toBaseFactor = (unit: Food["unidad"], quantity: number) => {
  if (unit === "g") return quantity / 1000;
  return quantity;
};

const nutritionFactor = (unit: Food["unidad"], quantity: number) => {
  if (unit === "g") return quantity / 100;
  if (unit === "unidad") return quantity;
  return (quantity * 1000) / 100;
};

export const ingredientCost = (food: Food, quantity: number) =>
  toBaseFactor(food.unidad, quantity) * food.precio_por_unidad;

export const recipeCost = (recipe: Recipe, foods: Food[]) =>
  recipe.ingredientes.reduce((total, item) => {
    const food = foods.find((candidate) => candidate.id === item.foodId);
    return food ? total + ingredientCost(food, item.cantidad) : total;
  }, 0);

export const recipeCostPerServing = (recipe: Recipe, foods: Food[]) =>
  recipe.raciones > 0 ? recipeCost(recipe, foods) / recipe.raciones : 0;

export const suggestedPrice = (recipe: Recipe, foods: Food[]) => {
  const cost = recipeCostPerServing(recipe, foods);
  return recipe.margen > 0 ? cost / (1 - recipe.margen / 100) : cost;
};

export const recipeNutrition = (recipe: Recipe, foods: Food[]) =>
  recipe.ingredientes.reduce(
    (total, item) => {
      const food = foods.find((candidate) => candidate.id === item.foodId);
      if (!food) return total;

      const factor = nutritionFactor(food.unidad, item.cantidad);
      return {
        calorias: total.calorias + food.nutrientes.calorias * factor,
        proteinas: total.proteinas + food.nutrientes.proteinas * factor,
        grasas: total.grasas + food.nutrientes.grasas * factor,
        carbohidratos: total.carbohidratos + food.nutrientes.carbohidratos * factor,
      };
    },
    { calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0 },
  );
