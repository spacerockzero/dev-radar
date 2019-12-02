import { h } from 'preact';
import style from './style';

export default function Article({ id, link, title, feedsrc, labels, pubDate }) {
	const date = new Date(pubDate);
	const dateString = `${date.toLocaleDateString()}`;

	return (
		<a href={link} className={style.article} data-id={id}>
			{/* <article className={style.articlewrapper}> */}
			<div className={style.status} />
			<div className={style.body}>
				<h3>{title}</h3>
				<p className={style.meta}>
					{feedsrc} - {dateString}
					{labels.length > 0 &&
						<p className={style.labels}>
							{labels.map(label => <span>{label}</span>)}
						</p>
					}
				</p>
			</div>
			{/* </article> */}
		</a>
	);
}