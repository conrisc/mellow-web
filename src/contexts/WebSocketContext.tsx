import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { musiqWebsocket } from 'Services/musiqWebsocket';
import { WSDataType } from 'Types/websocket.types';

interface WebSocketContextValue {
	isOnline: boolean;
	setOnline: () => void;
	setOffline: () => void;
	connect: () => void;
	disconnect: () => void;
	sendDataToTargets: (type: WSDataType, data?: any) => void;
	setSelectedDevices: (devices: string[]) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
	children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
	const [isOnline, setIsOnlineState] = useState(false);
	const webSocketRef = useRef<ReturnType<typeof musiqWebsocket.getInstance> | null>(null);

	const setOnline = () => {
		setIsOnlineState(true);
	};

	const setOffline = () => {
		setIsOnlineState(false);
	};

	// Initialize WebSocket instance
	useEffect(() => {
		webSocketRef.current = musiqWebsocket.getInstance({ setOnline, setOffline });
	}, []);

	const connect = () => {
		webSocketRef.current?.open();
	};

	const disconnect = () => {
		webSocketRef.current?.close();
	};

	const sendDataToTargets = (type: WSDataType, data?: any) => {
		webSocketRef.current?.sendDataToTargets(type, data);
	};

	const setSelectedDevices = (devices: string[]) => {
		webSocketRef.current?.setSelectedDevices(devices);
	};

	const value: WebSocketContextValue = {
		isOnline,
		setOnline,
		setOffline,
		connect,
		disconnect,
		sendDataToTargets,
		setSelectedDevices,
	};

	return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket(): WebSocketContextValue {
	const context = useContext(WebSocketContext);
	if (context === undefined) {
		throw new Error('useWebSocket must be used within a WebSocketProvider');
	}
	return context;
}
