import * as React from 'react';

import { AppBar as MuiAppBar, Container } from 'components';

import { PageNavigation } from './PageNavigation/PageNavigation';

export function AppBar() {
  return (
    <MuiAppBar position="static">
      <Container>
        <PageNavigation />
      </Container>
    </MuiAppBar>
  );
}
