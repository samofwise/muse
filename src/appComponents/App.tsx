import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SongContainer from './pages/Song/SongContainer';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import './App.less';
import NewSetContainer from './pages/NewSet/NewSetContainer';
import Reset from './pages/Reset/Reset';
import NewSong from './pages/NewSong/NewSong';
// tslint:disable-next-line: import-name
import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from './common/ErrorComponent';
import { SetsProvider } from '../core/contexts/SetsContext';
import { SongsProvider } from '../core/contexts/SongsContext';

const theme = createMuiTheme();

// tslint:disable-next-line:variable-name
const App = () => (
	<>
		<ErrorBoundary FallbackComponent={ErrorComponent}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SetsProvider>
					<SongsProvider>
						<BrowserRouter>
							<Switch>
								<Route exact path="/reset" component={Reset} />
								<Route path="/sets/new" exact component={NewSetContainer} />
								<Route path="/sets/:slug/edit" exact component={NewSetContainer} />
								<Route path="/sets/:id/:slug?" component={SongContainer} />
								<Route path="/songs/new" component={NewSong} />
								<Route path="/:slug?" component={SongContainer} />
							</Switch>
						</BrowserRouter>
					</SongsProvider>
				</SetsProvider>
			</ThemeProvider>
		</ErrorBoundary>
	</>
);

export default App;
