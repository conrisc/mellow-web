import React, { useRef, useEffect } from 'react';
import { YELLOW_API_URL } from 'Constants/environment';
import { usePlayer } from 'Contexts/PlayerContext';
import { VideoData } from 'Types/player.types';

const mimeCodec = 'audio/webm; codecs="opus"';
const MAX_APPEND_FAILS = 3;

function getAudioPlayer(audioContainer: HTMLAudioElement) {
	let mediaSource: MediaSource;
	let controller: AbortController;
	let reader: ReadableStreamDefaultReader<Uint8Array>;
	let ytVideoId: string;

	function clearState() {
		if (reader) reader.cancel('Stop reading request body');
		if (controller) controller.abort('Stop previous request');
		if (mediaSource && mediaSource.readyState === 'open') mediaSource.endOfStream(); // TODO: sourceBuffer.updating might be in progress, fix it
	}

	async function loadAudioByVideoId(videoId: string) {
		clearState();

		ytVideoId = videoId;
		const url = `${YELLOW_API_URL}?videoId=${videoId}`;
		mediaSource = new MediaSource();
		audioContainer.src = URL.createObjectURL(mediaSource);

		mediaSource.addEventListener('sourceopen', async () => {
			try {
				const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
				// console.log(`SourceBuffer created for ${mimeCodec}`);

				// console.log(`Fetching stream from: ${url}`);
				controller = new AbortController();
				const response = await fetch(url, { signal: controller.signal });

				if (!response.ok) {
					throw new Error(`Fetch failed with status: ${response.status}`);
				}
				// console.log(`Content-Type: ${response.headers.get('content-type')}`);

				sourceBuffer.addEventListener('error', (e) => {
					console.log('SourceBuffer Error: ' + e);
				});
				sourceBuffer.addEventListener('updateend', () => {
					processQueue();
				});

				reader = response.body.getReader();
				const queue = [];
				let allDataFetched = false;
				let failedAppendAttempts = 0;

				function processQueue() {
					if (queue.length > 0 && !sourceBuffer.updating) {
						try {
							sourceBuffer.appendBuffer(queue.shift());
							failedAppendAttempts = 0;
						} catch (e) {
							failedAppendAttempts++;
							if (failedAppendAttempts == MAX_APPEND_FAILS) {
								console.log('Max buffer append attempts reached. Aborting.');
								throw e;
							}
							console.log(`Buffer Append Error: ${e.message}`);
							console.error(e);
						}
					} else if (
						allDataFetched &&
						queue.length === 0 &&
						!sourceBuffer.updating &&
						mediaSource.readyState === 'open'
					) {
						mediaSource.endOfStream();
					}
				}

				let result;
				while (!(result = await reader.read()).done) {
					queue.push(result.value);
					processQueue();
				}
				allDataFetched = true;
			} catch (err) {
				console.log(`Error: ${err?.message ? err.message : err}`);
				clearState();
			}
		});
	}

	function getVideoData(): VideoData {
		return { videoId: ytVideoId, title: '-' };
	}

	return {
		element: audioContainer,
		getVideoData,
		loadAudioByVideoId,
	};
}

export function AudioPlayer() {
	const { setAudioPlayer } = usePlayer();
	const audioPlayerRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioPlayerRef.current) {
			setAudioPlayer(getAudioPlayer(audioPlayerRef.current));
		}
	}, [setAudioPlayer]);

	return (
		<div style={{ textAlign: 'center' }}>
			<audio ref={audioPlayerRef} controls style={{ width: '90%' }}></audio>
		</div>
	);
}
