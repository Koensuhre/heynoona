"use client";

import { useEffect, useRef } from "react";

type SoapBubblesProps = {
  count?: number;
  intensity?: "light" | "medium" | "heavy";
};

type Bubble = {  x: number;
  y: number;
  radius: number;

  vx: number;
  vy: number;

  depth: number;
  wobble: number;
  wobbleSpeed: number;
  rotation: number;

  opacity: number;
  hue: number;
};

export default function SoapBubbles({
  count = 110,
  intensity = "medium",
}: SoapBubblesProps) {  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let bubbles: Bubble[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    /* ========================================
       CANVAS RESIZE
       ======================================== */

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ========================================
       BUBBLE GENERATOR
       ======================================== */

    const createBubble = (): Bubble => {
      const sizeRoll = Math.random();

      let radius: number;

      /*
       * Veel kleine bubbles,
       * genoeg middelgrote bubbles,
       * en enkele grotere bubbles.
       */
      if (sizeRoll < 0.45) {
        // 15 - 32px
        radius = Math.random() * 17 + 15;
      } else if (sizeRoll < 0.75) {
        // 32 - 55px
        radius = Math.random() * 23 + 32;
      } else if (sizeRoll < 0.92) {
        // 55 - 85px
        radius = Math.random() * 30 + 55;
      } else if (sizeRoll < 0.985) {
        // 85 - 125px
        radius = Math.random() * 40 + 85;
      } else {
        // 125 - 190px
        radius = Math.random() * 65 + 125;
      }

      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,

        radius,

        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.28 + 0.04),

        depth: Math.random(),

        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.008 + 0.002,

        rotation: Math.random() * Math.PI * 2,

        /*
         * Iets subtielere opacity dan de vorige versie.
         */
        opacity:
          radius < 35
            ? Math.random() * 0.18 + 0.48
            : Math.random() * 0.2 + 0.58,

        hue: Math.random() * 360,
      };
    };

    /* ========================================
       AANTAL BUBBLES
       ======================================== */

    const createBubbles = () => {
      /*
       * Minder dan de vorige versie,
       * maar nog steeds een rijk gevulde achtergrond.
       */
      const amount = window.innerWidth < 768 ? 75 : 125;

      bubbles = [];

      for (let i = 0; i < amount; i++) {
        bubbles.push(createBubble());
      }
    };

    /* ========================================
       MOUSE INTERACTION
       ======================================== */

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    /* ========================================
       DRAW BUBBLE
       ======================================== */

    const drawBubble = (bubble: Bubble, time: number) => {
      const { x, y, radius } = bubble;

      ctx.save();

      /* ========================================
         WOBBLE
         ======================================== */

      const wobbleX =
        Math.sin(
          time * bubble.wobbleSpeed + bubble.wobble
        ) *
        radius *
        0.018;

      const wobbleY =
        Math.cos(
          time * bubble.wobbleSpeed * 0.8 +
            bubble.wobble
        ) *
        radius *
        0.012;

      const bx = x + wobbleX;
      const by = y + wobbleY;

      const opacity = bubble.opacity;
      const hue = bubble.hue;

      /* ========================================
         OUTER GLOW
         ======================================== */

      const halo = ctx.createRadialGradient(
        bx,
        by,
        radius * 0.65,
        bx,
        by,
        radius * 1.3
      );

      halo.addColorStop(
        0,
        "rgba(255,255,255,0)"
      );

      halo.addColorStop(
        0.72,
        `rgba(255,255,255,${opacity * 0.025})`
      );

      halo.addColorStop(
        0.88,
        `rgba(255,255,255,${opacity * 0.1})`
      );

      halo.addColorStop(
        0.95,
        `hsla(${(hue + 320) % 360},100%,85%,${opacity * 0.055})`
      );

      halo.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.arc(
        bx,
        by,
        radius * 1.3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = halo;
      ctx.fill();

      /* ========================================
         TRANSPARENT GLASS CORE
         ======================================== */

      const glass = ctx.createRadialGradient(
        bx - radius * 0.3,
        by - radius * 0.35,
        0,
        bx,
        by,
        radius
      );

      glass.addColorStop(
        0,
        `rgba(255,255,255,${opacity * 0.025})`
      );

      glass.addColorStop(
        0.45,
        `rgba(255,255,255,${opacity * 0.012})`
      );

      glass.addColorStop(
        0.75,
        `rgba(255,255,255,${opacity * 0.035})`
      );

      glass.addColorStop(
        0.9,
        `rgba(255,255,255,${opacity * 0.11})`
      );

      glass.addColorStop(
        1,
        `rgba(255,255,255,${opacity * 0.18})`
      );

      ctx.beginPath();

      ctx.arc(
        bx,
        by,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = glass;
      ctx.fill();

      /* ========================================
         IRIDESCENT SOAP FILM
         ======================================== */

      const soap = ctx.createRadialGradient(
        bx - radius * 0.35,
        by - radius * 0.4,
        radius * 0.03,
        bx,
        by,
        radius
      );

      soap.addColorStop(
        0,
        `hsla(${hue},100%,96%,${opacity * 0.18})`
      );

      soap.addColorStop(
        0.2,
        `hsla(${(hue + 65) % 360},100%,85%,${opacity * 0.12})`
      );

      soap.addColorStop(
        0.4,
        `hsla(${(hue + 135) % 360},100%,85%,${opacity * 0.07})`
      );

      soap.addColorStop(
        0.58,
        `hsla(${(hue + 190) % 360},100%,88%,${opacity * 0.1})`
      );

      soap.addColorStop(
        0.72,
        `hsla(${(hue + 275) % 360},100%,88%,${opacity * 0.15})`
      );

      soap.addColorStop(
        0.88,
        `hsla(${(hue + 330) % 360},100%,92%,${opacity * 0.23})`
      );

      soap.addColorStop(
        1,
        `rgba(255,255,255,${opacity * 0.12})`
      );

      ctx.beginPath();

      ctx.arc(
        bx,
        by,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = soap;
      ctx.fill();

      /* ========================================
         OUTER RIM
         ======================================== */

      const rim = ctx.createConicGradient(
        bubble.rotation,
        bx,
        by
      );

      rim.addColorStop(
        0,
        `hsla(${(hue + 20) % 360},100%,75%,${opacity * 0.58})`
      );

      rim.addColorStop(
        0.16,
        `rgba(255,255,255,${opacity * 0.65})`
      );

      rim.addColorStop(
        0.32,
        `hsla(${(hue + 100) % 360},100%,82%,${opacity * 0.4})`
      );

      rim.addColorStop(
        0.5,
        `hsla(${(hue + 185) % 360},100%,82%,${opacity * 0.5})`
      );

      rim.addColorStop(
        0.68,
        `hsla(${(hue + 260) % 360},100%,82%,${opacity * 0.58})`
      );

      rim.addColorStop(
        0.84,
        `rgba(255,255,255,${opacity * 0.68})`
      );

      rim.addColorStop(
        1,
        `hsla(${(hue + 20) % 360},100%,75%,${opacity * 0.58})`
      );

      ctx.beginPath();

      ctx.arc(
        bx,
        by,
        radius * 0.975,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = rim;

      ctx.lineWidth = Math.max(
        1,
        radius * 0.02
      );

      ctx.stroke();

      /* ========================================
         SECOND INNER RIM
         ======================================== */

      ctx.beginPath();

      ctx.arc(
        bx,
        by,
        radius * 0.91,
        Math.PI * 1.03,
        Math.PI * 1.85
      );

      ctx.strokeStyle =
        `rgba(255,255,255,${opacity * 0.44})`;

      ctx.lineWidth = Math.max(
        0.6,
        radius * 0.012
      );

      ctx.stroke();

      /* ========================================
         LOWER COLORED REFRACTION
         ======================================== */

      const lowerGlow = ctx.createRadialGradient(
        bx + radius * 0.35,
        by + radius * 0.4,
        0,
        bx + radius * 0.35,
        by + radius * 0.4,
        radius * 0.7
      );

      lowerGlow.addColorStop(
        0,
        `hsla(${(hue + 290) % 360},100%,80%,${opacity * 0.14})`
      );

      lowerGlow.addColorStop(
        0.35,
        `hsla(${(hue + 190) % 360},100%,85%,${opacity * 0.07})`
      );

      lowerGlow.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.arc(
        bx + radius * 0.35,
        by + radius * 0.4,
        radius * 0.7,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = lowerGlow;
      ctx.fill();

      /* ========================================
         SOFT LARGE HIGHLIGHT
         ======================================== */

      const highlight = ctx.createRadialGradient(
        bx - radius * 0.34,
        by - radius * 0.4,
        0,
        bx - radius * 0.34,
        by - radius * 0.4,
        radius * 0.42
      );

      highlight.addColorStop(
        0,
        `rgba(255,255,255,${Math.min(
          0.78,
          opacity * 0.95
        )})`
      );

      highlight.addColorStop(
        0.16,
        `rgba(255,255,255,${opacity * 0.52})`
      );

      highlight.addColorStop(
        0.38,
        `rgba(255,255,255,${opacity * 0.22})`
      );

      highlight.addColorStop(
        0.65,
        `rgba(255,255,255,${opacity * 0.05})`
      );

      highlight.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.arc(
        bx - radius * 0.34,
        by - radius * 0.4,
        radius * 0.42,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = highlight;
      ctx.fill();

      /* ========================================
         SHARP SPECULAR REFLECTION
         ======================================== */

      ctx.beginPath();

      ctx.ellipse(
        bx - radius * 0.5,
        by - radius * 0.5,
        radius * 0.08,
        radius * 0.16,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(255,255,255,${Math.min(
          0.82,
          opacity
        )})`;

      ctx.fill();

      /* ========================================
         SECONDARY REFLECTION
         ======================================== */

      const reflection =
        ctx.createRadialGradient(
          bx + radius * 0.4,
          by + radius * 0.32,
          0,
          bx + radius * 0.4,
          by + radius * 0.32,
          radius * 0.3
        );

      reflection.addColorStop(
        0,
        `hsla(${(hue + 220) % 360},100%,95%,${opacity * 0.26})`
      );

      reflection.addColorStop(
        0.3,
        `hsla(${(hue + 160) % 360},100%,90%,${opacity * 0.12})`
      );

      reflection.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.arc(
        bx + radius * 0.4,
        by + radius * 0.32,
        radius * 0.3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = reflection;
      ctx.fill();

      ctx.restore();
    };

    /* ========================================
       UPDATE BUBBLE
       ======================================== */

    const updateBubble = (bubble: Bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      /*
       * Natuurlijke zijwaartse drift.
       */
      bubble.vx +=
        Math.sin(
          performance.now() * 0.0003 +
            bubble.wobble
        ) * 0.0006;

      /* ========================================
         MOUSE INTERACTION
         ======================================== */

      if (mouse.active) {
        const dx = bubble.x - mouse.x;
        const dy = bubble.y - mouse.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        const interactionRadius =
          120 + bubble.radius * 1.5;

        if (
          distance < interactionRadius &&
          distance > 0
        ) {
          const force =
            (1 - distance / interactionRadius) *
            0.045;

          bubble.vx +=
            (dx / distance) * force;

          bubble.vy +=
            (dy / distance) * force;
        }
      }

      /* ========================================
         AIR RESISTANCE
         ======================================== */

      bubble.vx *= 0.995;
      bubble.vy *= 0.995;

      /* ========================================
         SPEED LIMIT
         ======================================== */

      const maxSpeed = 1.2;

      bubble.vx = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, bubble.vx)
      );

      bubble.vy = Math.max(
        -maxSpeed,
        Math.min(maxSpeed, bubble.vy)
      );

      /* ========================================
         RESET ABOVE SCREEN
         ======================================== */

      if (
        bubble.y <
        -bubble.radius * 2
      ) {
        bubble.y =
          window.innerHeight +
          bubble.radius * 2;

        bubble.x =
          Math.random() *
          window.innerWidth;

        bubble.vy =
          -(Math.random() * 0.28 + 0.04);
      }

      /* ========================================
         HORIZONTAL BOUNDS
         ======================================== */

      if (
        bubble.x <
        -bubble.radius
      ) {
        bubble.x = -bubble.radius;
        bubble.vx =
          Math.abs(bubble.vx);
      }

      if (
        bubble.x >
        window.innerWidth +
          bubble.radius
      ) {
        bubble.x =
          window.innerWidth +
          bubble.radius;

        bubble.vx =
          -Math.abs(bubble.vx);
      }
    };

    /* ========================================
       ANIMATION
       ======================================== */

    const animate = (time: number) => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      /*
       * Kleine bubbles eerst,
       * grote bubbles bovenop.
       */
      bubbles.sort(
        (a, b) =>
          a.radius - b.radius
      );

      for (const bubble of bubbles) {
        updateBubble(bubble);
        drawBubble(bubble, time);
      }

      animationFrame =
        requestAnimationFrame(animate);
    };

    /* ========================================
       INIT
       ======================================== */

    resize();
    createBubbles();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="soap-bubbles-background"
      aria-hidden="true"
    />
  );
}