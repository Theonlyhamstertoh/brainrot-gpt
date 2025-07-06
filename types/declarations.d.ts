interface Window {
  webkitAudioContext: typeof AudioContext
  ReactNativeWebView?: { postMessage: (message: string) => void }
}
