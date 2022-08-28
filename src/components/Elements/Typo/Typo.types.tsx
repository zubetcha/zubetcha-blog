export interface TypoProps {
  role: TypoRoleUnionType;
  color: string;
  style?: { [key: string]: string };
  children: any;
}

export type TypoRoleUnionType =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small';
