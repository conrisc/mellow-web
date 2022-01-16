import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function HomeX(props) {

    function signOut() {
        sessionStorage.removeItem('mellov_api_auth_token');
        props.setUnauthenticated();
    }

    return (
        <div>
            <h1>Home page</h1>
            <ul>
                {props.isAuthenticated ?
                    <li>
                        <a href="#" onClick={signOut}>Sign out</a>
                    </li>
                    :
                    <li>
                        <Link to="/login">Sign in</Link>
                    </li>
                }
                <li>
                    <Link to="/notepad">Notepad</Link>
                </li>
                <li>
                    <Link to="/musiq">Musiq</Link>
                </li>
            </ul>
        </div>
    );
}


const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setUnauthenticated: () => dispatch({ type: 'SET_UNAUTHENTICATED' })
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeX);
