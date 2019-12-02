import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1><a href="/">[ dev.radar ]</a></h1>
		<nav>
			<Link title="Ocean: Everything that exists" activeClassName={style.active} href="/ocean/">
        🌊
			</Link>
			<Link title="Happy Place: Warm bubble of things I already agree with" activeClassName={style.active} href="/happy-place/">
        🎠
			</Link>
			<Link title="Hot: What others are reading most" activeClassName={style.active} href="/hot/">
        🔥
			</Link>
		</nav>
	</header>
);

export default Header;
