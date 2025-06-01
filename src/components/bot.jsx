import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MOVE_SPEED = 0.2; // Pixels per millisecond
const FRAME_DURATION = 100;
const STANDING_FRAME = "public/assets/sprite/standing.png";
const BLINK_FRAME = "/assets/sprite/blink.png";

const spriteFrames = [
  "public/assets/sprite/standing.png",
  "public/assets/sprite/walking2.png",
  "public/assets/sprite/walking3.png",
  "public/assets/sprite/walking4.png",
  "public/assets/sprite/walking5.png",
  "public/assets/sprite/walking7.png",
  
];

export default function SpriteSection() {
  const sectionRef = useRef(null);
  const [position, setPosition] = useState(100);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState("right");
  const [frameIndex, setFrameIndex] = useState(0);
  const [hideCursor, setHideCursor] = useState(false);

  const keys = useRef({ left: false, right: false });
  const lastTimeRef = useRef(null);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "d") {
        keys.current.right = true;
        setDirection("right");
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        keys.current.left = true;
        setDirection("left");
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowRight" || e.key === "d") {
        keys.current.right = false;
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        keys.current.left = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Animate position smoothly
  useEffect(() => {
    let animationFrameId;

    const update = (time) => {
      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;

        let move = 0;
        if (keys.current.right) move += MOVE_SPEED * delta;
        if (keys.current.left) move -= MOVE_SPEED * delta;

        if (move !== 0) {
          setPosition((prev) => Math.max(0, prev + move));
          setIsMoving(true);
        } else {
          setIsMoving(false);
        }
      }

      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle frame changes when moving
  useEffect(() => {
    if (!isMoving) {
      setFrameIndex(0); // default standing
      return;
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % spriteFrames.length);
    }, FRAME_DURATION);

    return () => clearInterval(interval);
  }, [isMoving]);

  const handleClick = () => {
    setHideCursor(true);
    sectionRef.current?.focus();
  };

  // Idle blinking logic
useEffect(() => {
  if (isMoving) return;

  let blinkTimeout;
  let resetTimeout;

  const scheduleBlink = () => {
    const delay = Math.random() * 3000 + 2000; // 2s–5s
    blinkTimeout = setTimeout(() => {
      setFrameIndex(-1); // use -1 as a signal for blink
      resetTimeout = setTimeout(() => {
        setFrameIndex(0); // back to standing
        scheduleBlink(); // schedule next blink
      }, 150); // blink duration
    }, delay);
  };

  scheduleBlink();

  return () => {
    clearTimeout(blinkTimeout);
    clearTimeout(resetTimeout);
  };
}, [isMoving]);


  return (
    <div
      ref={sectionRef}
      tabIndex={0}
      onClick={handleClick}
      className={`relative h-[50vh] w-full overflow-hidden bg-cover bg-center outline-none ${
        hideCursor ? "cursor-none" : "cursor-[url('/cursor.png'),_auto]"
      }`}
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
    <motion.img
    src={frameIndex === -1 ? BLINK_FRAME : spriteFrames[frameIndex]}
    alt="sprite"
    initial={false}
    animate={{ 
        x: position,
        scaleX: direction === "right" ? -1 : 1,
    }}
    transition={{
        x: { type: "tween", ease: "linear", duration: 0.1 },
        scaleX: { duration: 0 }, // no transition, flip is instant
    }}
    className="absolute bottom-4 w-[150px] h-[150px] select-none pointer-events-none"
    draggable={false}
    style={{ imageRendering: "pixelated" }}
    />



    </div>
  );
}
