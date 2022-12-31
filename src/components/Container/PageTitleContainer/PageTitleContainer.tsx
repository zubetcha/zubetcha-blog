import classes from './PageTitleContainer.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
}

export const PageTitleContainer = ({ children, title }: Props) => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <p className={classes.title}>{title}</p>
        {children}
      </div>
    </div>
  );
};
