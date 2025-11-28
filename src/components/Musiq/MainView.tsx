import React, { useState, useRef, useEffect } from 'react';
import { debounce } from 'throttle-debounce';
import { Row, Col } from 'antd';

import { WS_DATA_TYPES } from 'Types/websocket.types';
import { YTItem } from 'Types/youtube.types';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { getUsersApi } from 'Services/mellowApi';
import { YtVideoItem } from 'mellov_api';

import { SongList } from './SongList/SongList';
import { YtList } from './YtList';
import { ViewSwitch } from './ViewSwitch';

interface View {
	item: JSX.Element;
	span: number;
	name: string;
	customClasses: string;
}

export function MainView() {
	const [ytItems, setYtItems] = useState<YTItem[]>([]);
	const [isFetchingYtItems, setIsFetchingYtItems] = useState(false);
	const [visibleView, setVisibleView] = useState(0);

	const scrollPositions = useRef<number[]>([0, 0]);
	const webSocket = useRef(musiqWebsocket.getInstance());

	const getYtItemsDebounced = useRef(
		debounce(800, (title: string) => getYtItems(title))
	);

	useEffect(() => {
		// Restore scroll position when view changes
		document.documentElement.scrollTo(0, scrollPositions.current[visibleView]);
	}, [visibleView]);

	async function getYtItems(title: string): Promise<YTItem[] | undefined> {
		if (!title || title === '') {
			console.log('getYtItems: title is empty');
			return;
		}
		const api = await getUsersApi();
		if (!api) return;

		const encodedTitle = encodeURIComponent(title);
		const limit = 10;

		console.log('Fetching yt items for song:', title);
		setIsFetchingYtItems(true);

		return api.searchYtItems(encodedTitle, limit).then((ytItems) => {
			const mappedYtItems: YTItem[] = ytItems.map(item => ({
				videoId: item.videoId,
				title: item.title,
				thumbnailUrl: item.thumbnailUrl,
			}))
			setYtItems(mappedYtItems);
			setIsFetchingYtItems(false);
			return mappedYtItems;
		});
	}

	function loadVideo(videoId: string) {
		webSocket.current.sendDataToTargets(WS_DATA_TYPES.LOAD_VIDEO, { videoId });
	}

	function setView(viewIndex: number) {
		scrollPositions.current[visibleView] = document.documentElement.scrollTop;
		setVisibleView(viewIndex);
	}

	function showYtTab() {
		setView(1);
	}

	function getViews(): View[] {
		return [
			{
				item: (
					<SongList
						isActive={visibleView === 0}
						loadVideo={(id) => loadVideo(id)}
						getYtItems={(t) => getYtItems(t)}
						showYtTab={() => showYtTab()}
					/>
				),
				span: 16,
				name: 'SONG LIST',
				customClasses: '',
			},
			{
				item: (
					<YtList
						ytItems={ytItems}
						loadVideo={(id) => loadVideo(id)}
						getYtItemsDebounced={(t) => getYtItemsDebounced.current(t)}
						isFetchingYtItems={isFetchingYtItems}
					/>
				),
				span: 8,
				name: 'YT LIST',
				customClasses: 'red',
			},
		];
	}

	const views = getViews();
	const nextViewIndex = (visibleView + 1) % views.length;

	return (
		<Row className="pos-relative">
			{views.map((view, index) => (
				<Col
					key={index}
					xs={index === visibleView ? 24 : 0}
					sm={index === visibleView ? 24 : 0}
					lg={view.span}
				>
					{view.item}
				</Col>
			))}
			<ViewSwitch
				switchView={() => setView(nextViewIndex)}
				nextViewName={views[nextViewIndex].name}
				customClasses={views[nextViewIndex].customClasses}
			/>
		</Row>
	);
}
