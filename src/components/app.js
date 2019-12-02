import { h } from 'preact';
import { Router } from 'preact-router';
import Header from './header';
import Redirect from './Redirect';
import style from './style.css';

// Code-splitting is automated for routes
import Firehose from '../routes/firehose';
import HappyPlace from '../routes/home';
import Hot from '../routes/home';


export default function App() {
	return (
		<main id="app" className={style.app}>
			<Header />
			<Router>
				<Firehose path="/ocean/:page?" />
				<HappyPlace path="/happy-place/:page?" />
				<Hot path="/hot/:page?" />
				<Redirect path="/" to="/ocean/" />
			</Router>
		</main>
	);
}
