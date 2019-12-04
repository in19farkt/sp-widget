import * as React from 'react';
import { Route, Switch } from 'react-router';

import { Typography, Grid } from 'components';
import { routes } from 'app/routes';

import { PaltoPenza } from './PaltoPenza';
import { Menu } from './Menu';
import { Saks } from './Saks';

export function PricePage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4">Обработка прайсов</Typography>
          </Grid>
          <Grid item>
            <Menu />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Switch>
          <Route
            exact
            path={routes.price.supplier.getRedirectPath({ supplier: 'palto-penza' })}
            component={PaltoPenza}
          />
          <Route
            exact
            path={routes.price.supplier.getRedirectPath({ supplier: 'saks' })}
            component={Saks}
          />
        </Switch>
      </Grid>
    </Grid>
  );
}
