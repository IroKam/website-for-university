const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση - Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
    userButton.addEventListener('click', () => {
        // Αν το μενού είναι ήδη ορατό, το κρύβουμε
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
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

    //Ανέβασμα Θεμάτων
    $(document).ready(function () {
        $('#submitBtn').on('click',function () {
            event.preventDefault(); 
    
            //FormData
        var formData = new FormData();
        formData.append('title', $('#title').val());
        formData.append('description', $('#description').val());
        formData.append('file', $('#file')[0].files[0]);

            $.ajax({
                url: 'themata_create_data.php', 
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response); 
                    window.location.href = '../themata_projection/themata_projection.html';
                },
                error: function (xhr, status, error) {
                    console.error('Σφάλμα:', error);
                    alert('Η εισαγωγή απέτυχε.');
                }
            });
        });
    });