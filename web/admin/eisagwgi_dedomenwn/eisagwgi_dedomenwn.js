const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση / Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
    userButton.addEventListener('click', () => {
        // Αν το μενού είναι ήδη ορατό, το κρύβουμε
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; // Εμφανίζουμε το μενού
        }
    });

    // Κλείσιμο του μενού αν κάνεις κλικ κάπου αλλού στην σελίδα
    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; // Απόκρυψη του μενού
        }
    });

    // Submit αρχείου
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();  // Αποτροπή ριφρες σελιδας

        let fileInput = document.getElementById('jsonFile');
        let file = fileInput.files[0];

        if (file && file.type === 'application/json') {
            let formData = new FormData();
            formData.append('jsonFile', file);

            // Αποστολή του JSON αρχείου στο PHP αρχείο μέσω fetch API
            fetch('eisagwgi_dedomenwn.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())  // Διαβάζουμε την απάντηση ως ΚΕΙΜΕΝΟ
        .then(text => {
            console.log('Απάντηση από τον server:', text);
            alert(text);  // Δείχνουμε την απάντηση στον χρήστη
        })
        .catch((error) => {
            console.error('Σφάλμα:', error);
            alert("Παρουσιάστηκε σφάλμα κατά την αποστολή.");
        });
    } else {
        alert('Παρακαλώ επιλέξτε ένα αρχείο JSON.');
    }
    });
