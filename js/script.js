// script.js

var mainList;

window.addEventListener("beforeunload", saveData);
window.addEventListener("load", loadSite);

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
  // Returns the stack object with 'stackName'
  getStack(stackName) {
    if (this.containStack(stackName)) {
      for (let i = 0; i < this.stackList.length; i++) {
        if (this.stackList[i].stackName === stackName) {
          return this.stackList[i];
        }
      }
    } else {
      alertUser("STACK NOT PRESENT");
    }
  }

  // Adds flashcard to correct stack
  addFlashcard(flashcard) {
    var stackName = flashcard.stackName;
    if (this.containStack(stackName)) {
      for (let i = 0; i < this.stackList.length; i++) {
        var tempStack = this.stackList[i];
        if (this.stackList[i].stackName === stackName) {
          this.stackList[i].addFlashcard(flashcard);
        }
      }
    } else {
      alertUser("STACK NOT PRESENT");
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

  getFlashcards() {
    return this.flashcards;
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

// 
function showStack() {
  var stackName = document.getElementById("stackSelectDropdown")
    .selectedOptions[0].textContent;
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  showOnlyStack(stackName);
}

// Completely clears the home page and reverts all inputs back to their original state
function resetPage() {
  clearTextBoxes();
  populateStackDropdown();
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
}

// Clears all input text boxes on the home page
function clearTextBoxes() {
  var stackTextBox = document.getElementById("stackNameInput");
  stackTextBox.value = "";
  var fcQuestion = document.getElementById("fcQuestion");
  fcQuestion.value = "";
  var fcAnswer = document.getElementById("fcAnswer");
  fcAnswer.value = "";
}

// Iterates through all stacks and displays their flashcards
function showAllFlashcards() {
  // Clear stack container
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  for (let i = 0; i < mainList.stackList.length; i++) {
    showFlashcards(mainList.stackList[i].stackName);
  }
}

// Toggles flashcard information between question and answer
function toggleFlashcard(event) {
  var flashcardDiv = event.target.parentElement;

  var questionDiv = flashcardDiv.querySelector(".question");
  var answerDiv = flashcardDiv.querySelector(".answer");

  questionDiv.classList.toggle("hiddenText");
  answerDiv.classList.toggle("hiddenText");
}

// Clears the stack container and only populates with specified stack
function showOnlyStack(stackName) {
  // Get stack container and empty it before populating it
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  showFlashcards(stackName);
}

// Populates the stack container with the flashcards containing 'stackName' as their stack
function showFlashcards(stackName) {
  // Show all option
  if (stackName === "Show All") {
    showAllFlashcards();
    return;
  }

  // Get stack container
  var stackContainer = document.getElementById("stackContainer");

  // If stackName is 'none' or empty, return
  if (!stackName || stackName === "none") {
    return;
  }

  var stack = mainList.getStack(stackName);
  var flashcards = stack.getFlashcards();

  // Populate stack container with flashcards
  for (var i = 0; i < flashcards.length; i++) {
    var flashcard = flashcards[i];

    // Create a div element for the flashcard
    var flashcardDiv = document.createElement("div");
    flashcardDiv.classList.add("flashcard");

    // Create elements for question and answer
    var question = document.createElement("div");
    question.classList.add("question");
    question.textContent = flashcard.question;

    var answer = document.createElement("div");
    answer.classList.add("answer");
    answer.classList.add("hiddenText");
    answer.textContent = flashcard.answer;

    var toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle Flashcard";
    toggleButton.onclick = function (event) {
      toggleFlashcard(event);
    };

    var flashcardStack = document.createElement("div");
    flashcardStack.classList.add("stack");
    flashcardStack.textContent = "Stack: " + flashcard.stackName;

    // Append question and answer elements to flashcardDiv
    flashcardDiv.appendChild(question);
    flashcardDiv.appendChild(answer);
    flashcardDiv.appendChild(flashcardStack);
    flashcardDiv.appendChild(toggleButton);

    // Append the flashcardDiv to the stackContainer
    stackContainer.appendChild(flashcardDiv);
  }
}

// Deletes all stacks and resets all cards
function deleteAllStacks() {
  var stackNameInput = document.getElementById("stackNameInput");
  var confirm = window.confirm(
    "Deleting all stacks will remove all flashcards as well, are you sure you want to do this?"
  );

  if (confirm) {
    // Remove all stacks from main list and refresh the stack dropdown, show no flashcards
    mainList.clearAll();
    resetPage();

    // Place cursor back on the stack text box
    stackNameInput.focus();
  }
}
// Deletes stack specified by the stack dropdown
function deleteStack() {
  var stackSelect = document.getElementById("stackSelectDropdown")
    .selectedOptions[0].textContent;

  var stackNameInput = document.getElementById("stackNameInput");
  var stackOptionName =
    document.getElementById("stackEditDropdown").selectedOptions[0].textContent;

  if (mainList.containStack(stackOptionName)) {
    var confirm = window.confirm(
      "Deleting a stack will delete all of its contents, are you sure?"
    );
    if (confirm) {
      // Remove stack from main list and refresh the stack dropdown
      mainList.removeStack(stackOptionName);
      resetPage();

      // If the stack removed is the stack currently being showed, then show all stacks
      if (stackSelect === stackOptionName) {
        showFlashcards("Show All");
      } else {
        showOnlyStack(stackSelect);
        setSelectDropdown(stackSelect);
      }

      // Place cursor back on the stack text box
      stackNameInput.focus();
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
    clearTextBoxes();

    // Clear text boxes and place cursor back on the stack text box
    stackTextBox.focus();
  }
}

// Add new flashcard to the main list
function addFlashcard() {
  var flashcardQuestionElement = document.getElementById("fcQuestion");

  // Get flashcard answer and question text info and trim
  var flashcardQuestion = flashcardQuestionElement.value.trim();
  var flashcardAnswer = document.getElementById("fcAnswer").value.trim();
  var flashcardStackName =
    document.getElementById("stackEditDropdown").selectedOptions[0].textContent;

  var newFlashcard;

  // If the flashcard's fields are empty or the stack is not present alert the user
  if (flashcardAnswer === "" || flashcardQuestion === "") {
    alertUser("QUESTION AND ANSWER REQUIRED");
  } else {
    if (!mainList.containStack(flashcardStackName)) {
      alertUser("FLASHCARD NEEDS STACK");
    } else {
      // Create new flashcard and add to main list
      newFlashcard = new Flashcard(
        flashcardQuestion,
        flashcardAnswer,
        flashcardStackName
      );
      mainList.addFlashcard(newFlashcard);

      // Show the stack where the flashcard has been added and change the select dropdown to reflect the shown stack
      clearTextBoxes();
      showOnlyStack(flashcardStackName);
      setSelectDropdown(flashcardStackName);

      flashcardQuestionElement.focus();
    }
  }
}

// Sets the select dropdown value to the specified stack
function setSelectDropdown(stackName) {
  var selectDropdown = document.getElementById("stackSelectDropdown");
  var options = selectDropdown.options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].textContent === stackName) {
      selectDropdown.value = options[i].value;
      return;
    }
  }
}

// Populates the stack dropdowns used to select stacks for deletion and for organizing the flashcards
function populateStackDropdown() {

  // Get dropdown elements and clear their contents
  var stackDropdown = document.getElementById("stackEditDropdown");
  var stackSelectDropdown = document.getElementById("stackSelectDropdown");
  stackSelectDropdown.innerHTML = "";
  stackDropdown.innerHTML = "";

  // Create default option foir creating flashcards
  var defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Choose Stack";
  stackDropdown.appendChild(defaultOption);

  // Create default option for selecting flashcards
  var showAll = document.createElement("option");
  showAll.value = "default";
  showAll.textContent = "Show All";
  stackSelectDropdown.appendChild(showAll);

  // Create option element for each stack in the mainList and add to the stack dropdown
  for (var i = 0; i < mainList.stackList.length; i++) {
    var stackOptionName = mainList.stackList[i].stackName;
    var stackOption = document.createElement("option");
    stackOption.value = stackOptionName.toLowerCase().replace(/\s+/g, "-");
    stackOption.textContent = stackOptionName;
    stackDropdown.appendChild(stackOption);
  }

  // Separately populate the select dropdown with the same values as the create dropdown
  for (var i = 0; i < mainList.stackList.length; i++) {
    var stackOptionName = mainList.stackList[i].stackName;
    var stackOption = document.createElement("option");
    stackOption.value = stackOptionName.toLowerCase().replace(/\s+/g, "-");
    stackOption.textContent = stackOptionName;
    stackSelectDropdown.appendChild(stackOption);
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
  var flashcardID = "";
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
      break;
    case "STACK NOT PRESENT":
      alert("That stack cannot be found!");
      break;
    case "FLASHCARD NEEDS STACK":
      alert("You must place the new flashcard in an existing stack!");
      break;
    case "QUESTION AND ANSWER REQUIRED":
      alert("You must input both a question and answer for the flashcard");
      break;
  }
}

function setupSite() {
  // By default: Show all flashcards and populate the dropdowns
  populateStackDropdown();
  showAllFlashcards();

  // Add event listener for selecting and showing specific stacks using the select dropdown
  stackSelectDropdown.addEventListener("change", showStack);
}

// Function to save data to localStorage
function saveData() {
  // Convert mainList to JSON and save to localStorage
  localStorage.setItem("mainList", JSON.stringify(mainList));
}

// Main function which loads data from local stiorage and sets up the page for use
function loadSite() {
  var stackSelectDropdown = document.getElementById("stackSelectDropdown");

  // Retrieve data from localStorage
  const savedData = localStorage.getItem("mainList");
  if (savedData) {
    // Parse JSON data and initialize mainList
    mainList = new StackList();
    // Deserialize JSON string back into objects
    const parsedData = JSON.parse(savedData);
    // Restore class types and structure
    for (let stack of parsedData.stackList) {
      const stackObj = new Stack(stack.stackName);
      // Restore flashcards
      for (let flashcard of stack.flashcards) {
        stackObj.addFlashcard(
          new Flashcard(
            flashcard.question,
            flashcard.answer,
            flashcard.stackName
          )
        );
      }
      mainList.addStack(stackObj);
    }
  } else {
    // If no data found, initialize an empty mainList
    mainList = new StackList();
  }
  setupSite()
}
