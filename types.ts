import React from 'react';

export enum AppMode {
  NOISE = 'NOISE',
  SHATTER = 'SHATTER',
  SILENCE = 'SILENCE'
}

export interface InsightResponse {
  affirmation: string;
  strategy: string;
}

// Augment the JSX namespace to include React Three Fiber elements
// We declare both global JSX and module augmentation to catch different TS configurations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      instancedMesh: any;
      coneGeometry: any;
      dodecahedronGeometry: any;
      meshBasicMaterial: any;
      color: any;
      fog: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      instancedMesh: any;
      coneGeometry: any;
      dodecahedronGeometry: any;
      meshBasicMaterial: any;
      color: any;
      fog: any;
    }
  }
}
