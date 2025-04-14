import { useAppState } from '@hooks';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { isEqual } from 'react-native-worklet-functions';
import { useWillUnmount } from 'rooks';
import { AudioControl, IAudioControl } from './audio-control';
import { IS_WEB } from '@utils';

export enum AudioTracks {
  'BGM' = 0,
  'CORRECT' = 1,
  'INCORRECT' = 2,
  'READY' = 3,
  'CLICK' = 4,
  'WARNING' = 5,
  'COUNTDOWN' = 6,
  'CLOSE_SKIA_BUTTON' = 7,
  'HIDE_CUBE' = 8,
  'START' = 9,
  'ITEM_BUTTON' = 10,
}

export type IAudioContext = {
  audioControl: IAudioControl;
  isMuted: SharedValue<boolean>;
  play: (trackNumber: AudioTracks) => void;
  stop: (trackNumber: AudioTracks) => void;
  pause: () => void;
  resume: () => void;
  release: () => void;
  mute: () => void;
  unmute: () => void;
};

export const AudioContext = createContext<IAudioContext | null>(null);

type IAudioProviderProps = {
  children: ReactNode;
};

export const AudioProvider: FC<IAudioProviderProps> = ({ children }) => {
  const isMuted = useSharedValue<boolean>(IS_WEB);

  const values = useMemo(() => {
    const assetPath = IS_WEB ? '../../../assets/audios/' : '';
    const audioControl = AudioControl({
      [AudioTracks.BGM]: assetPath + 'bgm.mp3',
      [AudioTracks.CORRECT]: assetPath + 'correctsound.wav',
      [AudioTracks.INCORRECT]: assetPath + 'wrongsound.mp3',
      [AudioTracks.READY]: assetPath + 'ready.mp3',
      [AudioTracks.START]: assetPath + 'start.mp3',
      [AudioTracks.CLICK]: assetPath + 'click.mp3',
      [AudioTracks.WARNING]: assetPath + 'warning.mp3',
      [AudioTracks.COUNTDOWN]: assetPath + 'beep.mp3',
      [AudioTracks.CLOSE_SKIA_BUTTON]: assetPath + 'beep16.mp3',
      [AudioTracks.HIDE_CUBE]: assetPath + 'electric.mp3',
      [AudioTracks.ITEM_BUTTON]: assetPath + 'itemclick.mp3',
    });

    return {
      audioControl,
      isMuted,
      play: (trackNumber: AudioTracks) => {
        audioControl.play(trackNumber);
      },
      stop: (trackNumber: AudioTracks) => {
        audioControl.stop(trackNumber);
      },
      pause: () => {
        audioControl.pause();
      },
      resume: () => {
        audioControl.resume();
      },
      release: () => {
        audioControl.release();
      },
      mute: () => {
        isMuted.value = true;
      },
      unmute: () => {
        isMuted.value = false;
      },
    };
  }, [isMuted]);

  const { audioControl } = values;
  const bgm = audioControl.getTrack(AudioTracks.BGM);
  const playBgm = useCallback(() => {
    if (!bgm.isPlaying()) {
      const infinite = IS_WEB ? 1 : -1;
      bgm.setLoops(infinite);
      bgm.play();
    }
  }, [bgm]);

  // useAnimatedReaction(
  //   () => {
  //     return {
  //       progress: progress.value,
  //       isLoaded: bgm?.isLoaded.value,
  //       isMuted: isMuted.value,
  //     };
  //   },
  //   (curr, prev) => {
  //     if (prev === null || !curr.isLoaded || curr.isMuted) {
  //       return;
  //     }

  //     if (!isPaused.value && curr.progress === 100) {
  //       // runOnJS(playBgm)();
  //     }
  //   },
  //   [bgm?.isLoaded, isPaused, playBgm]
  // );

  // // * Bgm handler
  // useAnimatedReaction(
  //   () => isPaused.value,
  //   (currIsPaused, prevIsPaused) => {
  //     if (prevIsPaused === null || IS_WEB || !bgm) {
  //       return;
  //     }

  //     if (currIsPaused) {
  //       runOnJS(bgm.pause)();
  //     } else {
  //       runOnJS(bgm.resume)();
  //     }
  //   },
  //   [bgm, isPaused]
  // );

  useAnimatedReaction(
    () => isMuted.value,
    (isMuted) => {
      if (isMuted) {
        runOnJS(audioControl.mute)();
      } else {
        runOnJS(audioControl.unmute)();
      }
    },
    [audioControl]
  );

  // * Release audio when exit training content screen
  useWillUnmount(() => {
    audioControl.release();
  });

  // * Pause audio when app is inactive or in background and resume when app is active
  useAppState(
    (appState) => {
      if (isEqual(appState, 'active')) {
        audioControl.resume();
        return;
      }

      if (isEqual(appState, 'inactive') || isEqual(appState, 'background')) {
        audioControl.pause();
      }
    },
    [audioControl]
  );

  // useDidMount(() => runOnUI(addProgress)(70));

  return (
    <AudioContext.Provider value={values}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within a AudioProvider');
  }

  return ctx;
};
