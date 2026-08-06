import type { Destination, Locale } from "@/lib/types";

const W = 1080;
const H = 1350;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Zeichnet eine teilbare Bildkarte und gibt eine PNG-Data-URL zurück. */
export function drawShareCard(
  d: Destination,
  secret: number,
  locale: Locale,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Hintergrund-Verlauf aus dem Motiv
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, d.gradient[0]);
  grad.addColorStop(1, d.gradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Vignette unten für Lesbarkeit
  const vg = ctx.createLinearGradient(0, H * 0.45, 0, H);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  const M = 80;
  ctx.fillStyle = "rgba(255,255,255,0.92)";

  // Wortmarke oben
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("🧭  FERNWEH ATLAS", M, 90);

  // Geheimtipp-Grad Badge oben rechts
  ctx.textAlign = "center";
  const bx = W - M - 70;
  const by = 110;
  ctx.beginPath();
  ctx.arc(bx, by, 70, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "800 52px system-ui, sans-serif";
  ctx.fillText(String(secret), bx, by + 8);
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText(locale === "de" ? "GEHEIM" : "SECRET", bx, by + 40);

  // Ortsname groß unten
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.font = "800 108px system-ui, sans-serif";
  ctx.fillText(d.name, M, H - 360, W - 2 * M);

  ctx.font = "500 44px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(`${d.countryEmoji}  ${d.country}`, M, H - 300);

  // Beschreibung
  ctx.font = "400 36px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const lines = wrap(ctx, d.desc[locale], W - 2 * M);
  lines.slice(0, 3).forEach((ln, i) => {
    ctx.fillText(ln, M, H - 220 + i * 48);
  });

  // Stat-Chips
  const months = (locale === "de"
    ? "Jan,Feb,Mär,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez"
    : "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
  ).split(",");
  const best = d.bestMonths.map((m) => months[m - 1]).join(" · ");
  const chips = [
    `${locale === "de" ? "Beste Zeit" : "Best time"}: ${best}`,
    `${locale === "de" ? "Preis" : "Price"}: ${"€".repeat(d.priceLevel)}`,
  ];
  ctx.font = "600 28px system-ui, sans-serif";
  let cx = M;
  const cy = H - 70;
  for (const c of chips) {
    const w = ctx.measureText(c).width + 44;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    roundRect(ctx, cx, cy - 40, w, 56, 28);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(c, cx + 22, cy - 3);
    cx += w + 16;
  }

  return canvas.toDataURL("image/png");
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
