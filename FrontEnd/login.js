// Création de la fonction de connexion
async function sendId() {
    const formId = document.querySelector(".log-in");
    const errorMessage = document.querySelector(".log-error");

    // Vérification de la présence du formulaire
    if (formId)
        formId.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("1");

            // Récupération des valeurs du formulaire d'identification
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const user = {
                email: email,
                password: password
            };
            console.log("2", email, password);

            try {
                // Appel de la fonction fetch avec toutes les informations nécessaires
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });
                console.log("3", response);
                console.log(response.status === 401, response.status === 404, response.status === 401 && response.status === 404);

                // Vérification de la réponse
                if (response.status === 401 || response.status === 404) {
                    console.log("4");
                    errorMessage.innerHTML = "Le mot de passe ou l'identifiant sont incorrects.";
                    errorMessage.style.display = "block";
                } else if (response.ok) {
                    console.log("5");
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


// Appel de la fonction
sendId();
