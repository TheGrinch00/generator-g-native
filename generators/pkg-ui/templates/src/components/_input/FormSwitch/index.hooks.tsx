import { useFieldContext } from "@/src/components/_form/context";
import { useThemeColors } from "@/src/theme";

export const useFormSwitch = () => {
  const field = useFieldContext<boolean>();
  const theme = useThemeColors();

  const onValueChange = (value: boolean) => field.handleChange(value);

  return { field, theme, onValueChange };
};
