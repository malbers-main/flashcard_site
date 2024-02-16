// script.js

var mainList;

/*-----------------------------------------------------------------------------------------------*/
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
      alertUser("STACK ALREADY PRESENT");
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
      alertUser("FLASHCARD ALREADY PRESENT");
    }
  }
  // Checks to see if a flashcard with id 'flashcardID' already exists on this stack
  containsFlashcard(flashcardID) {
    for (let i = 0; i < this.flashcards.length; i++) {
      if (this.flashcards[i].id === flashcardID) {
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
/*-----------------------------------------------------------------------------------------------*/

// Clears all input text boxes
function clearTextBoxes() {
  var stackTextBox = document.getElementById("stackNameInput");
  stackTextBox.value = "";
}

// Deletes all stacks and resets all cards
function deleteAllStacks() {
  var confirm = window.confirm(
    "Deleting all stacks will remove all flashcards as well, are you sure you want to do this?"
  );

  if (confirm) {
    // Remove all stacks from main list and refresh the stack dropdown
    mainList.clearAll();
    populateStackDropdown();

    // Save data
    saveData();

    // Place cursor back on the stack text box
    clearInputElements();
    stackTextBox.focus();
  }
}
// Deletes stack specified by the stack dropdown
function deleteStack() {
  var stackOptionName =
    document.getElementById("stackDropdown").selectedOptions[0].textContent;

  if (mainList.containStack(stackOptionName)) {
    var confirm = window.confirm(
      "Deleting a stack will delete all of its contents, are you sure?"
    );
    if (confirm) {
      // Remove stack from main list and refresh the stack dropdown
      mainList.removeStack(stackOptionName);
      populateStackDropdown();

      // Place cursor back on the stack text box
      clearInputElements();
      stackTextBox.focus();

      // Save data
      saveData();
    }
  } else {
    alertUser("MUST CHOOSE STACK FOR DELETION");
  }
}

// Adds new stack to the stack list
function addStack() {
  var stackTextBox = document.getElementById("stackNameInput");
  var newStackName = stackTextBox.value;

  if (newStackName.trim() === "") {
    alertUser("STACK NAME REQUIRED");
    stackTextBox.focus();
  } else {
    // Create new stack and refresh the stack dropdown
    var newStack = new Stack(newStackName);
    mainList.addStack(newStack);
    populateStackDropdown();

    // Clear text boxes and place cursor back on the stack text box
    clearTextBoxes();
    stackTextBox.focus();

    // Save data
    saveData();
  }
}

// Populates the stack dropdown used to select stacks for deletion
function populateStackDropdown() {
  // Get dropdown element and clear its contents
  var stackDropdown = document.getElementById("stackDropdown");
  stackDropdown.innerHTML = "";

  // Create default option that is set as the first option
  var defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Choose Stack";
  stackDropdown.appendChild(defaultOption);

  // Create option element for each stack in the mainList and add to the stack dropdown
  for (var i = 0; i < mainList.stackList.length; i++) {
    var stackOptionName = mainList.stackList[i].stackName;
    var stackOption = document.createElement("option");
    stackOption.value = stackOptionName.toLowerCase().replace(/\s+/g, "-");
    stackOption.textContent = stackOptionName;
    stackDropdown.appendChild(stackOption);
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
      view.className = "showView";
    } else {
      view.className = "hiddenView";
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

// Alerts the user to errors in the site
function alertUser(alertCode) {
  switch (alertCode) {
    case "STACK ALREADY PRESENT":
      alert("A flashcard stack with this name already exists!");
      break;
    case "FLASHCARD ALREADY PRESENT":
      alert("A flashcard with this question already exists on this stack!");
      break;
    case "STACK NAME REQUIRED":
      alert("You must enter a name for the new stack!");
      break;
    case "MUST CHOOSE STACK FOR DELETION":
      alert("You must choose a valid stack option in order to delete it!");
  }
}

window.addEventListener("load", loadSite);

// Function to save data to localStorage
function saveData() {
  // Convert mainList to JSON and save to localStorage
  localStorage.setItem("mainList", JSON.stringify(mainList));
}

// Function to load data from localStorage
function loadSite() {
  // Retrieve data from localStorage
  const savedData = localStorage.getItem("mainList");
  if (savedData) {
    // Parse JSON data and initialize mainList
    mainList = new StackList();
    Object.assign(mainList, JSON.parse(savedData));
    populateStackDropdown();
  } else {
    // If no data found, initialize an empty mainList
    mainList = new StackList();
  }
}
