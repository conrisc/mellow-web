import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isLoggedIn } from 'Services/auth.service';

export function useAuth() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state) => state.isAuthenticated);

	useEffect(() => {
		checkIfAuthorized();
	}, []);

	async function checkIfAuthorized() {
		if (await isLoggedIn()) {
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
