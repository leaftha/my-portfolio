import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bx: number; // 기본 속도 (밀려났다가 돌아오는 속도)
  by: number;
  r: number;
  life: number; // -1: 영구, 그 외: 남은 프레임 (클릭 버스트용)
  maxLife: number;
};

const LINK_DIST = 110; // 점끼리 선으로 연결되는 거리
const MOUSE_DIST = 170; // 커서 영향 반경

/**
 * 커서를 따라 반응하는 파티클 배경.
 * - 커서 근처의 점은 밀려나고, 커서와 선으로 연결됩니다.
 * - 클릭하면 그 자리에서 점이 터져 나옵니다.
 * - 화면 밖이면 그리기를 멈추고, prefers-reduced-motion이면 아예 동작하지 않습니다.
 *
 * 화면 전체에 고정(position: fixed)되어 모든 섹션 뒤에서 움직입니다.
 * App 최상단에 한 번만 두면 됩니다. (z-index: -1 → 콘텐츠 뒤, html 배경 앞)
 */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let particles: Particle[] = [];

    const create = (x: number, y: number, burst = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? 2 + Math.random() * 3 : 0.15 + Math.random() * 0.35;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = burst ? 50 + Math.random() * 30 : -1;
      return {
        x,
        y,
        vx,
        vy,
        bx: burst ? 0 : vx,
        by: burst ? 0 : vy,
        r: 1 + Math.random() * 1.8,
        life,
        maxLife: life,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(140, Math.floor((w * h) / 14000));
      particles = Array.from({ length: count }, () =>
        create(Math.random() * w, Math.random() * h)
      );
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onDown = (e: PointerEvent) => {
      // 링크, 버튼, 입력창 등을 누를 때는 터지지 않게 합니다.
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("a, button, input, textarea, select, label, [role='tab']")
      )
        return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      for (let i = 0; i < 14; i++) particles.push(create(x, y, true));
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      ctx.clearRect(0, 0, w, h);

      // 커서 주변의 은은한 빛
      if (mouse.x > -9000) {
        const g = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_DIST + 30
        );
        g.addColorStop(0, "rgba(255,255,255,0.35)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // 업데이트
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST && dist > 0.001) {
          const force = 1 - dist / MOUSE_DIST;
          p.vx += (dx / dist) * force * 0.6;
          p.vy += (dy / dist) * force * 0.6;
        }

        // 밀려난 뒤 기본 속도로 천천히 복귀
        p.vx += (p.bx - p.vx) * 0.03;
        p.vy += (p.by - p.vy) * 0.03;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= 0) {
          p.life -= 1;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          if (p.x < 0) p.x = w;
          else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          else if (p.y > h) p.y = 0;
        }
      }

      // 점 사이 연결선
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(23,23,26,${(1 - d / LINK_DIST) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // 커서와의 연결선
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(23,23,26,${(1 - dm / MOUSE_DIST) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 점 그리기
      for (const p of particles) {
        const alpha = p.life >= 0 ? (p.life / p.maxLife) * 0.6 : 0.4;
        ctx.fillStyle = `rgba(23,23,26,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}

export default ParticleField;
