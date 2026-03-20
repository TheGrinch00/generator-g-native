import { Modal, Pressable, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FieldErrors } from "@/src/components/_form/FieldErrors";
import { useFormSelect } from "./index.hooks";

type FormSelectOption = {
  value: string | number;
  label: string;
};

type FormSelectProps = {
  label?: string;
  placeholder?: string;
  options: FormSelectOption[];
};

export const FormSelect = ({ label, placeholder, options }: FormSelectProps) => {
  const {
    field,
    visible,
    hasError,
    theme,
    selectedOption,
    open,
    close,
    select,
  } = useFormSelect(options);

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-muted">{label}</Text>
      )}

      <Pressable
        className={`flex-row items-center justify-between bg-input rounded-xl px-4 h-12 ${
          hasError ? "border-2 border-destructive" : "border border-border"
        }`}
        onPress={open}
      >
        <Text
          className={
            selectedOption
              ? "text-base text-foreground"
              : "text-base text-muted-foreground"
          }
        >
          {selectedOption?.label ?? placeholder ?? "Select..."}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.mutedForeground} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={close}
        >
          <Pressable
            className="bg-background rounded-t-3xl max-h-[60%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-border" />
            </View>

            <View className="px-5 py-4">
              <Text className="text-lg font-semibold text-foreground">
                {label ?? placeholder ?? "Select an option"}
              </Text>
            </View>

            <FlashList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === field.state.value;
                return (
                  <Pressable
                    className={`flex-row items-center justify-between px-5 py-4 ${
                      isSelected ? "bg-primary/10" : "active:bg-card"
                    }`}
                    onPress={() => select(item.value)}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border/50 mx-5" />
              )}
            />
            <View className="h-8" />
          </Pressable>
        </Pressable>
      </Modal>

      <FieldErrors meta={field.state.meta} />
    </View>
  );
};

FormSelect.displayName = "FormSelect";
