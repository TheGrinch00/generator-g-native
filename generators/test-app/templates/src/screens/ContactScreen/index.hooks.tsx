import { z } from "zod";
import { Alert } from "react-native";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";
import { useAppForm } from "@/src/components/_form";
import { useAppDispatch } from "@/src/redux-store/hooks";
import { actions } from "@/src/redux-store/slices";

const createSchema = (t: TFunction) =>
  z.object({
    firstName: z.string().min(1, t("contact.validation.firstNameRequired")),
    lastName: z.string().min(1, t("contact.validation.lastNameRequired")),
    email: z.string().email(t("contact.validation.emailInvalid")),
    phone: z.string().optional(),
    category: z.string().min(1, t("contact.validation.categoryRequired")),
    newsletter: z.boolean(),
  });

export const useContactScreen = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();
  const dispatch = useAppDispatch();
  const schema = createSchema(t);

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "",
      newsletter: false,
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      dispatch(
        actions.addContact({
          id: Date.now().toString(),
          ...value,
        }),
      );
      Alert.alert(t("contact.success"));
    },
  });

  return { t, theme, form };
};
