import { h, Component } from 'preact';
import map from 'lodash-es/map';
import uniqBy from 'lodash-es/uniqBy';
import differenceBy from 'lodash-es/differenceBy';
import sortby from 'lodash-es/sortBy';
import Article from '../article';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: [],
			loading: true
		};
	}

	setLocalArticles(articles) {
		window.localStorage.setItem('articles', JSON.stringify(articles));
	}

	getLocalArticles() {
		let localArticles = window.localStorage.getItem('articles');
		let articles = [];
		try {
			articles = JSON.parse(localArticles);
		}
		catch (err) {
			console.error('Error retrieving locally stored articles', err);
		}
		return articles;
	}

	componentDidMount() {
		// get old articles from local, if exist
		let oldArticles = this.getLocalArticles();
		if (oldArticles) {
			this.setState({ articles: oldArticles });
			this.setState({ loading: false });
		}
		// get new articles from api
		window
			.fetch('/getArticles') // prod
			// .fetch('http://localhost:5000/dev-radar/us-central1/getArticles') // localdev
			.then(data => data.json())
			.then(articles => {
				//do stuff
				const uniqNew = differenceBy(articles, this.state.articles, 'id');
				this.setState({ newArticles: uniqNew });
				// If we didn't have old articles to show, but now have new ones, show them
				if (this.state.articles.length < 1 && this.state.newArticles.length > 1) {
					this.setState({ loading: false });
					this.mergeNewArticles();
				}
			})
			.catch(err => {
				// do stuff
				console.log('Err getting articles:', err);
			});
	}

	mergeNewArticles() {
		// user asked to see new articles. merge them to top of articles list
		console.log('mergeNewArticles!');
		// de-dupe these...
		const oldArticles = this.state.articles || [];
		oldArticles.unshift(...this.state.newArticles);
		const unique =
			this.state.articles.length === 0 && this.state.newArticles.length > 0
				? this.state.newArticles
				: uniqBy(oldArticles, 'id');
		// TODO: consider reducing max number to prevent storage and render scaling issues down the road
		// then save result in localstore for next load
		this.setLocalArticles(unique);
		this.setState({ newArticles: [] });
		this.setState({ articles: unique });
	}

	render(props, state) {
		const merge = this.mergeNewArticles;
		const updateButton = (
			<Button className="mdc-button mdc-button--raised" onClick={merge}>
				Load {state.newArticles.length} new articles!
			</Button>
		);
		const loadingSpinner = <img src="/assets/loading.svg" />;
		return (
			<articlelist className={style.articlelist}>
				{state.newArticles.length > 0 ? updateButton : null}
				{state.loading === true ? loadingSpinner : null}
				{map(state.articles, (article, key) => <Article key={key} {...article} />)}
			</articlelist>
		);
	}
}
