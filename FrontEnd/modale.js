// AFFICHER / FERMER LA MODALE
const overlayModalContent = document.querySelector(".overlay-modal-content");
const modalGallery = document.querySelector(".modal-gallery");
const modalContent = document.querySelector("#modal-content");


// OUVERTURE MODALE SUR BOUTON MODIFIER ET MODE EDITION
const allBtnEdition = document.querySelectorAll(".in-log")
for (const btn of allBtnEdition) {
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        overlayModalContent.style.display = "flex";
        modalContent.style.display = "flex";
        modalProjects(allProjects);
    })
}

// FERMETURE MODAL CONTENT SUR LA CROIX
document.querySelector("#modal-close").addEventListener("click", (event) => {
    event.preventDefault();
    overlayModalContent.style.display = "none";
    modalContent.style.display = "none";
})


// FERMETURE A L'APPUI DE LA TOUCHE ECHAP
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || e.key === "Esc") {
        overlayModalContent.style.display = "none";
        modalContent.style.display = "none";
    }
})

// FERMETURE MODALE AU CLIC SUR LE COTE
window.onclick = (event) => {
    if (event.target == overlayModalContent) {
        overlayModalContent.style.display = "none";
        modalContent.style.display = "none";
    }
}

// FONCTION AFFICHER LES PROJETS
function modalProjects(projects) {
    const createModalGallery = () => {
        const modalGallery = /*html*/ `
        <div class="modal-gallery">
            ${projects.map((project) => /*html*/`
                <figure>
                    <img src="${project.imageUrl}" alt="${project.title}">
                    <i class="fa-solid fa-trash-can"></i>
                </figure>
            `).join('')}
        </div>
        `;

        // Cherche la section avec l'id "modal-content"
        const portfolioSection = document.getElementById("modal-content");

        //vérifie s'il y a déjà une galerie, si oui, la remplace
        const existingGallery = document.querySelector(".modal-gallery");
        if (existingGallery) {
            existingGallery.outerHTML = modalGallery;
        } else {
            //sinon, ajoute la nouvelle galerie à l'intérieur de la section "portfolio"
            portfolioSection.insertAdjacentHTML("beforeend", modalGallery);
        }
    };

    createModalGallery(); // Appel de la fonction createModalGallery pour créer la galerie d'images
}

