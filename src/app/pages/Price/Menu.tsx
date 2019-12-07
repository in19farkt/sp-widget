import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { TextField, MenuItem } from 'components';
import { routes } from 'app/routes';
import { makeStyles } from 'utils/styles';

const useStyles = makeStyles({
  selector: {
    width: 200,
  },
});

const options = [
  {
    value: 'palto-penza',
    label: 'Пальто Пенза',
  },
  {
    value: 'optolider',
    label: 'ОптоЛидер',
  },
  {
    value: 'saks',
    label: 'САКС Игрушки',
  },
];

function MenuComponent(props: RouteComponentProps<{ supplier: string }>) {
  const { match } = props;
  const classes = useStyles();

  return (
    <TextField
      select
      label="Выберите поставщика"
      value={match.params.supplier}
      className={classes.selector}
      variant="outlined"
    >
      {options.map(option => (
        <MenuItem
          component={Link as any}
          key={option.value}
          value={option.value}
          to={routes.price.supplier.getRedirectPath({ supplier: option.value })}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export const Menu = withRouter(MenuComponent);
