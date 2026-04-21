import { calculateFlavorIntensity } from "../lib/flavor";
import type { FlavorProfile, Food, Nutrients } from "../types";

type DopSeed = {
  name: string;
  family: string;
  region: string;
  lat: number;
  lng: number;
};

const DOP_SEEDS: DopSeed[] = [
  { name: "Calasparra", family: "Arroz", region: "Murcia / Castilla-La Mancha", lat: 38.23, lng: -1.7 },
  { name: "Pimentón de Murcia", family: "Especia", region: "Murcia", lat: 37.98, lng: -1.13 },
  { name: "Nueces de Nerpio", family: "Fruto seco", region: "Albacete", lat: 38.15, lng: -2.3 },
  { name: "Guijuelo", family: "Jamón ibérico", region: "Salamanca", lat: 40.56, lng: -5.67 },
  { name: "Jabugo", family: "Jamón ibérico", region: "Huelva", lat: 37.92, lng: -6.73 },
  { name: "Idiazabal", family: "Queso", region: "País Vasco / Navarra", lat: 43.0, lng: -2.15 },
  { name: "Aceite de Lucena", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.41, lng: -4.49 },
  { name: "Antequera", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.02, lng: -4.56 },
  { name: "Baena", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.62, lng: -4.32 },
  { name: "Estepa", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.29, lng: -4.88 },
  { name: "Montes de Granada", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.25, lng: -3.6 },
  { name: "Montoro-Adamuz", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 38.02, lng: -4.38 },
  { name: "Poniente de Granada", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.17, lng: -4.0 },
  { name: "Priego de Córdoba", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.44, lng: -4.2 },
  { name: "Sierra de Cádiz", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 36.75, lng: -5.81 },
  { name: "Sierra de Cazorla", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.91, lng: -3.0 },
  { name: "Sierra de Segura", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 38.18, lng: -2.75 },
  { name: "Sierra Mágina", family: "Aceite de oliva virgen extra", region: "Andalucía", lat: 37.73, lng: -3.47 },
  { name: "Aceituna Aloreña de Málaga", family: "Aceituna", region: "Andalucía", lat: 36.82, lng: -4.71 },
  { name: "Chirimoya de la Costa Tropical de Granada-Málaga", family: "Fruta", region: "Andalucía", lat: 36.74, lng: -3.69 },
  { name: "Pasas de Málaga", family: "Fruta desecada", region: "Andalucía", lat: 36.72, lng: -4.42 },
  { name: "Los Pedroches", family: "Jamón ibérico", region: "Andalucía", lat: 38.31, lng: -4.76 },
  { name: "Miel de Granada", family: "Miel", region: "Andalucía", lat: 37.18, lng: -3.6 },
  { name: "Vinagre de Jerez", family: "Vinagre", region: "Andalucía", lat: 36.69, lng: -6.14 },
  { name: "Vinagre de Montilla-Moriles", family: "Vinagre", region: "Andalucía", lat: 37.59, lng: -4.64 },
  { name: "Vinagre del Condado de Huelva", family: "Vinagre", region: "Andalucía", lat: 37.39, lng: -6.55 },
  { name: "Aceite del Bajo Aragón", family: "Aceite de oliva virgen extra", region: "Aragón", lat: 41.05, lng: -0.13 },
  { name: "Aceite del Somontano", family: "Aceite de oliva virgen extra", region: "Aragón", lat: 42.04, lng: 0.13 },
  { name: "Aceite Sierra del Moncayo", family: "Aceite de oliva virgen extra", region: "Aragón", lat: 41.88, lng: -1.72 },
  { name: "Melocotón de Calanda", family: "Fruta", region: "Aragón", lat: 40.94, lng: -0.23 },
  { name: "Cebolla Fuentes de Ebro", family: "Hortaliza", region: "Aragón", lat: 41.51, lng: -0.63 },
  { name: "Jamón de Teruel / Paleta de Teruel", family: "Jamón", region: "Aragón", lat: 40.34, lng: -1.11 },
  { name: "Afuega'l Pitu", family: "Queso", region: "Asturias", lat: 43.36, lng: -5.84 },
  { name: "Cabrales", family: "Queso", region: "Asturias", lat: 43.3, lng: -4.82 },
  { name: "Gamoneu / Gamonedo", family: "Queso", region: "Asturias", lat: 43.27, lng: -4.97 },
  { name: "Queso Casín", family: "Queso", region: "Asturias", lat: 43.18, lng: -5.35 },
  { name: "Sidra de Asturias / Sidra d'Asturies", family: "Sidra", region: "Asturias", lat: 43.46, lng: -5.44 },
  { name: "Aceite de Mallorca / Aceite mallorquín / Oli de Mallorca", family: "Aceite de oliva virgen extra", region: "Islas Baleares", lat: 39.57, lng: 2.65 },
  { name: "Aceituna de Mallorca / Aceituna Mallorquina / Oliva de Mallorca", family: "Aceituna", region: "Islas Baleares", lat: 39.75, lng: 2.86 },
  { name: "Pebre bord de Mallorca / Pimentón de Mallorca", family: "Especia", region: "Islas Baleares", lat: 39.62, lng: 3.01 },
  { name: "Miel de Ibiza / Mel d'Eivissa", family: "Miel", region: "Islas Baleares", lat: 38.91, lng: 1.43 },
  { name: "Mahón-Menorca", family: "Queso", region: "Islas Baleares", lat: 39.89, lng: 4.27 },
  { name: "Cochinilla de Canarias", family: "Colorante natural", region: "Canarias", lat: 28.1, lng: -15.43 },
  { name: "Papas Antiguas de Canarias", family: "Tubérculo", region: "Canarias", lat: 28.29, lng: -16.63 },
  { name: "Miel de Tenerife", family: "Miel", region: "Canarias", lat: 28.29, lng: -16.63 },
  { name: "Queso de Flor de Guía / Queso de Media Flor de Guía / Queso de Guía", family: "Queso", region: "Canarias", lat: 28.14, lng: -15.63 },
  { name: "Queso Majorero", family: "Queso", region: "Canarias", lat: 28.36, lng: -14.05 },
  { name: "Queso Palmero / Queso de La Palma", family: "Queso", region: "Canarias", lat: 28.68, lng: -17.76 },
  { name: "Miel de Liébana", family: "Miel", region: "Cantabria", lat: 43.15, lng: -4.62 },
  { name: "Picón Bejes-Tresviso", family: "Queso", region: "Cantabria", lat: 43.24, lng: -4.67 },
  { name: "Queso Nata de Cantabria", family: "Queso", region: "Cantabria", lat: 43.18, lng: -4.07 },
  { name: "Quesucos de Liébana", family: "Queso", region: "Cantabria", lat: 43.15, lng: -4.62 },
  { name: "Manzana Reineta del Bierzo", family: "Fruta", region: "Castilla y León", lat: 42.55, lng: -6.59 },
  { name: "Mantequilla de Soria", family: "Mantequilla", region: "Castilla y León", lat: 41.76, lng: -2.47 },
  { name: "Queso Zamorano", family: "Queso", region: "Castilla y León", lat: 41.5, lng: -5.74 },
  { name: "Aceite Campo de Calatrava", family: "Aceite de oliva virgen extra", region: "Castilla-La Mancha", lat: 38.98, lng: -3.93 },
  { name: "Aceite Campo de Montiel", family: "Aceite de oliva virgen extra", region: "Castilla-La Mancha", lat: 38.7, lng: -2.86 },
  { name: "Aceite de La Alcarria", family: "Aceite de oliva virgen extra", region: "Castilla-La Mancha", lat: 40.63, lng: -2.76 },
  { name: "Montes de Toledo", family: "Aceite de oliva virgen extra", region: "Castilla-La Mancha", lat: 39.71, lng: -4.23 },
  { name: "Azafrán de La Mancha", family: "Especia", region: "Castilla-La Mancha", lat: 39.28, lng: -3.1 },
  { name: "Miel de La Alcarria", family: "Miel", region: "Castilla-La Mancha", lat: 40.63, lng: -2.76 },
  { name: "Queso Manchego", family: "Queso", region: "Castilla-La Mancha", lat: 39.39, lng: -3.21 },
  { name: "Aceite de Terra Alta / Oli de Terra Alta", family: "Aceite de oliva virgen extra", region: "Cataluña", lat: 41.05, lng: 0.44 },
  { name: "Aceite del Baix Ebre-Montsià / Oli del Baix Ebre-Montsià", family: "Aceite de oliva virgen extra", region: "Cataluña", lat: 40.81, lng: 0.52 },
  { name: "Les Garrigues", family: "Aceite de oliva virgen extra", region: "Cataluña", lat: 41.53, lng: 0.86 },
  { name: "Oli de l'Empordà / Aceite de L'Empordà", family: "Aceite de oliva virgen extra", region: "Cataluña", lat: 42.27, lng: 2.96 },
  { name: "Siurana", family: "Aceite de oliva virgen extra", region: "Cataluña", lat: 41.26, lng: 1.03 },
  { name: "Arroz del Delta del Ebro / Arròs del Delta de l'Ebre", family: "Arroz", region: "Cataluña", lat: 40.72, lng: 0.72 },
  { name: "Pera de Lleida", family: "Fruta", region: "Cataluña", lat: 41.62, lng: 0.62 },
  { name: "Avellana de Reus", family: "Fruto seco", region: "Cataluña", lat: 41.15, lng: 1.11 },
  { name: "Fesols de Santa Pau", family: "Legumbre", region: "Cataluña", lat: 42.14, lng: 2.57 },
  { name: "Mongeta del Ganxet", family: "Legumbre", region: "Cataluña", lat: 41.62, lng: 2.29 },
  { name: "Mantequilla de l'Alt Urgell y la Cerdanya / Mantega de l'Alt Urgell i la Cerdanya", family: "Mantequilla", region: "Cataluña", lat: 42.36, lng: 1.46 },
  { name: "Queso de l'Alt Urgell y la Cerdanya", family: "Queso", region: "Cataluña", lat: 42.36, lng: 1.46 },
  { name: "Aceite Monterrubio", family: "Aceite de oliva virgen extra", region: "Extremadura", lat: 38.59, lng: -5.45 },
  { name: "Aceite Villuercas Ibores Jara", family: "Aceite de oliva virgen extra", region: "Extremadura", lat: 39.48, lng: -5.39 },
  { name: "Gata-Hurdes", family: "Aceite de oliva virgen extra", region: "Extremadura", lat: 40.32, lng: -6.47 },
  { name: "Pimentón de la Vera", family: "Especia", region: "Extremadura", lat: 40.12, lng: -5.6 },
  { name: "Cereza del Jerte", family: "Fruta", region: "Extremadura", lat: 40.22, lng: -5.75 },
  { name: "Dehesa de Extremadura", family: "Jamón ibérico", region: "Extremadura", lat: 39.47, lng: -6.37 },
  { name: "Miel Villuercas-Ibores", family: "Miel", region: "Extremadura", lat: 39.48, lng: -5.39 },
  { name: "Queso de Acehúche", family: "Queso", region: "Extremadura", lat: 39.8, lng: -6.63 },
  { name: "Queso de La Serena", family: "Queso", region: "Extremadura", lat: 38.92, lng: -5.8 },
  { name: "Queso Ibores", family: "Queso", region: "Extremadura", lat: 39.57, lng: -5.42 },
  { name: "Torta del Casar", family: "Queso", region: "Extremadura", lat: 39.56, lng: -6.42 },
  { name: "Pemento de Herbón", family: "Hortaliza", region: "Galicia", lat: 42.74, lng: -8.65 },
  { name: "Mejillón de Galicia / Mexillón de Galicia", family: "Molusco", region: "Galicia", lat: 42.43, lng: -8.65 },
  { name: "Arzúa-Ulloa", family: "Queso", region: "Galicia", lat: 42.93, lng: -8.16 },
  { name: "Cebreiro", family: "Queso", region: "Galicia", lat: 42.71, lng: -7.04 },
  { name: "Queso Tetilla / Queixo Tetilla", family: "Queso", region: "Galicia", lat: 42.88, lng: -8.54 },
  { name: "San Simón da Costa", family: "Queso", region: "Galicia", lat: 43.3, lng: -7.69 },
  { name: "Aceite de La Rioja", family: "Aceite de oliva virgen extra", region: "La Rioja", lat: 42.46, lng: -2.45 },
  { name: "Peras de Rincón de Soto", family: "Fruta", region: "La Rioja", lat: 42.23, lng: -1.85 },
  { name: "Nuez de Pedroso", family: "Fruto seco", region: "La Rioja", lat: 42.3, lng: -2.72 },
  { name: "Alubia de Anguiano", family: "Legumbre", region: "La Rioja", lat: 42.26, lng: -2.76 },
  { name: "Queso Camerano", family: "Queso", region: "La Rioja", lat: 42.17, lng: -2.58 },
  { name: "Aceite de Madrid", family: "Aceite de oliva virgen extra", region: "Madrid", lat: 40.23, lng: -3.75 },
  { name: "Pera de Jumilla", family: "Fruta", region: "Murcia", lat: 38.48, lng: -1.33 },
  { name: "Queso de Murcia", family: "Queso", region: "Murcia", lat: 37.99, lng: -1.13 },
  { name: "Queso de Murcia al vino", family: "Queso", region: "Murcia", lat: 37.99, lng: -1.13 },
  { name: "Aceite de Navarra", family: "Aceite de oliva virgen extra", region: "Navarra", lat: 42.52, lng: -1.67 },
  { name: "Pimientos del Piquillo de Lodosa", family: "Hortaliza", region: "Navarra", lat: 42.42, lng: -2.08 },
  { name: "Roncal", family: "Queso", region: "Navarra", lat: 42.81, lng: -0.96 },
  { name: "Arroz de Valencia / Arròs de València", family: "Arroz", region: "Comunidad Valenciana", lat: 39.35, lng: -0.32 },
  { name: "Granada Mollar de Elche / Granada de Elche", family: "Fruta", region: "Comunidad Valenciana", lat: 38.27, lng: -0.7 },
  { name: "Kaki Ribera del Xúquer", family: "Fruta", region: "Comunidad Valenciana", lat: 39.15, lng: -0.44 },
  { name: "Nísperos Callosa d'En Sarriá", family: "Fruta", region: "Comunidad Valenciana", lat: 38.65, lng: -0.12 },
  { name: "Uva de mesa embolsada del Vinalopó", family: "Fruta", region: "Comunidad Valenciana", lat: 38.38, lng: -0.77 },
  { name: "Chufa de Valencia / Xufa de València", family: "Tubérculo", region: "Comunidad Valenciana", lat: 39.55, lng: -0.36 },
  { name: "Alcachofa de Benicarló / Carxofa de Benicarló", family: "Hortaliza", region: "Comunidad Valenciana", lat: 40.42, lng: 0.42 },
];

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const profiles: Record<string, FlavorProfile> = {
  "Aceite de oliva virgen extra": { dulce: 1, salado: 0, acido: 1, amargo: 7, umami: 3, grasa: 10 },
  Aceituna: { dulce: 2, salado: 8, acido: 3, amargo: 5, umami: 5, grasa: 7 },
  Arroz: { dulce: 3, salado: 1, acido: 0, amargo: 0, umami: 2, grasa: 1 },
  Especia: { dulce: 3, salado: 1, acido: 1, amargo: 5, umami: 5, grasa: 1 },
  "Fruto seco": { dulce: 4, salado: 1, acido: 1, amargo: 3, umami: 4, grasa: 8 },
  Fruta: { dulce: 8, salado: 0, acido: 5, amargo: 1, umami: 1, grasa: 0 },
  "Fruta desecada": { dulce: 10, salado: 0, acido: 3, amargo: 1, umami: 2, grasa: 0 },
  Hortaliza: { dulce: 4, salado: 1, acido: 2, amargo: 3, umami: 4, grasa: 0 },
  "Jamón ibérico": { dulce: 3, salado: 8, acido: 1, amargo: 2, umami: 9, grasa: 8 },
  Jamón: { dulce: 2, salado: 7, acido: 1, amargo: 2, umami: 8, grasa: 6 },
  Legumbre: { dulce: 3, salado: 1, acido: 1, amargo: 1, umami: 4, grasa: 1 },
  Mantequilla: { dulce: 4, salado: 2, acido: 1, amargo: 1, umami: 3, grasa: 10 },
  Miel: { dulce: 10, salado: 0, acido: 2, amargo: 3, umami: 1, grasa: 0 },
  Molusco: { dulce: 3, salado: 7, acido: 1, amargo: 1, umami: 9, grasa: 2 },
  Queso: { dulce: 2, salado: 6, acido: 3, amargo: 3, umami: 8, grasa: 7 },
  Sidra: { dulce: 4, salado: 0, acido: 7, amargo: 2, umami: 1, grasa: 0 },
  Tubérculo: { dulce: 4, salado: 1, acido: 1, amargo: 1, umami: 3, grasa: 0 },
  Vinagre: { dulce: 3, salado: 1, acido: 10, amargo: 2, umami: 3, grasa: 0 },
  "Colorante natural": { dulce: 1, salado: 0, acido: 0, amargo: 2, umami: 1, grasa: 0 },
};

const nutrients: Record<string, Nutrients> = {
  "Aceite de oliva virgen extra": { calorias: 884, proteinas: 0, grasas: 100, carbohidratos: 0, micronutrientes: { principal: "polifenoles" } },
  Aceituna: { calorias: 239, proteinas: 2, grasas: 22, carbohidratos: 6, micronutrientes: { principal: "oleuropeína" } },
  Arroz: { calorias: 354, proteinas: 7, grasas: 1, carbohidratos: 80, micronutrientes: { principal: "almidón" } },
  Especia: { calorias: 300, proteinas: 12, grasas: 6, carbohidratos: 55, micronutrientes: { principal: "carotenoides" } },
  "Fruto seco": { calorias: 620, proteinas: 16, grasas: 60, carbohidratos: 15, micronutrientes: { principal: "vitamina E" } },
  Fruta: { calorias: 58, proteinas: 1, grasas: 0.3, carbohidratos: 14, micronutrientes: { principal: "vitamina C" } },
  "Fruta desecada": { calorias: 299, proteinas: 3, grasas: 0.5, carbohidratos: 79, micronutrientes: { principal: "potasio" } },
  Hortaliza: { calorias: 32, proteinas: 1.5, grasas: 0.2, carbohidratos: 7, micronutrientes: { principal: "fibra" } },
  "Jamón ibérico": { calorias: 375, proteinas: 43, grasas: 22, carbohidratos: 0, micronutrientes: { principal: "hierro" } },
  Jamón: { calorias: 280, proteinas: 31, grasas: 16, carbohidratos: 0, micronutrientes: { principal: "B12" } },
  Legumbre: { calorias: 340, proteinas: 21, grasas: 2, carbohidratos: 60, micronutrientes: { principal: "folato" } },
  Mantequilla: { calorias: 717, proteinas: 1, grasas: 81, carbohidratos: 1, micronutrientes: { principal: "vitamina A" } },
  Miel: { calorias: 304, proteinas: 0, grasas: 0, carbohidratos: 82, micronutrientes: { principal: "polifenoles" } },
  Molusco: { calorias: 86, proteinas: 12, grasas: 2, carbohidratos: 4, micronutrientes: { principal: "yodo" } },
  Queso: { calorias: 390, proteinas: 25, grasas: 31, carbohidratos: 2, micronutrientes: { principal: "calcio" } },
  Sidra: { calorias: 49, proteinas: 0, grasas: 0, carbohidratos: 4, micronutrientes: { principal: "ácidos orgánicos" } },
  Tubérculo: { calorias: 77, proteinas: 2, grasas: 0.1, carbohidratos: 17, micronutrientes: { principal: "potasio" } },
  Vinagre: { calorias: 88, proteinas: 0, grasas: 0, carbohidratos: 17, micronutrientes: { principal: "ácido acético" } },
  "Colorante natural": { calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0, micronutrientes: { principal: "ácido carmínico" } },
};

const unitFor = (family: string): Food["unidad"] => {
  if (family.includes("Aceite") || family === "Sidra" || family === "Vinagre") return "litro";
  return "kg";
};

const priceFor = (family: string) => {
  if (family.includes("Aceite")) return 18;
  if (family.includes("Jamón")) return 90;
  if (family === "Queso") return 24;
  if (family === "Especia") return 65;
  if (family === "Miel") return 14;
  if (family === "Molusco") return 8;
  if (family === "Fruto seco") return 18;
  if (family === "Vinagre") return 16;
  return 6;
};

const detailFor = (family: string) => {
  if (family.includes("Aceite")) {
    return {
      product: "aceite de oliva virgen extra",
      traits: "Se reconoce por su grasa limpia, notas vegetales y un equilibrio que puede ir de suave a amargo y picante segun la zona y la variedad de aceituna.",
      territory: "Su identidad nace del olivar, del clima y de las practicas de molturacion que protegen la calidad del aceite.",
    };
  }
  if (family === "Aceituna") {
    return {
      product: "aceituna de mesa",
      traits: "Destaca por su punto salino, textura carnosa y matices vegetales, con curaciones que refuerzan su caracter mediterraneo.",
      territory: "La variedad, el calibre y el modo de aderezo estan ligados a la tradicion local de su zona protegida.",
    };
  }
  if (family === "Arroz") {
    return {
      product: "arroz",
      traits: "Es un producto de grano definido, valorado por su absorcion de caldo, su textura y su comportamiento en cocina.",
      territory: "El cultivo depende del agua, el suelo y las practicas agrarias que dan personalidad al cereal protegido.",
    };
  }
  if (family === "Especia") {
    return {
      product: "especia",
      traits: "Aporta color, aroma y profundidad, con un perfil concentrado que permite identificar con rapidez su origen culinario.",
      territory: "El secado, la seleccion y la transformacion local son claves para fijar su calidad diferenciada.",
    };
  }
  if (family === "Fruto seco") {
    return {
      product: "fruto seco",
      traits: "Presenta textura crujiente, grasa natural y notas tostadas o dulces que lo hacen reconocible en degustacion.",
      territory: "La altitud, el secano y la seleccion varietal influyen en el calibre y en la intensidad de sabor.",
    };
  }
  if (family === "Fruta") {
    return {
      product: "fruta",
      traits: "Se aprecia por su dulzor, acidez, aroma y punto de maduracion, rasgos que cambian con el microclima de produccion.",
      territory: "La zona protegida condiciona calendario, variedades admitidas y caracter organoleptico.",
    };
  }
  if (family === "Fruta desecada") {
    return {
      product: "fruta desecada",
      traits: "Concentra dulzor, aroma y textura flexible gracias al proceso de secado tradicional.",
      territory: "El metodo de deshidratacion y el clima de la zona explican buena parte de su personalidad.",
    };
  }
  if (family === "Hortaliza") {
    return {
      product: "hortaliza",
      traits: "Combina frescor vegetal, textura definida y un sabor que puede ir de dulce a ligeramente amargo o picante.",
      territory: "Las condiciones de huerta, suelo y manejo agricola son esenciales para su calidad protegida.",
    };
  }
  if (family.includes("Jam")) {
    return {
      product: family.includes("iber") ? "jamon iberico" : "jamon curado",
      traits: "Ofrece aroma curado, salinidad equilibrada, textura firme y una persistencia intensa en boca.",
      territory: "La raza, la alimentacion, el clima de secado y la curacion lenta vinculan el producto con su paisaje de origen.",
    };
  }
  if (family === "Legumbre") {
    return {
      product: "legumbre",
      traits: "Interesa por su piel fina, textura mantecosa y capacidad para mantener forma y sabor tras la coccion.",
      territory: "El suelo, la semilla tradicional y el clima de cultivo influyen en su comportamiento culinario.",
    };
  }
  if (family === "Mantequilla") {
    return {
      product: "mantequilla",
      traits: "Aporta untuosidad, notas lacticas y un perfil graso delicado, muy ligado a la calidad de la leche.",
      territory: "La ganaderia, los pastos y el saber hacer local explican su singularidad.",
    };
  }
  if (family === "Miel") {
    return {
      product: "miel",
      traits: "Expresa aromas florales o de monte, dulzor persistente y una textura marcada por su origen botanico.",
      territory: "La flora disponible y la trashumancia apicola dan identidad a cada zona protegida.",
    };
  }
  if (family === "Molusco") {
    return {
      product: "molusco",
      traits: "Tiene sabor marino, textura jugosa y una intensidad umami que refleja la calidad de las aguas de cria.",
      territory: "Las rias, bateas y condiciones oceanograficas son determinantes en su crianza.",
    };
  }
  if (family === "Queso") {
    return {
      product: "queso",
      traits: "Combina leche, sal, fermentacion y maduracion para crear aromas lacticos, textura propia y persistencia en boca.",
      territory: "La raza ganadera, los pastos, la leche y la maduracion local sostienen su identidad protegida.",
    };
  }
  if (family === "Sidra") {
    return {
      product: "sidra",
      traits: "Presenta acidez, frescor y aromas de manzana, con una elaboracion muy vinculada al lagar.",
      territory: "Las variedades de manzana y la cultura sidrera de la zona condicionan su perfil.",
    };
  }
  if (family.includes("Tub")) {
    return {
      product: "tuberculo",
      traits: "Destaca por su textura, sabor terroso y capacidad para expresar diferencias de variedad y suelo.",
      territory: "La altitud, el clima y las formas tradicionales de cultivo refuerzan su diferenciacion.",
    };
  }
  if (family === "Vinagre") {
    return {
      product: "vinagre",
      traits: "Aporta acidez, aromas de crianza y una complejidad que depende del vino base y del envejecimiento.",
      territory: "La cultura vinicola de la zona y los sistemas de crianza marcan su personalidad.",
    };
  }
  if (family === "Colorante natural") {
    return {
      product: "colorante natural",
      traits: "Se valora por su capacidad colorante y por una elaboracion especializada de uso alimentario.",
      territory: "Su singularidad procede del manejo local de la materia prima y de su transformacion.",
    };
  }
  return {
    product: family.toLowerCase(),
    traits: "Es un alimento protegido por su calidad diferenciada y por una elaboracion vinculada a su territorio.",
    territory: "La zona de produccion y las practicas locales explican su caracter.",
  };
};

const descriptionFor = (seed: DopSeed) => {
  const detail = detailFor(seed.family);
  return `${seed.name} es una DOP de ${detail.product} situada en ${seed.region}. ${detail.traits}`;
};

const originFor = (seed: DopSeed) => {
  const detail = detailFor(seed.family);
  return `${detail.territory} Esta ficha resume su categoria, localizacion y perfil sensorial para consulta rapida dentro del catalogo DOP.`;
};

export const initialFoods: Food[] = DOP_SEEDS.map((seed, index) => {
  const profile = profiles[seed.family];
  const id = slug(seed.name);
  return {
    id,
    nombre: `DOP ${seed.name}`,
    descripcion: descriptionFor(seed),
    origen: { pais: "España", region: seed.region, lat: seed.lat, lng: seed.lng },
    procedencia: originFor(seed),
    imagen: publicAsset(`/imagenes-dop/${id}.jpg`),
    familia: seed.family,
    perfil_sabor: profile,
    intensidad_sabor: calculateFlavorIntensity(profile),
    combinaciones_relacionadas: [],
    nutrientes: nutrients[seed.family],
    precio_por_unidad: priceFor(seed.family) + (index % 5),
    unidad: unitFor(seed.family),
  };
});

export const families = Array.from(new Set(initialFoods.map((food) => food.familia))).sort();
