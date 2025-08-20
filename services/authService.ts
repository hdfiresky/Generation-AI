import { USE_BACKEND } from './geminiService';

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_USERS_KEY = 'frontend_users';

export const register = async (username: string, password: string): Promise<any> => {
    // --- START: BACKEND AUTH ---
    // This block handles registration when using the FastAPI backend.
    if (USE_BACKEND) {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        return response.json();
    }
    // --- END: BACKEND AUTH ---

    // --- START: FRONTEND-ONLY AUTH ---
    // This block can be removed if the app is only used with a backend.
    // It simulates user registration using local storage.
    else {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users = JSON.parse(localStorage.getItem(FRONTEND_USERS_KEY) || '[]');
                const userExists = users.some((user: any) => user.username === username);

                if (userExists) {
                    reject(new Error('Username already taken.'));
                    return;
                }

                users.push({ username, password });
                localStorage.setItem(FRONTEND_USERS_KEY, JSON.stringify(users));
                resolve({ username });

            }, 500);
        });
    }
    // --- END: FRONTEND-ONLY AUTH ---
};


export const login = async (username: string, password: string): Promise<{ access_token: string }> => {
    // --- START: BACKEND AUTH ---
    // This block handles login when using the FastAPI backend.
    if (USE_BACKEND) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${BACKEND_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
        }

        return response.json();
    }
    // --- END: BACKEND AUTH ---

    // --- START: FRONTEND-ONLY AUTH ---
    // This block can be removed if the app is only used with a backend.
    // It simulates user login using local storage.
    else {
        return new Promise((resolve, reject) => {
             setTimeout(() => { // Simulate network delay
                const users = JSON.parse(localStorage.getItem(FRONTEND_USERS_KEY) || '[]');
                const user = users.find((user: any) => user.username === username && user.password === password);

                if (!user) {
                    reject(new Error('Invalid username or password.'));
                    return;
                }
                
                // In frontend mode, the "token" is just the username.
                resolve({ access_token: user.username });
            }, 500);
        });
    }
    // --- END: FRONTEND-ONLY AUTH ---
};