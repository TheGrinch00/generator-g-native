import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormTextField } from "@/components/_input/FormTextField";
import { FormSwitch } from "@/components/_input/FormSwitch";
import { FormSelect } from "@/components/_input/FormSelect";

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
