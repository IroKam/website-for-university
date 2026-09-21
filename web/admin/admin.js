const userButton = document.querySelector('.user-button');
const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση/Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
    userButton.addEventListener('click', () => {
        // Αν το μενού είναι ήδη ορατό το κρύβουμε
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

 // Φόρτωση ανακοινώσεων
$(document).ready(function () {
    var $announceInfo = $('#announcements-container');

    $.ajax({
        url: 'get_announcements.php',
        type: 'GET',
        success: function (response) {
            var announcements = JSON.parse(response);

            if (announcements.length === 0) {
                $announceInfo.append('<li>Δεν υπάρχουν διαθέσιμες ανακοινώσεις.</li>');
            } else {
                announcements.forEach(function (item) {
                    var announcementElement = `
                        <li>
                            <p>${item.announce}</p>
                        </li>`;
                    $announceInfo.append(announcementElement);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα κατά τη φόρτωση ανακοινώσεων:', error);
        }
    });
});



