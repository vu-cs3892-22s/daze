import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type DefaultScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "List View"
>;

export interface RootTabParamList {
  "Map View": { name: string };
  "List View": { name: string };
  "Dining Hall": { name: string };
}

export interface DiningHallInfo {
  latitude: number;
  lineLength: string;
  longitude: number;
  name: string;
  type: string;
  waitTime: number | null;
}
export interface NavigationProps {
  navigation: DefaultScreenNavigationProp;
}
