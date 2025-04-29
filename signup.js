document.getElementById('signupForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  createAccount();
});

function showPopupMessage(message) {
  document.getElementById('popupMessage').textContent = message;
  document.getElementById('customPopup').style.display = 'block';
}

function hidePopup() {
  document.getElementById('customPopup').style.display = 'none';
}

function createAccount() {
  // Collect values from the form fields
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  console.log('Form Data:', firstName, lastName, email, phone, password, confirmPassword); // Debugging line

  if (!validatePhoneNumber(phone)) {
      alert('Please enter a valid Pakistani phone number starting with 03 and 11 digits in total.');
      return;
  }

  if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
  }

  var username = generateUsername(firstName, lastName);
  var existingUsernames = JSON.parse(localStorage.getItem('usernames')) || [];

  if (existingUsernames.includes(username)) {
      username = generateUniqueUsername(username, existingUsernames);
  }

  saveUserData(username, email, phone, password);
  existingUsernames.push(username);
  localStorage.setItem('usernames', JSON.stringify(existingUsernames));

  alert('Account Created Successfully! Your username is: ' + username);
  redirectToLogin();
}

function saveUserData(username, email, phone, password) {
  var userData = {
    username: username,
    email: email,
    phone: phone,
    password: password
  };
  localStorage.setItem(username, JSON.stringify(userData));
}

function generateUsername(firstName, lastName) {
  // Combine first name and last name without spaces to create a username
  var username = (firstName + lastName).replace(/\s/g, '');
  return username;
}

function generateUniqueUsername(username, existingUsernames) {
  var uniqueUsername = username;
  var count = 1;

  // Keep adding random numbers until a unique username is found
  while (existingUsernames.includes(uniqueUsername)) {
    uniqueUsername = username + randomInt(1000); // Append a random number
    count++;
    if (count > 1000) {
      // Avoid infinite loop
      break;
    }
  }

  return uniqueUsername;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function saveUserData(username, email, phone, password) {
  var userData = {
    username: username,
    email: email,
    phone: phone,
    password: password
  };
  localStorage.setItem(username, JSON.stringify(userData));
}

  // Update the list of existing usernames
  existingUsernames.push(username);
  localStorage.setItem('usernames', JSON.stringify(existingUsernames));
  x
function validatePhoneNumber(phone) {
  var phoneRegex = /^03\d{9}$/;
  return phoneRegex.test(phone);
}

// Update the showPopupMessage function to display the pop-up message at the top
function showPopupMessage(message) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.style.display = 'block';

  // Hide the pop-up message after a few seconds (adjust as needed)
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000); // 3 seconds (adjust the duration as needed)
}


function redirectToLogin() {
  window.location.href = 'login.html';
}
