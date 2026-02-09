const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    userButton.addEventListener('click', () => {
        
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
        }
    });  //Με το κλικ στο εικονίδιο λογαριασμού ανοιγεί το μενού χρήστη

    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; 
        }
    });  //Κλικ οπουδήποτε και κλείνει

   $(document).ready(function(){

    var $userInfo = $('#user-info'); //Υπεύθυνο για το όνομα φοιτητή στο header

    $.ajax({
        url: '../profil_data.php',
        type: 'GET',
        success: function (response) {
            const students = JSON.parse(response);
            $.each(students, function (i, student) {
                $userInfo.append('<a>' + student.name + ' ' + student.surname + '</a>');
            });  //Εμφανίζει το όνομα του φοιτητή αναλογα τα στοιχεία σύνδεσης
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα φόρτωσης ονόματος:', error);
        }
    });  //error φόρτωσης
});

$(document).ready(function () {
    const $userInfo = $('#user-info');
    const $infoList = $('#diplomaInfo');

    $.ajax({
        url: 'de_projection_data_student.php',
        type: 'GET',
        success: function (response) {
            const data = JSON.parse(response);

            if (data.length === 0) {
                $infoList.append('<li>Δεν έχει ανατεθεί διπλωματική εργασία.</li>');
                return;
            }

            const thesis = data[0];
            const startDate = thesis.start_date ? new Date(thesis.start_date) : null;
            const today = new Date();
            const daysPassed = startDate ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) : '—';
            const filePath = '../../professor/themata_create/uploads/' + thesis.filename;

            let committeeHTML = 'Δεν έχουν οριστεί ακόμη μέλη τριμελούς.';
            if (thesis.committee && thesis.committee.length > 0) {
                committeeHTML = '<ul>' + thesis.committee.map(m =>
                    `<li>${m.name} ${m.surname} (${m.role})</li>`).join('') + '</ul>';
            }

            $infoList.append('<li>'
                + '<h3>' + thesis.title + '</h3>'
                + '<p><strong>Περιγραφή:</strong> ' + thesis.description + '</p>'
               + '<p><strong>Συνημμένο αρχείο:</strong> <a href="' + filePath + '" target="_blank">' + thesis.filename + '</a></p>'
                + '<p><strong>Κατάσταση:</strong> ' + thesis.status + '</p>'
                + '<p><strong>Ημέρες από την ανάθεση:</strong> ' + daysPassed + '</p>'
                + '<p><strong>Τριμελής Επιτροπή:</strong> ' + committeeHTML + '</p>'
                + '</li>');
        }, //Ανακτηση δεδομένων διπλωματικής
        error: function (xhr, status, error) {
            console.error('Σφάλμα φόρτωσης διπλωματικής:', error);
        }
    }); //Error στην ανάκτηση διπλωματικής
});
