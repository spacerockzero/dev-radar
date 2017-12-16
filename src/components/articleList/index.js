import { h, Component } from 'preact';
import map from 'lodash.map';
import { firebase, firestore } from '../firebase';
import Article from '../article';
// import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [
				// {
				// 	createdOn: '2017-12-09T23:49:41.778Z',
				// 	feedsrc: 'Echo JS',
				// 	labels: [],
				// 	link: 'https://is.gd/9ouvi9',
				// 	opengraph: {},
				// 	sentiment: {},
				// 	title: 'React newsletter: 68'
				// }
			]
		};
	}
	componentWillMount() {
		return firestore
			.collection('publicArticles')
			.orderBy('createdOn')
			.limit(50)
			.get()
			.then(snapshot => {
				const arts = [];
				snapshot.forEach(doc => arts.push(doc.data()));
				this.setState({ articles: arts });
			});
	}

	render(props, state) {
		return (
			<section>{map(state.articles, (article, key) => <Article key={key} {...article} />)}</section>
		);
	}
}
