export interface IconProps {
  role: IconRoleUnionType;
  size: 'large' | 'medium' | 'small';
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
  | 'graphql';
