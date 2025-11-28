/**
 * WebSocket message data types
 */
export const WS_DATA_TYPES = {
	NEW_MESSAGE: 'new_message',
	JOIN: 'join',
	PLAY: 'play',
	PAUSE: 'pause',
	NEXT_SONG: 'next_song',
	PREV_SONG: 'prev_song',
	SET_VOLUME: 'set_volume',
	LOAD_VIDEO: 'load_video',
	PLAYER_STATE: 'player_state',
	PING: 'ping',
	CLIENTS_INFO: 'clients_info',
} as const;

export type WSDataType = typeof WS_DATA_TYPES[keyof typeof WS_DATA_TYPES];

/**
 * WebSocket message structure
 */
export interface WSMessage {
	type: WSDataType;
	data?: any;
}

/**
 * WebSocket listeners interface
 */
export interface WSListeners {
	open?: (event: Event) => void;
	message?: (event: MessageEvent) => void;
	close?: (event: CloseEvent) => void;
	error?: (event: Event) => void;
}

/**
 * Client device information
 */
export interface ClientDevice {
	id: string;
	name: string;
	type?: string;
	lastSeen?: Date;
}

/**
 * WebSocket connection options
 */
export interface WSConnectionOptions {
	setOnline?: () => void;
	setOffline?: () => void;
	autoReconnect?: boolean;
	reconnectInterval?: number;
}
