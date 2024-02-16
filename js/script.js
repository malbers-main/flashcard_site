// script.js

class StackList {
    stackList;

    constructor() {
        this.stackList = [];
    }
    clearAll() {
        this.stackList = [];
    }
    // Removes stack from the list using the stack's name
    removeStack(stackName) {
        for (let i = 0; i < this.stackList.length; i++) {
            if (this.stackList[i].stackName === stackName) {
                this.stackList.splice(i, 1);
                return;
            }
        }
    }
    // Add's stack to the list only if there isn't another stack with the same name
    addStack(stack) {
        if (!this.containStack(stack.stackName)) {
            this.stackList.push(stack);
        } else {
            alertUser('STACK ALREADY PRESENT');
        }
    }
    // Check if a stack with name 'stackName' already exists on the 'stackList'
    containStack(stackName) {
        for (let i = 0; i < this.stackList.length; i++) {
            if (this.stackList[i].stackName === stackName) {
                return true;
            }
        }
    }
}

class Stack {
    stackName;
    flashcards;

    constructor(stackName) {
        this.stackName = stackName;
        this.flashcards = [];
    }
    // Removes all flashcards from the stack
    clearStack() {
        this.flashcards = [];
    }
    // Adds a flashcard to the stack if it doesn't already exist
    addFlashcard(flashcard) {
        if (!this.containsFlashcard(flashcard.id)) {
            this.flashcards.push(flashcard);
        } else {
            alertUser('FLASHCARD ALREADY PRESENT');
        }
    }
    // Checks to see if a flashcard with id 'flashcardID' already exists on this stack
    containsFlashcard(flashcardID) {
        for (let i = 0; i < this.flashcards.length; i++) {
            if (this.flashcards.id === flashcardID) {
                return true;
            }
        }
    }
}

class Flashcard {
    id;
    question;
    answer;
    stackName;

    constructor(question, answer, stackName) {
        this.id = generateFlashcardID(question);
        this.question = question;
        this.answer = answer;
        this.stackName = stackName;
    }

    /* Functions for changing flashcard information */
    changeQuestion(newQuestion) {
        this.question = newQuestion;
        this.id = generateFlashcardID(newQuestion);
    }
    changeAnswer(newAnswer) {
        this.answer = newAnswer;
    }
    changeStack(newStackName) {
        this.stackName = newStackName;
    }
}

// Changes which view is shown on the site
function changeView(viewID) {
    // Get a list of all elements
    var viewPages = document.getElementById("viewContainer").children;
    // Loop through all views and reveal the one selected
    for (let i = 0; i < viewPages.length; i++) {
        let view = viewPages[i];
        if (view.id === viewID) {
            view.className = 'showView';
        } else {
            view.className = 'hiddenView';
        }
    }
}

// Generates a unique string that is used to identify flashcards
function generateFlashcardID(question) {
    flashcardID = "";
    for (let i = 0; i < question.length; i++) {
        flashcardID += question.charCodeAt(i);
    }
    return flashcardID;
}

// Executes all necessary functions when the site is initially loaded
function loadSite() {
    changeView('homeView');
}

// Alerts the user to errors in the site
function alertUser(alertCode) {
    switch (alertCode) {
        case 'STACK ALREADY PRESENT':
            alert("A flashcard stack with this name already exists!");
            break;
        case 'FLASHCARD ALREADY PRESENT':
            alert("A flashcard with this question already exists on this stack!");
            break;
    }
}

/* Event Listeners */
document.addEventListener("DOMContentLoaded", loadSite);