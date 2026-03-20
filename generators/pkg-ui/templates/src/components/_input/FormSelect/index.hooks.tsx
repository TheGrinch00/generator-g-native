import { useState } from "react";
import { useFieldContext } from "@/src/components/_form/context";
import { useThemeColors } from "@/src/theme";

type FormSelectOption = {
  value: string | number;
  label: string;
};

export const useFormSelect = (options: FormSelectOption[]) => {
  const field = useFieldContext<string | number | null>();
  const [visible, setVisible] = useState(false);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const theme = useThemeColors();

  const selectedOption = options.find((o) => o.value === field.state.value);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const select = (value: string | number) => {
    field.handleChange(value);
    setVisible(false);
  };

  return {
    field,
    visible,
    hasError,
    theme,
    selectedOption,
    open,
    close,
    select,
  };
};
