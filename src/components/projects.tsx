import { useEffect, useRef, useState } from "react";
import style from "../style/Projects.module.css";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
import { projects } from "../util/project";
import gsap from "gsap";
import Modal from "./modal";
import SplitType from "split-type";

function Projects() {
  const projectBody = useRef<HTMLDivElement | null>(null);
  const isView = useInView(projectBody);
  const [modal, setModal] = useState({ active: false, idx: 0 });
  const { scrollYProgress } = useScroll({ target: projectBody });
  const [currentIndex, setCurrentIndex] = useState(0);

  const count = projects.length;
  const project = projects[currentIndex];
  const hasLive = project?.img.length !== 0;

  // 스크롤 진행도를 프로젝트 개수로 균등하게 나눠서 인덱스를 계산합니다.
  // (기존: 6개 값을 하드코딩 + Math.round → 첫/마지막 프로젝트 구간이 절반밖에 안 됐습니다)
  useEffect(() => {
    const update = (v: number) => {
      const next = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
      setCurrentIndex(next);
    };
    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, count]);

  // 프로젝트가 바뀌면 열려 있던 미리보기를 닫습니다. (제목이 새로 마운트되어 hoverEnd가 안 옵니다)
  useEffect(() => {
    setModal((m) => ({ ...m, active: false }));
  }, [currentIndex]);

  // 제목 분할 애니메이션. cleanup에서 원상 복구해서 다시 들어와도 중복 분할되지 않습니다.
  useEffect(() => {
    if (!isView) return;

    const split = new SplitType(`.${style.title}`, {
      types: "lines,words,chars",
      tagName: "span",
    });
    const tween = gsap.from(`.${style.title} span`, {
      y: "110%",
      opacity: 0,
      rotationZ: "10",
      duration: 0.4,
      stagger: 0.1,
      delay: 0.5,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [isView]);

  // 인디케이터를 누르면 해당 프로젝트 구간의 중간으로 스크롤합니다.
  const goTo = (i: number) => {
    const el = projectBody.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + scrollable * ((i + 0.5) / count) });
  };

  const rows: [string, string | undefined][] = [
    ["기간:", project?.time],
    ["역할:", project?.description.role],
    ["사용 기술:", project?.description.tech],
    ["프로젝트 설명:", project?.description.projectDescription],
    ["구체적인 기술적 도전:", project?.description.challenge],
    ["해결 과정:", project?.description.solution],
    ["소감:", project?.description.feedback],
  ];

  return (
    <>
      <div className={style.main} ref={projectBody}>
        <h1 className={style.title}>My Projects</h1>
        <div className={style.Projects}>
          <div className={style.projectsbody}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={style.contents}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <motion.h1
                  className={`${style.projectTitle} ${
                    hasLive ? style.under : ""
                  }`}
                  onHoverStart={() => {
                    if (hasLive) setModal({ active: true, idx: currentIndex });
                  }}
                  onHoverEnd={() => {
                    if (hasLive) setModal({ active: false, idx: currentIndex });
                  }}
                  onClick={() => {
                    if (hasLive)
                      window.open(project.address, "_blank", "noopener,noreferrer");
                  }}
                >
                  {project?.name}
                </motion.h1>

                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className={style.git}
                    onClick={() =>
                      window.open(project?.git, "_blank", "noopener,noreferrer")
                    }
                  >
                    {project?.git}
                  </motion.p>
                  {rows.map(([label, value], i) => (
                    <motion.p
                      key={label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      // 기존 최대 1.7초 → 0.5초 안쪽. 스크롤로 빠르게 넘길 때 기다리지 않게 합니다.
                      transition={{ duration: 0.2, delay: 0.15 + i * 0.06 }}
                    >
                      <span className={style.projectDescriptionTitle}>
                        {label}
                      </span>
                      {value}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* 스타일은 Projects.module.css의 .nav / .navDot. sticky인 .Projects 안에 있어서 섹션이 고정된 동안에만 보입니다. */}
          <div role="tablist" aria-label="프로젝트 선택" className={style.nav}>
            {projects.map((p, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={p.name}
                onClick={() => goTo(i)}
                className={`${style.navDot} ${
                  i === currentIndex ? style.navDotActive : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <Modal modal={modal} />
    </>
  );
}

export default Projects;
