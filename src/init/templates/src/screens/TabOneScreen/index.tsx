import { FC, memo } from "react";
import { RootTabScreenProps } from "../../../types";

import { useTabOneScreen } from "./index.hooks";
import { styles } from "./styles";

import EditScreenInfo from "components/EditScreenInfo";
import { Text, View } from "components/Themed";

type TabOneScreenProps = {} & RootTabScreenProps<"TabOne">;

export const TabOneScreen: FC<TabOneScreenProps> = memo(({ navigation }) => {
  const {} = useTabOneScreen();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
});

TabOneScreen.displayName = "TabOneScreen";
