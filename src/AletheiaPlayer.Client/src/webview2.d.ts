interface Window {
  chrome?: {
    webview?: {
      addEventListener(type: string, listener: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void): void;
      postMessage(message: string): void;
    };
  };
}
