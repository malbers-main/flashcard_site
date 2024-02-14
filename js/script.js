// script.js

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

/* Global Variables */

// Array that holds all stacks
let stacks = [];

// Array that stores all flashcards
let flashcards = [];

/*---------------------------------------- Flashcard Functionality ---------------------------------------------*/


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

        displayFlashcards(selectedStackIndex - 1); // Update displayed flashcards for the selected stack
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
        stack.flashcards.forEach(flashcard => {
            // Create a div for each flashcard
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');
            
            // Set content for the flashcard div
            flashcardDiv.innerHTML = `
                <div class="question">Question: ${flashcard.question}</div>
                <div class="answer">Answer: ${flashcard.answer}</div>
                <div class="stack">Stack: ${stack.name}</div>
            `;
            
            // Append the flashcard div to the container
            flashcardContainer.appendChild(flashcardDiv);
        });
    });
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
    displayStacks();
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
    const stackSelect = document.getElementById('stackSelect');
    stackSelect.innerHTML = '<option value="" disabled selected>Select Stack</option>';

    stacks.forEach(stack => {
        const option = document.createElement('option');
        option.value = stack.name;
        option.textContent = stack.name;
        stackSelect.appendChild(option);
    });
}


/* 'allcards' view functionality */
function allCardsView() {
    showView('allcards');
    showAllFlashcards();
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
window.addEventListener('load', populateStackDropdown);

// Call the function to save data when the page is unloaded
window.addEventListener('unload', saveDataToStorage);
