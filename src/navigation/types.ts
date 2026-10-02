import type { NavigatorScreenParams } from '@react-navigation/native';

export type CommuneStackParamList = {
  CommuneHome: undefined;
  Classroom: undefined;
  Dating: undefined;
};

export type RootDrawerParamList = {
  Tower: undefined;
  Commune: NavigatorScreenParams<CommuneStackParamList> | undefined;
  News: undefined;
  Circle: undefined;
  Profile: undefined;
};
