import classes from './Select.module.scss';

interface Props {
  label: string;
  onClick?: () => void;
}

export const Option = ({ label, onClick }: Props) => {
  return (
    <li className={classes.option} onClick={onClick}>
      {label}
    </li>
  );
};
