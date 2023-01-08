import { FC, memo } from "react";

import { Text, View } from "components";
import { EditScreenInfo } from "components";

import { useTabTwoScreen } from "./index.hooks";
import { styles } from "./styles";

type TabTwoScreenProps = {};

export const TabTwoScreen: FC<TabTwoScreenProps> = memo(() => {
  const {} = useTabTwoScreen();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
});

TabTwoScreen.displayName = "TabTwoScreen";
