import { h, Component } from 'preact';
import { uniqBy, differenceBy, orderBy } from 'lodash-es';
import Article from '../article';
// import VirtualList from 'react-virtual-list';
import InfiniteScroll from 'react-infinite-scroller';
// import 'preact-material-components/Button/style.css';
import style from './style';

const API_URL =
	process.env.PREACT_APP_ENV === 'development'
		? 'http://localhost:5000/api/getfeed'
		: 'https://dev-radar-server-prod.herokuapp.com/api/getfeed';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: [],
			loading: true,
			currentPage: 1,
			debug: false
		};
		this.getNewArticles = this.getNewArticles.bind(this);
	}

	getDebug() {
		let debug = window.localStorage.getItem('debug');
		return debug === 'true';
	}

	setLocalArticles(articles) {
		console.log('Saving current articles locally...');
		const sorted = orderBy(articles, ['createdOn'], ['desc']);
		// only save a few, so they load fast
		const sliced = sorted.slice(0, 10) || sorted;
		window.localStorage.setItem('articles', JSON.stringify(sliced));
	}

	getLocalArticles() {
		console.log('Get local articles...');
		let localArticles = window.localStorage.getItem('articles');
		let articles = [];
		try {
			articles = JSON.parse(localArticles);
		}
		catch (err) {
			console.log('Error retrieving locally stored articles', err);
		}
		return articles;
	}

	getNewArticles(page = 1, limit = 25) {
		console.log('Getting new articles!');
		// get new articles from api
		const params = { limit, page };
		let url = new URL(API_URL);
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		return window
			.fetch(url)
			.then(data => data.json())
			.then(articles => {
				if (articles.length > 0) {
					// uniqueify, then set as articles array
					const uniqNew = differenceBy(articles, this.state.articles, 'link');
					this.setState({ newArticles: uniqNew, currentPage: this.state.currentPage + 1 });
					this.setState({ loading: false });
					this.mergeNewArticles();
				}
				else {
					// no more articles in page
					this.setState({ loading: false, currentPage: false });
				}
				return;
			})
			.catch(err => {
				// do stuff
				console.log('Err getting articles:', err);
			});
	}

	componentDidMount() {
		// get debug, if exist
		let debug = this.getDebug();
		// get old articles from local, if exist
		let oldArticles = this.getLocalArticles();
		this.setState({ articles: oldArticles, loading: false, debug });
		this.getNewArticles();
	}

	mergeNewArticles() {
		// user asked to see more articles. merge them to bottom of articles list
		console.log('Merging new articles...');
		const oldArticles = this.state.articles || [];
		// add new article pages at end, where user is scrolling
		const combinedArticles = oldArticles.concat(this.state.newArticles);
		// de-dupe these...
		const unique =
			this.state.articles.length === 0 && this.state.newArticles.length > 0
				? this.state.newArticles
				: uniqBy(combinedArticles, 'link');
		this.setLocalArticles(unique);
		this.setState({ newArticles: [], articles: unique });
	}

	render(props, state) {
		const merge = this.mergeNewArticles.bind(this);
		const updateButton = (
			<button className="merge-button" onClick={merge}>
				Load {state.newArticles.length} new articles!
			</button>
		);
		const loadingSpinner = <img src="/assets/loading.svg" />;
		return (
			<articlelist className={style.articlelist}>
				<InfiniteScroll
					pageStart={0}
					loadMore={this.getNewArticles}
					hasMore={this.state.currentPage !== false || false}
					loader={
						<div className="loader" key={0}>
							Loading ...
						</div>
					}
				>
					{state.newArticles.length > 0 ? updateButton : null}
					{state.loading === true ? loadingSpinner : null}
					{state.articles.map((article, key) => (
						<Article key={key} {...article} debug={state.debug} />
					))}
				</InfiniteScroll>
				{state.currentPage === false ? (
					<div className="quest-complete">
						<div className="emoji">😊</div>
						You have completed your quest.
						<br />
						The interwebs have been read.
					</div>
				) : (
					''
				)}
			</articlelist>
		);
	}
}
