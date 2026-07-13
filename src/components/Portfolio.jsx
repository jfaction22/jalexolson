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
  faint: "#5D6873",
  line: "#E3E6E3",
  accent: "#E8631C",
  accentText: "#A8440E",
  accentSoft: "rgba(232,99,28,0.08)",
  green: "#1F7A4D",
  panel: "#131A21",
  panelText: "#E8ECEF",
  panelFaint: "#9AA6B0",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};

// ───────────── DATA (edit freely) ─────────────

const MARQUEE = [
  "React", "TypeScript", "AI agents", "Cloudflare Workers", "Vite",
  "Automations", "Supabase", "TanStack", "SEO", "Stripe", "Performance",
];

const SERVICES = [
  {
    icon: "code",
    featured: true,
    label: "React development · my go-to",
    benefit: "Launch the app your business actually needs",
    how:
      "Custom web apps, built and shipped: designed, deployed, documented, and handed over so you own it outright instead of renting another subscription.",
    tags: ["React", "TypeScript", "Vite", "TanStack"],
    img: "/crm-dashboard.webp",
    imgW: 1000,
    imgH: 667,
    imgAlt: "Custom CRM dashboard with pipeline, activity feed, and sales performance widgets",
    visual: "App screenshot: a custom dashboard in production",
  },
  {
    icon: "bot",
    label: "AI agents + automation",
    benefit: "Get hours of busywork back every week",
    how:
      "Invoice entry, report chasing, status updates, alerts: if your team does it by hand every week, I can probably automate it. I run fleets of these bots for my own products.",
    tags: ["LLM APIs", "Workflows", "Bots", "Node"],
    img: "/agent-workflow.webp",
    imgW: 1000,
    imgH: 527,
    imgAlt: "Multi-agent content automation workflow with research agents, planners, and writers wired together in n8n",
    visual: "Diagram: manual workflow before / automated after",
  },
  {
    icon: "gauge",
    label: "Performance + Core Web Vitals",
    benefit: "A faster site closes more customers",
    how:
      "Slow pages bleed sales and Google rankings. I find the bloat and cut it. This page is the demo: run Lighthouse on it right now.",
    tags: ["Lighthouse", "Core Web Vitals", "Bundle analysis"],
    img: "/lighthouse-100.webp",
    imgW: 1000,
    imgH: 689,
    imgAlt: "PageSpeed Insights report scoring 100 in Performance, Accessibility, Best Practices, and SEO, with 0.8s First Contentful Paint, 1.8s Largest Contentful Paint, 0ms blocking time, and zero layout shift",
    visual: "Screenshot: Lighthouse 100 / 100 / 100 / 100",
  },
  {
    icon: "search",
    label: "SEO for JavaScript apps",
    benefit: "Show up when your customers search",
    how:
      "If Google and AI assistants can't read your app, you're invisible to buyers already looking for you. I built a prerendering service for exactly this problem; it runs production traffic today.",
    tags: ["Prerendering", "Structured data", "Edge routing"],
    img: "/seo-vibe-hero.webp",
    imgW: 1000,
    imgH: 562,
    imgAlt: "SEO Vibe landing page showing what Google sees before and after prerendering: an empty root div versus full content",
    visual: "Screenshot: search results before / after prerendering",
  },
  {
    icon: "plug",
    label: "Integrations + platform work",
    benefit: "Take payments and sign-ups without the duct tape",
    how:
      "Stripe billing, Google and Microsoft login, licensing: the plumbing between demo and business. I've wired all of it for my own paying products.",
    tags: ["Stripe", "OAuth 2.0", "Supabase", "Cloudflare"],
    img: "/auth-providers.webp",
    imgW: 1000,
    imgH: 443,
    imgAlt: "Authentication provider dashboard with email, phone, SAML, Apple, Azure, GitHub, and a dozen more sign-in methods enabled",
    visual: "Screenshot: checkout and sign-in flow",
  },
  {
    icon: "globe",
    label: "Marketing sites · Astro + React",
    benefit: "A website that works while you work",
    how:
      "Fast, findable, and maintained, with hosting handled if you want it. Built on React and Astro, the same stack as this page. I've run over a hundred sites for a decade; yours won't be my first rodeo.",
    tags: ["React", "Astro", "SEO", "Hosting"],
    visual: "Screenshot: this site, which is also the sample",
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
    retired: true,
    what: "My web development and marketing agency, now sunset",
    detail:
      "Ran over a hundred WordPress sites in production on a dedicated server I administered myself. Performance, SEO, ads, backups, the works. Built up and sold a 34 client management business along the way.",
    stack: ["WordPress", "cPanel/WHM", "Cloudflare", "SEO"],
  },
];

// Side projects: smaller cards below the flagship products.
// Verify the stack tags and details, these are drafts.
const SIDE_PROJECTS = [
  {
    name: "Build a Golf Sim (BAGS)",
    detail:
      "buildagolfsim.com. Specs a complete golf simulator around your room and budget. No spreadsheet math, no guesswork.",
    stack: ["React", "Interactive builder"],
  },
  {
    name: "Levotate CRM + Ticketing",
    detail:
      "The internal platform that kept a 100+ site agency sane, built because nothing off the shelf fit how we worked.",
    stack: ["React", "Internal tools"],
  },
  {
    name: "Perfect Campsite Finder",
    detail:
      "Cross references public land, terrain, and drive time to find campsites worth the trip, not the first pin on the map.",
    stack: ["React", "Maps", "Geo data"],
  },
  {
    name: "Workout Tracker",
    detail:
      "A no fluff training log: programs, sets, progressive overload. Fast enough to use between sets.",
    stack: ["React", "Mobile-first"],
  },
  {
    name: "League Chat",
    detail:
      "Real time chat for fantasy football leagues. Smack talk threaded to matchups and trades, not lost in a group text.",
    stack: ["React", "Realtime"],
  },
  {
    name: "Colorado Snow Tracker",
    detail:
      "Live snowfall and conditions for Colorado resorts in one dashboard, so a powder day never sneaks past.",
    stack: ["React", "Data viz", "APIs"],
  },
  {
    name: "Card Vault",
    detail:
      "A Pokemon card collection manager with the capabilities of Dex: sets, variants, condition, market values.",
    stack: ["React", "Collection data"],
  },
];

const INCIDENTS = [
  {
    id: "IR-01",
    sev: "SEV-1",
    title: "Open-proxy abuse on the prerender fleet",
    problem: "prerender endpoint abused as a free rendering proxy; containers restarted 6,844 times",
    fix: "domain allowlist, per-origin rate limits at the Worker, hard container timeouts",
    outcome: "abuse traffic to zero; paying customers never saw an outage",
  },
  {
    id: "IR-02",
    sev: "SEV-2",
    title: "License gating rebuilt for OleyBot binaries",
    problem: "issued download links for licensed binaries could be shared by anyone",
    fix: "edge functions validate the license per request and issue short-lived signed URLs",
    outcome: "piracy path closed, zero added friction for real customers",
  },
  {
    id: "IR-03",
    sev: "SEV-2",
    title: "Cloudflare Workers quota exhaustion",
    problem: "traffic spike burned through the Workers request quota, every site at risk at once",
    fix: "cache in front of the Worker; tiered routing so only bot traffic pays the Worker cost",
    outcome: "request volume down an order of magnitude, headroom for the next spike",
  },
  {
    id: "IR-04",
    sev: "SEV-3",
    title: "Next.js CVE audit across client properties",
    problem: "published Next.js CVE, a hundred client properties to check by hand",
    fix: "scripted framework fingerprinting across every property, patched the exposed sites",
    outcome: "everything patched inside the disclosure window, repeatable script for the next CVE",
  },
  {
    id: "IR-05",
    sev: "SEV-2",
    title: "Prerender.io bill replaced with owned infrastructure",
    problem: "third-party prerendering priced per render: $149/mo for a handful of client sites, with the $349 tier next as traffic grew",
    fix: "built Rendr.it: Cloudflare Worker routing at the edge, self-hosted render containers on Docker behind Coolify",
    outcome: "the recurring bill became a product I own and now sell",
    saved: "$1,800+/yr",
  },
  {
    id: "IR-06",
    sev: "SEV-2",
    title: "Hosting stack costing $12k/yr, rebuilt for $2k",
    problem: "Flywheel at $425/mo on top of a $7,000/yr dedicated server, disk near capacity, backups eating local storage",
    fix: "migrated every site off Flywheel, downgraded to a right-sized $2,000/yr server, stood up Coolify with Docker and PM2, scripted cloud backups to Google Drive",
    outcome: "every site faster than before, on a fraction of the spend, deploying on git push",
    saved: "$10,100+/yr",
  },
  {
    id: "IR-07",
    sev: "SEV-3",
    title: "Subscription sprawl replaced with software I built",
    problem: "$1,195/mo across 18 SaaS subscriptions: email platforms, scrapers, SEO suites, automation tools",
    fix: "replaced the bulk with my own software: Bonsai Mail for Mailchimp and Instantly, SEO Vibe for Moz, my agent fleet for the Zapier and Apify jobs",
    outcome: "the subscriptions that survive are the ones that earn their bill",
    saved: "$9,000+/yr",
  },
  {
    id: "IR-08",
    sev: "SEV-3",
    title: "A headless CMS and SEO pipeline, end to end",
    problem: "retail client's React app invisible to search: no structured data, and a script-stripping bug corrupting prerendered HTML in two layers",
    fix: "Sanity Studio on their subdomain, JSON-LD structured data layer, fixed the prerender proxy, added AI crawler support",
    outcome: "marketers publish in Sanity; crawlers get complete structured HTML at the edge",
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
  bot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4M9 4h6" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    </>
  ),
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
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18" />
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

function ArchMark() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      style={{ flexShrink: 0 }}
    >
      <path d="M1.5 10 V6 A4.5 4.5 0 0 1 10.5 6 V10" />
    </svg>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: C.mono,
        fontSize: 12,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: C.accentText,
        marginBottom: 14,
      }}
    >
      <ArchMark />
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
      className="pf-shell"
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: C.sans,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        /* dot grid + faint arch tattoo, staggered like a brick pattern */
        .pf-shell {
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M29 42 V35 a7 7 0 0 1 14 0 V42' fill='none' stroke='%23E8631C' stroke-opacity='0.09' stroke-width='1.5'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M29 42 V35 a7 7 0 0 1 14 0 V42' fill='none' stroke='%23E8631C' stroke-opacity='0.09' stroke-width='1.5'/%3E%3C/svg%3E"),
            radial-gradient(rgba(24,32,40,0.075) 1px, transparent 1px);
          background-size: 144px 144px, 144px 144px, 22px 22px;
          background-position: 0 0, 72px 72px, 0 0;
          overflow-x: clip;
        }
        .pf-shell ::selection { background: rgba(232,99,28,0.25); }
        /* highlighter swipe on the headline's key phrase */
        .pf-hl {
          background-image: linear-gradient(100deg,
            rgba(232,99,28,0) 0.5%, rgba(232,99,28,0.24) 3%,
            rgba(232,99,28,0.24) 97%, rgba(232,99,28,0) 99.5%);
          background-repeat: no-repeat;
          background-position: 0 72%;
          animation: pf-swipe .55s ease .6s both;
        }
        @keyframes pf-swipe {
          from { background-size: 0% 42%; }
          to { background-size: 100% 42%; }
        }
        /* full-bleed marquee: transform-only, pauses on hover */
        .pf-marquee {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          overflow: hidden;
          border-top: 1px solid ${C.line};
          border-bottom: 1px solid ${C.line};
          background: ${C.card};
          padding: 13px 0;
        }
        .pf-marquee-track {
          display: flex;
          width: max-content;
          animation: pf-scroll 32s linear infinite;
        }
        .pf-marquee:hover .pf-marquee-track { animation-play-state: paused; }
        .pf-marquee-row { display: flex; align-items: center; }
        .pf-m-item {
          font-family: ${C.mono};
          font-size: 12px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: ${C.slate};
          padding: 0 16px;
          white-space: nowrap;
        }
        .pf-m-sep { color: ${C.accent}; font-size: 11px; }
        @keyframes pf-scroll { to { transform: translateX(-50%); } }
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
        @keyframes pf-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        /* hero intro: pure CSS, runs on load. Text fades in quickly;
           the photo animates transform only so LCP is never delayed. */
        .pf-intro > * { animation: pf-rise .5s ease both; }
        .pf-intro > *:nth-child(1) { animation-delay: .05s; }
        .pf-intro > *:nth-child(2) { animation-delay: .12s; }
        .pf-intro > *:nth-child(3) { animation-delay: .2s; }
        .pf-intro > *:nth-child(4) { animation-delay: .28s; }
        .pf-intro > *:nth-child(5) { animation-delay: .36s; }
        /* hero CTA: matches the outlined orange offset-shadow style */
        .pf-cta {
          display: inline-block;
          font-family: ${C.mono};
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: ${C.accentText};
          background: ${C.accentSoft};
          border: 1px solid ${C.accent};
          padding: 14px 56px;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 3px 3px 0 ${C.accent};
          transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .pf-cta:hover {
          background: rgba(232,99,28,0.14);
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 ${C.accent};
        }
        @keyframes pf-settle {
          from { transform: translateY(22px); }
          to { transform: translateY(0); }
        }
        /* scroll reveals: hidden ONLY after hydration (.pf-hydrated),
           so the page is complete for crawlers and no-JS visitors */
        .pf-hydrated .pf-reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity .55s ease, transform .55s ease;
        }
        .pf-hydrated .pf-reveal.pf-in { opacity: 1; transform: none; }
        /* cards stagger in behind their section (animation, not
           transition, so hover transforms stay instant) */
        .pf-hydrated .pf-reveal .pf-card { opacity: 0; }
        .pf-hydrated .pf-reveal.pf-in .pf-card { animation: pf-rise .5s ease both; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(2) { animation-delay: .07s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(3) { animation-delay: .14s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(4) { animation-delay: .21s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(5) { animation-delay: .28s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(6) { animation-delay: .35s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(7) { animation-delay: .42s; }
        /* nav underline sweep */
        .pf-nav a { position: relative; }
        .pf-nav a::after {
          content: "";
          position: absolute; left: 0; bottom: -3px;
          width: 100%; height: 1.5px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
        }
        .pf-nav a:hover::after, .pf-nav a:focus-visible::after { transform: scaleX(1); }
        /* keyboard navigation: visible focus everywhere */
        .pf-root a:focus-visible, .pf-root button:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }
        .pf-hero { display: grid; grid-template-columns: 1.2fr .8fr; gap: 44px; align-items: center; }
        /* arch frame: top corners fully round (browser clamps 999px
           to half the width), bottom matches the card radius */
        .pf-hero-photo { --pf-arch: 999px 999px 22px 22px; }
        /* Shadow lives on the wrapper so it traces the arch and the
           offset panel together. */
        .pf-photo-frame {
          position: relative;
          /* reserve room for the offset accent panel so it never
             overflows the layout and causes horizontal scroll */
          margin: 0 12px 12px 0;
          filter: drop-shadow(0 8px 18px rgba(24, 32, 40, 0.10))
                  drop-shadow(0 22px 56px rgba(24, 32, 40, 0.14));
          animation: pf-settle .7s ease both;
          transition: transform .3s ease, filter .3s ease;
        }
        .pf-hydrated .pf-photo-frame:hover {
          transform: translateY(-4px);
          filter: drop-shadow(0 10px 22px rgba(24, 32, 40, 0.12))
                  drop-shadow(0 30px 68px rgba(24, 32, 40, 0.17));
        }
        .pf-photo-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translate(12px, 12px);
          background: ${C.accent};
          opacity: 0.9;
          border-radius: var(--pf-arch);
        }
        .pf-photo { width: 100%; height: auto; display: block; position: relative; border-radius: var(--pf-arch); }
        /* ── stats strip: numbers instead of paragraphs ── */
        .pf-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 46px;
          border-top: 1px solid ${C.line};
          animation: pf-rise .6s ease .45s both;
        }
        .pf-stat { padding: 18px 18px 0 0; }
        .pf-stat + .pf-stat { border-left: 1px solid ${C.line}; padding-left: 18px; }
        .pf-stat-n {
          font-family: ${C.mono};
          font-weight: 700;
          font-size: clamp(24px, 3.4vw, 38px);
          letter-spacing: -1px;
          color: ${C.ink};
        }
        .pf-stat-l {
          font-family: ${C.mono};
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: ${C.faint};
          margin-top: 4px;
        }
        /* ── the deck: services as sticky stacking cards ──
           Pure CSS: each card pins below the header and the next
           one scrolls up and over it. Offsets leave a 12px peek
           of each covered card, like a deck edge. */
        .pf-stack { display: grid; gap: 30px; }
        .pf-stack-card {
          position: sticky;
          top: calc(74px + (var(--i) * 12px));
          min-height: min(64vh, 620px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 40px;
          align-items: center;
          background: ${C.card};
          border: 1px solid ${C.line};
          border-radius: 18px;
          padding: 40px 44px;
        }
        .pf-stack-card:first-child {
          background: #FDF1E9;
          border-color: rgba(232,99,28,0.4);
          box-shadow: 0 10px 28px rgba(24,32,40,0.06);
        }
        /* image placeholder: swap for a real <img loading="lazy"> later */
        .pf-ph {
          border: 2px dashed rgba(232,99,28,0.45);
          border-radius: 14px;
          background: rgba(232,99,28,0.05);
          aspect-ratio: 4 / 3;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 20px;
        }
        @media (max-width: 860px) {
          .pf-stack-card {
            grid-template-columns: 1fr;
            gap: 22px;
            min-height: 0;
            padding: 26px 22px;
            align-items: start;
          }
          .pf-ph { aspect-ratio: 16 / 10; }
        }
        /* ── the ledger: products as expandable ruled rows ── */
        .pf-ledger { border-top: 1px solid ${C.line}; }
        .pf-lrow { border-bottom: 1px solid ${C.line}; }
        .pf-lrow summary {
          list-style: none;
          cursor: pointer;
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 16px 12px;
          transition: background .2s ease;
        }
        .pf-lrow summary::-webkit-details-marker { display: none; }
        .pf-hydrated .pf-lrow summary:hover { background: ${C.card}; }
        .pf-lrow[open] summary { background: rgba(232,99,28,0.05); }
        .pf-lbody { padding: 6px 12px 20px 34px; }
        .pf-plus {
          font-family: ${C.mono};
          font-size: 18px;
          color: ${C.accentText};
          width: 22px;
          text-align: center;
          transition: transform .25s ease;
        }
        details[open] > summary .pf-plus { transform: rotate(45deg); }
        /* ── the bento: flagship products in varied tiles ── */
        .pf-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .pf-b-tile {
          border: 1px solid ${C.line};
          border-radius: 14px;
          background: ${C.card};
          padding: 20px 22px;
          transition: border-color .2s ease, transform .2s ease;
        }
        .pf-hydrated .pf-b-tile:hover { border-color: ${C.accent}; transform: translateY(-2px); }
        .pf-b-feat {
          grid-column: span 2;
          background: #FDF1E9;
          border-color: rgba(232,99,28,0.4);
        }
        @media (max-width: 900px) {
          .pf-bento { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pf-bento { grid-template-columns: 1fr; }
          .pf-b-feat { grid-column: auto; }
        }
        /* ── the terminal: incidents as a live console ── */
        .pf-term {
          background: ${C.panel};
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 18px 44px rgba(24,32,40,0.18);
        }
        .pf-term-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #0D1319;
          padding: 11px 16px;
        }
        .pf-term-dot { width: 11px; height: 11px; border-radius: 999px; }
        .pf-term-title {
          font-family: ${C.mono};
          font-size: 11.5px;
          color: ${C.panelFaint};
          margin-left: 10px;
        }
        .pf-term-body {
          font-family: ${C.mono};
          font-size: 12.5px;
          line-height: 1.7;
          color: #C7D0D8;
          padding: 20px 22px 22px;
        }
        .pf-term-cmd { color: ${C.panelFaint}; margin-bottom: 14px; }
        .pf-term-entry { margin-bottom: 18px; }
        .pf-term-head { color: ${C.panelText}; font-weight: 700; }
        .pf-term-id { color: ${C.accent}; font-weight: 400; }
        .pf-term-kv {
          display: grid;
          grid-template-columns: 76px 1fr;
          gap: 10px;
          padding-left: 14px;
        }
        .pf-term-k { color: ${C.accent}; }
        .pf-term-ok { color: #3FCF8E; }
        .pf-term-saved { color: #3FCF8E; font-weight: 700; }
        .pf-cursor { display: inline-block; width: 8px; background: #C7D0D8; }
        .pf-hydrated .pf-cursor { animation: pf-blink 1.1s steps(1) infinite; }
        @keyframes pf-blink { 50% { opacity: 0; } }
        /* ── ghost labels on section edges ── */
        .pf-ghost {
          position: absolute;
          top: 20px;
          right: 4px;
          writing-mode: vertical-rl;
          font-family: ${C.mono};
          font-weight: 800;
          font-size: clamp(56px, 7vw, 92px);
          letter-spacing: 8px;
          color: transparent;
          -webkit-text-stroke: 1px rgba(24,32,40,0.10);
          user-select: none;
          pointer-events: none;
        }
        /* render perf for sections below the services deck only.
           Excluded: the hero (content-visibility's paint containment
           would clip the photo's drop shadow) and the services
           section (containment breaks the sticky stacking cards
           and would clip their shadows). */
        section:nth-of-type(n+3) { content-visibility: auto; contain-intrinsic-size: auto 600px; }
        @media (max-width: 1200px) {
          .pf-ghost { display: none; }
        }
        @media (max-width: 760px) {
          .pf-hero { grid-template-columns: 1fr; gap: 28px; }
          .pf-hero-photo { max-width: 420px; }
          .pf-stats { grid-template-columns: 1fr 1fr; }
          .pf-stat:nth-child(3) { border-left: none; padding-left: 0; }
          .pf-stat { padding-top: 14px; }
        }
        .pf-card { transition: background .2s ease; }
        @media (prefers-reduced-motion: reduce) {
          .pf-hydrated .pf-reveal { opacity: 1; transform: none; transition: none; }
          .pf-hydrated .pf-dot { animation: none; }
          .pf-intro > *, .pf-photo-frame, .pf-stats, .pf-hydrated .pf-reveal.pf-in .pf-card { animation: none; opacity: 1; }
          .pf-hydrated .pf-reveal .pf-card { opacity: 1; }
          .pf-hydrated .pf-photo-frame:hover { transform: none; }
          .pf-nav a::after { transition: none; }
          .pf-cta { transition: none; }
          .pf-cta:hover { transform: none; }
          .pf-marquee-track { animation: none; }
          .pf-hl { animation: none; background-size: 100% 42%; }
          .pf-plus, .pf-lrow summary, .pf-b-tile { transition: none; }
          .pf-hydrated .pf-b-tile:hover { transform: none; }
          .pf-hydrated .pf-cursor { animation: none; }
        }
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
          <nav className="pf-nav" aria-label="Sections" style={{ display: "flex", gap: 18, fontFamily: C.mono, fontSize: 12 }}>
            <a href="#work" style={{ color: C.slate, textDecoration: "none" }}>Work</a>
            <a href="#incidents" style={{ color: C.slate, textDecoration: "none" }}>Incidents</a>
            <a href="#contact" style={{ color: C.accentText, textDecoration: "none" }}>Hire me</a>
          </nav>
        </header>

        <main>

        {/* hero */}
        <section aria-labelledby="hero-title" style={{ padding: "64px 0 56px" }}>
          <div className="pf-hero">
            <div className="pf-intro">
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
                I build <span className="pf-hl">bespoke apps</span> tailored to what people actually want.
              </h1>
              <p style={{ fontSize: 17, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 26px" }}>
                I have 12+ years building for the web. I sold off a WordPress agency that had over 100 clients in its heyday.
                I've built 5 different SaaS products, dozens of AI automations and agents.
              </p>
              <div>
                <a href="#contact" className="pf-cta">Hire Me</a>
              </div>
            </div>
            <div className="pf-hero-photo">
              <div className="pf-photo-frame">
                <img
                  className="pf-photo"
                  src={PHOTO}
                  srcSet="/jack-maroon-bells-480.webp 480w, /jack-maroon-bells.webp 780w"
                  sizes="(max-width: 760px) 90vw, 400px"
                  alt="Alex Olson standing at Maroon Lake below the Maroon Bells near Aspen, Colorado"
                  width="780"
                  height="1040"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* stats strip: the resume paragraph, as numbers */}
          <div className="pf-stats">
            {[
              ["14+", "years building for the web"],
              ["5", "SaaS products shipped"],
              ["150+", "sites managed"],
              ["$20k+", "yearly costs cut with my own tools"],
            ].map(([n, l]) => (
              <div key={l} className="pf-stat">
                <div className="pf-stat-n">{n}</div>
                <div className="pf-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* marquee: decorative, so aria-hidden; content exists elsewhere */}
        <div className="pf-marquee" aria-hidden="true">
          <div className="pf-marquee-track">
            {[0, 1].map((i) => (
              <div key={i} className="pf-marquee-row">
                {MARQUEE.map((m) => (
                  <span key={m} className="pf-m-item">
                    {m} <span className="pf-m-sep"> ✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* services: sticky stacking deck (no pf-reveal here, a
            transformed ancestor would break position: sticky) */}
        <section aria-labelledby="services-title" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>For clients</Eyebrow>
          <h2 id="services-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            What hiring me actually gets you
          </h2>
          <div className="pf-stack">
            {SERVICES.map((s, i) => (
              <div key={s.benefit} className="pf-stack-card" style={{ "--i": i }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: C.accentText }}>
                    <Icon name={s.icon} />
                    <span style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "clamp(24px, 3.6vw, 40px)", letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 16 }}>
                    {s.benefit}
                  </div>
                  <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 520 }}>{s.how}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
                {s.img ? (
                  <img
                    src={s.img}
                    alt={s.imgAlt}
                    width={s.imgW}
                    height={s.imgH}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 14,
                      border: `1px solid ${C.line}`,
                      boxShadow: "0 10px 30px rgba(24,32,40,0.10)",
                    }}
                  />
                ) : (
                  <div className="pf-ph">
                    <div>
                      <div style={{ color: C.accentText, marginBottom: 10, display: "flex", justifyContent: "center" }}>
                        <Icon name={s.icon} />
                      </div>
                      <div style={{ fontFamily: C.mono, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.accentText, marginBottom: 6 }}>
                        Image placeholder
                      </div>
                      <div style={{ fontFamily: C.mono, fontSize: 12, color: C.faint }}>{s.visual}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* the zero-friction closer */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px 22px",
              padding: "34px 12px 0",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Not sure which one you need?
            </div>
            <div style={{ fontSize: 14, color: C.slate }}>
              Tell me the problem, I'll tell you the fix. That part's free.
            </div>
            <a
              href="mailto:jack@jalexolson.com"
              style={{
                fontFamily: C.mono,
                fontSize: 13,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.accent}`,
                background: C.accentSoft,
                color: C.accentText,
                boxShadow: `3px 3px 0 ${C.accent}`,
              }}
            >
              Describe your problem ↗
            </a>
          </div>
        </section>

        {/* products */}
        <section id="work" aria-labelledby="work-title" className="pf-reveal" style={{ padding: "26px 0 54px", position: "relative" }}>
          <div className="pf-ghost" aria-hidden="true">SHIPPED</div>
          <Eyebrow>Shipped and still running</Eyebrow>
          <h2 id="work-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            Things I built and operate
          </h2>
          <div className="pf-bento">
            {PRODUCTS.map((p, i) => (
              <article key={p.name} className={i === 0 ? "pf-card pf-b-tile pf-b-feat" : "pf-card pf-b-tile"}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  {p.retired ? (
                    <span
                      aria-hidden="true"
                      style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: C.faint }}
                    />
                  ) : (
                    <LiveDot />
                  )}
                  <h3 style={{ fontSize: i === 0 ? 20 : 16, fontWeight: 800, margin: 0 }}>{p.name}</h3>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.accentText, marginBottom: 10 }}>{p.what}</div>
                <p style={{ fontSize: i === 0 ? 14 : 13.5, color: C.slate, lineHeight: 1.6, margin: "0 0 14px" }}>{p.detail}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* side projects: compact rows in the same ledger */}
          <div
            style={{
              fontFamily: C.mono,
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: C.faint,
              margin: "34px 0 0",
            }}
          >
            Side projects and experiments
          </div>
          <div className="pf-ledger" style={{ marginTop: 12 }}>
            {SIDE_PROJECTS.map((p) => (
              <details key={p.name} className="pf-card pf-lrow">
                <summary>
                  <span aria-hidden="true" style={{ fontFamily: C.mono, fontSize: 13, color: C.accentText }}>▸</span>
                  <span style={{ fontSize: 14.5, fontWeight: 700 }}>{p.name}</span>
                  <span />
                  <span className="pf-plus" aria-hidden="true">+</span>
                </summary>
                <div className="pf-lbody">
                  <p style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, margin: 0, maxWidth: 640 }}>{p.detail}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* incident reports */}
        <section id="incidents" aria-labelledby="incidents-title" className="pf-reveal" style={{ padding: "26px 0 54px", position: "relative" }}>
          <div className="pf-ghost" aria-hidden="true">PAGED</div>
          <Eyebrow>Selected incident reports</Eyebrow>
          <h2 id="incidents-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 26px" }}>
            Problems I've actually been paged for
          </h2>
          <div className="pf-term">
            <div className="pf-term-bar">
              <span className="pf-term-dot" style={{ background: C.accent }} />
              <span className="pf-term-dot" style={{ background: "#F2C744" }} />
              <span className="pf-term-dot" style={{ background: "#3FCF8E" }} />
              <span className="pf-term-title">alex@edge: ~/ops</span>
            </div>
            <div className="pf-term-body">
              <div className="pf-term-cmd">$ tail -f incidents.log</div>
              {INCIDENTS.map((ir) => (
                <div key={ir.id} className="pf-term-entry">
                  <div className="pf-term-head">
                    <span className="pf-term-id">[{ir.id}]</span> <span className="pf-term-id">[{ir.sev}]</span> {ir.title}
                  </div>
                  <div className="pf-term-kv"><span className="pf-term-k">problem</span><span>{ir.problem}</span></div>
                  <div className="pf-term-kv"><span className="pf-term-k">fix</span><span>{ir.fix}</span></div>
                  <div className="pf-term-kv">
                    <span className="pf-term-k">outcome</span>
                    <span>{ir.outcome} <span className="pf-term-ok">✓ resolved</span>{ir.saved ? <span className="pf-term-saved"> [{ir.saved} saved]</span> : null}</span>
                  </div>
                </div>
              ))}
              <div aria-hidden="true">$ <span className="pf-cursor">&nbsp;</span></div>
            </div>
          </div>
        </section>

        </main>

        {/* contact */}
        <footer id="contact" style={{ padding: "26px 0 64px", borderTop: `1px solid ${C.line}` }}>
          <Eyebrow>Contact</Eyebrow>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 14px" }}>
            Have a project? Let's talk.
          </h2>
          <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 24px" }}>
            Tell me what you're building and what's in the way. Honest read within a day.
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
                  boxShadow: label === "Email" ? `3px 3px 0 ${C.accent}` : "none",
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