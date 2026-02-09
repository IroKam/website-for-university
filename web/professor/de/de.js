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


    //Η Διπλώματική
    $(document).ready(function () {
        
        var storedData = sessionStorage.getItem('InfoData');
        console.log('Loaded from sessionStorage:', storedData);
    
        if (storedData) {
            
            var parsedData = JSON.parse(storedData);
    
            
            $.ajax({
                url: 'de_data.php', 
                method: 'POST', 
                data: { id: parsedData.id }, 
                success: function (response) {
                    if (typeof response === 'string') {
                        try {
                            response = JSON.parse(response);
                        } catch (e) {
                            console.error('Failed to parse JSON:', e.message);
                            return;
                        }
                    }
                
                    console.log('Response from server:', response);
                    console.log('Τύπος:', typeof response);
                    console.log('Αντικείμενο:', response[0]);
                
                    // Εμφάνιση δεδομένων στη σελίδα
                    var $infoContainer = $('#info');
                    $.each(response, function (i, de) {
                        $infoContainer.append(
                        '<li><h3>' + de.title + '</h3>'
                    + '<p>Όνοματεπώνυμο Φοιτητή: ' + de.name + ' ' + de.surname + ' ΑΜ: '+ de.student_id + '</p>'
                    + '<p>Status: ' + de.status + '</p>'
                    + '<p>Ημερομηνία Έναρξης: ' + de.start_date + '</p>'
                    + '<p>Ημερομηνία Λήξης: ' + (de.end_date || '-') + '</p>'
                    + '<p>Ημερομηνία Έναρξης Ενεργής Κατάστασης: ' + (de.date_en || '-') + '</p>'
                    + '<p>Ημερομηνία Έναρξης Υπό Εξέτασης: ' + (de.date_yexams || '-') + '</p>'
                    + '<p><strong>Τελικός Βαθμός:</strong> ' + (de.grade !== null ? de.grade : '—') + '</p></li>'
                    );


                        //Καθηγητές
                        $infoContainer.append(
                            '<li><h4>Τριμελής Επιτροπή</h4>' +
                            de.professors.map(function(prof) {
                              let line = prof.name + ' ' + prof.surname + ' (' + prof.role;
                          
                              if (prof.grade) {
                                line += ', Βαθμός: ' + prof.grade;
                          
                                if (prof.create_date) {
                                  const date = new Date(prof.create_date);
                                  const formatted = date.toLocaleDateString('el-GR');
                                  line += ' στις ' + formatted;
                                }
                              }
                          
                              line += ')';
                              return '<p>' + line + '</p>';
                            }).join('') +
                            '</li>'
                          );
                    });
                },
                
                error: function (xhr, status, error) {
    console.error('Σφάλμα από το server:', error);
    console.log('Raw response:', xhr.responseText);
}

            });
        } else {
            console.warn('No data found in sessionStorage.');
        }
    });
    