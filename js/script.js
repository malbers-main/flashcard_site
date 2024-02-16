// script.js

function changeView(viewID) {

    // Get a list of all elements
    var viewPages = document.getElementById("viewContainer").children;

    // Loop throguh all elements, changing class to showPage
    for (var i = 0; i < viewPages.length; i++) {
        let view = viewPages[i];
        if (view.id === viewID) {
            view.className = 'showView';
        } else {
            view.className = 'hiddenView';
        }
    }

}