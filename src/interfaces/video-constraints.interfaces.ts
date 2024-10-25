interface VideoConstraints {
  width: {
    min: number;
    ideal: number;
    max: number;
  };
  height: {
    min: number;
    ideal: number;
    max: number;
  };
}

export interface Constraints {
  video: VideoConstraints;
  deviceId?: { exact: string };
}
