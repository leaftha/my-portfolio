import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * 커서 위치에 따라 3D로 기울어지는 이미지.
 * 기존 <img>와 같은 className을 그대로 넘기면 레이아웃은 바뀌지 않습니다.
 */
function TiltImage(props: { src: string; className?: string; alt?: string }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 200, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), spring);

  const handleMove = (e: React.PointerEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.img
      src={props.src}
      alt={props.alt ?? ""}
      className={props.className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.04 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    />
  );
}

export default TiltImage;
