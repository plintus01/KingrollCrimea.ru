import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "./utils/cn";
import {
  CATS,
  CITY,
  DISHES,
  HOURS,
  PHONE_PRETTY,
  PHONE_TEL,
  dishById,
  rub,
  type Cat,
  type Dish,
} from "./data";

const OPEN = 11 * 60;
const CLOSE = 23 * 60;

function cityParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Simferopol",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(pick("hour") || "0");
  const minute = Number(pick("minute") || "0");
  return { mins: hour * 60 + minute, clock: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` };
}

function useCityClock() {
  const [now, setNow] = useState(() => cityParts());
  useEffect(() => {
    const id = window.setInterval(() => setNow(cityParts()), 20000);
    return () => window.clearInterval(id);
  }, []);
  return { open: now.mins >= OPEN && now.mins < CLOSE, clock: now.clock };
}

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.2 3.5h2.6l1.5 4.2-1.8 1.1a12.2 12.2 0 0 0 5.7 5.7l1.1-1.8 4.2 1.5v2.6c0 .9-.8 1.8-1.8 1.8C9.8 18.6 5.4 14.2 5.4 5.3c0-1 .8-1.8 1.8-1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const pic = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const UNIQUE: Record<string, string> = {
  king: pic(8951172),
  "gold-dragon": pic(17584444),
  "black-dragon": pic(1893568),
  "red-dragon": pic(10692516),
  rainbow: pic(34759445),
  "yin-yang": pic(28291549),
  "unagi-kappa": pic(20570602),
  "ebi-tempura": pic(10692538),
  "light-cheese": pic(10692480),
  "sake-cheese": pic(10692527),
  "kani-cheese": pic(10692504),
  phila: pic(8951176),
  "phila-classic": pic(8951243),
  "phila-light": pic(5678887),
  "phila-eel": pic(12659888),
  "phila-tuna": pic(10692481),
  "phila-tiger": pic(38100809),
  "phila-bacon": pic(20732269),
  "cali-salmon": pic(10692528),
  "cali-salmon-cheese": pic(1148084),
  "cali-eel": pic(34759444),
  "cali-eel-cheese": pic(12659890),
  "cali-snow": pic(10692543),
  "cali-snow-cheese": pic(13336540),
  "cali-tiger": pic(38100794),
  "cali-tiger-cheese": pic(18891321),
  "cali-tuna": pic(30557704),
  "baked-phila": pic(10692480),
  "baked-tuna": pic(37356446),
  "baked-eel": pic(17584445),
  "baked-tiger": pic(38100794),
  "baked-salmon": pic(32482529),
  "baked-snow": pic(8951498),
  "fried-tuna": pic(11064614),
  "fried-eel": pic(17584441),
  "fried-tiger": pic(17584436),
  "fried-salmon": pic(15433933),
  "fried-crab": "/images/fried-roll.jpg",
  "maki-tiger": pic(12878170),
  "maki-tuna": pic(12878167),
  "maki-eel": pic(32482528),
  "maki-light": pic(10360196),
  "maki-salmon": pic(20157983),
  "maki-tobiko": pic(20570601),
  "maki-crab": pic(28291550),
  "maki-chuka": pic(7719908),
  "maki-takuan": pic(10692510),
  "maki-cucumber": pic(10692532),
  mega: "/images/mega-set.jpg",
  "set-ny": pic(28701159),
  "set-house": "/images/set.jpg",
  "king-set": pic(31264149),
  "set-phila-2": pic(12659892),
  "set-maki-2": pic(3147493),
  "set-baked": pic(1893568),
  "set-fried": pic(10692538),
  "set-phila-1": pic(26579723),
  "set-cali-1": pic(31415302),
  "set-cali-2": pic(28701152),
  "set-maki-1": pic(12878171),
  "set-student": pic(28574963),
  "soba-beef": pic(7715477),
  "soba-eel": pic(24186433),
  "soba-tiger": pic(19264271),
  "soba-salmon": pic(30506291),
  "soba-sea": pic(37261910),
  "soba-chicken": pic(31393431),
  "soba-veg": pic(2456435),
  "udon-beef": pic(1907229),
  "udon-sea": "/images/noodles.jpg",
  "udon-eel": pic(31321820),
  "udon-tiger": "https://images.pexels.com/photos/6646353/pexels-photo-6646353.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "udon-salmon": pic(31321825),
  "udon-chicken": pic(31393433),
  "udon-veg": pic(36701464),
  "fun-eel": pic(10692546),
  "fun-shrimp": pic(7474163),
  "fun-beef": pic(30136632),
  "fun-chicken": pic(1028734),
  "fun-mushroom": pic(28354426),
  "shrimp-batter": pic(17628583),
  wings: pic(6941027),
  "cheese-sticks": "https://images.pexels.com/photos/32916221/pexels-photo-32916221.jpeg?auto=compress&cs=tinysrgb&w=1600",
  nuggets: "https://images.pexels.com/photos/18188572/pexels-photo-18188572.jpeg?auto=compress&cs=tinysrgb&w=1600",
  chuka: pic(1893563),
  fries: pic(39851023),
  wedges: pic(5041473),
  extra: pic(31415302),
};

function shotFor(id?: string, _cat?: string, fallback?: string) {
  if (id && UNIQUE[id]) return UNIQUE[id];
  return fallback || "/images/set.jpg";
}

function partImage(id?: string, fallback?: string) {
  return shotFor(id, undefined, (id ? dishById(id)?.image : undefined) || fallback);
}

function Img({ src, alt = "", className, style }: { src: string; alt?: string; className?: string; style?: CSSProperties }) {
  const [broken, setBroken] = useState(false);
  const finalSrc = broken ? "/images/set.jpg" : src;
  return <img src={finalSrc} alt={alt} className={className} style={style} loading="lazy" onError={() => setBroken(true)} />;
}

function SetPlate({ dish }: { dish: Dish }) {
  const parts = dish.includes ?? [];
  const n = parts.length;
  const slices: { src: string; x: number; y: number; size: number }[] = [];

  const ring = (list: typeof parts, count: number, radius: number, size: number, offset: number) => {
    list.slice(0, count).forEach((part, i) => {
      const a = (i / count) * Math.PI * 2 + offset;
      slices.push({
        src: partImage(part.id, dish.image),
        x: 50 + Math.cos(a) * radius - size / 2,
        y: 50 + Math.sin(a) * radius - size / 2,
        size,
      });
    });
  };

  if (n <= 5) {
    ring(parts, n, 30, 40, -Math.PI / 2);
  } else if (n <= 8) {
    ring(parts, n, 33, 31, -Math.PI / 2);
  } else {
    const outerCount = n - 3;
    ring(parts.slice(0, 3), 3, 15, 22, Math.PI / 6);
    ring(parts.slice(3), outerCount, 35, 26, -Math.PI / 2);
  }

  return (
    <span className="set-plate" aria-hidden="true">
      <span className="set-plate-dish" />
      <span className="set-plate-area">
        {slices.map((s, i) => (
          <span
            key={`${s.src}-${i}`}
            className="roll-slice"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}%`,
              height: `${s.size}%`,
              backgroundImage: `url(${s.src})`,
              animationDelay: `${Math.min(i, 12) * 0.06}s`,
            }}
          />
        ))}
      </span>
    </span>
  );
}

function CallLink({ label = "Позвонить", className = "btn-gold" }: { label?: string; className?: string }) {
  return (
    <a className={className} href={`tel:${PHONE_TEL}`}>
      <IconPhone />
      <span className="btn-stack">
        <small>{label}</small>
        {PHONE_PRETTY}
      </span>
    </a>
  );
}

function KnifeCut({ flip = false }: { flip?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className={cn("knife-cut", inView && "in")} aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
        <polygon points={flip ? "0,0 1440,70 1440,100 0,100" : "0,100 0,70 1440,0 1440,100"} fill="#090807" />
        <line
          x1="0"
          y1={flip ? 8 : 78}
          x2="1440"
          y2={flip ? 78 : 8}
          stroke="#e0c48a"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = window.innerWidth / 2;
    let y = 80;
    let cx = x;
    let cy = y;
    let raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(-8deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);
  return <div ref={ref} className="cursor-blade" aria-hidden="true" />;
}

const MARQUEE = `KING ROLL  ·  ${CITY.toUpperCase()}  ·  11:00—23:00  ·  ${PHONE_PRETTY}  ·  БЕЗУМНО ОГРОМНЫЙ ВЫБОР  ·  МЕНЮ  ·  `;

function HugeChoice() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = 1 - (rect.top + rect.height * 0.25) / (window.innerHeight + rect.height * 0.4);
      setP(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <section ref={ref} className="huge" id="choice" style={{ "--p": p } as CSSProperties}>
      <div className="huge-drift" aria-hidden="true">
        МЕНЮ · МЕНЮ · МЕНЮ · МЕНЮ · МЕНЮ ·
      </div>
      <span className="orb orb-a" aria-hidden="true" />
      <span className="orb orb-b" aria-hidden="true" />
      <div className="huge-inner">
        <p className="huge-kicker">меню дома</p>
        <h2>
          <span>Безумно</span>
          <span>огромный</span>
          <span className="gold">выбор</span>
        </h2>
        <p className="huge-menu">МЕНЮ</p>
        <p className="huge-sub">{DISHES.length} позиций · суши, роллы, сеты, лапша — и всё это по одному звонку</p>
      </div>
      <div className="huge-marquee" aria-hidden="true">
        <div>
          <span>БЕЗУМНО ОГРОМНЫЙ ВЫБОР · МЕНЮ · СУШИ · РОЛЛЫ · СЕТЫ · ЛАПША · </span>
          <span>БЕЗУМНО ОГРОМНЫЙ ВЫБОР · МЕНЮ · СУШИ · РОЛЛЫ · СЕТЫ · ЛАПША · </span>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { open, clock } = useCityClock();
  const [phase, setPhase] = useState<"draw" | "cut" | "done">(() => {
    if (typeof window === "undefined") return "draw";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "done";
    if (sessionStorage.getItem("kr-intro")) return "done";
    return "draw";
  });
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [cat, setCat] = useState<"all" | Cat>("all");
  const [cutting, setCutting] = useState(false);
  const [railPos, setRailPos] = useState(0);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const craft = useInView<HTMLElement>(0.2);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    if (phase === "done") {
      sessionStorage.setItem("kr-intro", "1");
      return;
    }
    const a = window.setTimeout(() => setPhase("cut"), 1150);
    const b = window.setTimeout(() => setPhase("done"), 2150);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [phase]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen || activeId || phase !== "done" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen, activeId, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveId(null);
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const mid = window.innerWidth / 2;
      rail.querySelectorAll<HTMLElement>(".sign-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.classList.toggle("is-cut", Math.abs(r.left + r.width / 2 - mid) < r.width * 0.42);
      });
      const max = rail.scrollWidth - rail.clientWidth;
      setRailPos(max > 4 ? rail.scrollLeft / max : 1);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const featured = DISHES.filter((d) => d.featured);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISHES.filter((d) => {
      if (cat !== "all" && d.cat !== cat) return false;
      if (!q) return true;
      return `${d.name} ${d.kicker} ${d.lore}`.toLowerCase().includes(q);
    });
  }, [cat, query]);
  const active = DISHES.find((d) => d.id === activeId);

  const chooseCat = (id: "all" | Cat) => {
    setCat(id);
    setCutting(true);
    window.setTimeout(() => setCutting(false), 480);
  };

  const openDish = (dish: Dish) => setActiveId(dish.id);

  return (
    <div className={cn("page", phase !== "draw" && "is-live")}>
      <div className="progress" style={{ width: `${progress}%` }} />
      <Cursor />

      {phase !== "done" && (
        <div className={cn("intro", phase === "cut" && "is-cut")}>
          <div className="intro-top" />
          <div className="intro-bot" />
          <div className="intro-seam" />
          <div className="intro-brand">
            <div>
              <img src="/images/emblem.png" alt="" />
              <strong>KING ROLL</strong>
              <em>{CITY}</em>
            </div>
          </div>
          <button className="intro-skip" type="button" onClick={() => setPhase("done")}>
            Пропустить
          </button>
        </div>
      )}

      <header className={cn("nav", (scrolled || navOpen) && "is-on", navOpen && "is-open")}>
        <a className="brand" href="#top" onClick={() => setNavOpen(false)}>
          <img src="/images/emblem.png" alt="" />
          <span>
            KING
            <br />
            ROLL
          </span>
        </a>
        <nav className="nav-links" aria-label="Разделы">
          <a href="#sign">Фирменные</a>
          <a href="#menu">Меню</a>
          <a href="#call">Звонок</a>
        </nav>
        <div className="nav-right">
          <a className="nav-phone" href={`tel:${PHONE_TEL}`}>
            {PHONE_PRETTY}
          </a>
          <button className="burger" type="button" aria-label={navOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setNavOpen((v) => !v)}>
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>

      {navOpen && (
        <div className="mnav">
          <a href="#sign" onClick={() => setNavOpen(false)}>
            Фирменные
          </a>
          <a href="#menu" onClick={() => setNavOpen(false)}>
            Меню
          </a>
          <a href="#call" onClick={() => setNavOpen(false)}>
            Звонок
          </a>
          <a className="mnav-phone" href={`tel:${PHONE_TEL}`}>
            {PHONE_PRETTY}
          </a>
        </div>
      )}

      <section className="hero grain" id="top">
        <img className="hero-bg" src="/images/knife-hero.jpg" alt="Нож режет ролл" />
        <div className="hero-shade" />
        <div className="vert">
          <span>
            {CITY} · {HOURS} · только звонок
          </span>
        </div>
        <div className="hero-copy">
          <p className="kicker">
            <span className={cn("dot", !open && "is-off")} />
            {open ? "Сейчас открыто · до 23:00" : "Сейчас закрыто · откроемся в 11:00"}
            <span>
              {clock} · {CITY}
            </span>
          </p>
          <h1 className="brand-hero">
            KING
            <br />
            ROLL
          </h1>
          <svg className="hero-blade" viewBox="0 0 460 36" fill="none" aria-hidden="true">
            <path d="M8 18h70" stroke="#e0c48a" strokeWidth="6" />
            <path d="M78 18h300" stroke="#f3e0b0" strokeWidth="1.4" />
            <path d="M378 18l70-2.2-70 2.2 70 2.2-70-2.2Z" fill="#f3e0b0" />
          </svg>
          <p className="hero-lead">Суши-дом Армянска. Доставка по городу. Связаться можно только по номеру.</p>
          <div className="hero-meta">
            <span>Ежедневно {HOURS}</span>
            <span>Доставка по {CITY}у</span>
            <span>Без форм и корзины</span>
          </div>
          <div className="cta-row">
            <CallLink label="Единственный способ" />
            <a className="btn-ghost" href="#menu">
              Открыть меню
            </a>
          </div>
        </div>
        <aside className="hero-card">
          <small>{open ? "Линия открыта" : "До открытия"}</small>
          <strong>{HOURS}</strong>
          <p>Заказ принимает человек. Назовите блюдо — кухня услышит его только из трубки.</p>
          <a href={`tel:${PHONE_TEL}`}>{PHONE_PRETTY}</a>
        </aside>
      </section>

      <KnifeCut />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>
            {MARQUEE}
            <b>✦</b>
          </span>
          <span>
            {MARQUEE}
            <b>✦</b>
          </span>
        </div>
      </div>

      <section className="craft" id="craft" ref={craft.ref}>
        <div className="watermark">РЕЗ</div>
        <div className="wrap craft-grid">
          <div>
            <p className="sec-kicker">01 — Дом</p>
            <h2 className={cn("sec-title reveal", craft.inView && "in")}>
              Не лента. <em>Лезвие.</em>
            </h2>
            <p className="lede">
              KING ROLL готовит в Армянске каждый день с 11:00 до 23:00. Роллы, сеты, лапша и горячее — на этом сайте можно разглядеть и прочитать. Заказать можно только голосом, по одному номеру.
            </p>
            <div className="facts">
              <div className="fact">
                <b>11–23</b>
                <span>ежедневно, без выходных</span>
              </div>
              <div className="fact">
                <b>1</b>
                <span>номер на весь город</span>
              </div>
              <div className="fact">
                <b>{DISHES.length}</b>
                <span>позиций в карте дома</span>
              </div>
            </div>
          </div>
          <div className="mosaic">
            <img className="m1" src="https://images.pexels.com/photos/8951136/pexels-photo-8951136.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Шеф режет ролл" />
            <img className="m2" src="/images/king-roll.jpg" alt="Фирменный ролл" />
            <img className="m3" src="/images/mega-set.jpg" alt="Большой сет" />
          </div>
        </div>
      </section>

      <KnifeCut flip />

      <section className="sign" id="sign">
        <div className="sign-head">
          <div>
            <p className="sec-kicker">02 — Первый рез</p>
            <h2 className="sec-title">
              С чего начинают <em>вечер</em>
            </h2>
            <p className="sign-sub">Позиции, которые берут чаще всего. Состав по каждой внутри.</p>
            <span className="swipe-hint" aria-hidden="true">
              листайте вбок →
            </span>
            <p className="sign-sub">Позиции, которые берут чаще всего. Состав по каждой внутри.</p>
          </div>
          <div className="rail-nav">
            <button
              type="button"
              aria-label="Назад"
              disabled={railPos <= 0.005}
              onClick={() => railRef.current?.scrollBy({ left: -Math.min(520, window.innerWidth * 0.84), behavior: "smooth" })}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Дальше"
              disabled={railPos >= 0.995}
              onClick={() => railRef.current?.scrollBy({ left: Math.min(520, window.innerWidth * 0.84), behavior: "smooth" })}
            >
              →
            </button>
          </div>
        </div>
        <div className="rail-wrap">
          <div className="rail" ref={railRef}>
            {featured.map((dish, i) => (
              <article key={dish.id} className="sign-card">
                <button type="button" className="photo" onClick={() => openDish(dish)}>
                  {dish.cat === "set" && dish.includes?.length ? (
                    <SetPlate dish={dish} />
                  ) : (
                    <img src={shotFor(dish.id, dish.cat, dish.image)} alt={dish.name} style={{ objectPosition: "center" }} />
                  )}
                </button>
                <div className="body">
                  <span className="idx">
                    0{i + 1} / {dish.kicker}
                  </span>
                  <h3>{dish.name}</h3>
                  <p>{dish.lore}</p>
                  <div className="row">
                    <span className="price">{rub(dish.price)}</span>
                    <button className="add" type="button" onClick={() => openDish(dish)}>
                      Читать
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="rail-progress" aria-hidden="true">
            <i style={{ width: `${Math.max(railPos * 100, 6)}%` }} />
          </div>
        </div>
      </section>

      <HugeChoice />

      <section className="menu" id="menu">
        <div className="wrap">
          <div className="menu-head">
            <div>
              <p className="sec-kicker">03 — Меню</p>
              <h2 className="sec-title">
                Безумно огромный <em>выбор</em>
              </h2>
              <p className="lede">Нажмите карточку, прочитайте и позвоните. Другого способа заказать нет.</p>
            </div>
          </div>
          <label className="find-wrap">
            <span className="sr-only">Поиск по меню</span>
            <input
              className="find"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти: дракон, соба, филадельфия…"
            />
          </label>
          <div className="cats" role="tablist" aria-label="Разделы меню">
            {CATS.map((c) => (
              <button key={c.id} type="button" className={cn("cat", cat === c.id && "is-on")} onClick={() => chooseCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className={cn("menu-stage", cutting && "is-cutting")}>
            {visible.length === 0 ? (
              <p className="lede">Такого реза нет. Позвоните — оператор подскажет близкое.</p>
            ) : (
              <div className="tiles" key={`${cat}-${query}`}>
                {visible.map((dish, i) => (
                  <button
                    key={dish.id}
                    type="button"
                    className={cn("tile", dish.id === "nuggets" && "is-solo", dish.cat === "set" && "is-set")}
                    style={{ "--accent": dish.accent, animationDelay: `${Math.min(i, 16) * 0.045}s` } as CSSProperties}
                    onClick={() => openDish(dish)}
                  >
                    {dish.cat === "set" && dish.includes?.length ? (
                      <SetPlate dish={dish} />
                    ) : (
                      <Img src={shotFor(dish.id, dish.cat, dish.image)} alt="" style={{ objectPosition: "center" }} />
                    )}
                    <span className="tile-shade" />
                    <span className="tile-slash" aria-hidden="true" />
                    <span className="tile-meta">
                      <em>{dish.kicker}</em>
                      <strong>{dish.name}</strong>
                      <b>{rub(dish.price)}</b>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="menu-note">
            Цены — с карты доставки. Если оператор назовёт другую, верна цена в трубке. Состав длинных позиций тоже подтверждается только голосом. Связаться можно лишь по {PHONE_PRETTY}.
          </p>
        </div>
      </section>

      <section className="callblock" id="call">
        <div className="wrap call-grid">
          <div>
            <p className="sec-kicker">04 — Только номер</p>
            <h2 className="sec-title">
              Продиктуйте. <em>Мы режем.</em>
            </h2>
            <p className="lede">
              Здесь нет корзины, формы и мессенджера. Доставка по Армянску живёт в одном звонке: с 11:00 до 23:00, каждый день. Назовите блюдо, адрес и время.
            </p>
            <div className="facts">
              <div className="fact">
                <b>11:00</b>
                <span>открываем линию</span>
              </div>
              <div className="fact">
                <b>23:00</b>
                <span>последний звонок</span>
              </div>
              <div className="fact">
                <b>{CITY}</b>
                <span>доставка по городу</span>
              </div>
            </div>
          </div>
          <aside className="poster">
            <p className="sec-kicker">{open ? "Линия открыта" : "Откроемся в 11:00"}</p>
            <div className="hours">
              11:00
              <br />
              23:00
            </div>
            <a className="giant-phone" href={`tel:${PHONE_TEL}`}>
              {PHONE_PRETTY}
            </a>
            <p>Армянск. Ежедневно. Других способов заказать нет.</p>
            <CallLink label="Позвонить сейчас" />
          </aside>
        </div>
      </section>

      <footer className="foot">
        <div>
          <strong>KING ROLL</strong>
          <div>
            {CITY} · {HOURS}
          </div>
        </div>
        <a href={`tel:${PHONE_TEL}`}>{PHONE_PRETTY}</a>
        <div>© {new Date().getFullYear()} · доставка суши</div>
      </footer>

      {phase === "done" && !active && (
        <a className="fab" href={`tel:${PHONE_TEL}`}>
          <span className="pulse" />
          <IconPhone />
          {PHONE_PRETTY}
        </a>
      )}

      <div className="mobbar">
        <a className="mob-call" href={`tel:${PHONE_TEL}`}>
          <IconPhone />
          <span>
            Позвонить
            <small>{PHONE_PRETTY}</small>
          </span>
        </a>
      </div>

      {active && (
        <div className="sheet-back" onClick={() => setActiveId(null)}>
          <article
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn("sheet-shot", active.id === "nuggets" && "is-solo", active.cat === "set" && active.includes?.length && "is-set")}>
              {active.cat === "set" && active.includes?.length ? (
                <SetPlate dish={active} />
              ) : (
                <Img src={shotFor(active.id, active.cat, active.image)} alt={active.name} style={{ objectPosition: "center" }} />
              )}
              <span className="sheet-blade" aria-hidden="true" />
            </div>
            <div className="sheet-copy">
              <div className="sheet-top">
                <span className="k">{active.kicker}</span>
                <button className="x" type="button" onClick={() => setActiveId(null)} aria-label="Закрыть">
                  ×
                </button>
              </div>
              <h2>{active.name}</h2>
              <div className="price">{rub(active.price)}</div>
              <p className="lore-text">{active.lore}</p>
              {active.includes && active.includes.length > 0 && (
                <ol className="includes">
                  {active.includes.map((part, index) => (
                    <li key={part.name}>
                      <Img src={partImage(part.id, active.image)} alt="" />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <em>{part.name}</em>
                    </li>
                  ))}
                </ol>
              )}
              <p className="menu-note">Звонки ежедневно {HOURS}. Другого канала нет.</p>
              <CallLink label="Заказать это голосом" />
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

