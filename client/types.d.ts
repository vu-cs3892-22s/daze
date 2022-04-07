import { StackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  "Map View": { name: string };
  "List View": { name: string };
  "Dining Hall": { name: string };
};

export type DefaultScreenNavigationProp = BottomTabNavigationProp<
RootTabParamList,
  "List View"
>;
