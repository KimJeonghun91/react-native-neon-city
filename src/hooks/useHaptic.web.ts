import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export const useHaptic = () => {
  const notify = useCallback((type: Haptics.NotificationFeedbackType) => {}, []);

  const impact = useCallback((type: Haptics.ImpactFeedbackStyle) => {}, []);

  return { notify, impact };
};
