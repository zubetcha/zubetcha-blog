import classes from './Icon.module.scss';
import { IconRoleUnionType, IconProps } from './Icon.types';

import { IoLogoGithub, IoLogoTwitter, IoLogoLinkedin } from 'react-icons/io';
import { MdOutlineEmail } from 'react-icons/md';
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { TbBrandHtml5, TbBrandCss3 } from 'react-icons/tb';
import { SiTypescript, SiJavascript, SiReact, SiGraphql } from 'react-icons/si';

export const Icon = ({ role, size }: IconProps) => {
  const icons: { [key: string]: JSX.Element } = {
    github: <IoLogoGithub className={classes[size]} />,
    twitter: <IoLogoTwitter />,
    linedIn: <IoLogoLinkedin />,
    email: <MdOutlineEmail />,
    'menu-fold': <RiMenuFoldLine />,
    'menu-unfold': <RiMenuUnfoldLine />,
    'toggle-on': <BsToggle2On />,
    'toggle-off': <BsToggle2Off />,
    javascript: <SiJavascript />,
    html: <TbBrandHtml5 />,
    css: <TbBrandCss3 />,
    typescript: <SiTypescript />,
    react: <SiReact />,
    graphql: <SiGraphql />,
  };

  return icons[role];
};

Icon.defaultProps = {
  size: 'medium',
};
