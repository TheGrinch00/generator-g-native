import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";
import { useAppDispatch, useAppSelector } from "@/src/redux-store/hooks";
import { actions, selectors } from "@/src/redux-store/slices";

export const useCounterScreen = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectors.getCount);

  const increment = () => dispatch(actions.increment());
  const decrement = () => dispatch(actions.decrement());
  const reset = () => dispatch(actions.reset());

  return { t, theme, count, increment, decrement, reset };
};
