// script.js

/* Global Variables */
// Array that holds all stacks
let stacks = [];

// Array that stores all flashcards
let flashcards = [];

/*
This section of functions is dedicated to changing between the three view-states of the SPA
*/

// Function to show a specific view and hide others
function showView(viewId) {

    let viewButtonId = '';
    if (viewId === 'home') {
        viewButtonId = 'homeViewButton';
    } else if (viewId === 'allcards') {
        viewButtonId = 'allCardsViewButton';
    } else {
        viewButtonId = 'reviewViewButton';
    }

    // Hide all views
    const views = document.querySelectorAll('.showView, .hideView');
    views.forEach(v => v.classList.remove('showView'));
    views.forEach(v => v.classList.add('hideView'));

    // Hide all view buttons
    const viewButtons = document.querySelectorAll('.activeViewButton, .hiddenViewButton');
    viewButtons.forEach(vB => vB.classList.remove('activeViewButton'));
    viewButtons.forEach(vB => vB.classList.add('hiddenViewButton'));

    // Show the specified view
    document.getElementById(viewId).classList.remove('hideView');
    document.getElementById(viewId).classList.add('showView');
    document.getElementById(viewButtonId).classList.remove('hiddenViewButton');
    document.getElementById(viewButtonId).classList.add('activeViewButton');

}

/* 'allcards' view functionality */
function allCardsView() {
    showView('allcards');
    showAllFlashcards();
}

/* 'home' view functionality */
function homeView() {
    showView('home');
    showAllFlashcards();
    populateStackDropdown();
}

/*---------------------------------------- Flashcard Functionality ---------------------------------------------*/

// Function to find flashcard index
function findFlashcardIndex(flashcardId) {

}

// Function to add a flashcard
function createFlashcard() {

    // Get question and answer and stack elements
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    const stackSelect = document.getElementById('stackSelect');
    
    // Get input values
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const selectedStackIndex = stackSelect.selectedIndex;
    
    // Check if any of the inputs are empty
    if (question && answer && selectedStackIndex !== 0) {

        const selectedStack = stacks[selectedStackIndex - 1]; // -1 to adjust for disabled "Select Stack" option
        const flashcard = { question, answer, stack: selectedStack.name };
        selectedStack.flashcards.push(flashcard);

        questionInput.value = '';
        answerInput.value = '';

        showAllFlashcards();

        console.log('Flashcard added successfully:', flashcard);
    } else {
        alert('Please enter both question, answer, and select a stack.');
    }

    // Save new changes to storage
    saveDataToStorage();

    // Place cursor back on question input field
    questionInput.focus();
}

// Function to show all flashcards
function showAllFlashcards() {
    // Get flashcard container element
    const flashcardContainer = document.getElementById('flashcardContainer');

    // Clear previous content
    flashcardContainer.innerHTML = '';

    // Loop through each stack
    stacks.forEach(stack => {
        // Loop through flashcards of each stack
        stack.flashcards.forEach((flashcard, index) => {
            // Create a div for each flashcard
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');

            // Set content for the flashcard div
            flashcardDiv.innerHTML = `
                <div class="flashcardElementsContainer">
                    <div class="flashcardText" id="flashcardQuestion">Q: ${flashcard.question}</div>
                    <div class="flashcardText" id="flashcardAnswer" style="display: none;">A: ${flashcard.answer}</div>
                    <div class="flashcardStack">Stack: ${stack.name}</div>
                    <button class="toggleButton" onclick="toggleFlashcard(this)">Toggle</button>
                    <button class="deleteButton" onclick="deleteFlashcardFromStack(${index})">Delete</button>
                </div>
            `;

            // Append the flashcard div to the container
            flashcardContainer.appendChild(flashcardDiv);
        });
    });
}

// Function to toggle between question and answer
function toggleFlashcard(button) {

    // Get flashcard question and answer elements
    const flashcardInfo = button.parentElement;
    const questionDiv = flashcardInfo.querySelector('#flashcardQuestion');
    const answerDiv = flashcardInfo.querySelector('#flashcardAnswer');

    // Flip display by setting one of the elements to 'none' and the other to 'block'
    if (questionDiv.style.display === 'none') {
        questionDiv.style.display = 'block';
        answerDiv.style.display = 'none';
    } else {
        questionDiv.style.display = 'none';
        answerDiv.style.display = 'block';
    }
}


// Function to delete all flashcards
function deleteAllFlashcards() {
    // Clear flashcards array
    flashcards = [];

    // Clear flashcards from all stacks
    stacks.forEach(stack => {
        stack.flashcards = [];
    });

    // Update UI to remove displayed flashcards
    const flashcardList = document.getElementById('flashcardList');
    flashcardList.innerHTML = '';

    // Save new changes to storage
    saveDataToStorage();
}

/*---------------------------------------- Stack Functionality ---------------------------------------------*/

// Function to add a stack
function createStack() {

    // Get stack name value
    const stackNameInput = document.getElementById('stackNameInput');
    const stackName = stackNameInput.value.trim();

    if (stackName) {
        const stack = { name: stackName, flashcards: [] };
        stacks.push(stack);
        stackNameInput.value = '';
        populateStackDropdown();
        console.log('Stack added successfully:', stack);
    } else {
        alert('Please enter a stack name.');
    }

    // Save new changes to storage
    saveDataToStorage();

    // Place cursor back on stack input field
    stackNameInput.focus();
}

// Function to delete a stack
function deleteStack(stackIndex) {
    stacks.splice(stackIndex, 1);
    console.log('Stack deleted successfully.');

    // Save new changes to storage
    saveDataToStorage();
}

// Function to delete all stacks
function deleteAllStacks() {

    // Confirm user wants to delete all stacks and thus all flashcards as well
    const isConfirmed = confirm("Are you sure you want to delete all stacks, and therefore all flashcards?")

    if (isConfirmed) {
        flashcards = [];
        stacks = [];
        populateStackDropdown();

        // Save new changes to storage
        saveDataToStorage();
    }
}

// Function to display all stacks
function displayStacks() {
    const stackListContainer = document.getElementById('stackList');
    stackListContainer.innerHTML = '';

    stacks.forEach((stack, index) => {
        const stackItem = document.createElement('div');
        stackItem.classList.add('stackItem');
        stackItem.innerHTML = `
            <span>${stack.name}</span>
            <button onclick="deleteStack(${index})" class="deleteButton">Delete</button>
        `;
        stackListContainer.appendChild(stackItem);
    });
}

// Function to populate the dropdown menu with available stacks
function populateStackDropdown() {

    // Get dropdown element and reset it's valye to default
    const stackSelect = document.getElementById('stackSelect');
    stackSelect.innerHTML = '<option value="" disabled selected>Select Stack</option>';

    // Populate dropdown menu with stack name informaton
    stacks.forEach(stack => {
        const option = document.createElement('option');
        option.value = stack.name;
        option.textContent = stack.name;
        stackSelect.appendChild(option);
    });
}

// Function to delete a flashcard from its stack
function deleteFlashcardFromStack(flashcardIndex) {

    // Confirm user wants to delete all stacks and thus all flashcards as well
    const isConfirmed = confirm("Are you sure you want to delete this flashcard?")
    
    if (isConfirmed) {
        const stackIndex = findStackIndexContainingFlashcard(flashcardIndex);
        if (stackIndex !== -1) {
            stacks[stackIndex].flashcards.splice(flashcardIndex, 1);
            showAllFlashcards(); // Update displayed flashcards
            saveDataToStorage(); // Save changes to storage
        }
    }
}


// Function to find the index of the stack containing a flashcard
function findStackIndexContainingFlashcard(flashcardIndex) {
    for (let i = 0; i < stacks.length; i++) {
        const stack = stacks[i];
        if (stack.flashcards.some((_, index) => index === flashcardIndex)) {
            return i;
        }
    }
    return -1;
}

/*------------------------------- Saving data to local storage and updating page on loading -------------------------------*/

// Function to save stack and flashcard information to localStorage
function saveDataToStorage() {
    // Convert stacks and flashcards arrays to JSON strings
    const stacksJSON = JSON.stringify(stacks);
    const flashcardsJSON = JSON.stringify(flashcards);
    
    // Save JSON strings to localStorage
    localStorage.setItem('stacks', stacksJSON);
    localStorage.setItem('flashcards', flashcardsJSON);
}

// Function to load stack and flashcard information from localStorage
function loadDataFromStorage() {
    // Retrieve JSON strings from localStorage
    const stacksJSON = localStorage.getItem('stacks');
    const flashcardsJSON = localStorage.getItem('flashcards');
    
    // Parse JSON strings into arrays
    if (stacksJSON) {
        stacks = JSON.parse(stacksJSON);
    }
    if (flashcardsJSON) {
        flashcards = JSON.parse(flashcardsJSON);
    }
}

// Call the function to load data when the page is loaded
window.addEventListener('load', loadDataFromStorage);
window.addEventListener('load', homeView);
window.addEventListener('load', populateStackDropdown);

// Call the function to save data when the page is unloaded
window.addEventListener('unload', saveDataToStorage);
