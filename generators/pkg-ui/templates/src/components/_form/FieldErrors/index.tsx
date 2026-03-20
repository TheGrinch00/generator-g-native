import { AnyFieldMeta } from "@tanstack/form-core";
import { ZodError } from "zod";
import { Text, View } from "react-native";

type FieldErrorsProps = {
  meta: AnyFieldMeta;
};

export const FieldErrors = ({ meta }: FieldErrorsProps) => {
  if (!meta.isTouched || meta.errors.length === 0) {
    return null;
  }

  return (
    <View className="px-1">
      {meta.errors.map(({ message }: ZodError, index: number) => (
        <Text key={index} className="text-destructive text-xs font-medium mt-1">
          {message}
        </Text>
      ))}
    </View>
  );
};
