import { useEffect, useState } from 'react';


function GitHubSuccess() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const url = new URLSearchParams(window.location.search);
        const name = url.get('name');
        const login = url.get('login');
        const avatar = url.get('avatar');

        if (name) setUser({ name, login, avatar });
    }, []);

    return user ? (
        <div>
            <h2>Welcome, {user.name} (@{user.login})</h2>
            <img src={user.avatar} alt="avatar" width="100" />
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default GitHubSuccess;
