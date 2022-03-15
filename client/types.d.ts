import { DrawerNavigationProp } from "@react-navigation/drawer";

export type RootDrawerParamList = {
    "My Profile": { name: string };
    "Update": { name: string, locationIndex: number };
    "Dashboard": { name: string };
    "Log In": { name: string };
};

export type DefaultScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'My Profile'>;