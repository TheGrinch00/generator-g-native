import { FC, memo } from "react";
import { TouchableOpacity } from "react-native";

import { useNotFoundScreen } from "./index.hooks";

import { styles } from "./styles";

import { RootStackScreenProps } from "../../../types";
import { Text, View } from "components/Themed";

type NotFoundScreenProps = {} & RootStackScreenProps<"NotFound">;

export const NotFoundScreen: FC<NotFoundScreenProps> = memo(
  ({ navigation }) => {
    const {} = useNotFoundScreen();

    return (
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <TouchableOpacity
          onPress={() => navigation.replace("Root")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Go to home screen!</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

NotFoundScreen.displayName = "NotFoundScreen";
