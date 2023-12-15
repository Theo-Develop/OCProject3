// Variable Allprojects est indexé dans index.js

// AFFICHER / FERMER LA MODALE
const overlayModalContent = document.querySelector(".overlay-modal-content");
const modalGallery = document.querySelector(".modal-gallery");
const modalContent = document.querySelector("#modal-content");
const modalPhoto = document.querySelector("#modal-photo");


// OUVERTURE MODALE SUR BOUTON MODIFIER ET MODE EDITION
const allBtnEdition = document.querySelectorAll(".in-log")
for (const btn of allBtnEdition) {
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        overlayModalContent.style.display = "flex";
        modalContent.style.display = "flex";
        createProjectForModalDisplay();
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
        modalPhoto.style.display = "none";
    }
})

// FERMETURE des 2MODALS AU CLIC SUR LE COTE
window.onclick = (event) => {
    if (event.target == overlayModalContent || event.target == modalPhoto) {
        overlayModalContent.style.display = "none";
        modalContent.style.display = "none";
        modalPhoto.style.display = "none";
    }
}

// FONCTION AFFICHER LES PROJETS
function createProjectForModalDisplay() {
    createModalGallery(); // Appel de la fonction createModalGallery pour créer la galerie d'images

    // Sélectionne toutes les figures de la galerie
    const allFigures = document.querySelectorAll(".modal-gallery figure");

    allFigures.forEach((figure) => {
        // Écoute du click sur une corbeille pour supprimer un élément
        const deleteIcon = figure.querySelector(".fa-trash-can");

        figure.addEventListener("click", (event) => {
            event.preventDefault();
            const projectId = figure.getAttribute("data-project-id");
            if (deleteIcon && event.target === deleteIcon) {
                deleteWork(projectId, figure.querySelector("img").alt, figure);
            }
        });
    });
}

// IMPORTATION DE LA GALLERIE
function createModalGallery() {
    const modalGalleryHTML = allProjects.map((project) => /*html*/ `
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
        existingGallery.innerHTML = modalGalleryHTML;
    } else {
        // Sinon, ajoute la nouvelle galerie à l'intérieur de la section "portfolio"
        portfolioSection.insertAdjacentHTML("beforeend", `<div class="modal-gallery">${modalGalleryHTML}</div>`);
    }
};

// SUPPRIMER PROJETS
async function deleteWork(projectId, projectTitle) {
    const deleteConfirm = window.confirm(`Êtes-vous sûr de vouloir supprimer le projet : ${projectTitle} ?`);
    if (deleteConfirm) {
        const fetchDelete = fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        fetchDelete.then(async (response) => {
            if (response.ok) {
                msgDeleteOkF();

                // Supprime l'élément de la modale
                const deletedElementModal = document.querySelector(`[data-project-id="${projectId}"]`);
                if (deletedElementModal) {
                    deletedElementModal.remove();
                }

                // Supprime l'élément de la page principale
                const deletedElementMain = document.getElementById(`project-${projectId}`);
                if (deletedElementMain) {
                    deletedElementMain.remove();
                }

                // Mettez à jour allProjects après la suppression
                allProjects = allProjects.filter(project => project.id !== projectId);

                await refreshProjects();

            } else {
                // MESSAGE DE SUPPRESSION OK
            }
        });
    }
}

// FONCTION POUR RAFRAICHIR LA LISTE allProjects
async function refreshProjects() {
    // Effectuez une requête au serveur pour obtenir la liste des projets
    const response = await fetch("http://localhost:5678/api/works/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (response.ok) {
        allProjects = await response.json();
    } else {
        console.error("Failed to refresh projects");
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

// OUVERTURE MODAL PHOTO
document.querySelector("#new-photo").addEventListener("click", (e) => {
    e.preventDefault();
    modalPhoto.style.display = "flex";
    modalContent.style.display = "none";
    showCategoriesModal(allProjects);
})

// FLECHE RETOUR POUR REVENIR SUR MODAL CONTENT
document.querySelector("#modal-return").addEventListener("click", (e) => {
    e.preventDefault();
    modalPhoto.style.display = "none";
    modalContent.style.display = "flex";
    overlayModalContent.style.display = "flex";
    createProjectForModalDisplay();
    resetForm();
})

// FERMETURE MODAL PHOTO SUR LA CROIX
document.querySelector("#modal-photo-close").addEventListener("click", (event) => {
    event.preventDefault();
    modalPhoto.style.display = "none";
    overlayModalContent.style.display = "none";
})

// FONCTION AFFICHER LES CATEGORIES DANS LA MODAL PHOTO
categorySelect = document.querySelector("#modal-photo-category");
function showCategoriesModal() {
    categorySelect.innerHTML = "<option value='' hidden></option>";

    // Utilisez les catégories récupérées dans initialise
    allCategories.forEach(category => {
        const option = document.createElement("option");
        option.setAttribute("value", category.id);
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
};

// AJOUTER PROJETS
const btnNewPhoto = document.querySelector("#image");
const photoBox = document.querySelector("#form-photo");
const allContentPhotoBox = photoBox.querySelectorAll(".display-none");

btnNewPhoto.addEventListener("change", (e) => {
    e.preventDefault();
    const objectURL = URL.createObjectURL(btnNewPhoto.files[0]);
    allContentPhotoBox.forEach((content) => {
        content.style.display = "none";
    })
    const ajoutImage = document.createElement("img");
    ajoutImage.setAttribute("src", objectURL);
    ajoutImage.setAttribute("alt", btnNewPhoto.files[0].name);
    photoBox.appendChild(ajoutImage);
    checkForm()
})


// VERIFICATION FORMULAIRE COMPLET
const modalPhotoTitle = document.querySelector("#modal-photo-title");
const btnFormValider = document.querySelector(".modal-valider");
function checkForm() {
    if (modalPhotoTitle.value !== "" && btnNewPhoto.files[0] !== undefined && categorySelect.value !== "") {
        btnFormValider.classList.add("form-btn-valider")
        const btnFormValiderCheck = document.querySelector(".form-btn-valider");
        btnFormValiderCheck.addEventListener("click", sendWork);
    }
}

// RESET FORMULAIRE
function resetForm() {
    document.querySelector("#modal-photo-title").value = "";
    imageInput.value = "";
    categorySelect.selectedIndex = 0;

    allContentPhotoBox.forEach((content) => {
        content.style.display = "block";
        if (document.querySelector("#form-photo img")) {
            document.querySelector("#form-photo img").remove();
            btnFormValider.classList.remove("form-btn-valider")
        };
    })
}

let categorySelectId = "";
categorySelect.addEventListener("change", () => {
    categorySelectId = categorySelect.selectedIndex;
    checkForm();
})

modalPhotoTitle.addEventListener("change", () => {
    checkForm();
})

// AJOUTER DES PROJETS
const msgSuccesErrorSlot = document.querySelector(".msg-add-photo-success-error");
const msgBadSizeFormatImg = document.querySelector(".msg-bad-size-format-img");

// FONCTION VERIFICATION TAILLE ET FORMAT IMAGE
const imageInput = document.querySelector("#image");
imageInput.addEventListener("change",
    function checkImg() {
        const selectedImage = imageInput.files[0];

        if (selectedImage) {
            if (selectedImage.size > 4 * 1024 * 1024) {
                resetForm();
                msgBadSize();
                return;
            }

            const allowedFormats = ["image/jpeg", "image/png"];
            if (!allowedFormats.includes(selectedImage.type)) {
                resetForm();
                msgBadFormat();
                return;
            }
        }
    });

// FONCTION DE MESSAGE DE SUCCES AJOUT DE PROJET
const msgAddSuccess = "Projet ajouté avec succés !";
function msgAddSuccessF() {
    msgSuccesErrorSlot.textContent = msgAddSuccess;
    msgSuccesErrorSlot.style.display = "block";

    setTimeout(() => {
        msgSuccesErrorSlot.textContent = "";
        msgSuccesErrorSlot.style.display = "none";
    }, 3000);
}

// FONCTION DE MESSAGE ERREUR AJOUT DE PROJET
const msgAddError = "Un problème est survenue, veuillez recommencer.";
function msgAddErrorF() {
    msgSuccesErrorSlot.textContent = msgAddError;
    msgSuccesErrorSlot.style.display = "block";

    setTimeout(() => {
        msgSuccesErrorSlot.textContent = "";
        msgSuccesErrorSlot.style.display = "none";
    }, 3000);
}

// FONCTION MESSAGE ERREUR POUR IMAGE TROP LOURDE
const errorBadSize = "L'image dépasse la limite de taille de 4 Mo !";
function msgBadSize() {
    msgBadSizeFormatImg.textContent = errorBadSize;

    setTimeout(() => {
        msgBadSizeFormatImg.textContent = "";
    }, 3000);
}

// FONCTION MESSAGE ERREUR POUR MAUVAIS FORMAT IMAGE
const errorBadFormat = "Format de fichier non supporté. Utilisez JPEG ou PNG.";
function msgBadFormat() {
    msgBadSizeFormatImg.textContent = errorBadFormat;

    setTimeout(() => {
        msgBadSizeFormatImg.textContent = "";
    }, 3000);
}


// FONCTION AJOUT DE PROJETS
const token = localStorage.getItem("token")

const sendWork = async (event) => {
    event.preventDefault();
    const image = document.querySelector("#image").files[0];
    const title = document.querySelector("#modal-photo-title").value;

    let formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categorySelectId);

    const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData
    });

    if (response.ok) {
        const newProject = await response.json();
        allProjects.push(newProject);
        msgAddSuccessF();
        resetForm();
        createProjectForModalDisplay();
        addImageToMain(newProject);
    } else {
        msgAddErrorF();
    }
}

function addImageToMain(project) {
    const mainGallery = document.querySelector("#portfolio .gallery");

    // Crée un nouvel élément figure pour la nouvelle image
    const newFigure = document.createElement("figure");
    newFigure.id = `project-${project.id}`;

    // Crée un élément img avec la source de l'image
    const newImage = document.createElement("img");
    newImage.src = project.imageUrl;
    newImage.alt = project.title;

    // Crée un élément figcaption avec le titre de l'image
    const newCaption = document.createElement("figcaption");
    newCaption.textContent = project.title;

    // Ajoute l'image et le titre à la figure
    newFigure.appendChild(newImage);
    newFigure.appendChild(newCaption);

    // Ajoute la nouvelle figure à la galerie principale
    mainGallery.appendChild(newFigure);
}
