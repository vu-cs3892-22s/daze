import React from "react";
import {Box} from "native-base";
import {Feather, FontAwesome} from "@expo/vector-icons";

export interface HeaderBaseProps {
  children?: React.ReactElement[];
}

const HeaderBase = ({children}: HeaderBaseProps) => (
  <Box
    width={"100%"}
    maxWidth={"100%"}
    bg={"#E76666"}
    margin={0}
    padding="20px 1px 0 1px"
    flexDirection={"row"}
    justifyContent={"space-between"}
  >
    {children &&
      React.Children.map(children, child => React.cloneElement(child, {style: {...child.props.style, opacity: 1}}))}
  </Box>
);

export default function Header() {
  return (
    <HeaderBase>
      <Feather name="menu" size={24} color="white" />
      <FontAwesome name="bell" size={24} color="white" />
    </HeaderBase>
  );
}
