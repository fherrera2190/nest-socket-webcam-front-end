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

const constraints: Constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
};
