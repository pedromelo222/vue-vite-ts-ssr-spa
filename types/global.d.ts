declare global {
  interface Window {
    __INITIAL_STATE__?: {
      serverTime: number;
      tenant: string;
      data: string; // other data
    }
  }
}

export { }
