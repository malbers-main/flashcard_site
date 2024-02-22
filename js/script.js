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
  removeStack(stackName) {
    for (let i = 0; i < this.stackList.length; i++) {
      if (this.stackList[i].stackName === stackName) {
        this.stackList.splice(i, 1);
        return;
      }
    }
  }
  addStack(stack) {
    if (!this.containStack(stack.stackName)) {
      this.stackList.push(stack);
    } else {
      alertUser("STACK ALREADY PRESENT");
    }
  }
  containStack(stackName) {
    for (let i = 0; i < this.stackList.length; i++) {
      if (this.stackList[i].stackName === stackName) {
        return true;
      }
    }
  }
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
  clearStack() {
    this.flashcards = [];
  }
  addFlashcard(flashcard) {
    if (!this.containsFlashcard(flashcard.id)) {
      this.flashcards.push(flashcard);
    } else {
      alertUser("FLASHCARD ALREADY PRESENT");
    }
  }
  containsFlashcard(flashcardID) {
    for (let i = 0; i < this.flashcards.length; i++) {
      if (this.flashcards[i].id === flashcardID) {
        return true;
      }
    }
  }
  removeFlashcard(flashcardId) {
    const index = this.flashcards.findIndex(
      (flashcard) => flashcard.id === flashcardId
    );
    if (index !== -1) {
      this.flashcards.splice(index, 1);
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

// Completely clears the home page and reverts all inputs back to their original state
function resetHomePage() {
  clearTextBoxes();
  populateStackDropdowns();
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  showAllFlashcards();
}

// Clears the review page and resets the dropdown
function resetReviewPage() {
  populateStackDropdowns();
  var flashcardReviewContainer = document.getElementById(
    "flashcardReviewContainer"
  );
  flashcardReviewContainer.innerHTML = "";
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

// Populates the home page with the flashcards from the currently selected stack
function showStack() {
  var stackName = document.getElementById("stackSelectDropdown")
    .selectedOptions[0].textContent;
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  showOnlyStack(stackName);
}

// Clears the stack container and only populates with specified stack
function showOnlyStack(stackName) {
  // Get stack container and empty it before populating it
  var stackContainer = document.getElementById("stackContainer");
  stackContainer.innerHTML = "";
  showFlashcards(stackName);
}

// Toggles flashcard information between question and answer
function toggleFlashcard(event) {
  var flashcardDiv = event.target.parentElement;

  var questionDiv = flashcardDiv.querySelector(".question");
  var answerDiv = flashcardDiv.querySelector(".answer");

  questionDiv.classList.toggle("hiddenText");
  answerDiv.classList.toggle("hiddenText");
}

// Delete flashcard from stack using its 'delete' button
function deleteFlashcard(event) {
  // Get the ID of the flashcard to delete
  var flashcardId = event.target.parentElement.id;

  // Iterate through all stacks to find the stack containing the flashcard
  for (let i = 0; i < mainList.stackList.length; i++) {
    var stack = mainList.stackList[i];

    // If the stack contains the flashcard, remove it
    if (stack.containsFlashcard(flashcardId)) {
      stack.removeFlashcard(flashcardId);
      // Update the UI to reflect the deletion, showing the currently selected stack
      showStack();
      return;
    }
  }
}

// Populates the stack container with the flashcards containing 'stackName' as their stack
function showFlashcards(stackName) {
  // Show all if that option is selected
  if (stackName === "Show All") {
    showAllFlashcards();
    return;
  }
  var stackContainer = document.getElementById("stackContainer");

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
    flashcardDiv.id = flashcard.id;

    // Create question element
    var question = document.createElement("div");
    question.classList.add("question");
    question.textContent = flashcard.question;

    // Create answer element
    var answer = document.createElement("div");
    answer.classList.add("answer");
    answer.classList.add("hiddenText");
    answer.textContent = flashcard.answer;

    // Create toggle button
    var toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle Flashcard";
    toggleButton.onclick = function (event) {
      toggleFlashcard(event);
    };

    // Create delete button
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Flashcard";
    deleteButton.onclick = function (event) {
      deleteFlashcard(event);
    };

    var flashcardStack = document.createElement("div");
    flashcardStack.classList.add("stack");
    flashcardStack.textContent = "Stack: " + flashcard.stackName;

    // Append question and answer elements to flashcardDiv
    flashcardDiv.appendChild(question);
    flashcardDiv.appendChild(answer);
    flashcardDiv.appendChild(flashcardStack);
    flashcardDiv.appendChild(toggleButton);
    flashcardDiv.appendChild(deleteButton);

    // Append the flashcardDiv to the stackContainer
    stackContainer.appendChild(flashcardDiv);
  }
}

// Deletes all stacks and deletes all flashcards
function deleteAllStacks() {
  var stackNameInput = document.getElementById("stackNameInput");
  var confirm = window.confirm(
    "Deleting all stacks will remove all flashcards as well, are you sure you want to do this?"
  );

  if (confirm) {
    // Remove all stacks from main list and refresh the stack dropdown, show no flashcards
    mainList.clearAll();
    resetHomePage();

    // Place cursor back on the stack text box
    stackNameInput.focus();
  }
}
// Deletes stack specified by the edit stack dropdown
function deleteStack() {
  var stackSelect = document.getElementById("stackSelectDropdown")
    .selectedOptions[0].textContent;

  var stackNameInput = document.getElementById("stackNameInput");
  var stackOptionName =
    document.getElementById("stackEditDropdown").selectedOptions[0].textContent;

  // Confirm user wants to delete the stack and its contents
  if (mainList.containStack(stackOptionName)) {
    var confirm = window.confirm(
      "Deleting a stack will delete all of its contents, are you sure?"
    );
    if (confirm) {
      // Remove stack from main list and refresh the stack dropdown
      mainList.removeStack(stackOptionName);
      resetHomePage();

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
    // Error if no stack is chosen for deletion
    alertUser("MUST CHOOSE STACK FOR DELETION");
  }
}

// Adds new stack to the stack list
function addStack() {
  var stackTextBox = document.getElementById("stackNameInput");
  var newStackName = stackTextBox.value;

  // Make sure user has inputted stack name
  if (newStackName.trim() === "") {
    alertUser("STACK NAME REQUIRED");
    stackTextBox.focus();
  } else {
    // Create new stack and refresh the stack dropdown
    var newStack = new Stack(newStackName);
    mainList.addStack(newStack);
    populateStackDropdowns();
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

      // Place cursor back on question input
      flashcardQuestionElement.focus();
    }
  }
}

// Sets the select dropdown value on the home page to the specified stack
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
function populateStackDropdowns() {
  // Get dropdown elements and clear their contents
  var stackDropdown = document.getElementById("stackEditDropdown");
  var stackSelectDropdown = document.getElementById("stackSelectDropdown");
  var reviewDropdown = document.getElementById("reviewDropdown");

  reviewDropdown.innerHTML = "";
  stackSelectDropdown.innerHTML = "";
  stackDropdown.innerHTML = "";

  // Create default option foir creating flashcards
  var defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "Choose Stack";
  stackDropdown.appendChild(defaultOption);

  // Create default option foir creating flashcards
  var reviewDefaultOption = document.createElement("option");
  reviewDefaultOption.value = "default";
  reviewDefaultOption.textContent = "Choose Stack";
  reviewDropdown.appendChild(reviewDefaultOption);

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

  // Separately populate the select dropdown
  for (var i = 0; i < mainList.stackList.length; i++) {
    var stackOptionName = mainList.stackList[i].stackName;
    var stackOption = document.createElement("option");
    stackOption.value = stackOptionName.toLowerCase().replace(/\s+/g, "-");
    stackOption.textContent = stackOptionName;
    stackSelectDropdown.appendChild(stackOption);
  }

  // Separately populate the review dropdown
  for (var i = 0; i < mainList.stackList.length; i++) {
    var stackOptionName = mainList.stackList[i].stackName;
    var stackOption = document.createElement("option");
    stackOption.value = stackOptionName.toLowerCase().replace(/\s+/g, "-");
    stackOption.textContent = stackOptionName;
    reviewDropdown.appendChild(stackOption);
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

var reviewIndex = 0;
var randomIndex = -1;

function showPrevFlashcard() {
  showReviewStack(--reviewIndex);
}

function showNextFlashcard() {
  showReviewStack(++reviewIndex);
}

// Clears the stack container and only populates with specified stack
function showReviewStack(index) {
  reviewIndex = index;

  var stackName =
    document.getElementById("reviewDropdown").selectedOptions[0].textContent;
  // Get stack container and empty it before populating it
  var stackContainer = document.getElementById("flashcardReviewContainer");
  stackContainer.innerHTML = "";
  showReviewFlashcards(stackName, reviewIndex);
}

function showReviewFlashcards(stackName, index) {
  var stackContainer = document.getElementById("flashcardReviewContainer");

  // Clear page is default option is chosen
  if (stackName === "Choose Stack") {
    resetReviewPage();
    return;
  }

  var stack = mainList.getStack(stackName);
  var flashcards = stack.getFlashcards();

  // Wrap selection of flashcard when you reach the end or beginning
  if (index === flashcards.length) {
    reviewIndex = 0;
    index = reviewIndex;
  } else if (index === -1) {
    reviewIndex = flashcards.length - 1;
    index = reviewIndex;
  }

  var flashcard = flashcards[index];

  // Create a div element for the flashcard
  var flashcardDiv = document.createElement("div");
  flashcardDiv.classList.add("flashcard");
  flashcardDiv.id = flashcard.id;

  // Create question element
  var question = document.createElement("div");
  question.classList.add("question");
  question.textContent = flashcard.question;

  // Create answer element
  var answer = document.createElement("div");
  answer.classList.add("answer");
  answer.classList.add("hiddenText");
  answer.textContent = flashcard.answer;

  // Create toggle button
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

// Resets the review page when changing view from home -> review
function changeViewReview() {
  changeView("reviewView");
  resetReviewPage();
}

// Resets the home page when changing view from review -> home
function changeViewHome() {
  changeView("homeView");
  resetHomePage();
}

// Resets page data and initializes event listeners
function setupSite() {
  var stackSelectDropdown = document.getElementById("stackSelectDropdown");
  var stackReviewDropdown = document.getElementById("reviewDropdown");

  // By default: Show all flashcards and populate the dropdowns
  resetHomePage();

  // Add event listener for selecting and showing specific stacks using the select dropdown
  stackSelectDropdown.addEventListener("change", showStack);
  stackReviewDropdown.addEventListener("change", function () {
    showReviewStack(0);
  });
}

// Function to save data to localStorage
function saveData() {
  // Convert mainList to JSON and save to localStorage
  localStorage.setItem("mainList", JSON.stringify(mainList));
}

// Main function which loads data from local stiorage and sets up the page for use
function loadSite() {
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
  setupSite();
}
