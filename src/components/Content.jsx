import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import { Home } from './Home';
import { Notepad } from './Notepad/Notepad';
import { Musiq } from './Musiq/Musiq';
import { Login } from './Login';
import { Register } from './Register';
import { useAuth } from 'Hooks/useAuth';

export function Content() {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route path="notepad/:noteId?" element={<Notepad />} />
                <Route path="musiq" element={<Musiq />} />
            </Route>
		</Routes>
	);
}

export function ProtectedRoute() {
	const { checkingAuth, isAuthenticated } = useAuth();
	const location = useLocation();

    if (checkingAuth) return null;

    return isAuthenticated ?
        <Outlet /> :
        <Navigate to="/login" state={{ from: location }} />;
}
