export type FlavorProfile = {
  dulce: number;
  salado: number;
  acido: number;
  amargo: number;
  umami: number;
  grasa: number;
};

export type Nutrients = {
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  micronutrientes: Record<string, string | number>;
};

export type Origin = {
  pais: string;
  region: string;
  lat: number;
  lng: number;
};

export type Food = {
  id: string;
  nombre: string;
  descripcion: string;
  origen: Origin;
  procedencia: string;
  imagen?: string;
  familia: string;
  perfil_sabor: FlavorProfile;
  intensidad_sabor: number;
  combinaciones_relacionadas: string[];
  nutrientes: Nutrients;
  precio_por_unidad: number;
  unidad: "kg" | "g" | "litro" | "unidad";
};

export type RecommendationMode = "afinidad" | "contraste";

export type Recommendation = {
  food: Food;
  score: number;
  reasons: string[];
};

export type RecipeIngredient = {
  foodId: string;
  cantidad: number;
  unidad: Food["unidad"];
};

export type Recipe = {
  id: string;
  nombre: string;
  raciones: number;
  margen: number;
  ingredientes: RecipeIngredient[];
  pasos: string[];
};
