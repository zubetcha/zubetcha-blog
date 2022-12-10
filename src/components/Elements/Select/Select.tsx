import { useState, useEffect } from 'react';
import { SelectProvider } from './context';
import classNames from 'classnames';
import classes from './Select.module.scss';
import { Button } from '../Button';
interface Props {
  children: JSX.Element[];
  onChange: (selected: string) => void;
  defaultLabel: string;
}

export const Select = ({ children, onChange, defaultLabel }: Props) => {
  const [open, toggle] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const onMouseOver = () => toggle(true);
  const onMouseLeave = () => toggle(false);

  useEffect(() => {
    if (selected) {
      onChange(selected);
      toggle(false);
    }
  }, [selected, onChange]);

  return (
    <SelectProvider setSelected={setSelected}>
      <div className={classes.container}>
        <Button
          label={defaultLabel}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          status={open ? 'focused' : undefined}
          iconRight='dropdown'
        />
        <ul
          className={classNames(classes['options-wrapper'], {
            [classes.open]: open,
          })}
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
        >
          {children}
        </ul>
      </div>
    </SelectProvider>
  );
};
