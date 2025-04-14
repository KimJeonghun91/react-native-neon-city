import { Howl } from 'howler';

type Callback = (sound: Sound) => void;

export class Sound {
  static setCategory() {}
  sound: Howl;

  constructor(asset: string, onLoaded: () => void, onLoadedError: () => void) {
    this.sound = new Howl({
      src: [asset],
      preload: true,
    });
    this.sound.once('load', onLoaded);
    this.sound.once('loaderror', onLoadedError);
  }

  play = async (callback?: Callback) => {
    if (this.sound.state() !== 'loaded') {
      return;
    }
    await this.sound.play();
    if (callback) {
      callback(this);
    }
  };

  stop = async (callback?: Callback) => {
    await this.sound.stop();
    if (callback) {
      callback(this);
    }
  };

  pause = async (callback?: Callback) => {
    await this.sound.pause();
    if (callback) {
      callback(this);
    }
  };

  getCurrentTime = (callback: (currentTime: number) => void) => {
    callback(this.sound.seek());
  };

  setCurrentTime = (currentTime: number) => {
    this.sound.seek(currentTime);
  };

  release = () => {
    this.sound.unload();
  };

  setNumberOfLoops = (loop: number) => {
    this.sound.loop(loop > 0);
  };

  setVolume = (volume: number) => {
    this.sound.volume(volume);
  };

  mute = () => {
    this.sound.mute(true);
  };

  unmute = () => {
    this.sound.mute(false);
  };

  isPlaying = () => {
    return this.sound.playing();
  };
}
