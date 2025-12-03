import { useEffect, useRef } from "react";

const Background = () => {
  const ref = useRef(null);
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (ref.current) {
          const offset = window.pageYOffset;
          const adjustedOffset = Math.max(0, offset - 50);
          ref.current.style.backgroundPositionY = `${adjustedOffset * 0.7}px`;
          ticking = false;
        }
      });

      ticking = true;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`overflow-hidden absolute inset-0`}
      style={{
        backgroundImage: "var(--image-src)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "26.563rem",
        transform: "translateY(3rem)"
      }}
    >
      <div
        className="absolute inset-0 bg-primary-color-rgba"
        style={{ 
          backgroundColor: "var(--light-bg-color-rgba)"
        }}
      >
      </div>
    </div>
  );
  
}

export default Background;