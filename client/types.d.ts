import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface WeeklyHours {
  Monday: number[][];
  Tuesday: number[][];
  Wednesday: number[][];
  Thursday: number[][];
  Friday: number[][];
  Saturday: number[][];
  Sunday: number[][];
}

export type NavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "List View"
>;

export interface RootTabParamList {
  "Map View": { name: string };
  "List View": { name: string };
  "Dining Hall": { name: string };
}

export interface DiningHallInfo {
  latitude?: number;
  lineLength?: string;
  longitude?: number;
  name?: string;
  type?: string;
  waitTime?: number | null;
  schedule?: WeeklyHours;
}

export interface NavigationProps {
  navigation: NavigationProp;
}
