import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { IconRoleUnionType } from 'src/type/element';

import { Icon } from '@components/index';

interface Props {
  name: string;
  icon: IconRoleUnionType;
  path: string;
  isFocused: boolean;
}

export const NavItem = ({ name, icon, path, isFocused }: Props) => {
  const router = useRouter();

  return (
    <div
      className={classes['navitem-container']}
      onClick={() => router.replace(path)}
    >
      <Icon role={icon} />
      <p className={classes.name}>{name}</p>
    </div>
  );
};
