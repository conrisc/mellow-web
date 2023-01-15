import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAccessToken, isLoggedIn } from 'Services/auth.service';
import { setApiKey } from 'Services/apiConfig.service';

export function useAuth() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state) => state.isAuthenticated);

	useEffect(() => {
		checkIfAuthorized();
	}, []);

	async function checkIfAuthorized() {
		if (await isLoggedIn()) {
			const accessToken = await getAccessToken();
			setApiKey(accessToken);
			setAuthenticated();
		} else {
			setUnauthenticated();
		}

		setCheckingAuth(false);
	}

	function setAuthenticated() {
		dispatch({ type: 'SET_AUTHENTICATED' });
	}

	function setUnauthenticated() {
		dispatch({ type: 'SET_UNAUTHENTICATED' });
	}

	return {
		checkingAuth,
		isAuthenticated,
	};
}
