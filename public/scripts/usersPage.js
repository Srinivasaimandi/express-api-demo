// Fetch and render users after login
    async function fetchUsers() {
      const token = localStorage.getItem('x-api-token');
      const errorMsg = document.getElementById('error-msg');
      const table = document.getElementById('users-table');
      if (!token) {
        errorMsg.textContent = "You must login first.";
        errorMsg.style.display = "block";
        return;
      }
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            'x-api-key': token
          }
        });
        if (response.status === 401 || response.status === 403) {
          errorMsg.textContent = "Unauthorized. Please login again.";
          errorMsg.style.display = "block";
          localStorage.removeItem('x-api-token');
          return;
        }
        if (response.status === 204) {
          errorMsg.textContent = "No users found.";
          errorMsg.style.display = "block";
          return;
        }
        const users = await response.json();
        if (Array.isArray(users) && users.length > 0) {
          allUsers = users;
          renderUsers(allUsers);
          table.style.display = "";
        } else {
          errorMsg.textContent = "No users found.";
          errorMsg.style.display = "block";
        }
      } catch (err) {
        errorMsg.textContent = "Failed to fetch users.";
        errorMsg.style.display = "block";
      }
    }

    function renderUsers(users) {
      const tbody = document.querySelector('#users-table tbody');
      tbody.innerHTML = "";
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.username}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Filter function
    function filterUsers(query) {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      renderUsers(filtered);
    }

    // Search listener
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('search-input');
      searchInput.addEventListener('input', (e) => {
        filterUsers(e.target.value);
      });
    });

    // Logout link clears token
    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('x-api-token');
      window.location.href = "index.html";
    });

    document.getElementById('refresh-btn').addEventListener('click', function () {
      fetchUsers();
    });

    // On page load
    fetchUsers();