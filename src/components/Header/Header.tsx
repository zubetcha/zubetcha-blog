import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@recoil/theme';
import { useWindowSize } from '@hooks/useWindowSize';
import { NAV_LIST } from '@constants/navigation';
import classes from './Header.module.scss';

import { SearchBar, Toggle, Avartar } from '@components/index';

export const Header = () => {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [theme, setTheme] = useTheme();
  const [toggleStatus, setToggleStatus] = useState<'on' | 'off'>();

  const onClickToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (!theme) {
      return;
    }

    setToggleStatus(theme === 'dark' ? 'on' : 'off');
  }, [theme]);

  if (!toggleStatus) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <div className={classes['header-container']}>
          <Avartar
            size='small'
            onClick={() => router.push('/page/1')}
            style={{ cursor: 'pointer' }}
          />
          <div className={classes['left']}>
            <ul className={classes['nav-wrapper']}>
              {NAV_LIST.map(({ name, path }) => (
                <li key={name} onClick={() => router.push(`${path}`)}>
                  <p>{name}</p>
                </li>
              ))}
            </ul>
            <Toggle status={toggleStatus} onClick={onClickToggle} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={classes.container}>
      {/* <SearchBar /> */}
      <Toggle status={toggleStatus} onClick={onClickToggle} />
    </div>
  );
};
