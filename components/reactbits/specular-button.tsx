'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type SpecularButtonSize = 'sm' | 'md' | 'lg';

const SIZES: Record<SpecularButtonSize, string> = {
  sm: 'px-5 py-2.5 text-xs font-semibold',
  md: 'px-6 py-3 text-sm font-semibold',
  lg: 'px-8 py-4 text-base font-bold',
};

export interface SpecularButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  children?: ReactNode;
  size?: SpecularButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function SpecularButton({
  children = 'Get Started',
  size = 'md',
  radius = 16,
  tint = '#FF1018',
  tintOpacity = 0.18,
  blur = 8,
  textColor = '#FFFFFF',
  lineColor = '#FF3B41',
  baseColor = 'rgba(255, 16, 24, 0.25)',
  intensity = 1.2,
  idleIntensity = 0.5,
  glow = 1.2,
  speed = 1.2,
  followMouse = true,
  proximity = 200,
  autoAnimate = true,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const beamRef = useRef<HTMLSpanElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const [isNear, setIsNear] = useState(false);

  const angleRef = useRef(0);
  const intensityRef = useRef(idleIntensity);
  const targetAngleRef = useRef(0);
  const isNearRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!buttonRef.current || disabled) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < proximity) {
        if (!isNearRef.current) {
          isNearRef.current = true;
          setIsNear(true);
        }

        // Calculate target angle in degrees [0, 360)
        let deg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (deg < 0) deg += 360;
        targetAngleRef.current = deg;

        // Direct DOM update for glare position (no React re-render)
        const px = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const py = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(130px circle at ${px}% ${py}%, rgba(255, 255, 255, 0.25), transparent 70%)`;
        }
      } else if (isNearRef.current) {
        isNearRef.current = false;
        setIsNear(false);
      }
    },
    [disabled, proximity]
  );

  const handlePointerLeave = useCallback(() => {
    if (isNearRef.current) {
      isNearRef.current = false;
      setIsNear(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  // Smooth hardware-accelerated GPU transform rotation loop (Zero React re-renders)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isNearRef.current && followMouse) {
        // Smoothly glide current angle toward cursor target angle
        let diff = targetAngleRef.current - angleRef.current;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;

        angleRef.current = (angleRef.current + diff * (1 - Math.exp(-dt * 12)) + 360) % 360;
        intensityRef.current = intensityRef.current + (intensity - intensityRef.current) * (1 - Math.exp(-dt * 8));
      } else if (autoAnimate) {
        // Continuous auto-animation spin
        angleRef.current = (angleRef.current + speed * 60 * dt) % 360;
        intensityRef.current = intensityRef.current + (idleIntensity - intensityRef.current) * (1 - Math.exp(-dt * 5));
      }

      // Direct GPU transform update
      if (beamRef.current) {
        beamRef.current.style.transform = `rotate(${angleRef.current}deg)`;
        beamRef.current.style.opacity = String(intensityRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoAnimate, followMouse, idleIntensity, intensity, speed]);

  const sizeClass = SIZES[size] ?? SIZES.md;

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group relative isolate inline-flex cursor-pointer items-center justify-center gap-2 select-none border-0 font-medium tracking-wide outline-none transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${className}`}
      style={
        {
          borderRadius: `${radius}px`,
          color: textColor,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {/* 1. Specular Border Track (Conic beam with smooth rotating highlight) */}
      <span
        className="pointer-events-none absolute -inset-[1.5px] rounded-[inherit] overflow-hidden p-[1.5px]"
        aria-hidden="true"
        style={{
          boxShadow: `0 0 ${glow * 10}px ${lineColor}35, 0 10px 25px -10px rgba(0, 0, 0, 0.7)`,
        }}
      >
        {/* Base border line */}
        <span
          className="absolute inset-0 rounded-[inherit]"
          style={{
            backgroundColor: baseColor,
          }}
        />

        {/* Specular rotating light beam */}
        <span
          ref={beamRef}
          className="absolute inset-[-150%] rounded-[inherit] transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: idleIntensity,
            transform: 'rotate(0deg)',
            willChange: 'transform',
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, ${lineColor} 70deg, #FFFFFF 90deg, ${lineColor} 110deg, transparent 140deg, transparent 360deg)`,
          }}
        />
      </span>

      {/* 2. Glassmorphic Surface Body */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{
          backgroundColor: '#0B0B13',
          background: `color-mix(in srgb, ${tint} calc(${tintOpacity} * 100%), #0B0B13)`,
          backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
          WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
        aria-hidden="true"
      >
        {/* Subtle inner cursor glare reflection */}
        <span
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: isNear ? 0.35 : 0.15,
            background: `radial-gradient(130px circle at 50% 50%, rgba(255, 255, 255, 0.25), transparent 70%)`,
          }}
        />

        {/* Inner ambient rim glow */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0 0 16px ${tint}25`,
          }}
        />
      </span>

      {/* 3. Button Content */}
      <span className="relative z-10 inline-flex items-center gap-2 drop-shadow-sm font-semibold">
        {children}
      </span>
    </button>
  );
}

export default SpecularButton;
