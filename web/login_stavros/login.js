const Login = document.querySelector('.Login');
const Loginlink = document.querySelector('.Login .form .formelement button');
const Popup = document.querySelector('.ButtonLogin');
const CloseWindow = document.querySelector('.closeLogin');
const Office = document.querySelector('.menu .office');
const Info = document.querySelector('.menu .info');

Popup.addEventListener('click', ()=> {
    Login.classList.add('popup');
});
CloseWindow.addEventListener('click', ()=> {
    Login.classList.remove('popup');
});
Office.addEventListener('mouseover', ()=> {
    Info.classList.add('list');
});
Office.addEventListener('mouseout', ()=> {
    Info.classList.remove('list');
});

// αποστολή στοιχείων συνδεσης στο php
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Αποτρέπει το refresh της σελιδας
        console.log("Form submitted!"); 
        const formData = new FormData(form);  // Παίρνει τα δεδομένα της φόρμας

        fetch('login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Ανάλογα με το ρόλο γίνεται ανακατεύθυνση
                switch (data.role) {
                    case 'student':
                        window.location.href = '../student/student_arxiki.html';
                        break;
                    case 'teacher':
                        window.location.href = '../professor/professor_arxiki.html';
                        break;
                    case 'admin':
                        window.location.href = '../admin/admin_arxiki.html';
                        break;
                    default:
                        alert('Unknown role. Please contact support.');
                }
            } else {
                // Εμφάνιση μηνύματος σφάλματος
                showError(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Something went wrong. Please try again.');
        });
    });

    // Συνάρτηση για εμφάνιση μηνύματος σφάλματος
    function showError(message) {
        let errorDiv = document.querySelector('.error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('p');
            errorDiv.classList.add('error');
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        errorDiv.textContent = message;
    }
});