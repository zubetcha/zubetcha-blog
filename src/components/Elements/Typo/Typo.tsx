import classNames from 'classnames';
import classes from './Typo.module.scss';
import { TypoProps } from './Typo.types';

export const Typo = ({ role, color }: TypoProps) => {
  return <p className={classNames(classes[role], classes[color])}>Type</p>;
};
