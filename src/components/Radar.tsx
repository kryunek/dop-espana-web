import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Food } from "../types";

export function FlavorRadar({ foods }: { foods: Food[] }) {
  const data = ["dulce", "salado", "acido", "amargo", "umami", "grasa"].map((key) => {
    const row: Record<string, string | number> = { dimension: key };
    foods.forEach((food) => {
      row[food.nombre] = food.perfil_sabor[key as keyof typeof food.perfil_sabor];
    });
    return row;
  });

  const colors = ["#d7b56d", "#7ab8c8", "#dd7c6f"];

  return (
    <ResponsiveContainer width="100%" height={290}>
      <RadarChart data={data} outerRadius={105}>
        <PolarGrid stroke="rgba(255,255,255,0.16)" />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: "#d8d3c8", fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "#17191d",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#f4f1eb",
          }}
        />
        {foods.map((food, index) => (
          <Radar
            key={food.id}
            name={food.nombre}
            dataKey={food.nombre}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.18}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
