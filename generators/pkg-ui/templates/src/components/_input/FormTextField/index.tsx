import { Text, TextInput, TextInputProps, View } from "react-native";
import { FieldErrors } from "@/src/components/_form/FieldErrors";
import { useFormTextField } from "./index.hooks";

type FormTextFieldProps = {
  label?: string;
  placeholder?: string;
} & Omit<TextInputProps, "value" | "onChangeText">;

export const FormTextField = ({
  label,
  placeholder,
  ...props
}: FormTextFieldProps) => {
  const { field, focused, hasError, theme, onFocus, onBlur, onChangeText } =
    useFormTextField();

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-muted">{label}</Text>
      )}
      <View
        className={`bg-input rounded-xl px-4 h-12 justify-center ${
          focused
            ? "border-2 border-primary"
            : hasError
              ? "border-2 border-destructive"
              : "border border-border"
        }`}
      >
        <TextInput
          className="flex-1 text-foreground"
          style={{ fontSize: 16, textAlignVertical: "center" }}
          placeholder={placeholder}
          placeholderTextColor={theme.mutedForeground}
          value={field.state.value ?? ""}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
      </View>
      <FieldErrors meta={field.state.meta} />
    </View>
  );
};

FormTextField.displayName = "FormTextField";
