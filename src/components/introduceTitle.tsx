import { motion } from "framer-motion";
import { useContext, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // "gsap/all"은 모든 플러그인을 번들에 넣습니다
import { IsClickContext } from "./isClickedContext";
import style from "../style/introduceTitle.module.css";

gsap.registerPlugin(ScrollTrigger);

const BASE_SPEED = 0.1; // 60fps 기준, 프레임당 이동량(%)
const BOOST_SPEED = 0.6; // 빠르게 스크롤할 때 추가되는 최대 속도
const BOOST_DECAY = 0.94; // 스크롤을 멈추면 추가 속도가 줄어드는 비율(프레임당)

const NEAR_DIST = 240; // 커서가 띠에서 이 거리(px) 안으로 들어오면 반응 시작
const NEAR_SLOW = 0.9; // 커서가 바로 위에 있을 때 줄어드는 속도 비율 (0.9 → 10%까지 감속)
const NEAR_EASE = 0.9; // 반응이 부드럽게 따라가는 정도(프레임당, 클수록 느리게 반응)
const SKEW = 12; // 이동 속도에 따라 글자가 기울어지는 정도(도)

function IntroduceTitle() {
  const clicked = useContext(IsClickContext);
  const slider = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLParagraphElement>(null);
  const second = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // near: 현재 반응 정도(0~1), nearTarget: 커서 위치로 정해지는 목표값
    const state = {
      xPercent: 0,
      direction: -1,
      boost: 0,
      near: 0,
      nearTarget: 0,
    };

    // ScrollTrigger를 한 번에 정리하기 위한 context
    const ctx = gsap.context(() => {
      gsap.to(slider.current, {
        x: "-500px",
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: () => window.innerHeight, // 창 크기가 바뀌어도 다시 계산
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            state.direction = self.direction * -1;
            // 스크롤이 빠를수록 마키도 잠깐 빨라집니다.
            state.boost = Math.min(Math.abs(self.getVelocity()) / 3000, 1);
          },
        },
      });
    });

    // 커서와 마키 띠 사이의 세로 거리로 목표 반응 정도를 정합니다.
    const onMove = (e: PointerEvent) => {
      const el = slider.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dy =
        e.clientY < rect.top
          ? rect.top - e.clientY
          : e.clientY > rect.bottom
          ? e.clientY - rect.bottom
          : 0;
      state.nearTarget = 1 - Math.min(dy / NEAR_DIST, 1);
    };
    const onLeave = () => {
      state.nearTarget = 0;
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    // requestAnimationFrame 대신 gsap ticker 사용:
    // deltaTime으로 보정해서 120Hz 모니터에서도 속도가 같고, 정리(remove)도 쉽습니다.
    const tick = (_time: number, deltaTime: number) => {
      const frames = deltaTime / (1000 / 60);

      // 커서 반응을 부드럽게 따라가게 합니다.
      state.near +=
        (state.nearTarget - state.near) * (1 - Math.pow(NEAR_EASE, frames));

      // 커서가 가까울수록 느려지고, 느려진 만큼 기울기도 풀립니다.
      const speed =
        (BASE_SPEED + state.boost * BOOST_SPEED) * (1 - NEAR_SLOW * state.near);

      if (state.xPercent < -100) state.xPercent += 100;
      else if (state.xPercent > 0) state.xPercent -= 100;

      gsap.set([first.current, second.current], {
        xPercent: state.xPercent,
        skewX: -state.direction * speed * SKEW,
      });

      state.xPercent += speed * frames * state.direction;
      state.boost *= Math.pow(BOOST_DECAY, frames);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <motion.div
      className={style.main}
      // 기존 slideUp variants는 값이 모두 주석 처리되어 아무 효과가 없었습니다.
      // 헤더 애니메이션이 끝나는 시점(isClick)에 맞춰 부드럽게 나타나도록 했습니다.
      initial={{ opacity: 0 }}
      animate={{ opacity: clicked?.isClick ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className={style.container}>
        <div className={style.titles} ref={slider}>
          <p ref={first}>Front-End Developer-</p>
          <p ref={second} aria-hidden="true">
            Front-End Developer-
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default IntroduceTitle;
