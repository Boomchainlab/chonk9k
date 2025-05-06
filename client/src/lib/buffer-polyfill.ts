// This is a minimal Buffer polyfill for the browser
class BufferPolyfill {
  static from(data: string | Array<number> | Uint8Array, encoding?: string): Uint8Array {
    if (typeof data === 'string') {
      return new TextEncoder().encode(data);
    }
    return new Uint8Array(data);
  }
}

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = BufferPolyfill as any;
}

export default BufferPolyfill;
