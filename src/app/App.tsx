import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { Container, Box } from 'components';

import { AppBar } from './AppBar/AppBar';
import { DemoPage } from './pages/Demo/DemoPage';
import { HomePage } from './pages/Home/HomePage';
import { PricePage } from './pages/Price/PricePage';
import { routes } from './routes';

export function App() {
  return (
    <>
      <AppBar />
      <Box clone mt={{ xs: 2, lg: 3 }}>
        <Container>
          <Switch>
            {process.env.NODE_ENV !== 'production' && (
              <Route exact path={routes.demo.getRoutePath()} component={DemoPage} />
            )}
            <Route exact path={routes.price.getRoutePath()}>
              <Redirect to={routes.price.supplier.getRedirectPath({ supplier: 'palto-penza' })} />
            </Route>
            <Route exact path={routes.price.supplier.getRoutePath()} component={PricePage} />
            <Route exact path={routes.home.getRoutePath()} component={HomePage} />
            <Redirect to={routes.home.getRedirectPath()} />
          </Switch>
        </Container>
      </Box>
    </>
  );
}
