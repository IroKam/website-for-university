const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση - Απόκρυψη του μενού 
    userButton.addEventListener('click', () => {
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
        }
    });

    // Κλείσιμο του μενού 
    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; // Απόκρυψη του μενού
        }
    });

    $(document).ready(function(){

        var $userInfo = $('#user-info'); 
    
        $.ajax({
            url: 'profil_data.php',
            type: 'GET',
            success: function(response) {
                var professors = JSON.parse(response);
               $.each(professors, function(i, professor){
                $userInfo.append('<a>' +professor.name + ' ' + professor.surname + '</a>');
               });
            },
            error: function(xhr, status, error) {
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });

    $(document).ready(function(){

        var $profilName = $('#profil-name') 
    
        $.ajax({
            url: 'profil_data.php',
            type: 'GET',
            success: function(response) {
                var professors = JSON.parse(response);
               $.each(professors, function(i, professor){
                $profilName.append('<a>' +professor.name + ' ' + professor.surname + '</a>');
               });
            },
            error: function(xhr, status, error) {
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });

    $(document).ready(function(){

        var $profilInfo = $('#info') 
    
        $.ajax({
            url: 'profil_data.php',
            type: 'GET',
            success: function(response) {
                var professors = JSON.parse(response);
               $.each(professors, function(i, professor){
                $profilInfo.append('<li> <strong>Ονοματεπώνυμο:</strong> ' +professor.name + ' ' + professor.surname + '</br> <strong>Email:</strong> '
                    +professor.email + '</br> <strong>Τμήμα:</strong> ' + professor.department + '</br> <strong>Τηλέφωνο Επικοινωνίας:</strong> '+ professor.office_contact + 
                     '</li>');
               });
            },
            error: function(xhr, status, error) {
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });