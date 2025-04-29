document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('currentUsername');
    const logoutButton = document.getElementById('logout-button');
    const settingsButton = document.getElementById('settings');
    const feedbackButton = document.getElementById('feedback-button');
    const helpTipsButton = document.getElementById('help-tips-button');
    const messageDialog = document.getElementById('message-dialog');
    const messageConfirm = document.getElementById('message-confirm');
    const messageCancel = document.getElementById('message-cancel');
    const messageText = document.getElementById('message-text');
    const settingsContainer = document.getElementById('settings-container');
    const feedbackForm = document.getElementById('feedback-form');
    const helpTipsContent = document.getElementById('help-tips-content');

    
    feedbackForm.style.display = 'none';
    helpTipsContent.style.display = 'none';

    // Feedback form state
    let feedbackSubmitted = false;

    if (username) {
        const userNameElement = document.getElementById('user-name-placeholder');
        userNameElement.textContent = username;
    }
    
     // Add click event listeners to navigation buttons
     document.querySelectorAll('.nav-item').forEach((button) => {
        button.addEventListener('click', function () {
          const targetPage = this.getAttribute('data-target');
          loadPageContent(targetPage);
        });
      });
    
      // Function to load and display the content of a page
    function loadPageContent(pageName) {
        // You can add logic to load content from a server or handle it as needed for each page
        if (pageName === 'home') {
            // Redirect to the settings page
            window.location.href = 'homepage.html';
        } else if (pageName === 'playlist') {
            // Redirect to the playlist page
            window.location.href = 'playlistpage.html';
        } else if (pageName === 'favourites') {
            // Redirect to the favourites page
            window.location.href = 'favouritespage.html';
        } else {
            // Default to the home page
            // You can handle this as needed
        }
    }
    
    // Make navigation item active
    function makeActive(element) {
        document.querySelectorAll('.nav-item').forEach((navItem) => {
            navItem.classList.remove('active');
        });
        element.classList.add('active');
    }
    
    // Search icon functionality
    document.querySelector('.search-icon').addEventListener('click', function () {
        document.querySelectorAll('.nav-item').forEach((navItem) => {
            navItem.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    document.querySelector('.search-icon').addEventListener('click', function () {
        window.open('searchpage.html', '_self');
    });
    
    // Add click event listeners to navigation buttons
    document.querySelectorAll('.nav-item').forEach((button) => {
        button.addEventListener('click', function () {
            const targetPage = this.getAttribute('data-target');
            loadPageContent(targetPage);
        });
    });
    

    // Event listener for clicking on the logout button
    logoutButton.addEventListener('click', function () {
        // Show the confirmation dialog
        messageDialog.style.display = 'flex';
    });

    // Event listener for clicking on the confirm button in the dialog
    messageConfirm.addEventListener('click', function () {
        // Hide the confirmation dialog
        messageDialog.style.display = 'none';

        // Perform logout action here
        // For now, let's just display a message
        messageText.innerText = 'Logout successful!';

        // Hide everything after a brief delay
        setTimeout(function () {
            // Hide main menu
            document.querySelector('.main-menu').style.display = 'none';

            // Hide settings container
            settingsContainer.style.display = 'none';

            // Hide message dialog
            messageDialog.style.display = 'none';
        }, 1500); // 1500 milliseconds (1.5 seconds) delay
    });

    // Event listener for clicking on the cancel button in the dialog
    messageCancel.addEventListener('click', function () {
        // Hide the confirmation dialog
        messageDialog.style.display = 'none';
    });

    // Event listener for clicking on the settings button
    settingsButton.addEventListener('click', function () {
        // Toggle visibility of the settings container
        settingsContainer.style.display = (settingsContainer.style.display === 'none' || settingsContainer.style.display === '') ? 'flex' : 'none';

        // Hide other sections when opening settings
        feedbackForm.style.display = 'none';
        helpTipsContent.style.display = 'none';
    });

    // Event listener for clicking on the feedback button
    feedbackButton.addEventListener('click', function () {
        // Show the feedback form
        feedbackForm.style.display = 'block';

        // Reset feedback form state
        feedbackSubmitted = false;
    });

    // Event listener for submitting the feedback form
    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission (for simulation)

        // Validate form
        if (validateForm(feedbackForm)) {
            // Simulate feedback submission
            if (feedbackSubmitted) {
                alert('Feedback already submitted!');
            } else {
                showCenteredMessage('Feedback submitted successfully!');
                // Save feedback data (you can implement this part)
                feedbackSubmitted = true;
                // Hide the form
                feedbackForm.style.display = 'none';
            }
        } else {
            // Prompt the user to answer all questions
            promptUser();
        }
    });

    // Event listener for clicking on the help & tips button
    helpTipsButton.addEventListener('click', function () {
        // Show the Help & Tips content
        helpTipsContent.style.display = 'block';

        // Hide other sections when opening Help & Tips
        settingsContainer.style.display = 'none';
        feedbackForm.style.display = 'none';
    });

    // Function to show the message dialog
    function showMessage(message) {
        messageText.innerText = message;
        messageDialog.style.display = 'flex';
    }

    // Function to show a centered message
    function showCenteredMessage(message) {
        messageText.innerText = message;
        messageDialog.style.display = 'flex';
        messageDialog.style.alignItems = 'center';
        messageDialog.style.justifyContent = 'center';
    }

    // Function to validate form
    function validateForm(form) {
        var allAnswered = true;
        var questions = form.querySelectorAll('.form-question');
        questions.forEach(function (question) {
            if (!question.querySelector('input[type="radio"]:checked')) {
                allAnswered = false;
            }
        });
        return allAnswered;
    }

    // Prompt user to answer all questions
    function promptUser() {
        showMessage('Please answer all questions before continuing.');
    }
});
