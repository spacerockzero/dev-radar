import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header className="toolbar">
				<h1>[ DEV.RADAR ]</h1>
			</header>
		);
	}
}
