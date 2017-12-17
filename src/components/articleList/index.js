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
	mergeNewArticles(newArticleArray) {
		// user asked to see new articles. merge them to top of articles list
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
					const newArticles = [];
					// console.log('snapshot:', snapshot);
					snapshot.docChanges.forEach(change => {
						console.log('change:', change);
						if (change.type === 'added' && change.doc.metadata.fromCache === false) {
							const art = change.doc.data();
							console.log('new article: ', art);
							newArticles.push(art);
						}
					});
					console.log('additional: ', newArticles);
					this.setState({ newArticles });
					console.log('this.state.newArticles:', this.state.newArticles);
				});
			});
		// .orderBy('createdOn', 'desc');
		// .limit(10)
	}

	render(props, state) {
		return (
			<section>{map(state.articles, (article, key) => <Article key={key} {...article} />)}</section>
		);
	}
}
