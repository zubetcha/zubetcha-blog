import classes from './Footer.module.scss';
import { Icon } from '..';
import { CONTACT_LIST } from '@constants/navigation';
import { IconRoleUnionType } from '@type/element';

export const Footer = () => {
  const onClickContact = (e: React.MouseEvent<SVGElement>) => {
    const { id } = e.currentTarget;
    window.open(CONTACT_LIST[id]);
  };

  return (
    <footer className={classes.container}>
      <div className={classes['contacts-wrapper']}>
        {Object.keys(CONTACT_LIST).map((contact) => {
          return (
            <Icon
              key={contact}
              role={contact as IconRoleUnionType}
              onClick={onClickContact}
              size='large'
            />
          );
        })}
      </div>
      <p className={classes['footer-info']}>
        © 2022 zubetcha.
        <br />
        All Rights Reserved.
      </p>
    </footer>
  );
};
