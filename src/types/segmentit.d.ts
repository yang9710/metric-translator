declare module 'segmentit' {
  export interface Token {
    w: string;
    p: number;
    [key: string]: any;
  }

  export class Segment {
    constructor();
    useDefault(): void;
    doSegment(text: string): Token[];
  }
}