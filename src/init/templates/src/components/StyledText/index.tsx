import React, { FC, memo } from "react";
import { useStyledText } from "./index.hooks";
import { Text, TextProps } from "../Themed";

type StyledTextProps = {} & TextProps;

export const StyledText: FC<StyledTextProps> = memo(({ style, ...others }) => {
  const { styles } = useStyledText();

  return (
    <Text {...others} style={[styles, style, { fontFamily: "space-mono" }]} />
  );
});

StyledText.displayName = "StyledText";
