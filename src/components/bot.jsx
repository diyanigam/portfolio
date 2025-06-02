import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOVE_SPEED = 0.2;
const FRAME_DURATION = 100;

const BLINK_FRAME = "/assets/sprite/blink.png";
const DUCK_FRAME = "/assets/sprite/click.png";

const BG_IMAGES = [
  "/assets/bg1.jpg", // default
  "/assets/bg2.jpg", // after 40%
  "/assets/bg1.jpg", // after 80%
];

const spriteFrames = [
  "/assets/sprite/standing.png",
  "/assets/sprite/walking2.png",
  "/assets/sprite/walking3.png",
  "/assets/sprite/walking4.png",
  "/assets/sprite/walking5.png",
  "/assets/sprite/walking7.png",
];
const bgVariants = {
  enter: (dir) => ({
    x: dir === "right" ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir === "right" ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function SpriteSection() {
  const containerRef = useRef(null);
  const lastTimeRef = useRef(null);

  const keys = useRef({ left: false, right: false });

  const [position, setPosition] = useState(100);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState("right"); // sprite facing direction

  const [frameIndex, setFrameIndex] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const duckTimeoutRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const isLongPressRef = useRef(false);

  // Background state: current index, previous index and slide direction
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [prevBgIndex, setPrevBgIndex] = useState(0);
  const [bgDirection, setBgDirection] = useState("right"); // transition direction for bg slider

  // Key handlers
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

  // Movement and background update
  useEffect(() => {
    let animationFrameId;

    const update = (time) => {
      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;

        let move = 0;
        if (keys.current.right) move += MOVE_SPEED * delta;
        if (keys.current.left) move -= MOVE_SPEED * delta;

        if (move !== 0) {
          setIsMoving(true);
          setPosition((prev) => {
            const containerWidth = containerRef.current?.clientWidth || 0;
            const spriteWidth = 150;
            let newPos = prev + move;

            // Clamp position
            newPos = Math.max(0, Math.min(containerWidth - spriteWidth, newPos));

            // Calculate percentage scrolled
            const percent = newPos / containerWidth;

            // Determine new background index based on percentage
            let newBg = 0;
            if (percent > 0.8) newBg = 2;
            else if (percent > 0.4) newBg = 1;

            if (newBg !== currentBgIndex) {
              // Set bg direction based on index difference
              const dir = newBg > currentBgIndex ? "right" : "left";

              setPrevBgIndex(currentBgIndex);
              setCurrentBgIndex(newBg);
              setBgDirection(dir);
            }

            return newPos;
          });
        } else {
          setIsMoving(false);
        }
      }
      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentBgIndex]);

  // Walking animation frames
  useEffect(() => {
    if (!isMoving) {
      setFrameIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % spriteFrames.length);
    }, FRAME_DURATION);

    return () => clearInterval(interval);
  }, [isMoving]);

  // Blinking animation (when not moving or ducking)
  useEffect(() => {
    if (isMoving || isDucking) return;

    let blinkTimeout;
    let resetTimeout;

    const scheduleBlink = () => {
      const delay = Math.random() * 3000 + 2000;
      blinkTimeout = setTimeout(() => {
        setFrameIndex(-1); // blink frame
        resetTimeout = setTimeout(() => {
          setFrameIndex(0);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(resetTimeout);
    };
  }, [isMoving, isDucking]);

  // Duck logic handlers
  const handleSpriteDown = () => {
    isLongPressRef.current = false;
    holdTimeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsDucking(true);
    }, 400);
  };

  const handleSpriteUp = () => {
    clearTimeout(holdTimeoutRef.current);
    if (!isLongPressRef.current) {
      setIsDucking(true);
      duckTimeoutRef.current = setTimeout(() => {
        setIsDucking(false);
      }, 500);
    } else {
      setIsDucking(false);
    }
  };

  const handleSpriteLeave = () => {
    clearTimeout(holdTimeoutRef.current);
    if (isLongPressRef.current) setIsDucking(false);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(duckTimeoutRef.current);
      clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative h-[50vh] w-full overflow-hidden outline-none"
    >
      {/* Static Bottom Background */}
      <div
        key={`bg-bottom-${prevBgIndex}`}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BG_IMAGES[prevBgIndex]})`,
          zIndex: 0,
        }}
      />

      {/* Sliding Top Background */}
      <AnimatePresence initial={false} custom={bgDirection}>
        {currentBgIndex !== prevBgIndex && (
          <motion.div
            key={`bg-top-${currentBgIndex}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGES[currentBgIndex]})`, zIndex: 1 }}
            variants={bgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={bgDirection}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Sprite */}
      <motion.img
        src={
          isDucking
            ? DUCK_FRAME
            : frameIndex === -1
            ? BLINK_FRAME
            : spriteFrames[frameIndex]
        }
        alt="sprite"
        initial={false}
        animate={{
          x: position,
          scaleX: direction === "right" ? -1 : 1,
        }}
        transition={{
          x: { type: "tween", ease: "linear", duration: 0 },
          scaleX: { duration: 0 },
        }}
        className="absolute bottom-4 w-[150px] h-[150px] z-10 select-none pointer-events-auto"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
        onMouseDown={handleSpriteDown}
        onMouseUp={handleSpriteUp}
        onMouseLeave={handleSpriteLeave}
        onTouchStart={handleSpriteDown}
        onTouchEnd={handleSpriteUp}
      />
    </div>
  );
}