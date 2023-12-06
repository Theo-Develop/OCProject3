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
    if (event.key === "Escape" || event.key === "Esc") {
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
        const modalGalleryHTML = projects.map((project) => /*html*/ `
            <figure data-project-id="${project.id}">
                <img src="${project.imageUrl}" alt="${project.title}">
                <i class="fa-solid fa-trash-can"></i>
            </figure>
        `).join('');

        // Cherche la section avec l'id "modal-content"
        const portfolioSection = document.getElementById("modal-content");

        // Vérifie s'il y a déjà une galerie, si oui, la remplace
        const existingGallery = document.querySelector(".modal-gallery");
        if (existingGallery) {
            console.log("Existing gallery found. Replacing content...");
            existingGallery.innerHTML = modalGalleryHTML;
        } else {
            console.log("No existing gallery. Adding new gallery...");
            // Sinon, ajoute la nouvelle galerie à l'intérieur de la section "portfolio"
            portfolioSection.insertAdjacentHTML("beforeend", `<div class="modal-gallery">${modalGalleryHTML}</div>`);
        }
    };

    createModalGallery(); // Appel de la fonction createModalGallery pour créer la galerie d'images

    // Sélectionne toutes les figures de la galerie
    const allFigures = document.querySelectorAll(".modal-gallery figure");

    allFigures.forEach((figure) => {
        // Écoute du click sur une corbeille pour supprimer un élément
        const deleteIcon = figure.querySelector(".fa-trash-can");

        figure.addEventListener("click", (event) => {
            const projectId = figure.getAttribute("data-project-id");
            if (deleteIcon && event.target === deleteIcon) {
                console.log("Delete icon clicked for project ID:", projectId);
                event.preventDefault();
                deleteWork(projectId, figure.querySelector("img").alt, localStorage.getItem("token"));
            }
        });

        console.log("Figure added to click event listener:", figure);
    });
}

// SUPPRIMER PROJETS
function deleteWork(projectId, projectTitle, token) {
    const deleteConfirm = window.confirm(`Êtes-vous sûr de vouloir supprimer le projet : ${projectTitle} ?`);
    if (deleteConfirm) {
        const fetchDelete = fetch(`${"http://localhost:5678/api/works"}/${projectId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        fetchDelete.then((response) => {
            if (response.ok) {
                msgDeleteOkF();
                modalProjects(allProjects);
            } else {
                // MESSAGE DE SUPPRESSION OK
            }
        });
    }
}

const msgDeleteOkSlot = document.querySelector(".msg-delete-ok");
const msgDeleteOk = "Le projet a bien été supprimé.";

function msgDeleteOkF() {
    msgDeleteOkSlot.textContent = msgDeleteOk;

    setTimeout(() => {
        msgDeleteOkSlot.textContent = "";
    }, 3000);
}


