import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import Article from '../../components/article';
import style from './style';

const API_URL =
	process.env.PREACT_APP_ENV === 'development'
		? 'http://localhost:5000/api/getfeed'
		: 'https://dev-radar-server-prod.herokuapp.com/api/getfeed';

async function getNewArticles(page = 1, limit = 25) {
	console.log('Getting new articles!');
	// get em from api
	const params = { limit, page };
	let url = new URL(API_URL);
	Object.keys(params).forEach(key => {
		url.searchParams.append(key, params[key]);
	});
	try {
		const articlesReq = await window.fetch(url);
		return articlesReq.json();
	}
	catch (error) {
		console.error('error fetching articles:', error);
		return;
	}
}

function PageNav({ page, next, prev }) {
	return (<nav className={style.pagenav}>
		{page > 1 ? <button onClick={prev}>Prev</button> : <button>Prev</button>}
		<h1>Firehose</h1>
		<button onClick={next}>Next</button>
	</nav>);
}


const Firehose = ({ page, ...rest }) => {
	const [articles, setArticles] = useState([]);
	const pageProp = parseInt(page, 10) || 1;
	const [contentPage, setContentPage] = useState(pageProp);

	useEffect(async () => {
		const arts = await getNewArticles(contentPage);
		setArticles(arts);
	}, [contentPage]);

	useEffect(() => {
		setContentPage(pageProp);
	}, [pageProp]);

	function next(e) {
		setContentPage(p => p + 1);
		route(`/firehose/${contentPage + 1}`);
	}
	function prev(e) {
		setContentPage(p => p - 1);
		route(`/firehose/${contentPage - 1}`);
	}

	return (
		<div className={style.firehose}>

			<PageNav page={contentPage} next={next} prev={prev} />
			{articles.length > 0 ? articles.map(art => <Article {...art} />)
				: <div className={style.done}>You've read everything!</div>}
			<PageNav page={contentPage} />
			{/* <pre>{JSON.stringify(articles, null, 2)}</pre> */}
		</div>
	);
};

export default Firehose;
