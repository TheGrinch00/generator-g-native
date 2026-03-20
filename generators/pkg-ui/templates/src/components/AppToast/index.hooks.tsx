import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/redux-store/hooks";
import { actions, selectors } from "@/src/redux-store/slices";
import { useThemeColors } from "@/src/theme";
import { FeedbackType } from "@/src/redux-store/slices/feedback/feedback.interfaces";

const typeConfig: Record<
  FeedbackType,
  { icon: string; colorKey: string; title: string }
> = {
  success: { icon: "checkmark-circle", colorKey: "success", title: "Success" },
  error: { icon: "close-circle", colorKey: "destructive", title: "Error" },
  warning: { icon: "warning", colorKey: "accent", title: "Warning" },
  info: { icon: "information-circle", colorKey: "primary", title: "Info" },
};

export const useAppToast = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectors.getFeedbackOpen);
  const type = useAppSelector(selectors.getFeedbackType);
  const message = useAppSelector(selectors.getFeedbackMessage);
  const theme = useThemeColors();

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  const close = () => dispatch(actions.closeFeedback());

  const config = typeConfig[type] ?? typeConfig.info;
  const accentColor = (theme as any)[config.colorKey] ?? theme.primary;

  return {
    open,
    message,
    config,
    accentColor,
    theme,
    translateY,
    opacity,
    close,
  };
};
