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

export const Icon = ({ role, size }: IconProps) => {
  const icons: { [key: string]: JSX.Element } = {
    github: <IoLogoGithub className={classes[size]} />,
    twitter: <IoLogoTwitter className={classes[size]} />,
    linkedIn: <IoLogoLinkedin className={classes[size]} />,
    email: <MdOutlineEmail className={classes[size]} />,
    'menu-fold': <RiMenuFoldLine className={classes[size]} />,
    'menu-unfold': <RiMenuUnfoldLine className={classes[size]} />,
    'toggle-on': <BsToggle2On className={classes[size]} />,
    'toggle-off': <BsToggle2Off className={classes[size]} />,
    javascript: <SiJavascript className={classes[size]} />,
    html: <TbBrandHtml5 className={classes[size]} />,
    css: <TbBrandCss3 className={classes[size]} />,
    typescript: <SiTypescript className={classes[size]} />,
    react: <SiReact className={classes[size]} />,
    graphql: <SiGraphql className={classes[size]} />,
    about: <RiCodeSSlashLine className={classes[size]} />,
  };

  return icons[role];
};

Icon.defaultProps = {
  size: 'medium',
};
