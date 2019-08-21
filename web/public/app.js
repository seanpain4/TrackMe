$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const API_URL = 'http://localhost:5000/api';
const currentUser = localStorage.getItem('name');

if (currentUser) {
  $.get(`${API_URL}/users/${currentUser}/devices`)
  .then(response => {
    response.forEach((device) => {
      $('#devices tbody').append(`
        <tr data-device-id=${device._id}>
          <td>${device.user}</td>
          <td>${device.name}</td>
        </tr>`
      );
    });
    $('#devices tbody tr').on('click', (e) => {
      const deviceId = e.currentTarget.getAttribute('data-device-id');
      $.get(`${API_URL}/devices/${deviceId}/device-history`)
      .then(response => {
        response.map(sensorData => {
          $('#historyContent').append(`
            <tr>
              <td>${sensorData.ts}</td>
              <td>${sensorData.temp}</td>
              <td>${sensorData.loc.lat}</td>
              <td>${sensorData.loc.lon}</td>
            </tr>
          `);
        });
        $('#historyModal').modal('show');
      });
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
} else {
  const path = window.location.pathname;
  if (path !== '/login') {
    location.href = '/login';
  }
}

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
  if (password1 != password2) {
    $('#alert').append(`<p class="alert alert-danger">Passwords do not match!</p>`);
  } else {
    $.post(`${API_URL}/registration`, { "name": username_in, "password": password1 })
    .then((response) => {
      if (response.success) {
        location.href = '/login';
      } else {
        $('#alert').append(`<p class="alert alert-danger">${response}</p>`); 
      }
    });
  }
});

$('#login').on('click', () => {
  const user = $('#username').val();
  const password = $('#password1').val();
  $.post(`${API_URL}/authenticate`, { "name": user, "password": password })
  .then((response) =>{
    if (response.success) {
      localStorage.setItem('name', user);
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
  localStorage.removeItem('name');
  localStorage.removeItem('isAdmin');
  window.location.href = '/login';
}