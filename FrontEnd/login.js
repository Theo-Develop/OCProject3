// Création de la fonction de connexion
async function initialiseLoginForm() {
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
                const response = await fetch("http://sophie-bluel-api.vercel.app/api/users/login",/* fetch("http://localhost:5678/api/users/login", */ {
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
                    }
                }
            } catch (error) {
                // Message en cas d'erreurs de requête ou de connexion
                console.error("Erreur lors de la requête d'authentification", error);
            }
        });
}


// Création de la fonction d'initialisation pour l'affichage différent en étant connecté
function initialiseLogoutbtn() {
    const loginLink = document.querySelector(".login-logout");
    const head_band = document.querySelector(".head-band");
    const in_log = document.querySelector(".in-log");
    const filter_buttons = document.querySelector(".filter-buttons");

    if (loginLink) {
        // Vérification si le token est déjà stocké dans le local storage
        if (localStorage.getItem("token")) {

            // Changement du texte du lien "login" en "logout"
            loginLink.innerHTML = "logout";
            loginLink.style.cursor = "pointer";

            // Affichage du bandeau et du changement portfolio
            head_band.style.display = "flex";
            in_log.style.display = "flex";
            filter_buttons.style.display = "none";


            // Déconnexion lors du clique sur "logout"
            loginLink.addEventListener("click", onClickBtnLogout);
        }
    }
}

// Appel de la fonction pour se déconnecter
function onClickBtnLogout(event) {
    event.preventDefault();

    // Supression du token du local storage
    localStorage.removeItem("token");

    // Redirection vers la page normale pour vérifier les ajouts ou suppresions
    window.location.href = "index.html";
}


// Appel de la fonction lors du chargement du DOM
document.addEventListener("DOMContentLoaded", function () {
    initialiseLoginForm();
    initialiseLogoutbtn();
});
