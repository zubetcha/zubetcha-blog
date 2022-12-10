import { useSelectContext } from './context';
import classes from './Select.module.scss';

interface Props {
  id: string;
  label: string;
}

export const Option = ({ id, label }: Props) => {
  const { setSelected } = useSelectContext();

  return (
    <li id={id} className={classes.option} onClick={() => setSelected?.(id)}>
      {label}
    </li>
  );
};
