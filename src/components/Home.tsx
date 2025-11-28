import React from 'react';
import { Link } from 'react-router-dom';
import { signOutUser } from 'Services/auth.service';
import { useAuth } from 'Contexts/AuthContext';

export function Home() {
	const { checkingAuth, isAuthenticated, setIsAuthenticated } = useAuth();

	function signOut() {
		signOutUser();
		setIsAuthenticated(false);
	}

	return (
		<div>
			<h1>Home page</h1>
			{!checkingAuth && (
				<ul>
					{isAuthenticated ? (
						<>
							<li>
								<a href="#" onClick={signOut}>
									Sign out
								</a>
							</li>
							<li>
								<Link to="/notepad">Notepad</Link>
							</li>
							<li>
								<Link to="/musiq">Musiq</Link>
							</li>
						</>
					) : (
						<li>
							<Link to="/login">Sign in</Link>
						</li>
					)}
				</ul>
			)}
		</div>
	);
}
