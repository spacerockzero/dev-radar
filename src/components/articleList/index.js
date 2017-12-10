import { h, Component } from 'preact';
import map from 'lodash.map';
import { firestore } from '../firebase';
import Article from '../article';
// import { route } from 'preact-router';
// import Toolbar from 'preact-material-components/Toolbar';
// import Drawer from 'preact-material-components/Drawer';
// import List from 'preact-material-components/List';
// import Dialog from 'preact-material-components/Dialog';
// import Switch from 'preact-material-components/Switch';
// import 'preact-material-components/Switch/style.css';
// import 'preact-material-components/Dialog/style.css';
// import 'preact-material-components/Drawer/style.css';
// import 'preact-material-components/List/style.css';
// import 'preact-material-components/Toolbar/style.css';
// import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [
				{
					createdOn: '2017-12-09T23:49:41.778Z',
					feedsrc: 'Echo JS',
					labels: [],
					link: 'https://is.gd/9ouvi9',
					opengraph: {},
					sentiment: {},
					title: 'React newsletter: 68'
				}
			]
		};
	}
	componentWillMount() {
		firestore
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
