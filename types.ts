export enum AppMode {
  NOISE = 'NOISE',
  SHATTER = 'SHATTER',
  SILENCE = 'SILENCE'
}

export interface InsightResponse {
  affirmation: string;
  strategy: string;
}
