import { AudioTrack, IAudioTrack } from './audio-track';

export type IAudio = {
  [trackNumber: number]: string;
};

export interface IAudioControl {
  getTrack: (trackNumber: number) => IAudioTrack;
  play: (trackNumber: number) => void;
  pause: () => void;
  resume: () => void;
  stop: (trackNumber: number) => void;
  release: () => void;
  setLoops: (trackNumber: number, loop: number) => void;
  setVolume: (trackNumber: number, volume: number) => void;
  mute: () => void;
  unmute: () => void;
}

export const AudioControl = (audio: IAudio): IAudioControl => {
  const tracks: IAudioTrack[] = [];

  const isValidUrl = (url: string) => {
    return url && url !== '';
  };

  for (const [key, audioUrl] of Object.entries(audio)) {
    if (isValidUrl(audioUrl)) {
      tracks[+key] = AudioTrack(audioUrl);
    }
  }

  const getTrack = (trackNumber: number) => {
    return tracks[trackNumber];
  };

  const play = (trackNumber: number) => {
    tracks[trackNumber]?.play();
  };

  const pause = () => {
    tracks.forEach((track) => track?.pause());
  };

  const resume = () => {
    tracks.forEach((track) => track?.resume());
  };

  const stop = (trackNumber: number) => {
    tracks[trackNumber].stop();
  };

  const release = () => {
    tracks.forEach((track) => track.release());
  };

  const setLoops = (trackNumber: number, loop: number) => {
    tracks[trackNumber].setLoops(loop);
  };

  const setVolume = (trackNumber: number, volume: number) => {
    tracks[trackNumber].setVolume(volume);
  };

  const mute = () => {
    tracks.forEach((track) => track?.mute());
  };

  const unmute = () => {
    tracks.forEach((track) => track?.unmute());
  };

  return {
    getTrack,
    play,
    pause,
    resume,
    stop,
    release,
    setLoops,
    setVolume,
    mute,
    unmute,
  };
};
