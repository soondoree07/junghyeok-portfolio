// 표지 그리기 — 프로젝트마다 캔버스에 타이포 표지를 그려 텍스처로 만든다.
import * as THREE from 'three';

const W = 768;
const H = 1152;
const SERIF = '"Libre Caslon Display", Georgia, serif';
const SANS = 'Inter, "Pretendard Variable", system-ui, sans-serif';

// 도형 모음 — 표지 가운데 그림. (ctx, project) 를 받아 그린다.
const MOTIFS = {
  rings(c, p) {
    c.strokeStyle = p.accent;
    for (let r = 40; r < 300; r += 26) { c.lineWidth = r % 52 ? 1.5 : 4; ring(c, W / 2, 560, r); }
  },
  coins(c, p) {
    [[250, 470, 120], [500, 560, 150], [330, 700, 90]].forEach(([x, y, r]) => {
      c.fillStyle = p.accent; disc(c, x, y, r);
      c.strokeStyle = p.color; c.lineWidth = 8; ring(c, x, y, r * 0.72);
    });
  },
  orbit(c, p) {
    c.fillStyle = p.ink; disc(c, W / 2, 570, 230);
    c.fillStyle = p.accent; c.fillRect(W / 2 - 230, 555, 460, 30);
    c.fillStyle = p.ink; disc(c, W / 2, 570, 70);
    c.fillStyle = p.accent; disc(c, W / 2, 570, 42);
  },
  window(c, p) {
    c.strokeStyle = p.ink; c.lineWidth = 6;
    c.strokeRect(184, 380, 400, 420);
    c.beginPath(); c.moveTo(384, 380); c.lineTo(384, 800); c.moveTo(184, 590); c.lineTo(584, 590); c.stroke();
    c.fillStyle = p.accent; disc(c, 484, 480, 48);
  },
  grid(c, p) {
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
      c.fillStyle = (x + y * 2) % 7 === 0 ? p.accent : 'rgba(255,255,255,.14)';
      c.fillRect(154 + x * 78, 380 + y * 78, 62, 62);
    }
  },
  path(c, p) {
    c.strokeStyle = p.ink; c.lineWidth = 10; c.setLineDash([2, 26]); c.lineCap = 'round';
    c.beginPath(); c.moveTo(150, 820); c.bezierCurveTo(260, 380, 520, 860, 620, 400); c.stroke();
    c.setLineDash([]);
    [[150, 820], [620, 400]].forEach(([x, y]) => { c.fillStyle = p.accent; disc(c, x, y, 26); });
  },
  loop(c, p) {
    c.strokeStyle = p.ink; c.lineWidth = 14;
    c.beginPath(); c.ellipse(W / 2, 590, 230, 150, 0, 0.3, Math.PI * 2 - 0.3); c.stroke();
    c.fillStyle = p.ink;
    c.beginPath(); c.moveTo(600, 520); c.lineTo(640, 600); c.lineTo(560, 600); c.fill();
  },
  lanes(c, p) {
    c.strokeStyle = p.accent; c.lineWidth = 6;
    for (let i = -3; i <= 3; i++) {
      c.beginPath(); c.moveTo(W / 2 + i * 14, 380); c.lineTo(W / 2 + i * 120, 860); c.stroke();
    }
    c.fillStyle = 'rgba(246,211,60,.25)'; disc(c, W / 2, 380, 60);
  },
  frames(c, p) {
    [[160, 400, 200, 260], [400, 360, 200, 150], [400, 540, 200, 240], [160, 690, 200, 90]].forEach(([x, y, w, h], i) => {
      c.fillStyle = i === 1 ? p.accent : 'rgba(0,0,0,.08)'; c.fillRect(x, y, w, h);
      c.strokeStyle = p.ink; c.lineWidth = 2; c.strokeRect(x, y, w, h);
    });
  },
  arch(c, p) {
    c.fillStyle = p.accent;
    c.beginPath(); c.moveTo(214, 840); c.lineTo(214, 560); c.arc(W / 2, 560, 170, Math.PI, 0); c.lineTo(554, 840); c.fill();
    c.fillStyle = p.ink; disc(c, W / 2, 520, 34);
  },
  terminal(c, p) {
    c.font = `500 30px ui-monospace, Menlo, monospace`; c.fillStyle = p.accent;
    ['$ claude', '> connected', '> tunnel ok', '> pm2 online', '_'].forEach((t, i) => c.fillText(t, 150, 450 + i * 64));
  },
};

function ring(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); }
function disc(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }

function fitTitle(c, text, maxWidth, startSize) {
  let size = startSize;
  do { c.font = `400 ${size}px ${SERIF}`; size -= 4; } while (c.measureText(text).width > maxWidth && size > 40);
}

function toTexture(canvas, renderer) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function newCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  return [canvas, canvas.getContext('2d')];
}

export function drawProjectCover(project, index, renderer) {
  const [canvas, c] = newCanvas();
  c.fillStyle = project.color; c.fillRect(0, 0, W, H);

  c.save(); c.translate(0, 140); MOTIFS[project.motif]?.(c, project); c.restore();

  c.fillStyle = project.ink;
  c.font = `500 24px ${SANS}`; c.letterSpacing = '6px';
  c.fillText(String(index + 1).padStart(2, '0'), 70, 110);
  c.textAlign = 'right'; c.fillText(project.year.split(' ')[0], W - 70, 110);
  c.textAlign = 'left';

  c.fillRect(70, 136, 60, 3);
  // 앞 책에 가려지지 않는 왼쪽 위에 제목을 둔다
  fitTitle(c, project.title, W - 140, 120); c.letterSpacing = '0px';
  c.fillText(project.title, 66, 270);
  c.font = `400 26px ${SANS}`; c.globalAlpha = 0.75;
  c.fillText(project.sub, 70, 320);
  c.globalAlpha = 1;
  return toTexture(canvas, renderer);
}

// 책장 단면(종이 결) — horizontal: 앞마구리, vertical: 위아래
export function drawPageTexture(horizontal) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#efe7d6'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 2) {
    ctx.fillStyle = `rgba(110,80,50,${0.05 + Math.random() * 0.12})`;
    horizontal ? ctx.fillRect(0, i, 256, 1) : ctx.fillRect(i, 0, 1, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
