import style from "../style/header.module.css";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { IsClickContext } from "./isClickedContext";
import { useContext, useEffect, useRef } from "react";
import { slideUp } from "../util/ani";

const RADIUS = 180; // 커서 영향 반경(px)
const STAGGER = 0.08; // 글자 사이 파도 간격(초)
const WAVE_SCALE = 1.6; // 파도가 지나갈 때 최대 크기
const WAVE_DURATION = 0.6; // 한 글자가 커졌다 작아지는 시간(초)
const WAVE_GAP = 0; // 왼쪽→오른쪽 파도가 끝나고 오른쪽→왼쪽 파도가 시작하기 전 쉬는 시간(초)
const FALLBACK_MS = 5000; // 애니메이션이 멈춘 경우를 대비한 안전장치

/** 한 번의 파도가 모든 글자를 지나가는 데 걸리는 시간 */
const sweepTime = (count: number) => (count - 1) * STAGGER + WAVE_DURATION;
/** 전체 시퀀스 시간: 왼쪽→오른쪽 + 쉬는 시간 + 오른쪽→왼쪽 */
const totalTime = (count: number) => sweepTime(count) * 2 + WAVE_GAP;

/**
 * idx번째 글자의 키프레임.
 * 1) 왼쪽→오른쪽: idx * STAGGER 뒤에 커졌다 작아집니다.
 * 2) 오른쪽→왼쪽: 순서를 뒤집어서 (count - 1 - idx) * STAGGER 뒤에 다시 한 번.
 * 모든 글자가 같은 총 시간(totalTime)을 쓰므로 마지막 글자 기준으로 끝을 감지할 수 있습니다.
 */
function wave(idx: number, count: number) {
  const total = totalTime(count);
  const a = idx * STAGGER; // 1차 파도 시작
  const b = sweepTime(count) + WAVE_GAP + (count - 1 - idx) * STAGGER; // 2차 파도 시작
  const d = WAVE_DURATION;

  const points: [number, number][] = [];
  if (a > 1e-6) points.push([0, 1]);
  points.push(
    [a, 1],
    [a + d / 2, WAVE_SCALE],
    [a + d, 1],
    [b, 1],
    [b + d / 2, WAVE_SCALE],
    [b + d, 1]
  );
  if (total - (b + d) > 1e-6) points.push([total, 1]);

  // 같은 시간에 겹치는 키프레임 제거 (예: 마지막 글자는 1차가 끝나는 순간 2차가 시작)
  const unique = points.filter(
    ([t], i) => i === 0 || t - points[i - 1][0] > 1e-6
  );

  return {
    scale: unique.map(([, v]) => v),
    times: unique.map(([t]) => t / total),
  };
}

/**
 * 커서가 가까워질수록 글자가 커지면서 위로 떠오르는 래퍼.
 * 파도 애니메이션은 안쪽 <motion.p>가 담당하고, 이 래퍼는
 * 별도의 motion value(scale, y)만 건드려서 서로 충돌하지 않습니다.
 */
function ProximityLetter(props: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useMotionValue(0); // 0(멀다) ~ 1(가깝다)
  const spring = { stiffness: 260, damping: 18 };
  const scale: MotionValue<number> = useSpring(1, spring);
  const y: MotionValue<number> = useSpring(0, spring);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const unsub = t.on("change", (v) => {
      scale.set(1 + v * 0.3);
      y.set(-v * 12);
    });

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const d = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2)
      );
      t.set(Math.max(0, 1 - d / RADIUS));
    };
    const onLeave = () => t.set(0);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      unsub();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [t, scale, y]);

  return (
    <motion.div ref={ref} style={{ scale, y }}>
      {props.children}
    </motion.div>
  );
}

function Header() {
  const intro = useRef(null);
  const clicked = useContext(IsClickContext);

  const str: string[] = [
    "M",
    "Y",
    ".",
    "P",
    "O",
    "R",
    "T",
    "F",
    "O",
    "L",
    "I",
    "O",
  ];

  // 파도가 끝나면 인트로 시퀀스를 시작합니다.
  // 탭이 백그라운드라서 애니메이션이 멈춰도 시퀀스가 막히지 않도록 타이머를 하나 둡니다.
  useEffect(() => {
    const id = window.setTimeout(() => {
      clicked?.setIsClick(true);
    }, FALLBACK_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={intro}
      className={style.headerDiv}
      variants={slideUp}
      initial="initial"
      animate={clicked?.isClick && "animate"}
    >
      <div className={style.words}>
        {str.map((word, idx) => (
          <ProximityLetter key={idx}>
            <motion.p
              animate={{ scale: wave(idx, str.length).scale }}
              transition={{
                duration: totalTime(str.length),
                ease: "easeInOut",
                times: wave(idx, str.length).times,
              }}
              style={{ originX: 0.5, originY: 1 }}
              onAnimationComplete={() => {
                if (idx === str.length - 1 && !clicked?.isClick) {
                  clicked?.setIsClick(true);
                }
              }}
            >
              {word}
            </motion.p>
          </ProximityLetter>
        ))}
      </div>
    </motion.div>
  );
}

export default Header;
