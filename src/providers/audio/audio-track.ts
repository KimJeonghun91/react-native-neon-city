import { SharedValue, makeMutable } from 'react-native-reanimated';
import Sound from 'react-native-sound';

export interface IAudioTrack {
  isLoaded: SharedValue<boolean>;
  play: (currentTime?: number) => void;
  isPlaying: () => boolean;
  pause: () => void;
  stop: () => void;
  resume: () => void;
  release: () => void;
  setLoops: (loop: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
}

export const AudioTrack = (url: string): IAudioTrack => {
  const isLoaded = makeMutable<boolean>(false);
  const isPaused = makeMutable<boolean>(false);
  const isReleased = makeMutable<boolean>(false);
  const currPlayTime = makeMutable<number>(0);
  const track = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.warn(error);
      isLoaded.value = false;
    } else {
      isLoaded.value = true;
    }
  });

  const setCurrPlayTime = (playTime: number) => {
    currPlayTime.value = playTime;
  };

  const isAudioAvailable = () => {
    return isLoaded.value && !isReleased.value;
  };

  const play = (currentTime = 0) => {
    isPaused.value = false;
    track.setCurrentTime(currentTime);
    // * Must provide callback due to the issue below.
    // * link: https://stackoverflow.com/questions/69528553/react-native-sound-error-argument-1-rctresponsesenderblock-of-rnsound-play-mu
    track.play((success) => success);
  };

  const isPlaying = () => {
    return track.isPlaying();
  };

  const pause = () => {
    if (isAudioAvailable()) {
      isPaused.value = true;
      track.pause(() => null);
      track.getCurrentTime(setCurrPlayTime);
    }
  };

  const stop = () => {
    if (isAudioAvailable()) {
      track.stop(() => null);
    }
  };

  const resume = () => {
    if (currPlayTime.value === 0) {
      return;
    }

    if (isAudioAvailable()) {
      if (isPaused.value) {
        isPaused.value = false;
        play(currPlayTime.value);
      }
    }
  };

  const release = () => {
    if (isAudioAvailable()) {
      isReleased.value = true;
      track.release();
    }
  };

  const setLoops = (loop: number) => {
    track.setNumberOfLoops(loop);
  };

  const setVolume = (volume: number) => {
    track.setVolume(volume);
  };

  const mute = () => {
    track.setVolume(0);
  };

  const unmute = () => {
    track.setVolume(1);
  };

  return {
    isLoaded,
    play,
    isPlaying,
    pause,
    stop,
    resume,
    release,
    setLoops,
    setVolume,
    mute,
    unmute,
  };
};
