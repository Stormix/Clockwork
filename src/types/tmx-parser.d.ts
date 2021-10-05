declare module 'tmx-parser' {
  export function parse(
    responseText: string,
    route: string,
    cb: (err: Error, map: ITMXData) => void,
  ): void
}
