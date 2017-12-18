import { h, Component } from 'preact';
import map from 'lodash.map';
import sortby from 'lodash.sortby';
import { firestore } from '../fire';
import Article from '../article';
// import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: []
		};
	}
	componentWillMount() {
		const articlesRef = firestore.collection('publicArticles');
		// initial load
		articlesRef
			.orderBy('createdOn')
			.limit(50)
			.get()
			.then(snapshot => {
				const arts = [];
				snapshot.forEach(doc => arts.push(doc.data()));
				// set initial articles
				this.setState({ articles: arts });

				// when firestore detects new articles in the cloud
				articlesRef.onSnapshot({ includeQueryMetadataChanges: false }, snapshot => {
					snapshot.docChanges.forEach(change => {
						// we want updates, but not the current data being added to local cache
						if (change.type === 'added' && change.doc.metadata.fromCache === false) {
							const art = change.doc.data();
							this.state.newArticles.push(art);
						}
					});
					this.setState({ newArticles: this.state.newArticles });
					console.log('this.state.newArticles:', this.state.newArticles);
					// }
				});
			});
	}

	render(props, state) {
		const mergeNewArticles = e => {
			// user asked to see new articles. merge them to top of articles list
			console.log('mergeNewArticles!');
			state.articles.unshift(...state.newArticles);
			this.setState({ newArticles: [] });
			this.setState({ articles: state.articles });
		};
		return (
			<section>
				<button className="new-articles" onClick={mergeNewArticles}>
					{state.newArticles.length} new articles
				</button>
				{map(state.articles, (article, key) => <Article key={key} {...article} />)}
			</section>
		);
	}
}
