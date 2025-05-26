import { useEffect, useState } from "react";
import cursorDefault from "../assets/cursor1.jpg";
import cursorHover from "../assets/cursor2.jpg";
import cursorClick from "../assets/cursor3.jpg";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorImage, setCursorImage] = useState(cursorDefault);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const moveHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      if (hoveredElement?.classList.contains("cursor-hover")) {
        setCursorImage(cursorHover);
        setHovering(true);
    } else if (!hovering) {
        setCursorImage(cursorDefault);}
    };

    const downHandler = () => {
      setCursorImage(cursorClick);
    };

    const upHandler = () => {
      setCursorImage(cursorDefault);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mousedown", downHandler);
    window.addEventListener("mouseup", upHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mousedown", downHandler);
      window.removeEventListener("mouseup", upHandler);
    };
  }, []);

  return (
    <img
      src={cursorImage}
      alt="custom cursor"
      className="pointer-events-none fixed z-[9999] w-8 h-8"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}