import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { App } from 'app/App';
import { Api, ApiContext } from 'services/api';
import { ErrorBoundary, Snackbar, CssBaseline } from 'components';
import { theme } from 'utils/styles';

export function Root(): React.ReactElement<{}> {
  const api = new Api();

  return (
    <ErrorBoundary>
      <BrowserRouter basename="/sp">
        <Snackbar>
          <MuiThemeProvider theme={theme}>
            <ApiContext.Provider value={api}>
              <CssBaseline />
              <App />
            </ApiContext.Provider>
          </MuiThemeProvider>
        </Snackbar>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
