export interface IconProps {
  role: IconRoleUnionType;
  size: 'large' | 'medium' | 'small';
  onClick?: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
}

export type IconRoleUnionType =
  | 'github'
  | 'twitter'
  | 'linkedIn'
  | 'email'
  | 'menu-fold'
  | 'menu-unfold'
  | 'toggle-on'
  | 'toggle-off'
  | 'about'
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'graphql'
  | 'about';
