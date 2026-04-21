import { PrismaClient } from "@prisma/client";
import { initialFoods } from "../src/data/foods";

const prisma = new PrismaClient();

async function main() {
  for (const food of initialFoods) {
    await prisma.food.upsert({
      where: { id: food.id },
      update: {
        nombre: food.nombre,
        descripcion: food.descripcion,
        pais: food.origen.pais,
        region: food.origen.region,
        lat: food.origen.lat,
        lng: food.origen.lng,
        procedencia: food.procedencia,
        imagen: food.imagen,
        familia: food.familia,
        dulce: food.perfil_sabor.dulce,
        salado: food.perfil_sabor.salado,
        acido: food.perfil_sabor.acido,
        amargo: food.perfil_sabor.amargo,
        umami: food.perfil_sabor.umami,
        grasa: food.perfil_sabor.grasa,
        intensidad: food.intensidad_sabor,
        calorias: food.nutrientes.calorias,
        proteinas: food.nutrientes.proteinas,
        grasas: food.nutrientes.grasas,
        carbohidratos: food.nutrientes.carbohidratos,
        micronutrientes: food.nutrientes.micronutrientes,
        price: {
          upsert: {
            create: { precioPorUnidad: food.precio_por_unidad, unidad: food.unidad },
            update: { precioPorUnidad: food.precio_por_unidad, unidad: food.unidad },
          },
        },
      },
      create: {
        id: food.id,
        nombre: food.nombre,
        descripcion: food.descripcion,
        pais: food.origen.pais,
        region: food.origen.region,
        lat: food.origen.lat,
        lng: food.origen.lng,
        procedencia: food.procedencia,
        imagen: food.imagen,
        familia: food.familia,
        dulce: food.perfil_sabor.dulce,
        salado: food.perfil_sabor.salado,
        acido: food.perfil_sabor.acido,
        amargo: food.perfil_sabor.amargo,
        umami: food.perfil_sabor.umami,
        grasa: food.perfil_sabor.grasa,
        intensidad: food.intensidad_sabor,
        calorias: food.nutrientes.calorias,
        proteinas: food.nutrientes.proteinas,
        grasas: food.nutrientes.grasas,
        carbohidratos: food.nutrientes.carbohidratos,
        micronutrientes: food.nutrientes.micronutrientes,
        price: { create: { precioPorUnidad: food.precio_por_unidad, unidad: food.unidad } },
      },
    });

    for (const targetId of food.combinaciones_relacionadas) {
      await prisma.pairing.upsert({
        where: { baseId_targetId: { baseId: food.id, targetId } },
        update: {},
        create: { baseId: food.id, targetId },
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
