document.addEventListener('DOMContentLoaded', () => {
    const recipeLibrary = document.getElementById('recipeLibrary');
    const recipeModal = document.getElementById('recipeModal');
    const addRecipeModal = document.getElementById('addRecipeModal');
    const editRecipeModal = document.getElementById('editRecipeModal');
    const closeButtons = document.querySelectorAll('.close');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');
    const editMenuBtn = document.getElementById('editMenuBtn');
    const editMenu = document.getElementById('editMenu');
    const deleteRecipeBtn = document.getElementById('deleteRecipeBtn');
    const editRecipeBtn = document.getElementById('editRecipeBtn');
    const saveEditRecipeBtn = document.getElementById('saveEditRecipeBtn');
    let currentRecipeId = null;

    function createRecipeElement(id, title, imageUrl, recipeText) {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.dataset.id = id;
        recipeItem.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="recipe-title">${title}</div>
        `;
        recipeItem.addEventListener('click', () => {
            showModal(id);
        });
        return recipeItem;
    }

    function showModal(id) {
        const recipe = JSON.parse(localStorage.getItem(id));
        if (recipe) {
            document.getElementById('modalTitle').innerText = recipe.title;
            document.getElementById('modalImage').src = recipe.imageUrl;
            document.getElementById('modalRecipe').innerText = recipe.text;
            currentRecipeId = id;
            recipeModal.style.display = 'flex';
        }
    }

    function showEditRecipeModal() {
        const recipe = JSON.parse(localStorage.getItem(currentRecipeId));
        if (recipe) {
            document.getElementById('editRecipeTitleInput').value = recipe.title;
            document.getElementById('editRecipeImageInput').value = ''; // Reset file input
            document.getElementById('editRecipeTextInput').value = recipe.text;
            editRecipeModal.style.display = 'flex';
        }
    }

        closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModals();
            editMenu.style.display = 'none';
        });
    });


    function hideModals() {
        recipeModal.style.display = 'none';
        addRecipeModal.style.display = 'none';
        editRecipeModal.style.display = 'none';
    }

    function loadRecipes() {
        recipeLibrary.innerHTML = '';
        Object.keys(localStorage).forEach(key => {
            const recipe = JSON.parse(localStorage.getItem(key));
            if (recipe) {
                recipeLibrary.appendChild(createRecipeElement(key, recipe.title, recipe.imageUrl, recipe.text));
            }
        });
    }

    function convertToBase64(file, callback) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    }

    function saveRecipe() {
        const title = document.getElementById('recipeTitleInput').value;
        const imageInput = document.getElementById('recipeImageInput');
        const text = document.getElementById('recipeTextInput').value;

        if (title && imageInput.files.length && text) {
            convertToBase64(imageInput.files[0], (base64Image) => {
                const id = Date.now().toString();
                const recipe = { title, imageUrl: base64Image, text };
                localStorage.setItem(id, JSON.stringify(recipe));
                recipeLibrary.appendChild(createRecipeElement(id, title, base64Image, text));
                hideModals();
            });
        } else {
            alert('Please fill in all fields and upload an image.');
        }
    }

    function updateRecipe() {
        const title = document.getElementById('editRecipeTitleInput').value;
        const imageInput = document.getElementById('editRecipeImageInput');
        const text = document.getElementById('editRecipeTextInput').value;

        const recipe = JSON.parse(localStorage.getItem(currentRecipeId));
        if (title && text) {
            const newRecipe = { title, imageUrl: recipe.imageUrl, text };
            if (imageInput.files.length) {
                convertToBase64(imageInput.files[0], (base64Image) => {
                    newRecipe.imageUrl = base64Image;
                    localStorage.setItem(currentRecipeId, JSON.stringify(newRecipe));
                    document.querySelector(`[data-id="${currentRecipeId}"] img`).src = base64Image;
                    document.querySelector(`[data-id="${currentRecipeId}"] .recipe-title`).innerText = title;
                    hideModals();
                });
            } else {
                localStorage.setItem(currentRecipeId, JSON.stringify(newRecipe));
                document.querySelector(`[data-id="${currentRecipeId}"] .recipe-title`).innerText = title;
                document.querySelector(`[data-id="${currentRecipeId}"] img`).src = recipe.imageUrl;
                hideModals();
            }
        } else {
            alert('Please fill in all fields.');
        }
    }

    function deleteRecipe() {
        if (currentRecipeId) {
            localStorage.removeItem(currentRecipeId);
            document.querySelector(`[data-id="${currentRecipeId}"]`).remove();
            hideModals();
        }
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', hideModals);
    });

    addRecipeBtn.addEventListener('click', () => {
        addRecipeModal.style.display = 'flex';
    });

    saveRecipeBtn.addEventListener('click', saveRecipe);

    editMenuBtn.addEventListener('click', () => {
        editMenu.style.display = editMenu.style.display === 'block' ? 'none' : 'block';
    });

    editRecipeBtn.addEventListener('click', showEditRecipeModal);

    saveEditRecipeBtn.addEventListener('click', updateRecipe);

    deleteRecipeBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipe();
        }
    });

    loadRecipes();
});
