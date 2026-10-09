import Header from "./components/header";
import Introduce from "./components/introduce";
import { IsClickProvider } from "./components/isClickedContext";
import Projects from "./components/projects";
import Footer from "./components/footer";
import ParticleField from "./components/particleField";
import { useEffect } from "react";
import Lenis from "lenis";

function App() {
  useEffect(() => {
    const lenis = new Lenis();
    let rafId = 0;

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <IsClickProvider>
        {/* isolation: isolate → 파티클(z-index:-1)이 이 영역 안쪽 배경에만 깔립니다 */}
        <div style={{ position: "relative", isolation: "isolate" }}>
          <ParticleField />
          <Header />
          <Introduce />
        </div>
      </IsClickProvider>
      <Projects />
      <Footer />
    </div>
  );
}

export default App;
