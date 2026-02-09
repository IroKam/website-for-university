const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    // Εμφάνιση - Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
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

     //Οι προσκλήσεις 

     $(document).ready(function(){

        var $profilInfo = $('#message') 
    
        $.ajax({
            url: 'message_data.php',
            type: 'GET',
            success: function(response) {
                var message = JSON.parse(response);
               $.each(message, function(i, message){
                $profilInfo.append('<li><h3 id="title">' + message.title + '</h3>'
                    + '<p><strong>Όνοματεπώνυμο Φοιτητή:</strong> ' + message.student_name + ' ' + message.student_surname + '</p>'
                    +'<p><strong>ΑΜ:</strong> '+ message.student_id + '</p>'
                    + '<p><strong>Επιβλέπων Καθηγητής:</strong> ' + message.professor_name + ' ' + message.professor_surname + '</p>'
                    + '<p><strong>Ημερομηνία Έναρξης:</strong> ' + message.start_date + '</p>'
                    + '<p><strong>Ημερομηνία Αποστολής:</strong> ' + message.sent_date + '</p>'
                    + '<button class="button-all" id="accept" data-invitation-id="' + message.invitation_id + '" data-themata-b-id="' + message.themata_b_id + '"> Αποδοχή </button>    <button class="button-all" id="rejection" data-val= "'+ message.invitation_id+'"> Απόρριψη </button> </li>');
               });
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });


    //Κουμπί απόρριψης
    $(document).on('click', '#rejection', function(){
        var id = $(this).attr('data-val');
        var action ='rejectionInvitation';
        $.ajax({
            url: "message_data.php",
            type: "POST",
            data: {action:action, id:id},
            success:function(data){
                   alert(data);
                   if (data.includes("Eπιτυχία")) { 
                    location.reload(); 
                }
                }
        })

    });

    //Κουμπί αποδοχής
    $(document).on('click', '#accept', function(){
        var invitation_id = $(this).attr('data-invitation-id');
        var themata_b_id = $(this).attr('data-themata-b-id');
        var action ='acceptInvitation';
        $.ajax({
            url: "message_data.php",
            type: "POST",
            data: {action:action, invitation_id:invitation_id, themata_b_id:themata_b_id },
            success:function(data){
                   alert(data);
                   if (data.includes("Eπιτυχία")) { 
                    location.reload(); 
                }
                }
        })

    });