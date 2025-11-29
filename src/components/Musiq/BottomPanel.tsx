import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Slider } from 'antd';
import { usePlayer } from 'Contexts/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

export function BottomPanel() {
	const { ytPlayer } = usePlayer();
	const [time, setTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isPaused, setIsPaused] = useState(true);

	useEffect(() => {
		if (!ytPlayer) return;

		const timeUpdater = setInterval(() => {
			const currentTime = (ytPlayer.getCurrentTime && ytPlayer.getCurrentTime()) || 0;
			const floorTime = Math.floor(currentTime);
			setTime(floorTime);
		}, 200);

		ytPlayer.addEventListener('onStateChange', updateVideoDuration);

		return () => {
			clearInterval(timeUpdater);
		};
	}, [ytPlayer]);

	function updateVideoDuration(state: any) {
		if (state.data === 1) {
			const floorDuration = Math.floor((ytPlayer?.getDuration && ytPlayer.getDuration()) || 0);
			setDuration(floorDuration);
			setIsPaused(false);
		} else if (state.data === -1 || state.data === 5) {
			setDuration(0);
			setIsPaused(true);
		} else {
			setIsPaused(true);
		}
	}

	function handleTimeChange(value: number) {
		ytPlayer?.seekTo(value);
	}

	function playVideo() {
		ytPlayer?.playVideo();
	}

	function pauseVideo() {
		ytPlayer?.pauseVideo();
	}

	function formatSeconds(seconds: number): string {
		const min = Math.floor(seconds / 60);
		const sec = ('0' + (seconds % 60)).slice(-2);
		return `${min}:${sec}`;
	}

	return (
		<div>
			<Row className="control-panel" justify="space-around">
				<Col>
					<Button ghost={true} onClick={playVideo}>
						<FontAwesomeIcon icon={faPlay} />
					</Button>
				</Col>
				<Col>
					<Button ghost={true} onClick={pauseVideo}>
						<FontAwesomeIcon icon={faPause} />
					</Button>
				</Col>
				<Col className="timer" span={2}>
					<span>{formatSeconds(time)}</span>
				</Col>
				<Col span={14}>
					{/* Use handleTimeChange debounce */}
					<Slider
						min={0}
						max={duration}
						value={time}
						onChange={handleTimeChange}
						tooltip={{ formatter: formatSeconds }}
					/>
				</Col>
				<Col className="timer" span={2}>
					<span>{formatSeconds(duration)}</span>
				</Col>
			</Row>
		</div>
	);
}
