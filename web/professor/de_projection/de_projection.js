const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση - Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
    userButton.addEventListener('click', () => {
        
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; // Εμφανίζουμε το μενού
        }
    });

    // Κλείσιμο του μενού 
    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; 
        }
    });

    //Όνομα χρήστη στο header
    $(document).ready(function(){

        var $userInfo = $('#user-info'); 
    
        $.ajax({
            url: '../profil_data.php',
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

     //Οι διπλωματικές

     $(document).ready(function() {
    
        var diplomaData = [];
    
        $.ajax({
            url: 'de_projection_data.php',
            type: 'GET',
            success: function(response) {
                diplomaData = JSON.parse(response);
                renderData(diplomaData);
            },
            error: function(xhr, status, error) {
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    
        // Εξαγωγή JSON
        $('#exportfile').click(function() {
            exportJson(diplomaData);
        });
    
        function exportJson(data) {
            const jsonData = JSON.stringify(data, null, 2);
            downloadFile(jsonData, 'diplomatikes.json', 'application/json');
        }
    
        
        function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    
        $('#statusFilter, #roleFilter').change(function () {
            const selectedStatus = $('#statusFilter').val();
            const selectedRole = $('#roleFilter').val();
        
            $.ajax({
                url: 'de_projection_data.php',
                type: 'GET',
                data: { 
                    status: selectedStatus,
                    role: selectedRole 
                },
                success: function(response) {
                    const filteredData = JSON.parse(response);
                    $('#themata').empty();
                    renderData(filteredData);
                },
                error: function(xhr, status, error) {
                    console.error('Σφάλμα κατά το φιλτράρισμα:', error);
                }
            });
        });
        
        

        function renderData(data) {
    var $profilInfo = $('#themata');
    data.forEach(item => {
        $profilInfo.append('<li><h3>' + item.title + '</h3>'
        + '<p><strong>Όνοματεπώνυμο Φοιτητή:</strong> ' + item.student_name + ' ' + item.student_surname + '</p>'
        + '<p><strong> ΑΜ:</strong> '+ item.student_id + '</p>' 
        + '<p><strong>Status:</strong> ' + item.status + '</p>'
        + '<p><strong>Ημερομηνία Έναρξης:</strong> ' + item.start_date + '</p>'
        + '<p><strong>Ημερομηνία Λήξης:</strong> ' + (item.end_date || ' ') + '</p>'
        + '<p><strong>Ημερομηνία Έναρξης Ενεργής Κατάστασης:</strong> ' + (item.date_en || ' ') + '</p>'
        + '<p><strong>Ημερομηνία Έναρξης Υπό Εξέταση:</strong> ' + (item.date_yexams || ' ') + '</p>'
        + '<p><strong>Βαθμός:</strong> ' + (item.grade || '—') + '</p>'
        + '<p><strong>Ρόλος Καθηγητή:</strong> ' + item.role + '</p>'
        + '<button class="button-all de-button" data-val="' + item.themata_a_id + '"><strong>Δείτε περισσότερες πληροφορίες</strong></button></li>');
    });
}

    });

    $(document).on('click', '.de-button', function() {
    var id = $(this).attr('data-val');
    console.log('ID για αποθήκευση:', id);
    sessionStorage.setItem('InfoData', JSON.stringify({ id: id }));
    console.log('Αποθηκεύτηκε στο sessionStorage:', sessionStorage.getItem('InfoData'));
    window.location.href = `../de/de.html`;
});

    