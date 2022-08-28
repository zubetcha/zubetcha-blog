export interface TypoProps {
  role: TypoRoleUnionType;
  color: string;
}

export type TypoRoleUnionType =
  | 'display-large'
  | 'display-meidum'
  | 'display-small'
  | 'headline-large'
  | 'headline-meidum'
  | 'headline-small'
  | 'title-large'
  | 'title-meidum'
  | 'title-small'
  | 'label-large'
  | 'label-meidum'
  | 'label-small'
  | 'body-large'
  | 'body-meidum'
  | 'body-small';
