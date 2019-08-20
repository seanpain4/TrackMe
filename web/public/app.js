$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const API_URL = 'http://localhost:5000/api';
const users = JSON.parse(localStorage.getItem('users')) || [];

$.get(`${API_URL}/devices`)
.then(response => {
  response.forEach(device => {
    $('#devices tbody').append(`
      <tr>
        <td>${device.user}</td>
        <td>${device.name}</td>
      </tr>`
    );
  });
})
.catch(error => {
  console.error(`Error: ${error}`);
});

$('#add-device').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];
  
  const body = {
    name,
    user,
    sensorData
  };

  $.post(`${API_URL}/devices`, body)
  .then(response => {
    location.href = '/';
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
});

$('#register').on('click', function() {
  const username_in = $('#username').val();
  const password1 = $('#password1').val();
  const password2 = $('#password2').val();
  const exists = users.find(users => users.username === username_in);
  if (exists == undefined) {
    if (password1 == password2) {
      users.push({ username: username_in, password: password1 });
      localStorage.setItem('users', JSON.stringify(users));
      window.location.href = '/login';
    } else {
      $('#alert').append(`
      <div class="alert alert-danger">
        Passwords do not match! Try again.
      </div>
    `);
    }
  } else {
    $('#alert').append(`
      <div class="alert alert-danger">
        Users already exists! Please login.
      </div>
    `);
  }
});

$('#login').on('click', () => {
  const user = $('#username').val();
  const password = $('#password1').val();
  $.post(`${API_URL}/authenticate`, { user, password })
  .then((response) =>{
    if (response.success) {
      localStorage.setItem('user', user);
      localStorage.setItem('isAdmin', response.isAdmin);
      location.href = '/';
    } else {
      $('#alert').append(`<p class="alert alert-danger">${response}</p>`);
    }
  });
});

$('#send-command').on('click', function() {
  const command = $('#command').val();
  console.log(`command is: ${command}`);
});

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/login';
}