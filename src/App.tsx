import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Download, MapPinned, RadarIcon, Search, ShieldCheck } from "lucide-react";
import { FlavorRadar } from "./components/Radar";
import { families as initialFamilies, initialFoods } from "./data/foods";
import { productInformation } from "./lib/flavor";
import { exportFoodPdf } from "./lib/pdf";
import type { Food } from "./types";

type View = "ficha" | "mapa";

const selectedFoodStorageKey = "dop-espana:selected-food";
const activeViewStorageKey = "dop-espana:active-view";

const readStoredSelectedId = (foods: Food[]) => {
  const storedId = localStorage.getItem(selectedFoodStorageKey);
  return foods.some((food) => food.id === storedId) ? storedId : foods[0].id;
};

const readStoredView = (): View => {
  const storedView = localStorage.getItem(activeViewStorageKey);
  return storedView === "mapa" || storedView === "ficha" ? storedView : "ficha";
};

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#d7b56d;border:2px solid #101113;box-shadow:0 0 0 5px rgba(215,181,109,.18)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function App() {
  const [foods] = useState<Food[]>(initialFoods);
  const [selectedId, setSelectedId] = useState(() => readStoredSelectedId(initialFoods));
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("Todas");
  const [originFilter, setOriginFilter] = useState("Todos");
  const [intensityFilter, setIntensityFilter] = useState(10);
  const [activeView, setActiveView] = useState<View>(() => readStoredView());

  const selected = foods.find((food) => food.id === selectedId) ?? foods[0];
  const origins = Array.from(new Set(foods.map((food) => food.origen.region))).sort();
  const availableFamilies = useMemo(
    () => Array.from(new Set([...initialFamilies, ...foods.map((food) => food.familia)].filter(Boolean))).sort(),
    [foods],
  );

  const filteredFoods = useMemo(
    () =>
      foods.filter((food) => {
        const text = `${food.nombre} ${food.descripcion} ${food.familia} ${food.origen.region}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (familyFilter === "Todas" || food.familia === familyFilter) &&
          (originFilter === "Todos" || food.origen.region === originFilter) &&
          food.intensidad_sabor <= intensityFilter
        );
      }),
    [foods, query, familyFilter, originFilter, intensityFilter],
  );

  useEffect(() => {
    localStorage.setItem(selectedFoodStorageKey, selected.id);
  }, [selected.id]);

  useEffect(() => {
    localStorage.setItem(activeViewStorageKey, activeView);
  }, [activeView]);

  return (
    <main className="min-h-screen bg-graphite text-ink">
      <div className="mx-auto flex max-w-[1740px] flex-col gap-4 px-3 py-3 md:gap-5 md:px-5 md:py-5 xl:flex-row">
        <aside className="w-full shrink-0 rounded-lg border border-line bg-panel/95 shadow-premium xl:w-[350px]">
          <div className="border-b border-line p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold text-graphite">
                <ShieldCheck size={21} />
              </div>
              <div className="min-w-0">
                <h1 className="font-serif text-2xl leading-none">DOP España</h1>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/60 sm:tracking-[0.22em]">Consulta de denominaciones</p>
              </div>
            </div>

            <nav className="mt-5 grid grid-cols-2 gap-2">
              <NavButton view="ficha" active={activeView} onClick={setActiveView} icon={<RadarIcon size={15} />} label="Ficha" />
              <NavButton view="mapa" active={activeView} onClick={setActiveView} icon={<MapPinned size={15} />} label="Mapa" />
            </nav>

            <label className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-black/25 px-3 py-2">
              <Search size={16} className="text-white/60" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-white/45"
                placeholder="Buscar DOP, familia o region"
              />
            </label>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select className="input" value={familyFilter} onChange={(event) => setFamilyFilter(event.target.value)}>
                <option>Todas</option>
                {availableFamilies.map((family) => (
                  <option key={family}>{family}</option>
                ))}
              </select>
              <select className="input" value={originFilter} onChange={(event) => setOriginFilter(event.target.value)}>
                <option>Todos</option>
                {origins.map((origin) => (
                  <option key={origin}>{origin}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_78px] items-center gap-2 rounded-lg border border-line bg-black/20 px-3 py-2">
              <div>
                <p className="text-xs uppercase text-white/60">Intensidad maxima</p>
                <input
                  title="Intensidad maxima"
                  type="range"
                  min={1}
                  max={10}
                  value={intensityFilter}
                  onChange={(event) => setIntensityFilter(Number(event.target.value))}
                  className="mt-1 w-full accent-gold"
                />
              </div>
              <input
                title="Intensidad maxima"
                type="number"
                min={1}
                max={10}
                value={intensityFilter}
                onChange={(event) => setIntensityFilter(Number(event.target.value))}
                className="input"
              />
            </div>
          </div>

          <div className="flex max-h-[340px] gap-2 overflow-x-auto overflow-y-hidden p-3 scrollbar-thin xl:block xl:h-[calc(100vh-238px)] xl:max-h-none xl:overflow-y-auto xl:overflow-x-hidden">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedId(food.id)}
                className={`w-[260px] shrink-0 rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:bg-panelSoft xl:mb-2 xl:w-full ${
                  food.id === selected.id ? "border-gold bg-panelSoft shadow-lift" : "border-line bg-white/[0.035]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FoodThumbnail food={food} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{food.nombre}</p>
                    <p className="mt-1 truncate text-xs text-white/60">{food.familia}</p>
                    <p className="mt-1 truncate text-xs text-white/42">{food.origen.region}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {activeView === "ficha" && <FichaView selected={selected} />}
          {activeView === "mapa" && (
            <MapView foods={filteredFoods} selectedId={selected.id} setSelectedId={setSelectedId} setActiveView={setActiveView} />
          )}
        </section>
      </div>
    </main>
  );
}

function FichaView({ selected }: { selected: Food }) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const info = productInformation(selected.familia, selected.origen.region);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportFoodPdf(selected);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <section className="rounded-lg border border-line bg-panel shadow-premium">
      <div className="grid gap-5 p-4 md:p-6 lg:grid-cols-[330px_1fr] lg:gap-6">
        <div>
          <FoodImage food={selected} />

          <div className="mt-4 rounded-lg border border-line bg-black/35 p-4">
            <p className="text-xs uppercase text-white/60">Origen</p>
            <p className="mt-2 text-xl font-semibold text-gold">{selected.origen.region}</p>
            <p className="mt-1 text-sm text-white/65">{selected.origen.pais}</p>
            <div className="mt-4 rounded-lg border border-line bg-black/28 p-3 text-sm text-white/70">
              {selected.origen.lat.toFixed(4)}, {selected.origen.lng.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-3xl text-ink md:text-4xl">{selected.nombre}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-graphite">{selected.familia}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gold">Intensidad {selected.intensidad_sabor}/10</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              title="Descargar ficha en PDF"
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gold bg-gold px-3 text-sm font-semibold text-graphite transition hover:-translate-y-0.5 hover:bg-[#e5c47a] disabled:cursor-wait disabled:opacity-70"
            >
              <Download size={16} />
              <span>{isExportingPdf ? "Generando" : "PDF"}</span>
            </button>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="storyInput min-h-24">{selected.descripcion}</div>
              <div className="storyInput mt-3 min-h-24">{selected.procedencia}</div>
            </div>
            <div className="rounded-lg border border-line bg-black/14 p-4">
              <h2 className="sectionTitle">
                <RadarIcon size={18} /> Perfil de sabor de esta DOP
              </h2>
              <FlavorRadar foods={[selected]} />
            </div>
          </div>

          <div className="infoPanel mt-5">
            <h2 className="sectionTitle">Informacion de producto</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm leading-6 md:grid-cols-3">
              <InfoBlock title="Servicio" text={info.service} />
              <InfoBlock title="Tecnica" text={info.technique} />
              <InfoBlock title="Territorio" text={info.territory} />
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-line bg-black/14 p-4">
            <h2 className="sectionTitle">Vector sensorial</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(selected.perfil_sabor).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-line bg-black/28 p-3">
                  <span className="flex items-center justify-between text-xs uppercase text-white/60">
                    {key}
                    <strong className="text-gold">{value}</strong>
                  </span>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${value * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FoodImage({ food }: { food: Food }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = food.imagen && failedSrc !== food.imagen;

  return (
    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-line bg-panelSoft">
      {showImage ? (
        <img
          src={food.imagen}
          alt={food.nombre}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(food.imagen ?? null)}
        />
      ) : (
        <div className="grid h-full place-items-center px-5 text-center text-white/58">
          <div>
            <MapPinned className="mx-auto mb-3" />
            <p>Imagen pendiente</p>
            <p className="mt-2 text-xs leading-5 text-white/45">Anade la foto en public{food.imagen}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FoodThumbnail({ food }: { food: Food }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = food.imagen && failedSrc !== food.imagen;

  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-black/30 text-gold">
      {showImage ? (
        <img
          src={food.imagen}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(food.imagen ?? null)}
        />
      ) : (
        <MapPinned size={18} />
      )}
    </div>
  );
}

function MapView({
  foods,
  selectedId,
  setSelectedId,
  setActiveView,
}: {
  foods: Food[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  setActiveView: (view: View) => void;
}) {
  return (
    <section className="h-[72vh] min-h-[520px] rounded-lg border border-line bg-panel p-4 shadow-premium md:p-6 xl:h-[calc(100vh-40px)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl">Mapa DOP España</h2>
          <p className="mt-2 text-sm text-white/60">Consulta la distribucion territorial de las denominaciones visibles.</p>
        </div>
        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-sm text-gold">{foods.length} DOP visibles</span>
      </div>
      <div className="h-[calc(100%-132px)] sm:h-[calc(100%-92px)]">
        <MapContainer center={[40.2, -3.7]} zoom={6} minZoom={3} scrollWheelZoom>
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MarkerClusterGroup chunkedLoading>
            {foods.map((food) => (
              <Marker
                key={food.id}
                position={[food.origen.lat, food.origen.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedId(food.id);
                  },
                }}
              >
                <Popup>
                  <PopupImage food={food} />
                  <strong>{food.nombre}</strong>
                  <br />
                  {food.familia}
                  <br />
                  {food.origen.region}
                  <br />
                  {food.origen.lat.toFixed(4)}, {food.origen.lng.toFixed(4)}
                  <br />
                  <button
                    style={{ marginTop: 8, color: "#d7b56d" }}
                    onClick={() => {
                      setSelectedId(food.id);
                      setActiveView("ficha");
                    }}
                  >
                    Abrir ficha
                  </button>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </section>
  );
}

function PopupImage({ food }: { food: Food }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = food.imagen && failedSrc !== food.imagen;

  return (
    <div className="mb-2 h-24 w-44 overflow-hidden rounded-md border border-line bg-black/30 sm:w-48">
      {showImage ? (
        <img
          src={food.imagen}
          alt={food.nombre}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(food.imagen ?? null)}
        />
      ) : (
        <div className="grid h-full place-items-center text-gold">
          <MapPinned size={22} />
        </div>
      )}
    </div>
  );
}

function NavButton({ view, active, onClick, icon, label }: { view: View; active: View; onClick: (view: View) => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
        active === view ? "border-gold bg-gold text-graphite" : "border-line bg-white/5 text-white/75 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="infoBlock">
      <p className="text-xs uppercase text-gold">{title}</p>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}

export default App;
