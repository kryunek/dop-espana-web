# DOP España

Aplicacion de consulta para Denominaciones de Origen Protegidas, con ficha de producto, filtros y mapa territorial.

## Stack

- Tauri 2 para escritorio Windows
- React + TypeScript + Vite
- TailwindCSS
- SQLite + Prisma ORM
- Leaflet con clusters
- Recharts para radar de sabor

## Desarrollo

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run prisma:generate
npm.cmd run prisma:migrate -- --name init
npm.cmd run prisma:seed
npm.cmd run dev
```

La aplicacion queda disponible en `http://127.0.0.1:1420`.

Para ejecutar el contenedor de escritorio:

```powershell
npm.cmd run tauri dev
```

Necesitas Rust/Cargo instalado para compilar Tauri en Windows.

## Notas de arquitectura

- `src/App.tsx`: experiencia principal de consulta DOP con ficha y mapa.
- `src/data/foods.ts`: dataset inicial de DOP con familia, origen, coordenadas y perfil sensorial.
- `src/lib/flavor.ts`: calculo de intensidad y textos de informacion de producto.
- `src/components/Radar.tsx`: visualizacion del perfil sensorial.
- `prisma/schema.prisma`: modelo SQLite preparado para persistencia local.

## Imagenes DOP

Cada ficha busca su foto en `public/imagenes-dop` con el id de la DOP en formato `.jpg`.

Ejemplos:

- `public/imagenes-dop/calasparra.jpg`
- `public/imagenes-dop/pimenton-de-murcia.jpg`
- `public/imagenes-dop/queso-manchego.jpg`

Si el archivo no existe, la ficha muestra el nombre exacto de la ruta que falta.
