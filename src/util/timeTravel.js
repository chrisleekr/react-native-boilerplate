/* eslint-disable no-undef */
// timeTravel.js: https://benjaminjohnson.me/testing-animations-in-react-native
//  This is a helper file to test animation.
import MockDate from 'mockdate';

const FRAME_TIME = 10;

const advanceOneFrame = () => {
  const now = Date.now();
  MockDate.set(new Date(now + FRAME_TIME));
  jest.advanceTimersByTime(FRAME_TIME);
};

const timeTravel = msToAdvance => {
  const numberOfFramesToRun = msToAdvance / FRAME_TIME;
  let framesElapsed = 0;

  // Step through each of the frames until we've ran them all
  while (framesElapsed < numberOfFramesToRun) {
    advanceOneFrame();
    framesElapsed++;
  }
};

export default timeTravel;

// timeTravel.js
export const setupTimeTravel = () => {
  MockDate.set(0);
  jest.useFakeTimers();
};
