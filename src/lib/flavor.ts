import type { FlavorProfile } from "../types";

export const calculateFlavorIntensity = (profile: FlavorProfile) => {
  const values = Object.values(profile);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const peak = Math.max(...values);
  const activeDimensions = values.filter((value) => value >= 6).length;

  return Math.max(1, Math.min(10, Math.round(average * 0.58 + peak * 0.32 + activeDimensions * 0.7)));
};

export const productInformation = (family: string, region: string) => {
  const base: Record<string, { service: string; technique: string; pairing: string }> = {
    "Aceite de oliva virgen extra": {
      service: "Ideal para acabado, emulsiones, pilpil, marinados y servicio en crudo cuando interesa destacar territorio.",
      technique: "Conviene controlar amargor y picante, porque puede dominar pescados delicados o verduras dulces.",
      pairing: "Funciona con tomate, legumbre, pan, pescado blanco, cítricos, frutos secos y quesos frescos.",
    },
    Aceituna: {
      service: "Aporta salinidad, grasa vegetal y notas fermentadas; muy útil en aperitivos, fondos mediterráneos y guarniciones.",
      technique: "Debe equilibrarse con ácido o dulzor para que la salmuera no tape el plato.",
      pairing: "Combina con cítricos, hierbas, pescado azul, tomate, almendra y quesos curados.",
    },
    Arroz: {
      service: "Base neutra de alta absorción para fondos, sofritos, caldos concentrados y elaboraciones melosas o secas.",
      technique: "El punto depende de hidratación, reposo y concentración del caldo.",
      pairing: "Admite marisco, azafrán, setas, carnes blancas, verduras asadas y aceites aromáticos.",
    },
    Especia: {
      service: "Se usa como acento aromático y cromático; pequeñas dosis cambian por completo el perfil del plato.",
      technique: "Tostar o infusionar suavemente ayuda a liberar aroma sin generar notas quemadas.",
      pairing: "Encaja con arroces, guisos, aves, legumbres, lácteos y verduras dulces.",
    },
    "Fruto seco": {
      service: "Aporta textura, grasa noble y tostados; funciona en salsas, picadas, pralinés salados y acabados crujientes.",
      technique: "El tostado debe ser preciso para evitar amargor excesivo.",
      pairing: "Combina con quesos, miel, frutas, chocolate, carnes curadas y aceites verdes.",
    },
    Fruta: {
      service: "Introduce dulzor, acidez y frescor; puede usarse cruda, asada, fermentada, encurtida o reducida.",
      technique: "Su madurez cambia mucho la lectura del plato, especialmente acidez y textura.",
      pairing: "Acompaña quesos, carnes grasas, frutos secos, vinagres, mieles y hierbas.",
    },
    Queso: {
      service: "Producto de fuerte identidad territorial, útil como centro de plato, salsa, crema, relleno o afinado de umami.",
      technique: "Temperatura y oxigenación son clave; frío pierde aroma y grasa, exceso de calor separa la fase grasa.",
      pairing: "Se equilibra con miel, fruta, frutos secos, pan, vinagres suaves, jamón y verduras amargas.",
    },
    Miel: {
      service: "Endulza, glasea y redondea amargor; también aporta notas florales específicas del territorio.",
      technique: "Mejor añadir al final o en cocciones suaves para conservar aromas.",
      pairing: "Va con quesos, yogur, frutos secos, cítricos, carnes lacadas y especias.",
    },
    Vinagre: {
      service: "Herramienta de tensión ácida para levantar grasa, salinidad y sabores profundos.",
      technique: "Debe dosificarse al final o reducirse con cuidado para no volver agresivo el plato.",
      pairing: "Combina con aceites, verduras asadas, mariscos, escabeches, frutas y fondos oscuros.",
    },
  };

  const fallback = {
    service: "Producto de identidad territorial pensado para aportar carácter, trazabilidad y lectura gastronómica clara.",
    technique: "Su aplicación debe ajustarse a intensidad, textura, grasa, salinidad y punto de servicio.",
    pairing: "Conviene probarlo con productos de la misma región y con contrastes de acidez, grasa o umami.",
  };

  const info = base[family] ?? fallback;
  return {
    ...info,
    territory: `Su origen en ${region} condiciona estilo, disponibilidad y relato de carta.`,
  };
};
