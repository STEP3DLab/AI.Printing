import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Rocket,
  Factory,
  TrendingUp,
  Users,
  ShieldCheck,
  Timer,
  Cpu,
  Workflow,
  Wallet,
  Building2,
  MoveRight,
  GitBranch,
  MapPin,
  Calculator,
  Download,
  ChevronDown,
  Link as LinkIcon,
} from "lucide-react";

const Section: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({
  id,
  children,
  className = "",
}) => (
  <section id={id} className={`relative py-16 md:py-24 ${className}`}>
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/5" />
    <div className="container mx-auto max-w-7xl px-4 relative">{children}</div>
  </section>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border bg-white/60 backdrop-blur px-3 py-1 text-xs font-medium shadow-sm">
    {children}
  </span>
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/10 ${className}`}>{children}</div>
);

const H2: React.FC<{ kicker?: React.ReactNode; children: React.ReactNode }> = ({ children, kicker }) => (
  <div className="mb-10 text-center">
    {kicker && (
      <div className="mb-3 flex justify-center">
        <Badge>{kicker}</Badge>
      </div>
    )}
    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">{children}</h2>
  </div>
);

const marketSeries = [
  { year: 2024, global: 19.7, ru: 15 / 90 },
  { year: 2025, global: 24.0, ru: 20 / 90 },
  { year: 2026, global: 29.4, ru: 28 / 90 },
  { year: 2027, global: 35.9, ru: 46 / 90 },
  { year: 2028, global: 41.0, ru: 52 / 90 },
];

const competitor = [
  { name: "Shapeways (глобал)", scale: 95, risk: 70, capex: 80, ops: 55 },
  { name: "Локальные студии (РФ)", scale: 25, risk: 35, capex: 40, ops: 65 },
  { name: "Step3D.Мейкер (мы)", scale: 80, risk: 30, capex: 15, ops: 85 },
];

const techGrid = [
  {
    key: "FDM",
    title: "FDM",
    desc: "Доступная и быстрая. Лучшее для прототипов и бытовых изделий.",
    pros: ["низкая цена", "широкий выбор материалов"],
    cons: ["видимые слои", "анизотропия"],
  },
  {
    key: "SLA",
    title: "SLA",
    desc: "Высочайшая детализация и гладкая поверхность.",
    pros: ["точность", "гладкость"],
    cons: ["хрупкость", "постобработка"],
  },
  {
    key: "SLS",
    title: "SLS",
    desc: "Прочность и сложная геометрия без поддержек.",
    pros: ["прочность", "без поддержек"],
    cons: ["дороже", "шероховатость"],
  },
];

const roadmap = [
  {
    phase: "Фаза 1",
    period: "0–3 мес",
    items: ["MVP: Telegram‑бот + автокалькулятор STL", "10–20 FDM‑партнёров", "SLA 72 часа, QA‑конвейер"],
  },
  {
    phase: "Фаза 2",
    period: "4–9 мес",
    items: ["Сеть 50–100 принтеров", "Интеграции CDEK/Ozon, СБП", "Первая рекламная кампания"],
  },
  {
    phase: "Фаза 3",
    period: "10–18 мес",
    items: ["B2B + образование", "Добавление SLA/SLS", "3D‑моделирование как сервис"],
  },
];

const currency = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const COLORS = ["#4f46e5", "#e5e7eb", "#22c55e", "#ef4444", "#14b8a6"];

export const Step3DMakerInvestorSite: React.FC = () => {
  const [partners, setPartners] = useState(50);
  const [avgProfit, setAvgProfit] = useState(80000);
  const [commission, setCommission] = useState(15);
  const [segment, setSegment] = useState("B2B");

  const monthlyGMV = partners * avgProfit;
  const monthlyRevenue = Math.round(monthlyGMV * (commission / 100));
  const yearlyRevenue = monthlyRevenue * 12;

  const revenueSeries = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        month: i + 1,
        GMV: Math.round(monthlyGMV * (1 + 0.03 * i)),
        Revenue: Math.round(monthlyRevenue * (1 + 0.03 * i)),
      })),
    [monthlyGMV, monthlyRevenue],
  );

  const pieData = useMemo(
    () => [
      { name: "Комиссия", value: commission },
      { name: "Партнёрам", value: 100 - commission },
    ],
    [commission],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-800">
      <Section id="hero" className="pt-10 md:pt-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <Badge>
                <Rocket className="w-4 h-4" /> Step3D.Мейкер
              </Badge>
              <Badge>
                <ShieldCheck className="w-4 h-4" /> CapEx‑light
              </Badge>
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight">
              «Uber» для 3D‑печати:
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
                распределённая сеть и гарантии качества
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl">
              Платформа‑агрегатор 3D‑печати в РФ: объединяем мастеров, школы и студии в единую сеть с автоматической оценкой STL, SLA 72 часа и логистикой.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#model"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Инвест‑модель <MoveRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </a>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white ring-1 ring-slate-900/10 font-semibold hover:bg-slate-50"
              >
                Дорожная карта <GitBranch className="w-4 h-4" />
              </a>
              <a
                href="#sources"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white ring-1 ring-slate-900/10 font-semibold hover:bg-slate-50"
              >
                Источники <LinkIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-6 text-sm text-slate-500">MVP: Telegram‑бот • 10–20 FDM • QA‑конвейер • СБП/CDEK/Ozon</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Быстрый калькулятор юнит‑экономики</div>
                  <div className="text-2xl font-bold mt-1">{currency(monthlyRevenue)} / мес</div>
                </div>
                <Calculator className="w-10 h-10 text-indigo-600" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="text-sm text-slate-500">Партнёров (принтеров)</label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={partners}
                    onChange={(e) => setPartners(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <div className="font-semibold">{partners}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Прибыль партнёра, руб/мес</label>
                  <input
                    type="range"
                    min={40000}
                    max={120000}
                    step={5000}
                    value={avgProfit}
                    onChange={(e) => setAvgProfit(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <div className="font-semibold">{currency(avgProfit)}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Комиссия платформы, %</label>
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={commission}
                    onChange={(e) => setCommission(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <div className="font-semibold">{commission}%</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <div className="text-slate-500">GMV/мес</div>
                    <div className="text-lg font-bold">{currency(monthlyGMV)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <div className="text-slate-500">Выручка/год</div>
                    <div className="text-lg font-bold">{currency(yearlyRevenue)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueSeries}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => currency(value)} />
                      <Area type="monotone" dataKey="Revenue" stroke="#4f46e5" fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                        {pieData.map((entry, index) => (
                          <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section id="value">
        <H2 kicker={
          <>
            <TrendingUp className="w-4 h-4" /> Рост рынка
          </>
        }>
          Почему сейчас?
        </H2>
        <Card className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="global" name="Глобальный, $ млрд" stroke="#4f46e5" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="ru" name="РФ, $ млрд экв" stroke="#14b8a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Factory className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Распределённое производство и локализация</div>
                  <div className="text-slate-600">Уход глобальных вендоров создаёт вакуум — агрегатор объединяет локальные мощности без CapEx.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Кастомизация и мелкосерия</div>
                  <div className="text-slate-600">Экономически выгодные партии 2–500 шт: B2C сувениры/макеты, B2B прототипы/запчасти.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Контроль качества как UTP</div>
                  <div className="text-slate-600">Автопроверка STL → мониторинг печати → фото/видео‑верификация. SLA 72 часа.</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <Section id="segments">
        <H2 kicker={
          <>
            <Users className="w-4 h-4" /> Сегменты
          </>
        }>
          Кому мы продаём
        </H2>
        <div className="flex gap-2 justify-center mb-6">
          {["B2B", "B2C", "Образование"].map((s) => (
            <button
              key={s}
              onClick={() => setSegment(s)}
              className={`px-4 py-2 rounded-full border font-semibold transition ${
                segment === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className={`p-6 ${segment !== "B2B" ? "opacity-60" : ""}`}>
            <div className="text-sm text-slate-500">B2B / стартапы</div>
            <div className="text-xl font-bold mt-1">Быстрые прототипы и мелкосерия</div>
            <ul className="mt-3 space-y-2 text-slate-600 list-disc pl-5">
              <li>Сроки 72ч, стабильное качество</li>
              <li>Смета и накладные онлайн</li>
              <li>Доставка CDEK/Ozon</li>
            </ul>
          </Card>
          <Card className={`p-6 ${segment !== "B2C" ? "opacity-60" : ""}`}>
            <div className="text-sm text-slate-500">B2C / хобби</div>
            <div className="text-xl font-bold mt-1">Сувениры, кастом‑детали</div>
            <ul className="mt-3 space-y-2 text-slate-600 list-disc pl-5">
              <li>Загрузка STL в боте</li>
              <li>Автокалькулятор цены</li>
              <li>Поддержка материалов и цветов</li>
            </ul>
          </Card>
          <Card className={`p-6 ${segment !== "Образование" ? "opacity-60" : ""}`}>
            <div className="text-sm text-slate-500">Образование</div>
            <div className="text-xl font-bold mt-1">Макеты и STEM‑проекты</div>
            <ul className="mt-3 space-y-2 text-slate-600 list-disc pl-5">
              <li>Без необходимости владения парком</li>
              <li>Единые стандарты качества</li>
              <li>Спец. цены и отчётность</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section id="tech">
        <H2 kicker={
          <>
            <Cpu className="w-4 h-4" /> Технологии
          </>
        }>
          Инфографика по технологиям
        </H2>
        <div className="grid md:grid-cols-3 gap-6">
          {techGrid.map((t) => (
            <Card key={t.key} className="p-6">
              <div className="text-sm text-slate-500">Технология</div>
              <div className="text-xl font-bold mt-1">{t.title}</div>
              <div className="text-slate-600 mt-2">{t.desc}</div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <div className="font-semibold">Плюсы</div>
                  <ul className="mt-1 list-disc pl-5 text-slate-600 space-y-1">
                    {t.pros.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold">Минусы</div>
                  <ul className="mt-1 list-disc pl-5 text-slate-600 space-y-1">
                    {t.cons.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="competition">
        <H2 kicker={
          <>
            <Workflow className="w-4 h-4" /> Позиционирование
          </>
        }>
          Сравнение с конкурентами
        </H2>
        <Card className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competitor} outerRadius={120}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar name="Масштаб" dataKey="scale" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                  <Radar name="Риски" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  <Radar name="CapEx" dataKey="capex" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.1} />
                  <Radar name="Операционка" dataKey="ops" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> CapEx‑light модель (комиссия с существующих мощностей)
              </li>
              <li className="flex gap-3">
                <Timer className="w-5 h-5 text-indigo-600" /> SLA 72 часа + стандарты QA (автопроверка, мониторинг, верификация)
              </li>
              <li className="flex gap-3">
                <Wallet className="w-5 h-5 text-indigo-600" /> Мульти‑монетизация: комиссия, материалы, подписки партнёров
              </li>
            </ul>
          </div>
        </Card>
      </Section>

      <Section id="roadmap">
        <H2 kicker={
          <>
            <GitBranch className="w-4 h-4" /> План 18 мес
          </>
        }>
          Дорожная карта
        </H2>
        <div className="grid md:grid-cols-3 gap-6">
          {roadmap.map((r, idx) => (
            <Card key={r.phase} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">{r.phase}</div>
                  <div className="text-xl font-bold mt-1">{r.period}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {idx === 0 ? "MVP" : idx === 1 ? "Scale" : "Growth"}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-slate-700 list-disc pl-5">
                {r.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="model">
        <H2 kicker={
          <>
            <Calculator className="w-4 h-4" /> Финмодель
          </>
        }>
          Интерактивная модель доходов
        </H2>
        <Card className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-500 text-sm">GMV (мес)</div>
                  <div className="text-2xl font-bold">{currency(monthlyGMV)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-500 text-sm">Выручка (мес)</div>
                  <div className="text-2xl font-bold">{currency(monthlyRevenue)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-500 text-sm">Выручка (год)</div>
                  <div className="text-2xl font-bold">{currency(yearlyRevenue)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-500 text-sm">Комиссия</div>
                  <div className="text-2xl font-bold">{commission}%</div>
                </div>
              </div>
              <p className="text-slate-600">
                Доп. каналы: продажа материалов (маржа 10–15%), подписка для партнёров (приоритет + аналитика).
              </p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => currency(value)} />
                  <Legend />
                  <Bar dataKey="GMV" fill="#94a3b8" name="GMV" />
                  <Bar dataKey="Revenue" fill="#4f46e5" name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </Section>

      <Section id="cta" className="pb-10">
        <Card className="p-8 md:p-10 bg-gradient-to-r from-indigo-600 to-sky-500 text-white">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="text-white/80 text-sm">Готовность к запуску</div>
              <div className="text-2xl md:text-4xl font-extrabold mt-1">Ищем smart‑инвестиции для MVP и масштабирования</div>
              <p className="mt-3 text-white/90">
                Команда, партнёры и техбаза подготовлены. Фокус на финансовой дисциплине и операционной эффективности.
              </p>
            </div>
            <div className="flex md:justify-end gap-3">
              <a
                href="https://t.me/step_3d_mngr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold hover:opacity-90"
              >
                Связаться в Telegram <MoveRight className="w-5 h-5" />
              </a>
              <a
                href="#sources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 ring-1 ring-white/20 font-semibold hover:bg-white/5"
              >
                Источники <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
        </Card>
      </Section>

      <Section id="sources">
        <H2 kicker={
          <>
            <LinkIcon className="w-4 h-4" /> Достоверность
          </>
        }>
          Список ключевых источников
        </H2>
        <details className="group">
          <summary className="cursor-pointer list-none">
            <Card className="p-6 flex items-center justify-between hover:ring-indigo-300 transition">
              <div className="font-semibold">Показать/скрыть источники (31)</div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition" />
            </Card>
          </summary>
          <Card className="p-6 mt-4">
            <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-700">
              <li>Weldex 2025 — Обзор рынка аддитивных технологий</li>
              <li>IQB: Рынок 3D‑печати 2024</li>
              <li>Twize: Итоги 2024 и тренды 2025</li>
              <li>Техно 3D: Дефекты и решения</li>
              <li>3DIY: Основные проблемы печати</li>
              <li>Vektorus: Российские производители 3D‑принтеров</li>
              <li>Росатом: серия среднегабаритных принтеров</li>
              <li>3DMF: Запасные части</li>
              <li>Easy3DPrint: Мелкосерия</li>
              <li>3D Services: Серийная 3D‑печать</li>
              <li>Деловой профиль: Аналитика рынка</li>
              <li>IQB: 3D‑моделирование</li>
              <li>ИнженерГрупп: Моделирование</li>
              <li>ForgeLabs: Разбор Shapeways</li>
              <li>3DPrintus — онлайн‑сервис</li>
              <li>Lab3DPrint — цены</li>
              <li>Foliplast — услуги</li>
              <li>3DMall — фотополимеры</li>
              <li>Цветной Мир — идеи</li>
              <li>HF.ru — автозапчасти</li>
              <li>Vektorus — бизнес‑план</li>
              <li>ID Smart — 3D в обучении</li>
              <li>Цветной Мир — образование</li>
              <li>Top 3D Shop — обзор</li>
              <li>Globatek — 3D‑принтеры в образовании</li>
              <li>Formlabs — сравнение FDM/SLA/SLS</li>
              <li>Creality Cloud — удалённая печать</li>
              <li>Telegram API</li>
              <li>Ozon интеграции</li>
              <li>CDEK интеграции</li>
              <li>Сбербанк: e‑commerce API</li>
            </ol>
          </Card>
        </details>
      </Section>

      <footer className="py-10 text-center text-sm text-slate-500">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-semibold text-slate-700">Step3D.Мейкер</div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Москва
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" /> CapEx‑light • QA‑first • SLA 72ч
              </span>
            </div>
            <a className="underline decoration-dotted" href="https://t.me/step_3d_mngr" target="_blank" rel="noreferrer">
              Связаться
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Step3DMakerInvestorSite;
