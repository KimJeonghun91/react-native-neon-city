import { MMKV } from 'react-native-mmkv';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

interface Keystore<StringKeysT, NumberKeysT, BoolKeysT> {
  /** Set a value for the given `key`. */
  set: (
    key: StringKeysT | NumberKeysT | BoolKeysT,
    value: boolean | string | number
  ) => void;
  /**
   * Get a boolean value for the given `key`.
   *
   * @default false
   */
  getBoolean: (key: BoolKeysT) => boolean | undefined;
  /**
   * Get a string value for the given `key`.
   *
   * @default undefined
   */
  getString: (key: StringKeysT) => string | undefined;
  /**
   * Get a number value for the given `key`.
   *
   * @default 0
   */
  getNumber: (key: NumberKeysT) => number | undefined;
  /** Delete the given `key`. */
  delete: (key: StringKeysT | NumberKeysT | BoolKeysT) => void;
  /**
   * Get all keys.
   *
   * @default [ ]
   */
  getAllKeys: () => (StringKeysT | NumberKeysT | BoolKeysT)[];
  /** Delete all keys. */
  clearAll: () => void;
  addOnValueChangedListener: (onValueChanged: (key: string) => void) => {
    remove: () => void;
  };
}

export function createKeystore<
  StringKeysT extends string = never,
  NumberKeysT extends string = never,
  BoolKeysT extends string = never,
>(): Keystore<StringKeysT, NumberKeysT, BoolKeysT> {
  return {
    set: (key, value) => {
      storage.set(key, value);
    },
    delete: (key) => {
      storage.delete(key);
    },
    getBoolean: (key) => {
      return storage.getBoolean(key) || false;
    },
    getString: (key) => {
      return storage.getString(key);
    },
    getNumber: (key) => {
      return storage.getNumber(key) || 0;
    },
    getAllKeys: () => {
      return storage.getAllKeys() as (StringKeysT | NumberKeysT | BoolKeysT)[];
    },
    clearAll: () => {
      storage.clearAll();
    },
    addOnValueChangedListener: (onValueChanged: (key: string) => void) => {
      return storage.addOnValueChangedListener(onValueChanged);
    },
  };
}

export enum EnumKeystoreString {
  EXAMPLE = 'EXAMPLE',
}

export enum EnumKeystoreNumber {
  BEST_SCORE = 'BEST_SCORE',
}

export enum EnumKeystoreBoolean {
  EXAMPLE = 'EXAMPLE',
}

const storage = new MMKV();

export const keystore = createKeystore<
  EnumKeystoreString,
  EnumKeystoreNumber,
  EnumKeystoreBoolean
>();

export const atomWithMMKV = <T>(key: string, initialValue: T) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem: (k: string): string | null => {
        const value = storage.getString(k);
        return value ? value : null;
      },
      setItem: (k: string, value: string) => {
        storage.set(k, value);
      },
      removeItem: (k: string) => {
        storage.delete(k);
      },
      clearAll: () => {
        storage.clearAll();
      },
    })),
    {
      getOnInit: true,
    }
  );
