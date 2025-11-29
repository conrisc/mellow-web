import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from 'Contexts/AuthContext';

// Code-split route components for better performance
const Home = lazy(() => import('./Home').then((module) => ({ default: module.Home })));
const Notepad = lazy(() => import('./Notepad/Notepad').then((module) => ({ default: module.Notepad })));
const Musiq = lazy(() => import('./Musiq/Musiq').then((module) => ({ default: module.Musiq })));
const Login = lazy(() => import('./Login').then((module) => ({ default: module.Login })));
const Register = lazy(() => import('./Register').then((module) => ({ default: module.Register })));

// Loading fallback component
const LoadingFallback = () => (
	<div
		style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
	>
		<Spin size="large" />
	</div>
);

export function Content() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<Routes>
				<Route index element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />

				<Route element={<ProtectedRoute />}>
					<Route path="notepad/:noteId?" element={<Notepad />} />
					<Route path="musiq" element={<Musiq />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export function ProtectedRoute() {
	const { checkingAuth, isAuthenticated } = useAuth();
	const location = useLocation();

	if (checkingAuth) return null;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
}
