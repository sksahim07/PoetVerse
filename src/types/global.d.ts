export {};

declare global {
  interface Window {
    storage: {
      get(key: string): Promise<any>;
      set(key: string, value: string): Promise<any>;
      list(prefix: string): Promise<any>;
    };

    html2canvas: (
      element: HTMLElement,
      options?: any
    ) => Promise<HTMLCanvasElement>;
  }
}