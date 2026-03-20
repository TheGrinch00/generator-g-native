import { z } from "zod";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";
import { useAppForm } from "@/src/components/_form";
import { useAppDispatch } from "@/src/redux-store/hooks";
import { actions } from "@/src/redux-store/slices";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  newsletter: z.boolean(),
});

export const useContactScreen = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();
  const dispatch = useAppDispatch();

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
