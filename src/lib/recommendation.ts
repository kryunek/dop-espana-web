import type { FlavorProfile, Food, Recommendation, RecommendationMode } from "../types";

const keys: (keyof FlavorProfile)[] = ["dulce", "salado", "acido", "amargo", "umami", "grasa"];

const euclidean = (a: FlavorProfile, b: FlavorProfile) =>
  Math.sqrt(keys.reduce((sum, key) => sum + Math.pow(a[key] - b[key], 2), 0));

const profileScore = (a: FlavorProfile, b: FlavorProfile, mode: RecommendationMode) => {
  const distance = euclidean(a, b);
  const maxDistance = Math.sqrt(keys.length * 100);
  const affinity = 1 - distance / maxDistance;
  return mode === "afinidad" ? affinity * 42 : (distance / maxDistance) * 42;
};

const ruleScore = (base: Food, candidate: Food) => {
  let score = 0;
  const reasons: string[] = [];
  const a = base.perfil_sabor;
  const b = candidate.perfil_sabor;

  if ((a.grasa >= 6 && b.acido >= 6) || (b.grasa >= 6 && a.acido >= 6)) {
    score += 14;
    reasons.push("el acido equilibra la grasa");
  }
  if ((a.amargo >= 6 && b.dulce >= 6) || (b.amargo >= 6 && a.dulce >= 6)) {
    score += 10;
    reasons.push("el dulce suaviza el amargor");
  }
  if ((a.umami >= 7 && b.salado >= 6) || (b.umami >= 7 && a.salado >= 6)) {
    score += 10;
    reasons.push("umami y salinidad se potencian");
  }
  if ((a.grasa >= 7 && candidate.intensidad_sabor >= 7) || (b.grasa >= 7 && base.intensidad_sabor >= 7)) {
    score += 7;
    reasons.push("la grasa transporta aromas intensos");
  }

  return { score, reasons };
};

export const recommendPairings = (
  base: Food,
  foods: Food[],
  mode: RecommendationMode = "afinidad",
  limit = 8,
): Recommendation[] =>
  foods
    .filter((food) => food.id !== base.id)
    .map((food) => {
      const profile = profileScore(base.perfil_sabor, food.perfil_sabor, mode);
      const rules = ruleScore(base, food);
      const sameCountry = base.origen.pais === food.origen.pais;
      const sameRegion = base.origen.region === food.origen.region;
      const geographic = sameRegion ? 12 : sameCountry ? 7 : 0;
      const intensityDelta = Math.abs(base.intensidad_sabor - food.intensidad_sabor);
      const intensity = intensityDelta > 6 ? -12 : 14 - intensityDelta * 2;
      const declared = base.combinaciones_relacionadas.includes(food.id) ? 15 : 0;
      const score = Math.max(0, Math.min(100, profile + rules.score + geographic + intensity + declared));
      const reasons = [
        ...rules.reasons,
        sameRegion ? "misma region gastronomica" : sameCountry ? "afinidad geografica nacional" : "",
        declared ? "relacion culinaria curada" : "",
        intensityDelta <= 2 ? "intensidades compatibles" : "",
      ].filter(Boolean);

      return { food, score: Math.round(score), reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

export const compareProfiles = (a: Food, b: Food) =>
  keys.map((key) => ({
    dimension: key,
    [a.nombre]: a.perfil_sabor[key],
    [b.nombre]: b.perfil_sabor[key],
  }));
