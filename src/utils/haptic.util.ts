import * as Haptics from 'expo-haptics';

export const haptic = async (
  type:
    | 'light'
    | 'medium'
    | 'heavy'
    | 'soft'
    | 'rigid'
    | 'success'
    | 'warning'
    | 'error' = 'light'
) => {
  const hapticMap = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
    soft: Haptics.ImpactFeedbackStyle.Soft,
    rigid: Haptics.ImpactFeedbackStyle.Rigid,
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  };

  if (['success', 'warning', 'error'].includes(type)) {
    await Haptics.notificationAsync(
      hapticMap[type] as Haptics.NotificationFeedbackType
    );
    return;
  }

  await Haptics.impactAsync(hapticMap[type] as Haptics.ImpactFeedbackStyle);
};
