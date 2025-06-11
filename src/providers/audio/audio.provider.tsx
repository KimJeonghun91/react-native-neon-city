import { useAppState } from '@hooks';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
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
  'CLOSE_BUTTON' = 7,
  'HIDE_CUBE' = 8,
  'START' = 9,
  'ITEM_BUTTON' = 10,
}

export type IAudioContext = {
  audioControl: IAudioControl;
  play: (trackNumber: AudioTracks) => void;
  stop: (trackNumber: AudioTracks) => void;
  pause: () => void;
  resume: () => void;
  release: () => void;
};

export const AudioContext = createContext<IAudioContext | null>(null);

type IAudioProviderProps = {
  children: ReactNode;
};

export const AudioProvider: FC<IAudioProviderProps> = ({ children }) => {
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
      [AudioTracks.CLOSE_BUTTON]: assetPath + 'beep16.mp3',
      [AudioTracks.HIDE_CUBE]: assetPath + 'electric.mp3',
      [AudioTracks.ITEM_BUTTON]: assetPath + 'itemclick.mp3',
    });

    return {
      audioControl,
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
    };
  }, []);

  const { audioControl } = values;
  const bgm = audioControl.getTrack(AudioTracks.BGM);
  const playBgm = useCallback(() => {
    if (!bgm.isPlaying()) {
      const infinite = IS_WEB ? 1 : -1;
      bgm.setLoops(infinite);
      bgm.play();
    }
  }, [bgm]);

  useAnimatedReaction(
    () => bgm?.isLoaded.value,
    (curr, prev) => {
      if (prev === null || !curr) {
        return;
      }

      runOnJS(playBgm)();
    },
    [bgm?.isLoaded, playBgm]
  );
  
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
