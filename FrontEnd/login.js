// Création de la fonction de connexion
async function sendId() {
    const formId = document.querySelector(".log-in");
    const errorMessage = document.querySelector(".log-error");

    // Vérification de la présence du formulaire
    if (formId)
        formId.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Récupération des valeurs du formulaire d'identification
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const user = {
                email: email,
                password: password
            };

            try {
                // Appel de la fonction fetch avec toutes les informations nécessaires
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });

                // Vérification de la réponse
                if (response.status === 401 || response.status === 404) {
                    errorMessage.innerHTML = "Le mot de passe ou l'identifiant sont incorrects.";
                    errorMessage.style.display = "block";
                } else if (response.ok) {
                    // Si la réponse est réussie, extraction des données en JSON
                    const result = await response.json();

                    // Vérification du token
                    if (result && result.token) {
                        // Stockage du token dans le local storage
                        localStorage.setItem("token", result.token);

                        // Redirection vers la page d'acceuil
                        window.location.href = "index.html";

                        // Je vide le formulaire
                        formId.reset();

                        // Changement du texte du lien une dois connecté
                        disconnect();
                    }
                }
            } catch (error) {
                // Message en cas d'erreurs de requête ou de connexion
                console.error("Erreur lors de la requête d'authentification", error);
            }
        });
}

// Appel de la fonction
sendId();

// Création de la fonction de déconnexion
function disconnect() {
    const loginLink = document.querySelector(".login-logout");

    if (loginLink) {
        // Vérification si le token est déjà stocké dans le local storage
        if (localStorage.getItem("token")) {

            // Changement du texte du lien "login" en "logout"
            loginLink.innerHTML = "logout";

            // Déconnexion lors du clique sur "logout"
            loginLink.addEventListener("click", function (event) {
                event.preventDefault();

                // Supression du token du local storage
                localStorage.removeItem("token");

                // Redirection vers la page d'identification
                window.location.href = "login.html";
            });
        }
    }

}

// Appel de la fonction lors du chargement du DOM
document.addEventListener("DOMContentLoaded", function () {
    sendId();
    disconnect();
});



