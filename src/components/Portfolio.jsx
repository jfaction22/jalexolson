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
    img: "/legendary-organics.webp",
    imgW: 1000,
    imgH: 511,
    imgAlt: "Legendary Organics dispensary website hero: Be Legendary. Be You. with location shop buttons over a photo of the store interior",
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
    img: "/rendrit-dashboard.webp",
    imgAlt: "Rendr.it prerender dashboard: 610 active URLs, 100 percent success rate, prerender activity and cache hit rate charts, 5,781 pages tracked",
  },
  {
    name: "OleyBot",
    img: "/oleybot.webp",
    imgAlt: "OleyBot landing page: Be first to the drop, with the Discord restock monitor dashboard showing live watching status and recent catches",
    what: "Licensed desktop automation for streamers and TCG collectors",
    detail:
      "Commercial desktop app with license validation, gated binary distribution through Supabase Edge Functions and signed URLs, and Stripe billing. If your product needs licensing or payments, I've built that end to end.",
    stack: ["Supabase", "Edge Functions", "React", "Stripe"],
  },
  {
    name: "Bonsai Mail",
    img: "/bonsai-mail.webp",
    imgAlt: "Bonsai Mail campaign analytics: 6.7K emails sent, 4.44 percent reply rate, 44 opportunities worth 22,000 dollars",
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
    img: "/levotate.webp",
    imgAlt: "Levotate agency site: next-level lead generation for local businesses, with a client website preview",
    retired: true,
    what: "My web development and marketing agency, now sunset",
    detail:
      "Ran over a hundred WordPress sites in production on a dedicated server I administered myself. Performance, SEO, ads, backups, the works. Built up and sold a 34 client management business along the way.",
    stack: ["WordPress", "cPanel/WHM", "Cloudflare", "SEO"],
  },
];

// Side projects: smaller cards below the flagship products.
// Verify the stack tags and details, these are drafts.
// Rent vs own: the argument, one row at a time.
const VERSUS = [
  { dim: "Month one", rent: "Cheaper. That's the hook.", own: "An investment with an end date." },
  { dim: "Year three", rent: "A $500/mo tool is $18,000 gone. You own nothing.", own: "Paid for itself. Costs $0/mo, forever." },
  { dim: "Price increases", rent: "Whenever they feel like it.", own: "There is no price. You own it." },
  { dim: "The feature you need", rent: "Upvote it. Wait. Hope.", own: "I build it. Usually that week." },
  { dim: "Your data", rent: "Hostage in their cloud.", own: "On your server. Yours." },
  { dim: "They get acquired", rent: "Sunset email, 30 days to migrate.", own: "Nothing happens. It's yours." },
  { dim: "When you stop paying", rent: "Everything disappears.", own: "There's nothing to stop paying." },
];

// The receipt: bills eliminated by building instead of renting.
const SAVINGS = [
  { item: "Prerender.io", note: "replaced with Rendr.it, my own prerender fleet", amount: "$1,800" },
  { item: "Flywheel hosting", note: "every site migrated to my own server", amount: "$5,100" },
  { item: "Dedicated server", note: "right-sized, backups scripted to the cloud", amount: "$5,000" },
  { item: "SaaS subscriptions (x18)", note: "replaced with software I built", amount: "$9,000" },
];

const SIDE_PROJECTS = [
  {
    name: "Build a Golf Sim (BAGS)",
    img: "/bags.webp",
    imgAlt: "buildagolfsim.com component builder comparing launch monitors, projectors, and screens across retailers with live prices and compatibility checks",
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
    name: "CampSpot Finder",
    detail:
      "Ranks Colorado camping lots by sun position, shade, hookups, and ten rating criteria, with month-by-month sun modeling and illustrated campground maps.",
    stack: ["React", "Maps", "Geo data"],
    img: "/campspot-finder.webp",
    imgAlt: "CampSpot Finder ranking Colorado camping lots by overall score, with June sun position, shade and accessibility ratings, and an illustrated Jellystone Park campground map",
  },
  {
    name: "Workout Tracker",
    img: "/workout-tracker.webp",
    imgAlt: "Spartan 300 workout tracker with progress bars and rep counters for pull-ups, deadlifts, and push-ups",
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

// The salon wall: every project, one gallery.
// kind: "live" | "side" | "retired" | "wip" drives the frame badge.
const GALLERY = [
  ...PRODUCTS.map((p) => ({ ...p, kind: p.retired ? "retired" : "live" })),
  ...SIDE_PROJECTS.map((p) => ({ ...p, kind: "side" })),
];

const BADGES = {
  live: { label: "Live", color: "#1F7A4D", border: "rgba(31,122,77,0.4)" },
  side: { label: "Side project", color: "#5D6873", border: "#E3E6E3" },
  retired: { label: "Retired", color: "#5D6873", border: "#E3E6E3" },
  wip: { label: "In progress", color: "#A8440E", border: "rgba(232,99,28,0.5)" },
};

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
  const spotRef = useRef(null);
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

    // Spotlight reel: scale each card by its distance from center,
    // and auto-advance like a marquee until the user takes the wheel.
    const spot = spotRef.current;
    let spotCleanup = () => {};
    if (spot) {
      const cards = Array.from(spot.children);
      let raf = 0;
      const paint = () => {
        raf = 0;
        const mid = spot.scrollLeft + spot.clientWidth / 2;
        for (const c of cards) {
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) / spot.clientWidth;
          const t = Math.max(0, 1 - d * 2.2);
          c.style.setProperty("--s", (0.88 + 0.16 * t).toFixed(3));
          c.style.setProperty("--o", (0.55 + 0.45 * t).toFixed(3));
          c.classList.toggle("pf-spot-live", t > 0.85);
        }
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
      spot.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      paint();

      let idx = 0;
      let hold = 0;
      const center = (i) => {
        const c = cards[i];
        spot.scrollTo({ left: c.offsetLeft - (spot.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
      };
      center(0);
      let timer = 0;
      if (!reduce) {
        timer = window.setInterval(() => {
          if (Date.now() < hold || document.hidden) return;
          idx = (idx + 1) % cards.length;
          center(idx);
        }, 4200);
        const pause = () => {
          hold = Date.now() + 9000;
          const mid = spot.scrollLeft + spot.clientWidth / 2;
          idx = cards.reduce((best, c, i) =>
            Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) <
            Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid) ? i : best, 0);
        };
        spot.addEventListener("pointerdown", pause, { passive: true });
        spot.addEventListener("wheel", pause, { passive: true });
        spot.addEventListener("touchstart", pause, { passive: true });
      }
      spotCleanup = () => {
        spot.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (timer) clearInterval(timer);
        if (raf) cancelAnimationFrame(raf);
      };
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
      spotCleanup();
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
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(8) { animation-delay: .49s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(9) { animation-delay: .56s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(10) { animation-delay: .63s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(11) { animation-delay: .7s; }
        .pf-hydrated .pf-reveal.pf-in .pf-card:nth-child(12) { animation-delay: .77s; }
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 28px;
          background: ${C.card};
          border: 1px solid ${C.line};
          border-radius: 18px;
          padding: 36px 44px 40px;
        }
        .pf-stack-text { text-align: center; max-width: 680px; margin: 0 auto; }
        .pf-stack-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          color: ${C.accentText};
          font-family: ${C.mono};
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }
        .pf-stack-media { display: flex; justify-content: center; }
        .pf-stack-media img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 460px;
          border-radius: 14px;
          border: 1px solid ${C.line};
          box-shadow: 0 10px 30px rgba(24,32,40,0.10);
        }
        .pf-stack-media .pf-ph { width: 100%; max-width: 720px; aspect-ratio: 16 / 7; }
        .pf-stack-card:first-child {
          background: #FDF1E9;
          border-color: rgba(232,99,28,0.4);
          box-shadow: 0 10px 28px rgba(24,32,40,0.06);
        }
        /* image placeholder: swap for a real <img loading="lazy"> later */
        .pf-ph {
          border-radius: 14px;
          background: rgba(24,32,40,0.045);
          aspect-ratio: 4 / 3;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 20px;
        }
        @media (max-width: 860px) {
          .pf-stack-card {
            min-height: 0;
            gap: 20px;
            padding: 26px 22px 30px;
          }
          .pf-ph { aspect-ratio: 16 / 10; }
        }
        /* ── the spotlight reel: every project on a center-stage
           carousel. Scroll-snap + a tiny scale-by-distance script;
           the centered card is the exhibit, neighbors recede. ── */
        .pf-spot {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 26px calc(50% - 190px) 34px;
          scrollbar-width: none;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        .pf-spot::-webkit-scrollbar { display: none; }
        .pf-spot-card {
          flex: 0 0 380px;
          scroll-snap-align: center;
          position: relative;
          background: ${C.card};
          border: 1px solid ${C.line};
          border-radius: 16px;
          padding: 12px 12px 18px;
          box-shadow: 0 10px 26px rgba(24,32,40,0.07);
          transform: scale(var(--s, 0.88));
          opacity: var(--o, 0.55);
          transition: box-shadow .3s ease;
          will-change: transform, opacity;
        }
        .pf-spot-live { box-shadow: 0 18px 40px rgba(24,32,40,0.13); }
        .pf-gart {
          aspect-ratio: 16 / 10;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(24,32,40,0.045);
          font-family: ${C.mono};
          font-size: 10px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: ${C.faint};
          overflow: hidden;
        }
        .pf-gart img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pf-gretired .pf-gart img { filter: grayscale(1); opacity: 0.9; }
        .pf-gbadge {
          position: absolute;
          top: -10px;
          left: 16px;
          z-index: 2;
          font-family: ${C.mono};
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          background: #FFFFFF;
          border: 1px solid;
          border-radius: 999px;
          padding: 3px 9px;
        }
        .pf-gplaque { padding: 14px 6px 0; }
        .pf-gname { font-size: 15px; font-weight: 800; }
        .pf-gwhat { font-size: 12.5px; font-weight: 700; color: ${C.accentText}; margin: 4px 0 7px; }
        .pf-gdesc {
          font-size: 12.5px;
          color: ${C.slate};
          line-height: 1.6;
          margin: 0 0 9px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 4.3em;
        }
        .pf-gmedium {
          font-family: ${C.mono};
          font-size: 10.5px;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: ${C.faint};
        }
        @media (max-width: 560px) {
          .pf-spot { padding: 26px calc(50% - 150px) 30px; gap: 16px; }
          .pf-spot-card { flex-basis: 300px; }
        }
        /* ── the versus ledger: rent vs own ── */
        .pf-vs { border-top: 1px solid ${C.line}; }
        .pf-vs-head {
          display: grid;
          grid-template-columns: 150px 1fr 1fr;
          gap: 18px;
          padding: 12px 12px 10px;
          border-bottom: 1px solid ${C.line};
          font-family: ${C.mono};
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }
        .pf-vs-row {
          display: grid;
          grid-template-columns: 150px 1fr 1fr;
          gap: 18px;
          padding: 14px 12px;
          border-bottom: 1px solid ${C.line};
          align-items: baseline;
        }
        .pf-vs-dim {
          font-family: ${C.mono};
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: ${C.faint};
        }
        .pf-vs-rent { font-size: 14px; color: ${C.faint}; }
        .pf-vs-own { font-size: 14px; font-weight: 700; }
        .pf-vs-x { color: ${C.faint}; margin-right: 7px; }
        .pf-vs-c { color: ${C.accent}; margin-right: 7px; }
        @media (max-width: 700px) {
          .pf-vs-head { display: none; }
          .pf-vs-row { grid-template-columns: 1fr; gap: 6px; padding: 16px 12px; }
        }
        /* ── the receipt: savings as a thermal-paper artifact ── */
        .pf-receipt-wrap { display: flex; justify-content: center; padding: 6px 0 10px; }
        .pf-receipt {
          width: min(430px, 100%);
          background: #FFFFFF;
          font-family: ${C.mono};
          color: ${C.ink};
          padding: 30px 26px 42px;
          position: relative;
          transform: rotate(-1.2deg);
          filter: drop-shadow(0 18px 36px rgba(24,32,40,0.16));
          clip-path: polygon(
            0 0, 100% 0,
            100% calc(100% - 11px), 97.5% 100%, 95% calc(100% - 11px),
            92.5% 100%, 90% calc(100% - 11px), 87.5% 100%, 85% calc(100% - 11px),
            82.5% 100%, 80% calc(100% - 11px), 77.5% 100%, 75% calc(100% - 11px),
            72.5% 100%, 70% calc(100% - 11px), 67.5% 100%, 65% calc(100% - 11px),
            62.5% 100%, 60% calc(100% - 11px), 57.5% 100%, 55% calc(100% - 11px),
            52.5% 100%, 50% calc(100% - 11px), 47.5% 100%, 45% calc(100% - 11px),
            42.5% 100%, 40% calc(100% - 11px), 37.5% 100%, 35% calc(100% - 11px),
            32.5% 100%, 30% calc(100% - 11px), 27.5% 100%, 25% calc(100% - 11px),
            22.5% 100%, 20% calc(100% - 11px), 17.5% 100%, 15% calc(100% - 11px),
            12.5% 100%, 10% calc(100% - 11px), 7.5% 100%, 5% calc(100% - 11px),
            2.5% 100%, 0 calc(100% - 11px)
          );
        }
        .pf-r-head { text-align: center; margin-bottom: 16px; }
        .pf-r-title { font-size: 15px; font-weight: 800; letter-spacing: 3px; }
        .pf-r-sub { font-size: 11px; color: ${C.faint}; letter-spacing: 1.6px; margin-top: 4px; }
        .pf-r-rule { border: none; border-top: 1.5px dashed rgba(24,32,40,0.3); margin: 14px 0; }
        .pf-r-row { display: flex; align-items: baseline; gap: 8px; font-size: 13px; font-weight: 700; }
        .pf-r-dots { flex: 1; border-bottom: 2px dotted rgba(24,32,40,0.35); transform: translateY(-3px); }
        .pf-r-note { font-size: 11.5px; color: ${C.faint}; margin: 3px 0 12px; }
        .pf-r-total { display: flex; align-items: baseline; gap: 8px; font-size: 15px; font-weight: 800; }
        .pf-r-total .pf-r-amt { font-size: 22px; letter-spacing: -0.5px; }
        .pf-r-forever { text-align: right; font-size: 11px; color: ${C.accentText}; margin-top: 4px; letter-spacing: 1.2px; }
        .pf-r-stamp {
          position: absolute;
          top: 74px;
          right: 16px;
          transform: rotate(8deg);
          border: 3px solid ${C.accent};
          border-radius: 6px;
          color: ${C.accent};
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 5px 9px;
          text-align: center;
          opacity: 0.85;
          user-select: none;
        }
        .pf-r-barcode {
          height: 34px;
          margin: 16px auto 8px;
          width: 78%;
          background: repeating-linear-gradient(90deg,
            ${C.ink} 0 2px, transparent 2px 5px,
            ${C.ink} 5px 6px, transparent 6px 10px,
            ${C.ink} 10px 13px, transparent 13px 15px,
            ${C.ink} 15px 16px, transparent 16px 21px);
        }
        .pf-r-foot { text-align: center; font-size: 10.5px; letter-spacing: 1.4px; color: ${C.faint}; }
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
          .pf-spot-card { transition: none; }
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
                I have 14+ years building for the web. I sold off a WordPress agency that had over 100 clients in its heyday.
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
                <div className="pf-stack-text">
                  <div style={{ fontWeight: 800, fontSize: "clamp(24px, 3.4vw, 36px)", letterSpacing: "-0.7px", lineHeight: 1.12, marginBottom: 12 }}>
                    {s.benefit}
                  </div>
                  <p style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.65, margin: "0 auto 14px", maxWidth: 600 }}>{s.how}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {s.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
                <div className="pf-stack-media">
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.imgAlt}
                      width={s.imgW}
                      height={s.imgH}
                      loading="lazy"
                      decoding="async"
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
                <div className="pf-stack-caption">
                  <Icon name={s.icon} />
                  <span>{s.label}</span>
                </div>
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
          <div className="pf-spot" ref={spotRef}>
            {GALLERY.map((p) => (
              <div key={p.name} className={"pf-spot-card" + (p.kind === "retired" ? " pf-gretired" : "")}>
                <span className="pf-gbadge" style={{ color: BADGES[p.kind].color, borderColor: BADGES[p.kind].border }}>
                  {BADGES[p.kind].label}
                </span>
                <div className="pf-gart">
                  {p.img ? (
                    <img src={p.img} alt={p.imgAlt || p.name} loading="lazy" decoding="async" />
                  ) : (
                    <span>Exhibit pending</span>
                  )}
                </div>
                <div className="pf-gplaque">
                  <div className="pf-gname">{p.name}</div>
                  {p.what ? <div className="pf-gwhat">{p.what}</div> : null}
                  <p className="pf-gdesc">{p.detail}</p>
                  <div className="pf-gmedium">Medium · {p.stack.join(" · ")}</div>
                </div>
              </div>
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

        {/* build vs buy: the argument */}
        <section aria-labelledby="vs-title" className="pf-reveal" style={{ padding: "26px 0 54px" }}>
          <Eyebrow>Stop renting software</Eyebrow>
          <h2 id="vs-title" style={{ fontSize: "clamp(26px, 4.2vw, 40px)", fontWeight: 800, letterSpacing: -0.8, margin: "0 0 10px" }}>
            Build <span style={{ color: C.accentText }}>&gt;</span> Buy
          </h2>
          <p style={{ fontSize: 15.5, color: C.slate, lineHeight: 1.7, maxWidth: 620, margin: "0 0 26px" }}>
            You're paying rent on software. Every month, forever, with nothing to show for it
            the day you stop. I build you the tool once, tailored to how your business actually
            works. Then it's yours: no seats, no tiers, no "updates to our pricing" emails. Ever.
          </p>
          <div className="pf-vs">
            <div className="pf-vs-head">
              <span />
              <span style={{ color: C.faint }}>Rent it</span>
              <span style={{ color: C.accentText, fontWeight: 700 }}>Own it</span>
            </div>
            {VERSUS.map((v) => (
              <div key={v.dim} className="pf-vs-row">
                <span className="pf-vs-dim">{v.dim}</span>
                <span className="pf-vs-rent"><span className="pf-vs-x" aria-hidden="true">✗</span>{v.rent}</span>
                <span className="pf-vs-own"><span className="pf-vs-c" aria-hidden="true">✓</span>{v.own}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 22px", padding: "22px 12px 0" }}>
            <div style={{ fontSize: 14, color: C.slate, maxWidth: 520 }}>
              Fair is fair: a few tools earn their fee. It's the other six line items on your
              card statement we're coming for.
            </div>
            <a
              href="mailto:jack@jalexolson.com?subject=My%20worst%20subscription"
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
              Send me your worst subscription ↗
            </a>
          </div>
        </section>

        {/* the receipt: build vs buy, in dollars */}
        <section aria-labelledby="savings-title" className="pf-reveal" style={{ padding: "26px 0 54px", position: "relative" }}>
          <div className="pf-ghost" aria-hidden="true">SAVED</div>
          <Eyebrow>Proof</Eyebrow>
          <h2 id="savings-title" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: -0.6, margin: "0 0 8px" }}>
            The receipts
          </h2>
          <p style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, maxWidth: 560, margin: "0 0 26px" }}>
            Bills I stopped paying by building the tool instead.
          </p>
          <div className="pf-receipt-wrap">
            <div className="pf-receipt">
              <div className="pf-r-stamp" aria-hidden="true">OWNED<br />NOT RENTED</div>
              <div className="pf-r-head">
                <div className="pf-r-title">J ALEX OLSON</div>
                <div className="pf-r-sub">BUILD &gt; BUY · COLORADO, USA</div>
              </div>
              <hr className="pf-r-rule" />
              {SAVINGS.map((s) => (
                <div key={s.item}>
                  <div className="pf-r-row">
                    <span>{s.item.toUpperCase()}</span>
                    <span className="pf-r-dots" aria-hidden="true" />
                    <span>{s.amount}</span>
                  </div>
                  <div className="pf-r-note">{s.note}</div>
                </div>
              ))}
              <hr className="pf-r-rule" />
              <div className="pf-r-total">
                <span>TOTAL SAVED / YEAR</span>
                <span className="pf-r-dots" aria-hidden="true" />
                <span className="pf-r-amt">$20,900</span>
              </div>
              <div className="pf-r-forever">EVERY YEAR. FOREVER.</div>
              <div className="pf-r-barcode" aria-hidden="true" />
              <div className="pf-r-foot">YOUR STACK PROBABLY HAS ONE OF THESE IN IT</div>
            </div>
          </div>
        </section>

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