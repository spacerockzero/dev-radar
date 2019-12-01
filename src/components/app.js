import { h } from 'preact';
import { Router } from 'preact-router';
import Header from './header';

// Code-splitting is automated for routes
import Firehose from '../routes/firehose';
import Home from '../routes/home';

export default function App() {
	return (
		<div id="app">
			<Header />
			<Router>
				<Firehose path="/firehose/:page?" />
				<Home path="/" />
			</Router>
		</div>
	);
}
