import { IconRoleUnionType } from '../Elements/Icon/Icon.types';

export interface NavItemProps {
  name: string;
  icon: IconRoleUnionType;
  path: string;
  isFocused: boolean;
}
