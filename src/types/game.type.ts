import { Directions } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export namespace Game {
  export type Stage =
    | 'idle'
    | 'ready'
    | 'playing'
    | 'paused'
    | 'time-over'
    | 'finished';
  export type Animations =
    | 'idle'
    | 'show-logo'
    | 'show-cube-effect'
    | 'press-play-button';

  export type Metrics = {
    score: number;
    bestScore: number;
    numCorrect: number;
    numConsecutiveCorrect: number;
    numIncorrect: number;
  };

  export type Control = {
    isPaused: boolean;
  };

  export enum ArrowType {
    Normal = 'Normal',
    Reverse = 'Reverse',
  }
  export type Arrow = {
    sequence: number;
    type: SharedValue<ArrowType>;
    direction: SharedValue<Directions>;
    hasItem: SharedValue<boolean>;
    setRandomArrow: () => void;
    setNormalArrow: () => void;
  };

  export type Rank = {
    rank: number;
    userId: string;
    score: number;
  };
}
