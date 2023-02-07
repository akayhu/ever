import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { FlagsProvider } from 'flag';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export const withReduxProvider = store => children => (
	<Provider store={store}>{children}</Provider>
);
export const withApolloProvider = client => children => (
	<ApolloProvider client={client}>{children}</ApolloProvider>
);
export const withFlagsProvider = flags => children => (
	<FlagsProvider flags={flags}>{children}</FlagsProvider>
);
export const withReactRouterProvider = children => (
	<BrowserRouter>{children}</BrowserRouter>
);
export const withMuiThemeProvider = children => (
	<MuiThemeProvider>{children}</MuiThemeProvider>
);
