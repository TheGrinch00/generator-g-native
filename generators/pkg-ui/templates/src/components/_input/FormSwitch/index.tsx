import { Platform, Switch, SwitchProps, Text, View } from "react-native";
import { FieldErrors } from "@/src/components/_form/FieldErrors";
import { useFormSwitch } from "./index.hooks";

type FormSwitchProps = {
  label?: string;
  description?: string;
} & Omit<SwitchProps, "value" | "onValueChange">;

export const FormSwitch = ({
  label,
  description,
  ...props
}: FormSwitchProps) => {
  const { field, theme, onValueChange } = useFormSwitch();

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between bg-input rounded-xl px-4 min-h-12 py-2 border border-border">
        <View className="flex-1 mr-3">
          {label && (
            <Text className="text-base font-medium text-foreground">
              {label}
            </Text>
          )}
          {description && (
            <Text className="text-sm text-muted mt-0.5">{description}</Text>
          )}
        </View>
        <Switch
          value={field.state.value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.switchTrack, true: theme.switchTrackActive }}
          thumbColor={Platform.OS === "android" ? theme.switchThumb : undefined}
          ios_backgroundColor={theme.switchTrack}
          {...props}
        />
      </View>
      <FieldErrors meta={field.state.meta} />
    </View>
  );
};

FormSwitch.displayName = "FormSwitch";
