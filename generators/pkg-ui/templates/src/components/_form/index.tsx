import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormTextField } from "@/src/components/_input/FormTextField";
import { FormSwitch } from "@/src/components/_input/FormSwitch";
import { FormSelect } from "@/src/components/_input/FormSelect";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

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
