const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    userButton.addEventListener('click', () => {
       
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
        }
    });  //Εμφανίζει με το κλικ το μενού χρήατη οταν πατάμε στο εικονίδιο λογαριασμού πανω δεξια

    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; 
        }
    });  //Κλείνει με το κλικ οπουδήποτε το μενού χρήστη

    $(document).ready(function(){

        var $userInfo = $('#user-info'); 
    
        $.ajax({
            url: 'profil_data.php',
            type: 'GET',
            success: function(response) {
                var students = JSON.parse(response);
               $.each(students, function(i, student){
                $userInfo.append('<a>' +student.name + ' ' + student.surname + '</a>');
               }); //Εμφανίζει το όνομα και το επώνυμο φοιτητή ανάλογα τα στοιχεία που κάναμε login
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            } //Βγάζει το μήνυμα όταν δεν έχει γίνει σωστό login
        });
    });  

$(document).ready(function () {
    var $announceInfo = $('#announcements-container');

    $.ajax({
        url: 'announce.php',
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
                });  //Φορτώνει τις ανακοινώσεις που αφορούν το id που έχει συνδεθεί
            }
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα κατά τη φόρτωση ανακοινώσεων:', error);
        }  //Εάν δεν έχει γίνει σύνδεση τότε εμφανίζει σε εκείνο το πλαίσιο το μήνυμα αυτό
    });
});