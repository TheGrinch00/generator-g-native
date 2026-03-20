import { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useFieldContext } from "@/src/components/_form";
import { FieldErrors } from "@/src/components/_form/FieldErrors";

type FormTextFieldProps = {
  label?: string;
  placeholder?: string;
} & Omit<TextInputProps, "value" | "onChangeText">;

export const FormTextField = ({
  label,
  placeholder,
  ...props
}: FormTextFieldProps) => {
  const field = useFieldContext<string>();
  const [focused, setFocused] = useState(false);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
      )}
      <TextInput
        className={`bg-gray-50 rounded-xl px-4 h-12 text-base text-gray-900 ${
          focused
            ? "border-2 border-blue-500"
            : hasError
              ? "border-2 border-red-400"
              : "border border-gray-200"
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={field.state.value ?? ""}
        onChangeText={(text) => field.handleChange(text)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          field.handleBlur();
        }}
        {...props}
      />
      <FieldErrors meta={field.state.meta} />
    </View>
  );
};

FormTextField.displayName = "FormTextField";
