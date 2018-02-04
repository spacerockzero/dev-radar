import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
// import style from './style';

export default class Article extends Component {
	render(state, props) {
		const img = <img src="{state.image}" width="100%" />;
		return (
			<article className="article">
				<Card>
					<Card.Primary>
						{state.image ? img : null}
						<Card.Subtitle>
							<a href={state.link}>{state.title}</a>
						</Card.Subtitle>
						<Card.Title>{state.feedsrc}</Card.Title>
					</Card.Primary>
					<Card.SupportingText>{new Date(state.createdOn).toDateString()}</Card.SupportingText>
				</Card>
			</article>
		);
	}
}
