import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isLoggedIn } from 'Services/auth.service';

interface AuthContextValue {
	isAuthenticated: boolean;
	checkingAuth: boolean;
	setIsAuthenticated: (value: boolean) => void;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);

	const checkAuth = async () => {
		setCheckingAuth(true);
		try {
			const loggedIn = await isLoggedIn();
			setIsAuthenticated(loggedIn);
		} catch (error) {
			console.error('Error checking authentication:', error);
			setIsAuthenticated(false);
		} finally {
			setCheckingAuth(false);
		}
	};

	// Check auth on mount
	useEffect(() => {
		checkAuth();
	}, []);

	const value: AuthContextValue = {
		isAuthenticated,
		checkingAuth,
		setIsAuthenticated,
		checkAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
