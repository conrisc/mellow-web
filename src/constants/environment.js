import process from 'process';

class EnvVariableNotDefinedError extends Error {
	constructor(envVarName) {
		super(`Environment variable ${envVarName} is not defined!`);
	}
}

export const MELLOV_API_URL = process.env.MELLOV_API_URL;
export const MELLOV_WEBSOCKET_URI = process.env.MELLOV_WEBSOCKET_URI;

if (!MELLOV_API_URL) {
	const error = new EnvVariableNotDefinedError('MELLOV_API_URL');
	console.error(error.message);
	throw error;
}

if (!MELLOV_WEBSOCKET_URI) {
	const error = new EnvVariableNotDefinedError('MELLOV_WEBSOCKET_URI');
	console.error(error.message);
	throw error;
}
