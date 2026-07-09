import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// jalexolson.com — one-page portfolio
// Drop this into a Remix route, Astro island, or TanStack Start
// page. Single default export, no required props, system fonts.
// ─────────────────────────────────────────────────────────────

const C = {
  paper: "#F7F8F6",
  card: "#FFFFFF",
  ink: "#182028",
  slate: "#4E5A66",
  faint: "#8B96A0",
  line: "#E3E6E3",
  accent: "#E8631C", // edge orange
  green: "#2E8B57",
  red: "#C4442A",
  inkPanel: "#182028",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};

// ───────────── DATA — edit freely ─────────────

const PRODUCTS = [
  {
    name: "Rendr.it / SEO Vibe",
    status: "live",
    what: "Prerendering & SEO infrastructure for React and Vite SPAs",
    detail:
      "Edge-routed prerendering service: a Cloudflare Worker classifies traffic (search crawlers, AI/GEO crawlers, users), serves rendered HTML to bots and the SPA to humans. Runs production traffic for client sites today.",
    stack: ["Cloudflare Workers", "Docker", "Redis", "Coolify"],
  },
  {
    name: "OleyBot",
    status: "live",
    what: "Licensed desktop automation platform for streamers & TCG collectors",
    detail:
      "Commercial desktop app with license validation, gated binary distribution through Supabase Edge Functions and signed URLs, Stripe billing, and a restock-alert pipeline in active development.",
    stack: ["Supabase", "Edge Functions", "React", "Stripe"],
  },
  {
    name: "Bonsai Mail",
    status: "live",
    what: "Cold email platform with multi-tenant OAuth",
    detail:
      "Sending infrastructure with Microsoft 365 and Google OAuth — migrated single-tenant to multi-tenant Azure app registration, hardened token refresh and edge-function delivery paths.",
    stack: ["Supabase", "Microsoft Graph", "OAuth 2.0", "React"],
  },
  {
    name: "Blocknerds",
    status: "live",
    what: "Real-time crypto market intelligence dashboard",
    detail:
      "Streaming derivatives analytics — CVD, open interest, funding, liquidation maps — with a rules engine and a PM2-managed alert bot fleet on dedicated hardware.",
    stack: ["React/Vite", "CoinGlass API", "Node", "PM2"],
  },
  {
    name: "Levotate",
    status: "live",
    what: "Web development & digital marketing agency",
    detail:
      "Founded and operate an agency running 100+ production WordPress properties on owned dedicated infrastructure — server administration, performance, SEO, and Google Ads under one roof. Previously built and sold a 34-client management business.",
    stack: ["WordPress", "cPanel/WHM", "Cloudflare", "SEO"],
  },
];

const INCIDENTS = [
  {
    id: "IR-01",
    sev: "SEV-1",
    title: "Open-proxy abuse on prerender fleet",
    problem:
      "Attackers discovered the prerender endpoint could be pointed at arbitrary URLs and used it as a free rendering proxy — 6,844 container restarts before containment.",
    fix: "Rewrote the Cloudflare Worker routing layer: strict origin allow-listing, an expanded bot-detection list, junk-path traps to poison scrapers, and per-route rate limits at the edge before traffic ever reaches a container.",
    outcome: "Abuse traffic zeroed out; renderer CPU returned to baseline; legitimate crawler success rate unaffected.",
    tags: ["Cloudflare Workers", "Security", "Edge routing"],
  },
  {
    id: "IR-02",
    sev: "SEV-1",
    title: "Paid binaries publicly downloadable",
    problem:
      "OleyBot's licensed desktop builds were reachable as static CDN URLs — anyone with the link could pull paid software with no entitlement check.",
    fix: "Re-architected distribution: downloads now route through a gated Supabase Edge Function that validates the license server-side and issues short-lived signed URLs. Static paths removed and revoked.",
    outcome: "Zero unauthenticated download paths remain; entitlement is enforced at request time, not by URL obscurity.",
    tags: ["Supabase", "Edge Functions", "Signed URLs", "AuthZ"],
  },
  {
    id: "IR-03",
    sev: "SEV-2",
    title: "Cloudflare Workers quota exhaustion",
    problem:
      "Legacy WordPress URL patterns from migrated sites drew endless crawler traffic into the Worker layer, burning the entire request quota and threatening the prerender service for every tenant.",
    fix: "Traced the traffic to stale URL-pattern crawl loops, deployed crawler traps and pattern-level filtering ahead of the Worker, and split routing so junk paths die at the edge for free.",
    outcome: "Quota consumption dropped to a sustainable baseline; no tenant downtime during remediation.",
    tags: ["Cloudflare", "Observability", "Cost control"],
  },
  {
    id: "IR-04",
    sev: "SEV-2",
    title: "Framework CVE in a client audit",
    problem:
      "A full security and code audit of a production Next.js/Supabase platform surfaced a high-severity middleware authorization-bypass CVE, among other issues, in live customer-facing code.",
    fix: "Delivered a prioritized findings report: patched the vulnerable middleware path, tightened row-level security policies, and closed secondary issues across edge functions and API routes.",
    outcome: "Critical path patched before exploitation; client left with a remediation roadmap instead of a scare.",
    tags: ["Next.js", "Supabase RLS", "Security audit"],
  },
  {
    id: "IR-05",
    sev: "SEV-3",
    title: "Headless CMS + SEO pipeline, end to end",
    problem:
      "A retail client's React SPA was invisible to search and AI crawlers, with no structured data and a two-layer script-stripping bug corrupting prerendered output.",
    fix: "Deployed Sanity Studio on a custom subdomain, built the content schemas and PostSeo component layer with JSON-LD structured data, and fixed the prerender proxy so rendered HTML shipped intact — including GEO/AEO crawler support for AI search.",
    outcome: "Fully indexed content pipeline: marketers publish in Sanity, crawlers get complete structured HTML at the edge.",
    tags: ["Sanity", "JSON-LD", "SEO/GEO", "Prerendering"],
  },
];

const PLATFORM = [
  {
    group: "Frontend",
    items: ["React", "Vite", "TanStack", "Remix-style loaders/actions", "Design systems", "Core Web Vitals budgets"],
  },
  {
    group: "Edge & Cloud",
    items: ["Cloudflare Workers", "DNS / routing / cache rules", "R2", "Vercel", "Coolify", "Docker"],
  },
  {
    group: "Backend & Data",
    items: ["Supabase (Postgres, RLS, Edge Functions)", "API & schema design", "OAuth 2.0 / Microsoft Graph", "Redis", "Node / PM2"],
  },
  {
    group: "Content & SEO",
    items: ["Sanity", "WordPress (headless & classic)", "JSON-LD / structured data", "Prerendering & GEO/AEO", "Google Ads"],
  },
  {
    group: "Infrastructure",
    items: ["Dedicated Linux servers (AlmaLinux)", "cPanel/WHM at 100+ account scale", "MariaDB / Apache / PHP-FPM tuning", "Backup & disaster recovery", "GitHub Actions"],
  },
];

const AGENT_POINTS = [
  {
    h: "Agents are the workflow, not a feature",
    p: "Every product above ships through AI-assisted development daily — Claude-driven builds from schema design to edge deployment. Not autocomplete: full agent loops that plan, build, and verify.",
  },
  {
    h: "Building the harness",
    p: "Custom prompts, project rules, and repeatable agent workflows that make generated code safe to ship: security review passes, dependency discipline, and infrastructure the agent can actually deploy to.",
  },
  {
    h: "Judgment is the product",
    p: "AI writes a lot of my code. The value I add is knowing when it's wrong — the security holes, the cache bugs, the reference-equality mistakes — and building systems where those get caught before production.",
  },
];

// ───────────── MOTION & ACCESSIBILITY LAYER ─────────────
// Hand-rolled CSS — no animation dependency. Everything below
// is disabled by prefers-reduced-motion.

const STYLES = `
  /* keyboard navigation — visible focus everywhere */
  .pf :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; border-radius: 6px; }

  /* hero boot sequence: headline lines rise in */
  .pf .boot-line { display: block; opacity: 0; transform: translateY(14px);
    animation: pf-rise .55s cubic-bezier(.2,.7,.2,1) forwards; }
  @keyframes pf-rise { to { opacity: 1; transform: none; } }

  /* status dots ignite left-to-right, then idle at a slow pulse */
  .pf .dot { opacity: 0;
    animation: pf-ignite .45s ease-out forwards, pf-pulse 2.8s ease-in-out infinite; }
  @keyframes pf-ignite { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
  @keyframes pf-pulse { 0%,100% { box-shadow: 0 0 4px rgba(74,222,128,.45); }
    50% { box-shadow: 0 0 10px rgba(74,222,128,.85); } }

  /* terminal cursor in the header strip */
  .pf .cursor { display: inline-block; width: 7px; height: 13px; background: ${C.accent};
    margin-left: 6px; vertical-align: -2px; animation: pf-blink 1.1s steps(1) infinite; }
  @keyframes pf-blink { 50% { opacity: 0; } }

  /* scroll reveals — hidden ONLY after hydration (.pf-hydrated),
     so prerendered HTML stays fully visible to crawlers & no-JS */
  .pf .reveal { transition: opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1); }
  .pf-hydrated .reveal { opacity: 0; transform: translateY(14px); }
  .pf-hydrated .reveal.in { opacity: 1; transform: none; }

  /* product card lift */
  .pf .pcard { transition: transform .25s ease, box-shadow .25s ease; }
  .pf .pcard:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(24,32,40,.08); }

  /* incident card expand: grid-rows 0fr -> 1fr height animation;
     visibility toggle keeps collapsed content out of tab order */
  .pf .ir-body { display: grid; grid-template-rows: 0fr;
    transition: grid-template-rows .35s cubic-bezier(.2,.7,.2,1); }
  .pf .ir-body.open { grid-template-rows: 1fr; }
  .pf .ir-inner { overflow: hidden; min-height: 0; visibility: hidden;
    transition: visibility 0s linear .35s; }
  .pf .ir-body.open .ir-inner { visibility: visible; transition-delay: 0s; }
  .pf .chev { display: inline-block; transition: transform .3s ease; }
  .pf .chev.open { transform: rotate(45deg); }

  /* the accessibility contract: motion is opt-out */
  @media (prefers-reduced-motion: reduce) {
    .pf .boot-line, .pf .dot, .pf .cursor { animation: none; opacity: 1; transform: none; }
    .pf-hydrated .reveal { opacity: 1; transform: none; transition: none; }
    .pf .pcard, .pf .ir-body, .pf .ir-inner, .pf .chev { transition: none; }
  }
`;

// Reveals children when scrolled into view. The effect is a
// textbook "sync with an external system": subscribe to
// IntersectionObserver on mount, disconnect on cleanup.
function Reveal({ children }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // reveal once, then stop observing
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={"reveal" + (inView ? " in" : "")}>
      {children}
    </div>
  );
}

// ───────────── COMPONENTS ─────────────

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: C.mono,
        fontSize: 11,
        letterSpacing: 2,
        color: C.accent,
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: C.sans,
        fontSize: "clamp(24px, 4vw, 34px)",
        fontWeight: 800,
        letterSpacing: -0.8,
        color: C.ink,
        margin: "0 0 28px",
        lineHeight: 1.1,
      }}
    >
      {children}
    </h2>
  );
}

function Chip({ children, tone }) {
  const colors =
    tone === "green"
      ? { bg: "rgba(46,139,87,0.1)", fg: C.green }
      : tone === "red"
      ? { bg: "rgba(196,68,42,0.1)", fg: C.red }
      : { bg: "#EEF0EE", fg: C.slate };
  return (
    <span
      style={{
        fontFamily: C.mono,
        fontSize: 10.5,
        padding: "3px 9px",
        borderRadius: 4,
        background: colors.bg,
        color: colors.fg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function IncidentCard({ inc }) {
  const [open, setOpen] = useState(false);
  const bodyId = inc.id.toLowerCase() + "-details";
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        marginBottom: 14,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={bodyId}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "18px 20px",
          display: "flex",
          gap: 14,
          alignItems: "baseline",
        }}
      >
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, flexShrink: 0 }}>{inc.id}</span>
        <Chip tone={inc.sev === "SEV-1" ? "red" : undefined}>{inc.sev}</Chip>
        <span style={{ fontFamily: C.sans, fontSize: 16, fontWeight: 700, color: C.ink, flex: 1, lineHeight: 1.35 }}>
          {inc.title}
        </span>
        <Chip tone="green">RESOLVED</Chip>
        <span
          className={"chev" + (open ? " open" : "")}
          aria-hidden="true"
          style={{ fontFamily: C.mono, color: C.faint, fontSize: 14, flexShrink: 0 }}
        >
          +
        </span>
      </button>
      <div id={bodyId} className={"ir-body" + (open ? " open" : "")}>
        <div className="ir-inner">
          <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.line}` }}>
            {[
              ["Problem", inc.problem],
              ["Fix", inc.fix],
              ["Outcome", inc.outcome],
            ].map(([label, text]) => (
              <div key={label} style={{ marginTop: 16 }}>
                <div style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 1.5, color: C.faint, textTransform: "uppercase", marginBottom: 5 }}>
                  {label}
                </div>
                <p style={{ fontFamily: C.sans, fontSize: 14.5, lineHeight: 1.7, color: C.slate, margin: 0 }}>{text}</p>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
              {inc.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────── PAGE ─────────────

export default function Portfolio() {
  // Gate scroll-reveal hiding behind hydration so prerendered
  // HTML (crawlers, no-JS) is never served with hidden content.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div
      className={"pf" + (hydrated ? " pf-hydrated" : "")}
      style={{ background: C.paper, minHeight: "100vh", color: C.ink }}
    >
      <style>{STYLES}</style>
      {/* ── HERO ── */}
      <div
        style={{
          backgroundImage: "radial-gradient(circle, rgba(24,32,40,0.055) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
      <header style={{ maxWidth: 880, margin: "0 auto", padding: "72px 24px 56px" }}>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, marginBottom: 18 }}>
          jalexolson.com <span style={{ color: C.line }}>/</span> Castle Rock, CO <span style={{ color: C.line }}>/</span> remote
          <span className="cursor" aria-hidden="true" />
        </div>
        <h1
          style={{
            fontFamily: C.sans,
            fontSize: "clamp(34px, 6.5vw, 58px)",
            fontWeight: 800,
            letterSpacing: -1.8,
            lineHeight: 1.04,
            margin: "0 0 22px",
          }}
        >
          <span className="boot-line" style={{ animationDelay: "0.05s" }}>J Alex Olson builds products,</span>
          <span className="boot-line" style={{ animationDelay: "0.15s" }}>the platforms under them,</span>
          <span className="boot-line" style={{ animationDelay: "0.25s", color: C.accent }}>
            and the agents that ship both.
          </span>
        </h1>
        <p style={{ fontFamily: C.sans, fontSize: 17, lineHeight: 1.7, color: C.slate, maxWidth: 640, margin: "0 0 30px" }}>
          Founder-engineer with 10+ years across frontend, edge infrastructure, and SEO. I run four SaaS
          products and an agency's worth of production infrastructure — designed, built, secured, and
          operated with AI agents in the loop every day.
        </p>

        {/* status strip — signature element */}
        <div
          style={{
            background: C.inkPanel,
            borderRadius: 10,
            padding: "14px 18px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 26px",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 1.5, color: "#8B96A0" }}>
            SYSTEMS OPERATED
          </span>
          {[
            ["4 SaaS products", true],
            ["100+ client sites", true],
            ["Edge prerender fleet", true],
            ["Dedicated infra, 12-core", true],
          ].map(([label], i) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span
                className="dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: "#4ADE80",
                  animationDelay: `${0.7 + i * 0.18}s, ${1.6 + i * 0.18}s`,
                }}
              />
              <span style={{ fontFamily: C.mono, fontSize: 12, color: "#D7DEE9" }}>{label}</span>
            </span>
          ))}
        </div>
      </header>
      </div>

      {/* ── PRODUCTS ── */}
      <Reveal>
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 56px" }}>
        <Eyebrow>Shipped & operating</Eyebrow>
        <SectionTitle>Products I own end to end</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="pcard"
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 10,
                padding: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontFamily: C.sans, fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>{p.name}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: C.green }} />
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.green }}>LIVE</span>
                </span>
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{p.what}</div>
              <p style={{ fontFamily: C.sans, fontSize: 13.5, lineHeight: 1.65, color: C.slate, margin: "0 0 14px", flex: 1 }}>
                {p.detail}
              </p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* ── INCIDENTS ── */}
      <Reveal>
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 56px" }}>
        <Eyebrow>Problems solved</Eyebrow>
        <SectionTitle>Selected incident reports</SectionTitle>
        <p style={{ fontFamily: C.sans, fontSize: 15, lineHeight: 1.7, color: C.slate, maxWidth: 620, margin: "-14px 0 24px" }}>
          The work I'm proudest of reads like postmortems — real production problems on systems I own,
          found, fixed, and kept fixed. Tap any report for the details.
        </p>
        {INCIDENTS.map((inc) => (
          <IncidentCard key={inc.id} inc={inc} />
        ))}
      </section>
      </Reveal>

      {/* ── AI / AGENTS ── */}
      <Reveal>
      <section style={{ background: C.inkPanel, padding: "56px 0" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 2, color: "#4ADE80", textTransform: "uppercase", marginBottom: 10 }}>
            AI-native by default
          </div>
          <h2
            style={{
              fontFamily: C.sans,
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 800,
              letterSpacing: -0.8,
              color: "#F2F5F8",
              margin: "0 0 28px",
              lineHeight: 1.15,
            }}
          >
            I don't use AI tools.
            <br />I build with agents.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
            {AGENT_POINTS.map((a) => (
              <div key={a.h}>
                <div style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 700, color: "#F2F5F8", marginBottom: 8 }}>{a.h}</div>
                <p style={{ fontFamily: C.sans, fontSize: 13.5, lineHeight: 1.7, color: "#9AA6B2", margin: 0 }}>{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* ── PLATFORM ── */}
      <Reveal>
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "56px 24px" }}>
        <Eyebrow>The toolbox</Eyebrow>
        <SectionTitle>Platform fluency</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
          {PLATFORM.map((g) => (
            <div key={g.group} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontFamily: C.mono, fontSize: 10.5, letterSpacing: 1.5, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>
                {g.group}
              </div>
              {g.items.map((item) => (
                <div key={item} style={{ fontFamily: C.sans, fontSize: 13.5, color: C.slate, lineHeight: 1.5, padding: "4px 0", borderBottom: `1px solid ${C.line}` }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* ── CONTACT ── */}
      <Reveal>
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "48px 24px 64px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Eyebrow>Contact</Eyebrow>
          <h2 style={{ fontFamily: C.sans, fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 14px" }}>
            Let's build something that survives production.
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: 15, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 24px" }}>
            This page is itself a React component — no framework lock-in, deployable as a Remix route or an
            Astro island. The source is the resume.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              ["Email", "mailto:jack@levotate.com"],
              ["GitHub", "https://github.com/"],
              ["LinkedIn", "https://linkedin.com/"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: C.mono,
                  fontSize: 12.5,
                  padding: "10px 18px",
                  borderRadius: 7,
                  textDecoration: "none",
                  border: `1px solid ${label === "Email" ? C.accent : C.line}`,
                  background: label === "Email" ? "rgba(232,99,28,0.08)" : C.card,
                  color: label === "Email" ? C.accent : C.slate,
                }}
              >
                {label} ↗
              </a>
            ))}
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.faint, marginTop: 36, lineHeight: 1.9 }}>
            Motion respects prefers-reduced-motion · fully keyboard navigable · zero animation dependencies — all
            motion is hand-rolled CSS
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, marginTop: 10 }}>
            © {new Date().getFullYear()} J Alex Olson · Built with React, shipped from the edge.
          </div>
        </div>
      </footer>
      </Reveal>
    </div>
  );
}