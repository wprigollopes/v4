declare module 'scrollreveal' {
  interface ScrollRevealOptions {
    origin?: string;
    distance?: string;
    duration?: number;
    delay?: number;
    rotate?: { x: number; y: number; z: number };
    opacity?: number;
    scale?: number;
    easing?: string;
    mobile?: boolean;
    reset?: boolean;
    useDelay?: string;
    viewFactor?: number;
    viewOffset?: { top: number; right: number; bottom: number; left: number };
  }

  interface ScrollRevealObject {
    reveal(target: string | Element, options?: ScrollRevealOptions): void;
    clean(target: string | Element): void;
    destroy(): void;
  }

  export default function ScrollReveal(): ScrollRevealObject;
}
