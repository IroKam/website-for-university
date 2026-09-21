const userButton = document.querySelector('.user-button');
const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση-Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
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

//Τα θέματα
$(document).ready(function() {
    
    // Ανάκτηση δεδομένων κατά την αρχική φόρτωση
    var diplomaData = [];

    $.ajax({
        url: 'provoli_diplomatikis_1.php',
        type: 'GET',
        success: function(response) {
            diplomaData = JSON.parse(response); // μετατροπή
            renderData(diplomaData); //εμφανιζει δεδομενα
        },
        error: function(xhr, status, error) {
            console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
        }
    });

    function renderData(data) {
        var $profilInfo = $('#themata');
        data.forEach(themata => {
            $profilInfo.append('<li data-val="' + themata.themata_a_id + '"><h3>' + themata.title + '</h3></li>');
        });
    }
});

// Κουμπί πληροφορίων
$(document).on('click', '#themata li', function() {
    var id = $(this).data('val'); // Παίρνω το ID

    // Αποθήκευση όλων των δεδομένων στο sessionStorage
    sessionStorage.setItem('InfoData', JSON.stringify({
        id: id
    }));

    // Εκτυπωσε την αποθηκευμένη τιμή στο console για έλεγχο 
    console.log('Stored Data:', sessionStorage.getItem('InfoData'));

    // Ανακατεύθυνση στην επόμενη σελίδα 
    window.location.href = '../provoli_diplomatikis_2/provoli_diplomatikis_2.html';
});