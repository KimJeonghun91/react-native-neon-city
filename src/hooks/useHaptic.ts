import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export const useHaptic = () => {
  const notify = useCallback((type: Haptics.NotificationFeedbackType) => {
    Haptics.notificationAsync(type);
  }, []);

  const impact = useCallback((type: Haptics.ImpactFeedbackStyle) => {
    Haptics.impactAsync(type);
  }, []);

  return { notify, impact };
};
