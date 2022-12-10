import Image from 'next/image';
import classNames from 'classnames';
import classes from './Avartar.module.scss';
import Zubetcha from '@assets/images/zubetcha.jpeg';
interface Props {
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
  style?: { [key: string]: string };
}
export const Avartar = ({ size, onClick, style }: Props) => {
  return (
    <div
      className={classNames(classes.container, classes[size])}
      onClick={onClick}
      style={style}
    >
      <Image src={Zubetcha} className={classes.avartar} alt='avartar' />
    </div>
  );
};
