import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import ArticleList from '../components/articleList';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Header />
				<ArticleList />
			</div>
		);
	}
}
