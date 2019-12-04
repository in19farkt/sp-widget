import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { routes } from 'app/routes';
import { Tabs, Tab } from 'components';

function PageNavigation() {
  return (
    <Route path="/:page">
      {({ match }: RouteComponentProps<{ page: string }>) => (
        <Tabs value={(match && match.params.page) || 'home'}>
          <Tab
            label="Home"
            component={Link}
            value={routes.home.getElementKey()}
            to={routes.home.getRedirectPath()}
          />
          <Tab
            label="Price"
            component={Link}
            value={routes.price.getElementKey()}
            to={routes.price.getRedirectPath()}
          />
          {process.env.NODE_ENV !== 'production' && (
            <Tab
              label="Demo"
              component={Link}
              value={routes.demo.getElementKey()}
              to={routes.demo.getRedirectPath()}
            />
          )}
        </Tabs>
      )}
    </Route>
  );
}

export { PageNavigation };
