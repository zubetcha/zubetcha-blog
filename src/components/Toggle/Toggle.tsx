import classNames from 'classnames';
import classes from './Toggle.module.scss';
import { ToggleProps } from './Toggle.types';

export const Toggle = ({ status, onClick }: ToggleProps) => {
    return (
        <div
            className={classNames(classes.container, classes[status])}
            onClick={onClick}
        >
            <div className={classes.toggle_bar}>
                <div className={classes.handler}></div>
            </div>
        </div>
    );
};
