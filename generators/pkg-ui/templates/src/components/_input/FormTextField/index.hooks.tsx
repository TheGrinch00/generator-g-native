import { useState } from "react";
import { useFieldContext } from "@/src/components/_form/context";
import { useThemeColors } from "@/src/theme";

export const useFormTextField = () => {
  const field = useFieldContext<string>();
  const [focused, setFocused] = useState(false);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const theme = useThemeColors();

  const onFocus = () => setFocused(true);

  const onBlur = () => {
    setFocused(false);
    field.handleBlur();
  };

  const onChangeText = (text: string) => field.handleChange(text);

  return {
    field,
    focused,
    hasError,
    theme,
    onFocus,
    onBlur,
    onChangeText,
  };
};
