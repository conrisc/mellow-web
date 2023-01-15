import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOutUser } from 'Services/auth.service';
import { useAuth } from 'Hooks/useAuth';

function HomeX(props) {
	const { checkingAuth, isAuthenticated } = useAuth();

	function signOut() {
		signOutUser();
		props.setUnauthenticated();
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

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUnauthenticated: () => dispatch({ type: 'SET_UNAUTHENTICATED' }),
	};
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeX);
