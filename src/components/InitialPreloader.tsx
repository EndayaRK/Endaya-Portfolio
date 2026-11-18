import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INTRO_MODE, LOADER_REVEAL_AT, markIntroSeen } from "../motion";

/* ─────────────────────────────────────────────────────────────────────────────
 * THE ASSEMBLY — EA Sports-Inspired 3D Monogram Lock & Camera Push-Through
 *
 * The /RK_logo_original.png emblem consists of three distinct, non-touching
 * strokes separated by transparent channels:
 *   1. The "R" letterform
 *   2. The "K" main diagonal slash (/)
 *   3. The "K" lower kick leg (\)
 *
 * Each stroke enters in 3D perspective along its natural vector and locks into
 * the unified RK emblem with a weighty impact pulse and a letter-masked light
 * sweep. Once locked, the emblem stays whole and glides forward as the stage
 * opens to reveal the portfolio. No boxes or squares behind the letters.
 * ──────────────────────────────────────────────────────────────────────────── */

const LOGO_SRC = "/RK_logo_original.png";
const READINESS_CAP_MS = 1200;

interface EmblemPart {
  id: string;
  /** Polygon running strictly through the transparent channels between the 3 strokes */
  clip: string;
  /** 3D entrance vector */
  from: {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    scale: number;
  };
  delay: number;
}

const PARTS: EmblemPart[] = [
  {
    // 1. Complete "R" letterform (left island)
    id: "part-r",
    clip: "polygon(0% 0%, 64% 0%, 64% 35%, 58.5% 45%, 55.8% 49.5%, 48.5% 55.5%, 53% 60.8%, 62% 70%, 62% 100%, 0% 100%)",
    from: { x: -0.75, y: 0.04, z: 240, rx: 6, ry: 30, rz: -2, scale: 1.08 },
    delay: 0.0,
  },
  {
    // 2. Complete "K" main diagonal slash (/) (upper-right island)
    id: "part-k-slash",
    clip: "polygon(64% 0%, 100% 0%, 100% 47%, 68% 47%, 60.9% 54%, 53% 60.8%, 48.5% 55.5%, 55.8% 49.5%, 58.5% 45%, 64% 35%)",
    from: { x: 0.72, y: -0.58, z: 210, rx: 10, ry: -26, rz: -3, scale: 1.06 },
    delay: 0.09,
  },
  {
    // 3. Complete "K" lower kick leg (\) (bottom-right island)
    id: "part-k-leg",
    clip: "polygon(68% 47%, 100% 47%, 100% 100%, 62% 100%, 62% 70%, 53% 60.8%, 60.9% 54%)",
    from: { x: 0.58, y: 0.52, z: 180, rx: -12, ry: -20, rz: 4, scale: 1.05 },
    delay: 0.17,
  },
];

export default function InitialPreloader() {
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const unifiedLogoRef = useRef<HTMLImageElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  /* ── Synchronize with application readiness (fonts + window + logo decode) ── */
  const readyPromiseRef = useRef<Promise<void> | null>(null);
  if (!readyPromiseRef.current && typeof window !== "undefined") {
    const fonts =
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
        ?.ready ?? Promise.resolve();
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((res) =>
            window.addEventListener("load", () => res(), { once: true })
          );
    const logo = new Promise<void>((res) => {
      const img = new Image();
      img.onload = () => res();
      img.onerror = () => res();
      img.src = LOGO_SRC;
    });
    readyPromiseRef.current = Promise.all([
      fonts.catch(() => undefined),
      loaded,
      logo,
    ]).then(() => {
      readyRef.current = true;
    });
  }

  /* ── Prevent wheel/touch scroll bleed while loader is active ── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const block = (e: Event) => e.preventDefault();
    root.addEventListener("wheel", block, { passive: false });
    root.addEventListener("touchmove", block, { passive: false });
    return () => {
      root.removeEventListener("wheel", block);
      root.removeEventListener("touchmove", block);
    };
  }, []);

  /* ── EA Sports-Style 3D Lock & Camera Push-Through Sequence ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const emblem = emblemRef.current;
    const unifiedLogo = unifiedLogoRef.current;
    const sheen = sheenRef.current;
    if (!root || !backdrop || !emblem || !unifiedLogo) return;

    let capTimer: number | undefined;
    const safety = window.setTimeout(
      () => setDone(true),
      (LOADER_REVEAL_AT + READINESS_CAP_MS / 1000 + 2.0) * 1000
    );

    const ctx = gsap.context(() => {
      const partEls = gsap.utils.toArray<HTMLElement>("[data-part]", root);

      const sx = Math.min(window.innerWidth * 0.24, 240);
      const sy = Math.min(window.innerHeight * 0.2, 180);

      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      const R = LOADER_REVEAL_AT;

      const holdForReadiness = () => {
        if (readyRef.current) return;
        tl.pause();
        const resume = () => {
          if (capTimer) window.clearTimeout(capTimer);
          if (tl.paused()) tl.play();
        };
        readyPromiseRef.current?.then(resume);
        capTimer = window.setTimeout(resume, READINESS_CAP_MS);
      };

      if (INTRO_MODE === "reduced") {
        gsap.set(partEls, { opacity: 0 });
        gsap.set(unifiedLogo, { opacity: 1 });
        tl.call(holdForReadiness, [], R);
        tl.call(markIntroSeen, [], R);
        tl.to(root, { opacity: 0, duration: 0.32, ease: "power2.out" }, R);
        return;
      }

      const timeScale = INTRO_MODE === "short" ? 0.6 : 1;
      const flyDur = 0.78 * timeScale;

      /* ── STAGE 01 & 02: 3D Letter Strokes Sweep In & Lock Together ── */
      PARTS.forEach((p, i) => {
        const el = partEls[i];
        if (!el) return;
        const startAt = p.delay * timeScale;

        tl.fromTo(
          el,
          {
            x: p.from.x * sx,
            y: p.from.y * sy,
            z: p.from.z,
            rotationX: p.from.rx,
            rotationY: p.from.ry,
            rotationZ: p.from.rz,
            scale: p.from.scale,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
            opacity: 1,
            duration: flyDur,
            ease: "expo.out",
          },
          startAt
        );
      });

      const lockAt = (0.17 + 0.7) * timeScale;

      /* ── STAGE 03: Impact Lock & Letter-Masked Sheen (Stays Whole!) ── */
      tl.set(unifiedLogo, { opacity: 1 }, lockAt);
      tl.set(partEls, { opacity: 0 }, lockAt);

      // Weighty EA-style lock thump: slight punch forward then crisp settle
      tl.to(
        emblem,
        {
          scale: 1.045,
          duration: 0.08 * timeScale,
          ease: "power2.out",
        },
        lockAt - 0.03 * timeScale
      );
      tl.to(
        emblem,
        {
          scale: 1,
          duration: 0.28 * timeScale,
          ease: "expo.out",
        },
        lockAt + 0.05 * timeScale
      );

      // Diagonal light sheen across the locked RK letters only
      if (sheen) {
        tl.fromTo(
          sheen,
          { xPercent: -130, opacity: 1 },
          {
            xPercent: 130,
            opacity: 1,
            duration: 0.52 * timeScale,
            ease: "power2.inOut",
          },
          lockAt
        );
        tl.set(sheen, { opacity: 0 }, lockAt + 0.53 * timeScale);
      }

      /* ── Readiness Synchronization ── */
      tl.call(holdForReadiness, [], R);

      /* ── STAGE 04: Unified Camera Push-Through Reveal (Never Breaks Apart) ── */
      tl.call(
        () => {
          root.style.pointerEvents = "none";
          markIntroSeen();
        },
        [],
        R
      );

      // The solid RK emblem glides toward the viewer while the stage opens cleanly
      tl.to(
        emblem,
        {
          scale: 1.18,
          z: 140,
          opacity: 0,
          duration: 0.56,
          ease: "power3.inOut",
        },
        R
      );

      tl.to(
        backdrop,
        {
          opacity: 0,
          duration: 0.58,
          ease: "power2.inOut",
        },
        R + 0.04
      );
    }, root);

    return () => {
      window.clearTimeout(safety);
      if (capTimer) window.clearTimeout(capTimer);
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="rk-loader fixed inset-0 z-[100] overflow-hidden select-none"
      role="status"
      aria-live="polite"
      data-lenis-prevent
    >
      <span className="sr-only">Loading Rhon Kelly Endaya&apos;s portfolio</span>

      {/* Clean Theme-Matched Stage Backdrop (No boxes, no borders, no clutter) */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="absolute inset-0 bg-band-primary will-change-[opacity]"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--rk-ambient), transparent 65%)",
          }}
        />
      </div>

      {/* 3D Dimensional Stage — ONLY the RK Letters */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center pointer-events-none"
        style={{ perspective: "1100px" }}
      >
        <div
          ref={emblemRef}
          className="relative w-[min(56vw,250px)] sm:w-[min(38vw,290px)] aspect-square flex items-center justify-center will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Three Real Strokes of the RK Monogram (R, K-slash, K-leg) */}
          {PARTS.map((p) => (
            <div
              key={p.id}
              data-part
              className="absolute inset-0 opacity-0 will-change-transform"
              style={{ clipPath: p.clip }}
            >
              <img
                src={LOGO_SRC}
                alt=""
                draggable={false}
                className="rk-loader-logo w-full h-full object-contain"
              />
            </div>
          ))}

          {/* Unified RK Emblem (stays whole after locking) */}
          <img
            ref={unifiedLogoRef}
            src={LOGO_SRC}
            alt=""
            draggable={false}
            className="rk-loader-logo absolute inset-0 w-full h-full object-contain opacity-0"
          />

          {/* Letter-Masked Sheen Sweep (masked strictly to the RK letters, zero box) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              WebkitMaskImage: `url('${LOGO_SRC}')`,
              maskImage: `url('${LOGO_SRC}')`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            <div
              ref={sheenRef}
              className="absolute inset-y-0 -inset-x-1/4 opacity-0 will-change-transform"
              style={{
                background:
                  "linear-gradient(108deg, transparent 36%, var(--rk-sheen) 50%, transparent 64%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
