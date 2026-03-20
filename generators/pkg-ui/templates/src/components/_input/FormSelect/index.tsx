import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { useFieldContext } from "@/src/components/_form";
import { FieldErrors } from "@/src/components/_form/FieldErrors";

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
  const field = useFieldContext<string | number | null>();
  const [visible, setVisible] = useState(false);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const selectedOption = options.find((o) => o.value === field.state.value);

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
      )}

      <Pressable
        className={`flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5 ${
          hasError ? "border-2 border-red-400" : "border border-gray-200"
        }`}
        onPress={() => setVisible(true)}
      >
        <Text
          className={
            selectedOption
              ? "text-base text-gray-900"
              : "text-base text-gray-400"
          }
        >
          {selectedOption?.label ?? placeholder ?? "Select..."}
        </Text>
        <ChevronDown size={20} color="#9ca3af" />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[60%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-gray-300" />
            </View>

            <View className="px-5 py-4">
              <Text className="text-lg font-semibold text-gray-900">
                {label ?? placeholder ?? "Select an option"}
              </Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === field.state.value;
                return (
                  <Pressable
                    className={`flex-row items-center justify-between px-5 py-4 ${
                      isSelected ? "bg-blue-50" : "active:bg-gray-50"
                    }`}
                    onPress={() => {
                      field.handleChange(item.value);
                      setVisible(false);
                    }}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? "text-blue-600 font-semibold"
                          : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Check size={20} color="#2563eb" />}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-100 mx-5" />
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
