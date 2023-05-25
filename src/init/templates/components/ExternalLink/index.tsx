import { FC, memo, ComponentProps } from "react";
import { useExternalLink } from "./index.hooks";

import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

type ExternalLinkProps = {} & ComponentProps<typeof Link>;

export const ExternalLink: FC<ExternalLinkProps> = memo(({ ...props }) => {
  const { styles } = useExternalLink();

  return (
    <Link
      hrefAttrs={{
        // On web, launch the link in a new tab.
        target: "_blank",
      }}
      {...props}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
});

ExternalLink.displayName = "ExternalLink";
