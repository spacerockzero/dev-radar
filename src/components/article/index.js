import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import LazyLoad from 'react-lazy-load';
// import style from './style';

export default class Article extends Component {
	render(props, state) {
		const img =
			props.opengraph && props.opengraph.image ? (
				<a href={props.link}>
					<LazyLoad offsetTop={100}>
						<img src={props.opengraph.image} width="100" />
					</LazyLoad>
				</a>
			) : (
				''
			);
		return (
			<article className="article" data-id={props.id}>
				<Card>
					{props.opengraph && props.opengraph.image ? img : null}
					<div class="text-body">
						<Card.Primary>
							<Card.Subtitle>
								<a href={props.link}>{props.title}</a>
							</Card.Subtitle>
							<Card.Title>{props.feedsrc}</Card.Title>
						</Card.Primary>
						{/* <Card.SupportingText>{new Date(props.createdOn).toDateString()}</Card.SupportingText> */}
					</div>
				</Card>
			</article>
		);
	}
}
