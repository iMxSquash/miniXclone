export const loginUser = async (email, password) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.token) {
        // Stocker le token dans un cookie
        document.cookie = `authToken=${data.token}; path=/; max-age=86400`; // Le token expirera après 1 jour
        window.location.href = '/'; // Rediriger vers la page d'accueil ou une page protégée
    } else {
        console.log(data.error); // Gérer l'erreur
    }
};

export const logoutUser = () => {
    // Supprimer le cookie
    document.cookie = 'authToken=; path=/; max-age=0';

    // Rediriger vers la page de connexion
    window.location.href = '/login';
};

export const registerUser = async (name, email, password) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.token) {
        // Stocker le token dans un cookie
        document.cookie = `authToken=${data.token}; path=/; max-age=86400`; // Le token expirera après 1 jour
        window.location.href = '/'; // Rediriger vers la page d'accueil ou une page protégée
    } else {
        console.log(data.error); // Gérer l'erreur
    }
};
