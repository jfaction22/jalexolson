import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// jalexolson.com, one-page portfolio (freelance + job search)
// Drop into an Astro island (client:idle), a Remix route, or any
// Vite app. Single default export, no required props, system
// fonts only. One image on the whole page: put
// jack-maroon-bells.webp in your public/ folder.
// ─────────────────────────────────────────────────────────────

const PHOTO = "/jack-maroon-bells.webp";

const C = {
  paper: "#F7F8F6",
  card: "#FFFFFF",
  ink: "#182028",
  slate: "#4E5A66",
  faint: "#6E7983",
  line: "#E3E6E3",
  accent: "#E8631C",
  accentText: "#BA4E12",
  accentSoft: "rgba(232,99,28,0.08)",
  green: "#1F7A4D",
  panel: "#131A21",
  panelText: "#E8ECEF",
  panelFaint: "#9AA6B0",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};

// ───────────── DATA (edit freely) ─────────────

const SERVICES = [
  {
    icon: "code",
    title: "React apps, built and shipped",
    detail:
      "New builds or rescues. React, TypeScript, Vite, TanStack, and a deploy pipeline you can run without me.",
    tags: ["React", "TypeScript", "Vite", "TanStack"],
  },
  {
    icon: "gauge",
    title: "Performance and Core Web Vitals",
    detail:
      "Lighthouse audits, bundle diets, image and font strategy. This page is my sample: run Lighthouse on it right now.",
    tags: ["Lighthouse", "Core Web Vitals", "Bundle analysis"],
  },
  {
    icon: "search",
    title: "SEO for JavaScript apps",
    detail:
      "SPAs that search engines and AI crawlers can actually read. I built a prerendering service for exactly this problem.",
    tags: ["Prerendering", "Structured data", "Edge routing"],
  },
  {
    icon: "plug",
    title: "Integrations and platform work",
    detail:
      "Stripe billing, Google and Microsoft OAuth, Supabase, license gating. The plumbing that makes a product a business.",
    tags: ["Stripe", "OAuth 2.0", "Supabase", "Cloudflare"],
  },
];

const PRODUCTS = [
  {
    name: "Rendr.it / SEO Vibe",
    what: "Prerendering and SEO infrastructure for React and Vite SPAs",
    detail:
      "A Cloudflare Worker classifies traffic at the edge: search crawlers and AI crawlers get rendered HTML, humans get the SPA. Runs production traffic for client sites today, and it's the engine behind my SPA SEO service.",
    stack: ["Cloudflare Workers", "Docker", "Redis", "Coolify"],
  },
  {
    name: "OleyBot",
    what: "Licensed desktop automation for streamers and TCG collectors",
    detail:
      "Commercial desktop app with license validation, gated binary distribution through Supabase Edge Functions and signed URLs, and Stripe billing. If your product needs licensing or payments, I've built that end to end.",
    stack: ["Supabase", "Edge Functions", "React", "Stripe"],
  },
  {
    name: "Bonsai Mail",
    what: "Cold email platform with multi-tenant OAuth",
    detail:
      "Sending infrastructure on Microsoft 365 and Google OAuth. I migrated the single-tenant Azure app registration to multi-tenant and hardened token refresh and delivery paths.",
    stack: ["Supabase", "Microsoft Graph", "OAuth 2.0", "React"],
  },
  {
    name: "Blocknerds",
    what: "Real-time crypto market intelligence dashboard",
    detail:
      "Live derivatives data: CVD, open interest, funding, liquidation maps, and a fleet of alert bots running under PM2 on my own server. Streaming data and dashboards are familiar ground.",
    stack: ["React/Vite", "CoinGlass API", "Node", "PM2"],
  },
  {
    name: "Levotate",
    what: "My web development and marketing agency",
    detail:
      "Over a hundred WordPress sites in production on a dedicated server I administer myself. Performance, SEO, ads, backups, the works. Along the way I built up and sold a 34 client management business.",
    stack: ["WordPress", "cPanel/WHM", "Cloudflare", "SEO"],
  },
];

const INCIDENTS = [
  {
    id: "IR-01",
    sev: "SEV-1",
    title: "Open-proxy abuse on the prerender fleet",
    problem:
      "Attackers found that the prerender endpoint would render arbitrary URLs and started using it as a free rendering proxy. The render containers restarted 6,844 times before containment.",
    fix:
      "Locked rendering to an allowlist of registered domains, added per-origin rate limits at the Worker, and set hard timeouts on the render containers.",
    outcome:
      "Abuse traffic dropped to zero and paying customers never saw an outage.",
  },
  {
    id: "IR-02",
    sev: "SEV-2",
    title: "License gating rebuilt for OleyBot binaries",
    problem:
      "Download links for the paid desktop app could be shared once issued, so anyone with a link could pull licensed binaries.",
    fix:
      "Moved distribution behind Supabase Edge Functions that validate the license on every request and issue short-lived signed URLs.",
    outcome:
      "Sharing a link now gets you an expired URL. Piracy path closed with zero added friction for real customers.",
  },
  {
    id: "IR-03",
    sev: "SEV-2",
    title: "Cloudflare Workers quota exhaustion",
    problem:
      "A traffic spike pushed the edge routing layer through its Workers request quota, threatening every site behind it at once.",
    fix:
      "Added caching in front of the Worker and tiered the routing so only bot traffic pays the Worker cost.",
    outcome:
      "Request volume fell by an order of magnitude, with headroom for the next spike.",
  },
  {
    id: "IR-04",
    sev: "SEV-3",
    title: "Next.js CVE audit across client properties",
    problem:
      "A published Next.js CVE potentially exposed client sites I maintain. Nobody was going to check a hundred properties by hand.",
    fix:
      "Scripted an audit across every property to fingerprint framework versions, then patched the affected sites.",
    outcome:
      "Everything patched inside the disclosure window, with a repeatable script for the next CVE.",
  },
];

const SKILLS = [
  {
    icon: "monitor",
    layer: "Interface",
    items: ["React", "TypeScript", "Vite", "TanStack Query/Router", "Tailwind", "CSS you can read"],
  },
  {
    icon: "database",
    layer: "Content and data",
    items: ["Sanity", "Supabase", "Postgres", "REST and edge APIs", "Structured data / JSON-LD"],
  },
  {
    icon: "globe",
    layer: "Edge and delivery",
    items: ["Cloudflare Workers", "Pages", "Caching strategy", "Prerendering", "DNS"],
  },
  {
    icon: "terminal",
    layer: "Operations",
    items: ["Docker", "PM2", "Coolify", "Linux server admin", "Monitoring and alerting"],
  },
];

const LINKS = [
  { label: "Email", href: "mailto:jack@jalexolson.com" },
  { label: "GitHub", href: "https://github.com/jalexolson" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jalexolson" },
];

// ───────────── SMALL PIECES ─────────────

// Inline SVG icons: zero network requests, inherit currentColor.
const ICON_PATHS = {
  code: <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />,
  gauge: (
    <>
      <path d="M5 19a9 9 0 1 1 14 0" />
      <path d="m12 13 4-4" />
      <circle cx="12" cy="13" r="1.4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
    </>
  ),
  plug: <path d="M9 6V2M15 6V2M7 6h10v4a5 5 0 0 1-10 0V6ZM12 15v7" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: C.mono,
        fontSize: 12,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: C.accentText,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Chip({ children, tone = "line" }) {
  const tones = {
    line: { border: C.line, color: C.slate, bg: C.card },
    accent: { border: C.accent, color: C.accentText, bg: C.accentSoft },
    green: { border: "rgba(31,122,77,0.35)", color: C.green, bg: "rgba(31,122,77,0.07)" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        fontFamily: C.mono,
        fontSize: 11,
        padding: "3px 9px",
        borderRadius: 999,
        border: `1px solid ${t.border}`,
        color: t.color,
        background: t.bg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function LiveDot() {
  return <span aria-hidden="true" className="pf-dot" style={{ background: C.green }} />;
}

function LiveTag() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
      <LiveDot />
      <span style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 1, color: C.green }}>LIVE</span>
    </span>
  );
}

// ───────────── PAGE ─────────────

export default function Portfolio() {
  const rootRef = useRef(null);
  const [perf, setPerf] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("pf-hydrated");

    // Scroll reveals. Content is fully visible without JS; this only
    // adds motion once hydrated, and only if the user allows motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io;
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("pf-in");
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px" }
      );
      root.querySelectorAll(".pf-reveal").forEach((el) => io.observe(el));
    } else {
      root.querySelectorAll(".pf-reveal").forEach((el) => el.classList.add("pf-in"));
    }

    // Live performance readout: the page measures itself.
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (!nav) return;
      const assets = performance
        .getEntriesByType("resource")
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
      setPerf({
        ms: Math.max(1, Math.round(nav.domContentLoadedEventEnd)),
        kb: Math.round((assets + (nav.transferSize || 0)) / 1024),
      });
    };
    if (document.readyState === "complete") measure();
    else window.addEventListener("load", measure, { once: true });

    return () => {
      io && io.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: C.sans,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        .pf-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 999px;
          box-shadow: 0 0 0 3px rgba(31,122,77,0.15);
        }
        .pf-hydrated .pf-dot { animation: pf-pulse 2.4s ease-in-out infinite; }
        @keyframes pf-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(31,122,77,0.15); }
          50% { box-shadow: 0 0 0 6px rgba(31,122,77,0.06); }
        }
        /* scroll reveals: hidden ONLY after hydration (.pf-hydrated),
           so the page is complete for crawlers and no-JS visitors */
        .pf-hydrated .pf-reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity .55s ease, transform .55s ease;
        }
        .pf-hydrated .pf-reveal.pf-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .pf-hydrated .pf-reveal { opacity: 1; transform: none; transition: none; }
          .pf-hydrated .pf-dot { animation: none; }
        }
        /* keyboard navigation: visible focus everywhere */
        .pf-root a:focus-visible, .pf-root button:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }
        .pf-hero { display: grid; grid-template-columns: 1.2fr .8fr; gap: 44px; align-items: center; }
        .pf-hero-photo { --pf-cut: polygon(
          0 22px, 22px 0,
          calc(100% - 22px) 0, 100% 22px,
          100% calc(100% - 22px), calc(100% - 22px) 100%,
          22px 100%, 0 calc(100% - 22px)
        ); }
        /* Shadow lives on the wrapper: filter follows the clip-path
           silhouette, while box-shadow would get clipped away. */
        .pf-photo-frame {
          position: relative;
          filter: drop-shadow(0 4px 10px rgba(24, 32, 40, 0.14))
                  drop-shadow(0 20px 38px rgba(24, 32, 40, 0.22));
        }
        .pf-photo-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translate(12px, 12px);
          background: ${C.accent};
          opacity: 0.9;
          clip-path: var(--pf-cut);
        }
        .pf-photo { width: 100%; height: auto; display: block; position: relative; clip-path: var(--pf-cut); }
        .pf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .pf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .pf-grid-skills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        section { content-visibility: auto; contain-intrinsic-size: auto 600px; }
        @media (max-width: 900px) {
          .pf-grid-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 760px) {
          .pf-hero { grid-template-columns: 1fr; gap: 28px; }
          .pf-hero-photo { max-width: 420px; }
          .pf-grid-2 { grid-template-columns: 1fr; }
          .pf-grid-skills { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pf-grid-3 { grid-template-columns: 1fr; }
        }
        @media (max-width: 460px) {
          .pf-grid-skills { grid-template-columns: 1fr; }
        }
        .pf-card { transition: border-color .2s ease, transform .2s ease; }
        .pf-hydrated .pf-card:hover { border-color: ${C.accent}; transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .pf-hydrated .pf-card:hover { transform: none; } }
      `}</style>

      <div className="pf-root" style={{ maxWidth: 1040, margin: "0 auto", padding: "0 22px" }}>
        {/* header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 0",
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
            jalexolson<span style={{ color: C.accentText }}>.com</span>
          </div>
          <nav aria-label="Sections" style={{ display: "flex", gap: 18, fontFamily: C.mono, fontSize: 12 }}>
            <a href="#work" style={{ color: C.slate, textDecoration: "none" }}>Work</a>
            <a href="#incidents" style={{ color: C.slate, textDecoration: "none" }}>Incidents</a>
            <a href="#contact" style={{ color: C.accentText, textDecoration: "none" }}>Hire me</a>
          </nav>
        </header>

        {/* hero */}
        <section aria-labelledby="hero-title" style={{ padding: "64px 0 56px" }}>
          <div className="pf-hero">
            <div>
              <Eyebrow>Alex Olson · Frontend engineer · Colorado</Eyebrow>
              <h1
                id="hero-title"
                style={{
                  fontSize: "clamp(34px, 5.6vw, 56px)",
                  fontWeight: 800,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.05,
                  margin: "0 0 18px",
                }}
              >
                I build bespoke apps tailored to what people actually want.
              </h1>
              <p style={{ fontSize: 17, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 22px" }}>
                I have 12+ years building for the web. I sold off a WordPress agency that had over 100 clients in its hayday.
                I've built 5 different SaaS products, dozens of AI automations and agents.
                
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Chip tone="green">
                  <LiveDot /> <span style={{ marginLeft: 6 }}>Available for freelance work</span>
                </Chip>
                <Chip tone="line">React · TypeScript · performance</Chip>
              </div>
            </div>
            <div className="pf-hero-photo">
              <div className="pf-photo-frame">
                <img
                  className="pf-photo"
                  src={PHOTO}
                  alt="Alex Olson standing at Maroon Lake below the Maroon Bells near Aspen, Colorado"
                  width="880"
                  height="1173"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>              
            </div>
          </div>

        </section>

        {/* services */}
        <section aria-labelledby="services-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>For clients</Eyebrow>
          <h2 id="services-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            What I can build for you
          </h2>
          <div className="pf-grid-2">
            {SERVICES.map((s) => (
              <article
                key={s.title}
                className="pf-card"
                style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, color: C.accentText }}>
                  <Icon name={s.icon} />
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.ink }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: "0 0 14px" }}>{s.detail}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* products */}
        <section id="work" aria-labelledby="work-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>Shipped and still running</Eyebrow>
          <h2 id="work-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            Things I built and operate
          </h2>
          <div className="pf-grid-3">
            {PRODUCTS.map((p) => (
              <article
                key={p.name}
                className="pf-card"
                style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                  <LiveTag />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{p.what}</div>
                <p style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: "0 0 14px" }}>{p.detail}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* incident reports */}
        <section id="incidents" aria-labelledby="incidents-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>Selected incident reports</Eyebrow>
          <h2 id="incidents-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 8px" }}>
            Problems I've actually been paged for
          </h2>
          <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, maxWidth: 620, margin: "0 0 26px" }}>
            Postmortems from my own infrastructure: what broke, what I did, what changed.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {INCIDENTS.map((ir) => (
              <article
                key={ir.id}
                style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint }}>{ir.id}</span>
                  <Chip tone="accent">{ir.sev}</Chip>
                  <Chip tone="green">RESOLVED</Chip>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, flexBasis: "100%" }}>{ir.title}</h3>
                </div>
                <dl style={{ margin: 0, display: "grid", gap: 10 }}>
                  {[
                    ["Problem", ir.problem],
                    ["Fix", ir.fix],
                    ["Outcome", ir.outcome],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 12 }}>
                      <dt style={{ fontFamily: C.mono, fontSize: 12, color: C.accentText, paddingTop: 2 }}>{k}</dt>
                      <dd style={{ margin: 0, fontSize: 14, color: C.slate, lineHeight: 1.65 }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        {/* how I work */}
        <section aria-labelledby="how-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <div style={{ background: C.panel, color: C.panelText, borderRadius: 16, padding: "34px 30px" }}>
            <div style={{ fontFamily: C.mono, fontSize: 12, letterSpacing: 2.2, textTransform: "uppercase", color: C.accent, marginBottom: 14 }}>
              How I work
            </div>
            <h2 id="how-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 18px", color: C.panelText }}>
              Fast to build, honest about what I ship
            </h2>
            <div className="pf-grid-2" style={{ gap: 22 }}>
              {[
                ["AI-accelerated, human-verified", "I use AI tooling heavily and read every diff before it lands, like a pull request from a fast junior engineer."],
                ["Performance is a budget, not a phase", "System fonts, one optimized image, no dead JavaScript. This site practices what it bills for."],
                ["I own the whole path", "DNS to database. On my servers there's no one to escalate to, so I build like the person on call."],
                ["Clean handoffs", "You get the repo, the docs, the pipeline, and a walkthrough. You own the thing when we're done."],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: C.panelText }}>{title}</h3>
                  <p style={{ fontSize: 14, color: C.panelFaint, lineHeight: 1.7, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* skills by layer */}
        <section aria-labelledby="skills-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>Stack</Eyebrow>
          <h2 id="skills-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            Fluency by layer
          </h2>
          <div className="pf-grid-skills">
            {SKILLS.map((s) => (
              <div key={s.layer} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: C.accentText }}>
                  <Icon name={s.icon} />
                  <h3 style={{ fontFamily: C.mono, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", margin: 0, color: C.accentText }}>
                    {s.layer}
                  </h3>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 7 }}>
                  {s.items.map((i) => (
                    <li key={i} style={{ fontSize: 13.5, color: C.slate }}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* contact */}
        <footer id="contact" style={{ padding: "26px 0 64px", borderTop: `1px solid ${C.line}` }}>
          <Eyebrow>Contact</Eyebrow>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 14px" }}>
            Have a project? Let's talk.
          </h2>
          <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 24px" }}>
            Tell me what you're building and what's in the way. I'll give you an honest read,
            usually within a day.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: C.mono,
                  fontSize: 13,
                  textDecoration: "none",
                  padding: "9px 16px",
                  borderRadius: 8,
                  border: `1px solid ${label === "Email" ? C.accent : C.line}`,
                  background: label === "Email" ? C.accentSoft : C.card,
                  color: label === "Email" ? C.accentText : C.slate,
                }}
              >
                {label} ↗
              </a>
            ))}
          </div>

          {/* live performance readout: the page measures itself */}
          <div
            aria-live="polite"
            style={{
              fontFamily: C.mono,
              fontSize: 11.5,
              color: C.faint,
              marginTop: 36,
              minHeight: 18,
              lineHeight: 1.9,
            }}
          >
            {perf
              ? `This page became interactive in ${perf.ms} ms and transferred about ${perf.kb} KB. Measured live in your browser, just now.`
              : "This page measures its own performance once it loads."}
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, lineHeight: 1.9 }}>
            One image on this page. System fonts only. Motion respects your reduced motion setting.
            Fully keyboard navigable.
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, marginTop: 20 }}>
            © {new Date().getFullYear()} Alex Olson · Built with React, shipped from the edge.
          </div>
        </footer>
      </div>
    </div>
  );
}