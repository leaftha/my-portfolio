import { useContext, useEffect } from "react";
import type Lenis from "lenis";
import { IsClickContext } from "./isClickedContext";

/**
 * 헤더 애니메이션이 끝나기 전(isClick === false)까지 스크롤을 막습니다.
 * - Lenis: stop()/start()로 휠 스크롤을 막고 풉니다. (Lenis는 휠 입력을 직접 가로채기 때문에 overflow만으로는 막히지 않습니다)
 * - html overflow: hidden: 터치, 키보드(스페이스, 방향키), 스크롤바 드래그를 막습니다.
 * - scrollbar-gutter: 잠금이 풀릴 때 스크롤바가 생기면서 화면이 옆으로 밀리는 것을 막습니다.
 *
 * IsClickProvider 안에서 렌더링해야 합니다.
 */
function ScrollLock(props: { lenis: Lenis | null }) {
  const { lenis } = props;
  const clicked = useContext(IsClickContext);
  const locked = !clicked?.isClick;

  // 새로고침해도 항상 맨 위에서 시작하도록 (스크롤 복원 때문에 중간에서 잠기는 것을 방지)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevGutter = root.style.getPropertyValue("scrollbar-gutter");

    window.scrollTo(0, 0);
    root.style.overflow = "hidden";
    root.style.setProperty("scrollbar-gutter", "stable");
    lenis?.stop();

    return () => {
      root.style.overflow = prevOverflow;
      if (prevGutter) root.style.setProperty("scrollbar-gutter", prevGutter);
      else root.style.removeProperty("scrollbar-gutter");
      lenis?.start();
    };
  }, [locked, lenis]);

  return null;
}

export default ScrollLock;
