import { createFormHook } from "@tanstack/react-form";

import { FormTextField } from "@/src/components/_input/FormTextField";
import { FormSwitch } from "@/src/components/_input/FormSwitch";
import { FormSelect } from "@/src/components/_input/FormSelect";
import { fieldContext, formContext } from "./context";

export { useFieldContext, useFormContext } from "./context";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FormTextField,
    FormSwitch,
    FormSelect,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
