import classes from './Icon.module.scss';
import { IconRoleUnionType, IconProps } from './Icon.types';

import { IoLogoGithub, IoLogoTwitter, IoLogoLinkedin } from 'react-icons/io';
import { MdOutlineEmail } from 'react-icons/md';
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiCodeSSlashLine,
} from 'react-icons/ri';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { TbBrandHtml5, TbBrandCss3, TbCode } from 'react-icons/tb';
import { SiTypescript, SiJavascript, SiReact, SiGraphql } from 'react-icons/si';

export const Icon = ({ role, size, onClick }: IconProps) => {
  const icons: { [key: string]: JSX.Element } = {
    github: (
      <IoLogoGithub className={classes[size]} onClick={onClick} id={role} />
    ),
    twitter: (
      <IoLogoTwitter className={classes[size]} onClick={onClick} id={role} />
    ),
    linkedIn: (
      <IoLogoLinkedin className={classes[size]} onClick={onClick} id={role} />
    ),
    email: (
      <MdOutlineEmail className={classes[size]} onClick={onClick} id={role} />
    ),
    'menu-fold': (
      <RiMenuFoldLine className={classes[size]} onClick={onClick} id={role} />
    ),
    'menu-unfold': (
      <RiMenuUnfoldLine className={classes[size]} onClick={onClick} id={role} />
    ),
    'toggle-on': (
      <BsToggle2On className={classes[size]} onClick={onClick} id={role} />
    ),
    'toggle-off': (
      <BsToggle2Off className={classes[size]} onClick={onClick} id={role} />
    ),
    javascript: (
      <SiJavascript className={classes[size]} onClick={onClick} id={role} />
    ),
    html: (
      <TbBrandHtml5 className={classes[size]} onClick={onClick} id={role} />
    ),
    css: <TbBrandCss3 className={classes[size]} onClick={onClick} id={role} />,
    typescript: (
      <SiTypescript className={classes[size]} onClick={onClick} id={role} />
    ),
    react: <SiReact className={classes[size]} onClick={onClick} id={role} />,
    graphql: (
      <SiGraphql className={classes[size]} onClick={onClick} id={role} />
    ),
    about: (
      <RiCodeSSlashLine className={classes[size]} onClick={onClick} id={role} />
    ),
  };

  return icons[role];
};

Icon.defaultProps = {
  size: 'medium',
};
