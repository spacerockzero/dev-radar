import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
// import style from './style';

export default class Article extends Component {
	render(props, state) {
		const img = (
			<a href={props.link}>
				<img src={props.image} width="100" />
			</a>
		);
		return (
			<article className="article">
				<Card>
					{props.image ? img : null}
					<div class="text-body">
						<Card.Primary>
							<Card.Subtitle>
								<a href={props.link}>{props.title}</a>
							</Card.Subtitle>
							<Card.Title>{props.feedsrc}</Card.Title>
						</Card.Primary>
						<Card.SupportingText>{new Date(props.createdOn).toDateString()}</Card.SupportingText>
					</div>
				</Card>
			</article>
		);
	}
}
