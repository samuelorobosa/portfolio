import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Thought } from "./thoughts";

const BG = "#0c0c0c";
const INK = "#f0ebe2";
const MID = "#c8c8c8";
const MUTED = "#a8a8a8";
const GREEN = "#82c79a";

export const OG_SIZE = { width: 1200, height: 630 };
export const CARD_SIZE = { width: 1080, height: 1350 };

async function loadFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [light, extraBold] = await Promise.all([
    readFile(join(dir, "PlusJakartaSans-Light.ttf")),
    readFile(join(dir, "PlusJakartaSans-ExtraBold.ttf")),
  ]);
  return [
    { name: "Jakarta", data: light, weight: 300 as const, style: "normal" as const },
    { name: "Jakarta", data: extraBold, weight: 800 as const, style: "normal" as const },
  ];
}

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function Frame({ children, padding }: { children: React.ReactNode; padding: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding,
        background: BG,
        backgroundImage:
          "radial-gradient(circle at 88% 8%, rgba(130,199,154,0.26), rgba(12,12,12,0) 55%)",
        color: INK,
        fontFamily: "Jakarta",
      }}
    >
      {/* Oversized quote mark as the backdrop */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: 30,
          fontSize: 760,
          fontWeight: 800,
          lineHeight: 1,
          color: GREEN,
          opacity: 0.13,
        }}
      >
        ”
      </div>
      {children}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          background: GREEN,
        }}
      />
    </div>
  );
}

function TopRow({ kind }: { kind: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -2 }}>SA</div>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: BG,
          background: GREEN,
          padding: "8px 18px",
        }}
      >
        {kind}
      </div>
    </div>
  );
}

interface OgContent {
  title: string;
  /** Short tag in the corner, e.g. "poem" or "article". */
  label: string;
  excerpt: string;
  /** Site path shown in the footer, e.g. "orobosa.xyz/thoughts". */
  path: string;
}

/** Landscape card used as the link preview on WhatsApp, X, LinkedIn, etc. */
export async function renderOgImage({ title, label, excerpt, path }: OgContent) {
  const titleSize = title.length <= 16 ? 124 : title.length <= 28 ? 96 : title.length <= 44 ? 76 : 62;

  return new ImageResponse(
    (
      <Frame padding={64}>
        <TopRow kind={label} />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 300,
              lineHeight: 1.45,
              color: MID,
              maxWidth: 940,
            }}
          >
            {clip(excerpt, 120)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            paddingBottom: 12,
          }}
        >
          <div style={{ fontWeight: 800 }}>Samuel Amagbakhen</div>
          <div style={{ fontWeight: 300, color: MUTED }}>{path}</div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}

const CARD_PADDING = 80;
const BODY_SIZE = 35;
const BODY_LINE = BODY_SIZE * 1.55;
const BODY_GAP = 26;
// Deliberately low estimates of how many characters fit on a line, so the
// card is never too short for its text.
const BODY_CHARS = 46;

function wrappedLines(text: string, perLine: number) {
  return text
    .split("\n")
    .reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / perLine)), 0);
}

/**
 * Portrait card carrying the whole piece, for statuses and stories. It grows
 * taller than the default size when the text needs the room.
 */
export async function renderShareCard(thought: Thought) {
  const body = thought.paragraphs;
  const titleSize = thought.title.length <= 18 ? 112 : 84;
  const titleLines = wrappedLines(thought.title, titleSize === 112 ? 13 : 17);
  const bodyHeight =
    body.reduce((sum, p) => sum + wrappedLines(p, BODY_CHARS) * BODY_LINE, 0) +
    (body.length - 1) * BODY_GAP;
  // Padding, header row, title block, rule and footer around the body.
  const chrome = CARD_PADDING * 2 + 56 + 70 + titleLines * titleSize + 96 + 70 + 92;
  const height = Math.max(CARD_SIZE.height, Math.ceil(chrome + bodyHeight));

  return new ImageResponse(
    (
      <Frame padding={CARD_PADDING}>
        <TopRow kind={thought.kind} />

        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {thought.title}
          </div>
          <div style={{ display: "flex", width: 120, height: 8, background: GREEN }} />
          <div style={{ display: "flex", flexDirection: "column", gap: BODY_GAP }}>
            {body.map((paragraph, i) => (
              <div
                key={i}
                style={{
                  fontSize: BODY_SIZE,
                  fontWeight: 300,
                  lineHeight: `${BODY_LINE}px`,
                  color: i === 0 ? INK : MID,
                  whiteSpace: "pre-wrap",
                }}
              >
                {paragraph}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 26,
            paddingBottom: 12,
          }}
        >
          <div style={{ fontWeight: 800 }}>Samuel Amagbakhen</div>
          <div style={{ fontWeight: 300, color: GREEN }}>
            {`orobosa.xyz/thoughts/${thought.slug}`}
          </div>
        </div>
      </Frame>
    ),
    { width: CARD_SIZE.width, height, fonts: await loadFonts() }
  );
}
