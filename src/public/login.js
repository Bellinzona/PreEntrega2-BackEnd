const loginForm = document.getElementById("loginForm");
const btnRegister = document.getElementById("btnRegister");

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(loginForm);
    const obj = {}
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status == 401) {
            window.location.replace('/register');
        } else if (res.status == 500){
            window.location.replace('/admin');

        }
    });
});

btnRegister.addEventListener('click', () => {
    window.location.replace('/register');
});
