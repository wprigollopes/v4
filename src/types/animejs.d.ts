declare module 'animejs' {
  interface AnimeParams {
    targets?: string | object | HTMLElement | SVGElement | NodeList | null;
    duration?: number;
    delay?: number | Function;
    easing?: string;
    opacity?: number | number[];
    scale?: number | number[];
    translateX?: number | number[] | string;
    translateY?: number | number[] | string;
    rotate?: number | number[] | string;
    strokeDashoffset?: any;
    zIndex?: number;
    complete?: () => void;
    [key: string]: any;
  }

  interface AnimeTimelineInstance {
    add(params: AnimeParams, offset?: string | number): AnimeTimelineInstance;
  }

  interface AnimeStatic {
    (params: AnimeParams): any;
    timeline(params?: AnimeParams): AnimeTimelineInstance;
    setDashoffset(el: HTMLElement | SVGElement): number;
  }

  const anime: AnimeStatic;
  export default anime;
}
