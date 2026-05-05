/**
 * Mawaheb Foundation — Loading Component
 * ─────────────────────────────────────────
 * All colors sourced from mawaheb-color-system.md
 *
 * Usage:
 *   import Loading from "@/components/Loading";
 *
 *   // Full-page overlay (blocks entire viewport)
 *   <Loading variant="page" />
 *
 *   // Inline — fills its container (card, panel, section)
 *   <Loading variant="inline" />
 *
 *   // Inline with a custom message
 *   <Loading variant="inline" message="Fetching student records…" />
 *
 *   // Tiny spinner for buttons / table rows
 *   <Loading variant="spinner" />
 *
 * Props:
 *   variant  "page" | "inline" | "spinner"   default: "page"
 *   message  string                           optional label below the animation
 */

import React from "react";

/* ─── Design-system tokens ──────────────────────────────── */
const t = {
    surfacePage: "#F5F3EE",
    surfaceCard: "#FAFAF7",
    brand900: "#0D2018",
    brand800: "#1A3A2A",
    brand600: "#296E42",
    brand400: "#4E9963",
    brand200: "#92C49C",
    brand100: "#C2DFC8",
    brand50: "#EAF3EC",
    accent400: "#D4A843",
    accent200: "#F0C95A",
    accent100: "#F9E4A0",
    accent50: "#FDF6E3",
    accent900: "#3D2D04",
    textPrimary: "#2E2C28",
    textSecondary: "#5E5A52",
    textMuted: "#9A9588",
    textInverse: "#FAFAF7",
    borderSubtle: "#E8E4D8",
};

/* ─── Keyframe injection (runs once) ────────────────────── */
const STYLE_ID = "mawaheb-loading-keyframes";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    /* Star pulse — scales up and down */
    @keyframes mw-star-pulse {
      0%, 100% { transform: scale(1);   opacity: 1; }
      50%       { transform: scale(1.18); opacity: 0.85; }
    }

    /* Ring spin */
    @keyframes mw-ring-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* Outer ring counter-spin (slower) */
    @keyframes mw-ring-spin-rev {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }

    /* Dot orbit around center */
    @keyframes mw-orbit {
      from { transform: rotate(0deg) translateX(28px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
    }

    /* Fade-in for the whole loader */
    @keyframes mw-fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* Shimmer for text */
    @keyframes mw-shimmer {
      0%   { opacity: 0.4; }
      50%  { opacity: 1;   }
      100% { opacity: 0.4; }
    }

    /* Micro spinner for buttons */
    @keyframes mw-micro-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* Skeleton wave */
    @keyframes mw-skeleton-wave {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `;
    document.head.appendChild(style);
}

/* ─── Star SVG (Mawaheb brand mark) ────────────────────── */
const StarMark = ({ size = 32, color = t.accent400 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            animation: "mw-star-pulse 1.8s ease-in-out infinite",
            display: "block",
        }}
    >
        <polygon
            points="16,2 19.5,12 30,12 21.5,18.5 24.5,29 16,23 7.5,29 10.5,18.5 2,12 12.5,12"
            fill={color}
        />
    </svg>
);

/* ─── Dual-ring spinner ─────────────────────────────────── */
const DualRing = ({ size = 72 }) => {
    const cx = size / 2;
    const outerR = size / 2 - 4;
    const innerR = size / 2 - 14;
    const stroke = 2.5;

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            {/* Outer ring — clockwise, brand color */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    animation: "mw-ring-spin 1.4s linear infinite",
                }}
            >
                <circle
                    cx={cx}
                    cy={cx}
                    r={outerR}
                    fill="none"
                    stroke={t.brand100}
                    strokeWidth={stroke}
                />
                <circle
                    cx={cx}
                    cy={cx}
                    r={outerR}
                    fill="none"
                    stroke={t.brand600}
                    strokeWidth={stroke}
                    strokeDasharray={`${outerR * 1.4} ${outerR * 10}`}
                    strokeLinecap="round"
                />
            </svg>

            {/* Inner ring — counter-clockwise, gold */}
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    animation: "mw-ring-spin-rev 2s linear infinite",
                }}
            >
                <circle
                    cx={cx}
                    cy={cx}
                    r={innerR}
                    fill="none"
                    stroke={t.accent100}
                    strokeWidth={stroke}
                />
                <circle
                    cx={cx}
                    cy={cx}
                    r={innerR}
                    fill="none"
                    stroke={t.accent400}
                    strokeWidth={stroke}
                    strokeDasharray={`${innerR * 0.9} ${innerR * 10}`}
                    strokeLinecap="round"
                />
            </svg>

            {/* Center star */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <StarMark size={22} color={t.accent400} />
            </div>
        </div>
    );
};

/* ─── Orbiting dot ──────────────────────────────────────── */
const OrbitDot = ({ delay = 0, color = t.brand400 }) => (
    <div
        style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "7px",
            height: "7px",
            marginTop: "-3.5px",
            marginLeft: "-3.5px",
            borderRadius: "50%",
            backgroundColor: color,
            animation: `mw-orbit 2.2s linear ${delay}s infinite`,
        }}
    />
);

/* ─── Skeleton shimmer bar ──────────────────────────────── */
const SkeletonBar = ({ width = "100%", height = 12, style = {} }) => (
    <div
        style={{
            width,
            height,
            borderRadius: "9999px",
            background: `linear-gradient(90deg, ${t.brand50} 25%, ${t.brand100} 50%, ${t.brand50} 75%)`,
            backgroundSize: "800px 100%",
            animation: "mw-skeleton-wave 1.6s ease-in-out infinite",
            ...style,
        }}
    />
);

/* ─── PAGE variant ──────────────────────────────────────── */
const PageLoader = ({ message }) => (
    <div
        style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: t.surfacePage,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            animation: "mw-fadein 0.3s ease forwards",
        }}
    >
        {/* Spinner with orbiting dots */}
        <div style={{ position: "relative", width: 72, height: 72 }}>
            <DualRing size={72} />
            <OrbitDot delay={0} color={t.brand400} />
            <OrbitDot delay={0.73} color={t.accent400} />
        </div>

        {/* Brand wordmark */}
        <div style={{ textAlign: "center" }}>
            <div
                style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: t.brand800,
                    marginBottom: "6px",
                }}
            >
                مواهب · Mawaheb
            </div>
            <div
                style={{
                    fontSize: "12px",
                    color: t.textMuted,
                    animation: "mw-shimmer 2s ease-in-out infinite",
                }}
            >
                {message || "Loading, please wait…"}
            </div>
        </div>

        {/* Skeleton preview — suggests content is coming */}
        <div
            style={{
                width: "240px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                opacity: 0.6,
            }}
        >
            <SkeletonBar width="100%" height={10} />
            <SkeletonBar width="75%" height={10} />
            <SkeletonBar width="55%" height={10} />
        </div>
    </div>
);

/* ─── INLINE variant ────────────────────────────────────── */
const InlineLoader = ({ message }) => (
    <div
        style={{
            width: "100%",
            padding: "48px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            animation: "mw-fadein 0.25s ease forwards",
        }}
    >
        {/* Compact dual ring */}
        <div style={{ position: "relative", width: 52, height: 52 }}>
            <DualRing size={52} />
        </div>

        {/* Label */}
        <div style={{ textAlign: "center" }}>
            <div
                style={{
                    fontSize: "13px",
                    color: t.textSecondary,
                    fontWeight: 500,
                    animation: "mw-shimmer 2s ease-in-out infinite",
                }}
            >
                {message || "Loading…"}
            </div>
        </div>

        {/* Skeleton rows that mimic a list */}
        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[100, 80, 65, 80].map((w, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `linear-gradient(90deg, ${t.brand50} 25%, ${t.brand100} 50%, ${t.brand50} 75%)`,
                            backgroundSize: "800px 100%",
                            animation: "mw-skeleton-wave 1.6s ease-in-out infinite",
                            flexShrink: 0,
                        }}
                    />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <SkeletonBar width={`${w}%`} height={10} />
                        <SkeletonBar width={`${w - 20}%`} height={8} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ─── SPINNER variant (micro — for buttons / rows) ──────── */
const SpinnerLoader = () => (
    <span
        style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: `2px solid ${t.brand100}`,
            borderTopColor: t.brand600,
            animation: "mw-micro-spin 0.75s linear infinite",
            verticalAlign: "middle",
        }}
    />
);

/* ─── Main export ───────────────────────────────────────── */
const Loading = ({ variant = "page", message }) => {
    if (variant === "spinner") return <SpinnerLoader />;
    if (variant === "inline") return <InlineLoader message={message} />;
    return <PageLoader message={message} />;
};

export default Loading;
export { SpinnerLoader, InlineLoader, PageLoader, SkeletonBar };