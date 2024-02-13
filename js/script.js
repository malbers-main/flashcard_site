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

/* This section contains functions relating to the creation and deletion of flashcard objects */

// Array that stores all flashcards
let flashcards = [];

// Function to add a flashcard
function createFlashcard() {

    // Get question and answer elements
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    
    // Get input values
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    
    // Check if inputs are not empty
    if (question && answer) {
        // Create flashcard object
        const flashcard = { question, answer };
        
        // Add flashcard to array
        flashcards.push(flashcard);
        
        // Clear input fields
        questionInput.value = '';
        answerInput.value = '';
        
        // Optionally, display success message or update UI
        console.log('Flashcard added successfully:', flashcard);
    } else {
        alert('Please enter both question and answer.');
    }

    // Put the cursor back on the 'questionInput' element
    questionInput.focus();
}

// Function to show all flashcards
function showAllFlashcards() {

    // Get flashcard list element
    const flashcardList = document.getElementById('flashcardList');
    // Clear previous content
    flashcardList.innerHTML = '';
    
    // Loop through flashcards array and display each flashcard
    flashcards.forEach((flashcard, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Q: ${flashcard.question} - A: ${flashcard.answer}`;
        flashcardList.appendChild(listItem);
    });
}

// Function to delete all flashcards
function deleteAllFlashcards() {
    // Empty the flashcards array
    flashcards = [];
    // Optionally, update UI to remove displayed flashcards
    const flashcardList = document.getElementById('flashcardList');
    flashcardList.innerHTML = '';
}
