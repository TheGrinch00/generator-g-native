import { Platform, Switch, SwitchProps, Text, View } from "react-native";
import { useFieldContext } from "@/src/components/_form";
import { FieldErrors } from "@/src/components/_form/FieldErrors";

type FormSwitchProps = {
  label?: string;
  description?: string;
} & Omit<SwitchProps, "value" | "onValueChange">;

export const FormSwitch = ({
  label,
  description,
  ...props
}: FormSwitchProps) => {
  const field = useFieldContext<boolean>();

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 min-h-12 py-2 border border-gray-200">
        <View className="flex-1 mr-3">
          {label && (
            <Text className="text-base font-medium text-gray-900">
              {label}
            </Text>
          )}
          {description && (
            <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
          )}
        </View>
        <Switch
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
          trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
          thumbColor={Platform.OS === "android" ? "#fff" : undefined}
          ios_backgroundColor="#e5e7eb"
          {...props}
        />
      </View>
      <FieldErrors meta={field.state.meta} />
    </View>
  );
};

FormSwitch.displayName = "FormSwitch";
