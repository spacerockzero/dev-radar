import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import LazyLoad from 'react-lazy-load';
// import style from './style';

export default class Article extends Component {
	render(props, state) {
		// const date = new Date(props.createdOn);
		// let dateString = `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
		const img =
			props.opengraph && props.opengraph.image ? (
				<a href={props.link}>
					<LazyLoad offsetVertical={250} offsetTop={250}>
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
						{/* <Card.SupportingText className="article-date">{dateString}</Card.SupportingText> */}
					</div>
				</Card>
			</article>
		);
	}
}
