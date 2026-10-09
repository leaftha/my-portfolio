import Header from "./components/header";
import Introduce from "./components/introduce";
import { IsClickProvider } from "./components/isClickedContext";
import Projects from "./components/projects";
import Footer from "./components/footer";
import ParticleField from "./components/particleField";
import ScrollLock from "./components/scrollLock";
import { useEffect, useState } from "react";
import Lenis from "lenis";

function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis();
    let rafId = 0;

    function raf(time: DOMHighResTimeStamp) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  return (
    <div>
      {/* 화면 전체에 고정된 배경. 모든 섹션 뒤에서 움직입니다. */}
      <ParticleField />
      <IsClickProvider>
        {/* 헤더 애니메이션(isClick)이 끝나기 전까지 스크롤 잠금 */}
        <ScrollLock lenis={lenis} />
        <Header />
        <Introduce />
      </IsClickProvider>
      <Projects />
      <Footer />
    </div>
  );
}

export default App;
