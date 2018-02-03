import { h, Component } from 'preact';
import map from 'lodash.map';
import Article from '../article';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: []
		};
	}
	componentDidMount() {
		// get old articles from local, if exist
		let oldArticles = window.localStorage.getItem('articles');
		if (oldArticles) {
			oldArticles = JSON.parse(oldArticles);
			this.setState({ articles: oldArticles });
		}
		// get new articles from api
		window
			.fetch('/getArticles')
			.then(data => data.json())
			.then(articles => {
				//do stuff
				this.setState({ newArticles: articles });
				const newArticles = JSON.stringify(articles);
			})
			.catch(err => {
				// do stuff
				console.log('Err getting articles:', err);
			});
	}

	render(props, state) {
		const mergeNewArticles = e => {
			// user asked to see new articles. merge them to top of articles list
			console.log('mergeNewArticles!');
			// de-dupe these...
			// then save result in localstore for next load
			// window.localStorage.setItem('articles', newArticles);
			state.articles.unshift(...state.newArticles);
			this.setState({ newArticles: [] });
			this.setState({ articles: state.articles });
		};
		// const updateButtonClass = state.articles.length > 0 ? {style.show} : {style.hide};
		const updateButton = (
			<Button className="mdc-button mdc-button--raised" onClick={mergeNewArticles}>
				Load {state.newArticles.length} new articles!
			</Button>
		);
		return (
			<articlelist className={style.articlelist}>
				{state.newArticles.length > 0 ? updateButton : null}
				{map(state.articles, (article, key) => <Article key={key} {...article} />)}
			</articlelist>
		);
	}
}
