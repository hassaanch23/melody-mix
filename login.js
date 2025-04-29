document.getElementById('loginForm').addEventListener('submit', function(event){
  event.preventDefault(); // Prevent the form from submitting the traditional way
  login();
});

function addMockUserData() {
  var users = [
    { username: 'hassaan', password: '123' },
    { username: 'samar',  password: '123' },
    { username: 'noman',  password: '123' },
    { username: 'ahmed',  password: '123' },
    { username: 'zohaib',  password: '123' },
  ];

  users.forEach(user => {
    localStorage.setItem(user.username, JSON.stringify(user));
    localStorage.setItem(user.email, JSON.stringify(user));
  });
}

// Call this function to add the mock data to local storage
addMockUserData();

function login() {
  var usernameOrEmail = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  var userDataByUsername = JSON.parse(localStorage.getItem(usernameOrEmail));
  
  if (userDataByUsername && userDataByUsername.password === password) {
    // Set just the username in localStorage
    localStorage.setItem('currentUsername', userDataByUsername.username);
    showPopupMessage('Login Successfully', true); // true for success
    setTimeout(() => {
      window.location.href = 'homepage.html';
    }, 1000);
  } else {
    showPopupMessage('Incorrect username or password', false); // false for failure
  }
}


function showPopupMessage(message, isSuccess) {
  const popup = document.getElementById('popup');
  popup.textContent = message;

  // Set the color based on success or failure
  if (isSuccess) 
  {
    popup.style.paddingLeft = '50px'; // Padding left
    popup.style.paddingTop = '10px'; // Padding top
    popup.style.paddingBottom = '10px'; // Padding bottom
    popup.style.paddingRight = '50px'; // Padding right
    popup.style.color = 'black'
    popup.style.backgroundColor = 'lightgreen'; // Green for success
  } else {
    popup.style.color = 'black'
    popup.style.backgroundColor = 'red'; // Keep red for failure or use another color
  }

  popup.style.display = 'block';
  popup.style.top = '0';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000); 
}



function redirectToSignUp() {
  window.location.href = 'signup.html'; 
}
