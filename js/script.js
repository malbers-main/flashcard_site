// script.js

// Array to store flashcards
var flashcards = [];

// Array to store categories
var categories = [];

// Variable to store last randomly selected index value
var randomIndex = -1;

// Load existing flashcards from local storage when the page is loaded
window.addEventListener('DOMContentLoaded', function() {
    // If the flashcards array is empty, populate it with stored flashcards
    if (flashcards.length === 0) {
        flashcards = getFCs(); // Populate flashcards array if it's empty
    }
    if (categories.length === 0) {
        categories = getCategories();
    }

    displayFCs(); // Display existing flashcards
    // Populate the drop-down menu with categories
    populateCategoryDropdownMenus();
    showView('Home'); // Show the 'Home' view by default
});

// Function to show a specific view based on its ID
function showView(viewID) {
    // Hide all views
    var views = document.querySelectorAll('.viewPage');
    views.forEach(function(view) {
        view.style.display = 'none';
    });

    // Show the selected view
    var selectedView = document.getElementById(viewID);
    selectedView.style.display = 'block';

    // If the selected view is 'All Cards', display the flashcards
    if (viewID === 'All Cards') {
        displayFCs();
    }

    // If the selected view is 'Random Review', clear the review page
    if (viewID ==='Random Review') {
        clearRandomPage();
    }

}

// Function to add a flashcard to the array and save to local storage
function addCategory(category) {
    categories.push(category);
    saveCategories();
}

// Function to remove a category
function deleteCategory() {
    var categoryDropdown = document.getElementById('removeCategory');
    var selectedCategory = categoryDropdown.value;

    if (selectedCategory) {
        // Confirm with the user before removing the category
        var confirmDelete = confirm("Are you sure you want to delete the selected category?");
        if (confirmDelete) {
            // Remove the selected category from the categories array
            var index = categories.indexOf(selectedCategory);
            if (index !== -1) {
                categories.splice(index, 1);
                // Update the dropdown menu with the updated list of categories
                populateCategoryDropdownMenus();
                // Save the updated list of categories to local storage
                saveCategories();

                // Optionally, you can also remove any flashcards associated with this category
                // and update the UI accordingly

                alert('Category deleted: ' + selectedCategory);
            }
        }
    } else {
        // Alert user if no category is selected
        alert('Please select a category to delete.');
    }
}

// Function to populate the drop-down menus with categories and 'undefined' option
function populateCategoryDropdownMenus() {
    var categoryDropdown = document.getElementById('category');
    var removeCategoryDropdown = document.getElementById('removeCategory');

    // Clear existing options
    categoryDropdown.innerHTML = '';
    removeCategoryDropdown.innerHTML = '';

    // Add 'undefined' as an option
    var undefinedOption = document.createElement('option');
    undefinedOption.value = 'Undefined';
    undefinedOption.textContent = 'Undefined';
    categoryDropdown.appendChild(undefinedOption);

    // Add "Select" option to the remove category dropdown
    var selectOption = document.createElement('option');
    selectOption.value = '';
    selectOption.textContent = 'Select';
    removeCategoryDropdown.prepend(selectOption);

    // Add categories as options
    categories.forEach(function(category) {
        var option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);

        // Also add categories to the remove category dropdown
        var removeOption = document.createElement('option');
        removeOption.value = category;
        removeOption.textContent = category;
        removeCategoryDropdown.appendChild(removeOption);
    });
}


// Function to add new category
function createCategory() {
    // Get input element for category
    var categoryInput = document.getElementById('newCategory');

    // Get value of category input
    var category = categoryInput.value;

    // Check if category is provided
    if (category) {
        // Check if the category already exists
        if (!categories.includes(category)) {
            // Add category to the list of categories
            categories.push(category);

            // Clear category input field after adding category
            categoryInput.value = '';

            // Save categories to local storage
            saveCategories();

            // Update the dropdown menu with the latest list of categories
            populateCategoryDropdownMenus();

            // Place cursor back on category input field
            categoryInput.focus();

            // Alert user that category has been added
            alert('Category added: ' + category);

        } else {
            // Alert user that the category already exists
            alert('Category already exists.');
        }
    } else {
        // Alert user if category is missing
        alert('Please enter a category.');
    }
}


// Function to create a new flashcard
function createFC() {
    // Get input elements for question, answer, and category
    var questionInput = document.getElementById('question');
    var answerInput = document.getElementById('answer');
    var categoryDropdown = document.getElementById('category');

    // Get values of question, answer, and selected category
    var question = questionInput.value;
    var answer = answerInput.value;
    var category = categoryDropdown.value; // Get selected category from the drop-down menu

    // If no category is selected, assign 'undefined' to category
    if (!category) {
        category = 'Undefined';
    }

    // Check if question and answer are provided
    if (question && answer) {
        // Create flashcard object with category
        var flashcard = {
            question: question,
            answer: answer,
            category: category
        };
        
        addFC(flashcard); // Add flashcard to array

        // Clear input fields after adding flashcard
        questionInput.value = '';
        answerInput.value = '';
        categoryDropdown.value = ''; // Reset the drop-down menu to its default state

        // Populate the drop-down menu again to reflect any changes in categories
        populateCategoryDropdownMenus();

        // Place cursor on question input field
        questionInput.focus();
    } else {
        // Alert user if question or answer is missing
        alert('A flashcard needs a question and an answer.');
    }
}

// Function to retrieve categories from local storage
function getCategories() {
    var storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
}

// Function to save categories to local storage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Function to add a flashcard to the array and save to local storage
function addFC(flashcard) {
    flashcards.push(flashcard);
    saveFCs();
}

// Function to save flashcards to local storage
function saveFCs() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Function to retrieve flashcards from local storage
function getFCs() {
    var storedFCs = localStorage.getItem('flashcards');
    return storedFCs ? JSON.parse(storedFCs) : [];
}

// Function to clear all flashcards
function clearFCs() {
    // Confirm with user before clearing flashcards
    var confirmClear = confirm("Are you sure you want to delete all flashcards?");
    if (confirmClear) {
        // Remove flashcards from local storage and reset array
        localStorage.removeItem('flashcards');
        flashcards = [];
        // Change view to 'Home'
        showView('Home');
        // Alert user that flashcards have been cleared
        alert('All flashcards have been cleared.');
    }
}

// Function to display flashcards in the 'All Cards' view
function displayFCs() {
    var flashcards = getFCs();
    var flashcardContainer = document.getElementById('flashcardContainer');
    flashcardContainer.innerHTML = '';

    flashcards.forEach(function(flashcard, index) {
        var card = createFlashcardElement(
            flashcard,
            function(answer) { toggleAnswerDisplay(answer); },
            function() { removeFC(index); },
            function() { editFC(index); }
        );

        flashcardContainer.appendChild(card);
    });
}

// Function to remove a flashcard from the array and update display
function removeFC(index) {
    flashcards.splice(index, 1); 

     // Update indices of remaining flashcards
     flashcards.forEach(function(flashcard, i) {
        if (i >= index) {
            // Update the index of flashcards greater than or equal to the removed index
            flashcard.index = i;
        }
    });

    // Save new flashcard information and display updated info
    saveFCs();
    displayFCs();
}

// Function to edit a flashcard
function editFC(index) {
    var flashcard = flashcards[index];
    
    // Find the flashcard element to edit
    var flashcardElement = document.querySelectorAll('.flashcard')[index];
    
    // Save the original content of the flashcard
    var originalQuestion = flashcard.question;
    var originalAnswer = flashcard.answer;
    
    // Create input fields for editing
    var newQuestionInput = document.createElement('input');
    newQuestionInput.type = 'text';
    newQuestionInput.value = flashcard.question;
    
    var newAnswerInput = document.createElement('input');
    newAnswerInput.type = 'text';
    newAnswerInput.value = flashcard.answer;
    
    // Replace the content of the flashcard with input fields
    flashcardElement.innerHTML = '';
    flashcardElement.appendChild(newQuestionInput);
    flashcardElement.appendChild(newAnswerInput);
    
    // Create save and cancel buttons
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        saveEditedFC(index, newQuestionInput.value, newAnswerInput.value);
    });
    flashcardElement.appendChild(saveButton);
    
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        // Revert the flashcard back to its original state
        flashcard.question = originalQuestion;
        flashcard.answer = originalAnswer;
        displayFCs(); // Update the display
    });
    flashcardElement.appendChild(cancelButton);

    // Focus cursor on new answer input field
    newQuestionInput.focus();
}

// Function to save the edited flashcard
function saveEditedFC(index, newQuestion, newAnswer) {
    var flashcard = flashcards[index];
    flashcard.question = newQuestion;
    flashcard.answer = newAnswer;
    
    // Save updated flashcards to local storage and update display
    saveFCs();
    displayFCs();
}

function clearRandomPage() {
    var randomCardContainer = document.getElementById('randomCardContainer');
    randomCardContainer.innerHTML = '';
}

// Function to display a single flashcard
function randomDisplay() {
    var flashcards = getFCs();
    var randomCardContainer = document.getElementById('randomCardContainer');
    randomCardContainer.innerHTML = '';

     // Check if there are flashcards available
     if (flashcards.length === 0) {
        // Display an error message to the user
        randomCardContainer.innerHTML = '<p>No flashcards available for random review.</p>';
        return; // Exit the function
    }

    var index = getRandomNumber();
    while (index === randomIndex) {
        index = getRandomNumber();
    }
    randomIndex = index;
    var flashcard = flashcards[randomIndex];

    var card = createFlashcardElement(
        flashcard,
        function(answer) { toggleAnswerDisplay(answer); },
        function() { removeFC(index); },
        function() { editFC(index); }
    );

    randomCardContainer.appendChild(card);
}

// Function to generate a random number within a range
function getRandomNumber() {
    var max = flashcards.length - 1;
    var randomNumber = Math.floor(Math.random() * (max + 1));
    return randomNumber;
}

// Function to create HTML elements for a flashcard
function createFlashcardElement(flashcard, toggleAnswerDisplay, removeButtonHandler, editButtonHandler) {
    var card = document.createElement('div');
    card.classList.add('flashcard');
    
    var question = document.createElement('h2');
    question.textContent = 'Question: ' + flashcard.question;

    var answer = document.createElement('p');
    answer.textContent = 'Answer: ' + flashcard.answer;
    answer.style.display = 'none'; // Initially hide the answer

    var revealButton = document.createElement('button');
    revealButton.textContent = 'Reveal Answer';
    revealButton.addEventListener('click', function() {
        toggleAnswerDisplay(answer);
    });

    var removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', removeButtonHandler);

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editButtonHandler);

    card.appendChild(question);
    card.appendChild(answer);
    card.appendChild(revealButton);
    card.appendChild(removeButton);
    card.appendChild(editButton);

    return card;
}

// Function to toggle the display of an element
function toggleAnswerDisplay(answerElement) {
    if (answerElement.style.display === 'none') {
        answerElement.style.display = 'block';
    } else {
        answerElement.style.display = 'none';
    }
}
