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
const WAVE_GAP = 0.8; // 파도와 파도 사이 쉬는 시간(초)
const WAVE_REPEAT = 1; // 추가 반복 횟수 (1 → 파도가 총 2번 지나감)
const FALLBACK_MS = 5000; // 애니메이션이 멈춘 경우를 대비한 안전장치

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
              animate={{ scale: [1, WAVE_SCALE, 1] }}
              transition={{
                duration: WAVE_DURATION,
                ease: "easeInOut",
                delay: idx * STAGGER,
                repeat: WAVE_REPEAT,
                repeatDelay: WAVE_GAP,
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
