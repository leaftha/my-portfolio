import { useRef, useState } from "react";
import style from "../style/mySkils.module.css";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

type GridSkil = {
  skil: string;
  src: string;
};

const skils: GridSkil[] = [
  { skil: "html", src: `${process.env.PUBLIC_URL}/image/logo/html5-plain.svg` },
  { skil: "css", src: `${process.env.PUBLIC_URL}/image/logo/css3-plain.svg` },
  {
    skil: "javascript",
    src: `${process.env.PUBLIC_URL}/image/logo/javascript-original.svg`,
  },
  {
    skil: "typescript",
    src: `${process.env.PUBLIC_URL}/image/logo/typescript-plain.svg`,
  },
  {
    skil: "react",
    src: `${process.env.PUBLIC_URL}/image/logo/react-original.svg`,
  },
  {
    skil: "next.js",
    src: `${process.env.PUBLIC_URL}/image/logo/nextjs-original.svg`,
  },
];

const cardVariants = {
  hidden: { scale: 0 },
  visible: (i: number) => ({
    scale: 1,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

/** 커서 쪽으로 살짝 끌려오고, 호버하면 기술 이름이 나타나는 아이콘 */
function MagneticSkill(props: {
  item: GridSkil;
  idx: number;
  inView: boolean;
}) {
  const { item, idx, inView } = props;
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 14 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHover(false);
  };

  return (
    <motion.div
      variants={cardVariants}
      custom={idx}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ scale: 1.2, transition: { duration: 0.1 } }}
      onPointerMove={handleMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={handleLeave}
      role="img"
      aria-label={item.skil}
      style={{
        x: sx,
        y: sy,
        position: "relative",
        background: `url(${item.src}) center/cover no-repeat`,
      }}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : -4 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          x: "-50%",
          marginTop: "0.6rem",
          whiteSpace: "nowrap",
          fontSize: "1.2rem",
          pointerEvents: "none",
        }}
      >
        {item.skil}
      </motion.span>
    </motion.div>
  );
}

function MySkils() {
  const skilRef = useRef<HTMLDivElement>(null);
  const inView = useInView(skilRef);

  return (
    <div className={style.main}>
      <div className={style.history}>
        <p>피세찬</p>
        <p>2001.04.27</p>
        <p>경일 고등학교 졸업 (2017 ~ 2020)</p>
        <p>동서대학교 졸업(2020 ~ 2026)</p>
        <p>Email : vltpcks@gmail.com</p>
        <p
          className={style.hyper}
          onClick={() =>
            window.open(
              "https://solved.ac/profile/vltpcks",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          백준
        </p>
        <br />
        <p
          className={style.hyper}
          onClick={() =>
            window.open(
              "https://github.com/leaftha",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          Git Hub
        </p>
      </div>
      <div className={style.skilContainer}>
        <h1 className={style.skilTitle}>My Skils</h1>
        <div className={style.skilGrid} ref={skilRef}>
          {skils.map((item, idx) => (
            <MagneticSkill
              key={item.skil}
              item={item}
              idx={idx}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MySkils;
