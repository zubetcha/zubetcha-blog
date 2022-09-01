import classNames from 'classnames';
import classes from './Typo.module.scss';
import { TypoProps } from './Typo.types';

export const Typo = ({ children, role, color, style }: TypoProps) => {
    return (
        <p
            className={classNames(
                classes.first_class,
                classes[role],
                classes[color],
            )}
            style={style}
        >
            {children}
        </p>
    );
};

Typo.defaultProps = {
    role: 'body-medium',
    color: 'title',
};
