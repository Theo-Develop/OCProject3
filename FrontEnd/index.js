let allProjects = [];
let allCategories = [];

//Appel de la fonction initialise **évitez d'avoir autre chose que des fonctions en racines**
function initialise() {
    // Récupération des projets
    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            allProjects = data;
            displayProjects(data);
        });

    // Récupération des catégories
    getCategories().then(categories => {
        allCategories = categories;

        const filterButtons = document.querySelector(".filter-buttons");

        // Utilise map pour générer la structure HTML pour chaque catégorie
        const buttonsHtml = categories.map(category => {
            return /*html*/`
                <button class="filter">${category.name}</button>
            `;
        }).join('');

        // Ajoute le bouton "Tous" en tant que premier bouton
        const allButtonHtml = /*html*/`
            <button class="filter filter-selected">Tous</button>
        `;

        // Crée la structure complète en combinant le bouton "Tous" avec les boutons de catégories
        const filterButtonsHtml = allButtonHtml + buttonsHtml;

        // Utilise innerHTML pour mettre à jour le contenu de la div filter-buttons
        filterButtons.innerHTML = filterButtonsHtml;

        // Récupère tous les boutons de filtre
        const buttons = document.querySelectorAll(".filter-buttons button");

        // Ajoute un event listener à chaque bouton de filtre 
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                //Si le bouton "Tous" est cliqué (avec la classe "filter-selected"), on appelle "filterProjects" avec categoryId à null
                //Sinon, on recherche l'id de la catégorie associée et on appelle "filterProjects" avec et cet id pour filtrer les projets par catégorie.
                const categoryId = button.classList.contains("filter-selected") ? null : categories.find(category => category.name === button.textContent)?.id;
                filterProjects(categoryId, button);
            });
        });
    });
}

// Fonction pour récupérer les catégories
function getCategories() {
    return fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => categories);
}

initialise();

function displayProjects(projects) {
    const createGallery = () => {
        const gallery = /*html*/ `
        <div class="gallery">
            ${projects.map((project) => /*html*/`
            <figure id="project-${project.id}">
                <img src="${project.imageUrl}" alt="${project.title}" />
                <figcaption>${project.title}</figcaption>
            </figure>
            `).join('')}
        </div>
        `;

        // Cherche la section avec l'id "portfolio"
        const portfolioSection = document.getElementById("portfolio");

        //vérifie s'il y a déjà une galerie, si oui, la remplace
        const existingGallery = document.querySelector(".gallery");
        if (existingGallery) {
            existingGallery.outerHTML = gallery;
        } else {
            //sinon, ajoute la nouvelle gallerie à l'intérieur de la section "portfolio"
            portfolioSection.insertAdjacentHTML("beforeend", gallery);
        }
    };

    createGallery(); // Appel de la fonction createGallery pour créer la galerie d'images
}


function filterProjects(categoryId, selectedButton) {
    // Vérifie si le bouton actuel est déjà sélectionné
    const isAlreadySelected = selectedButton.classList.contains("filter-selected");

    // Si le bouton est déjà sélectionné, ne faites rien
    if (isAlreadySelected) {
        return;
    }

    // Sinon, effectuez la logique de filtrage
    const filteredProjects = !categoryId ? allProjects : allProjects.filter(project => project.categoryId === categoryId);
    displayProjects(filteredProjects);
    setSelectedFilter(selectedButton);
}


function setSelectedFilter(selectedButton) {
    const buttons = document.querySelectorAll(".filter-buttons button");
    buttons.forEach(button => {
        button.classList.remove("filter-selected");
    });
    selectedButton.classList.add("filter-selected");
};

