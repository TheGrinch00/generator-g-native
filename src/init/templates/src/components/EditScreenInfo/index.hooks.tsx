import { styles } from "./styles";
import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";

export const useEditScreenInfo = () => {
  const onHelpPressed = useCallback(() => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
    );
  }, []);

  return { styles, onHelpPressed };
};
