$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

devices.forEach(function(device) {
  $('#devices tbody').append(`
    <tr>
      <td>${device.user}</td>
      <td>${device.name}</td>
    </tr>`
  );
});

$('#add-device').on('click', function() {
  const user = $('#user').val();
  const name = $('#name').val();
  devices.push({ user: user, name: name });
  localStorage.setItem('devices', JSON.stringify(devices));
  window.location.href = '/';
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

$('#send-command').on('click', function() {
  const command = $('#command').val();
  console.log(`command is: ${command}`);
});