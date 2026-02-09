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

     //Τα θέματα

     $(document).ready(function(){

        var $profilInfo = $('#themata') 
    
        $.ajax({
            url: 'themata_projection_data.php',
            type: 'GET',
            success: function(response) {
                var themata = JSON.parse(response);
               $.each(themata, function(i, themata){
                $profilInfo.append('<li><h3 id="title" data-val='+ themata.title+'">' +themata.title + '</h3> <h4>Περιγραφή:</h4><a id="description" data-val='+ themata.description+'">' 
                    + themata.description + '</a></br></br> <a><strong>Αρχείο:</strong> </a><a href="http://localhost/web/professor/themata_create/uploads/' +themata.pdf_file+'" target="blank" data-val='+ themata.pdf_file+'"> '
                    + themata.pdf_file + '</a>          <button class="button-all" id="edit" data-val='+ themata.themata_a_id+'">Επεξεργασία</button>               <button class="button-all" id="delete" data-val='+ themata.themata_a_id+'">Διαγραφή</button></li>');
               });
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });


        // Κουμπί διαγραφής
        $(document).on('click', '#delete', function(){
            var id = $(this).attr('data-val');
            var action ='deleteRecord';
            $.ajax({
                url: "themata_projection_data.php",
                type: "POST",
                data: {action:action, id:id},
                success:function(data){
                       alert(data);
                       if (data.includes("επιτυχία")) { 
                        location.reload(); 
                    }
                    }
            })

        });

        // Κουμπί επεξεργασίας
        $(document).on('click', '#edit', function() {
            var id = $(this).attr('data-val'); 
            var title = $(this).closest('li').find('#title').text().trim(); 
            var description = $(this).closest('li').find('#description').text().trim(); 
            var pdfFile = $(this).closest('li').find('a[href*="uploads"]').text().trim(); 
        
            // Αποθήκευση όλων των δεδομένων στο sessionStorage
            sessionStorage.setItem('editData', JSON.stringify({
                id: id,
                title: title,
                description: description,
                pdfFile: pdfFile
            }));
        
            
            console.log('Stored Data:', sessionStorage.getItem('editData'));
        
            
            window.location.href = `../themata_edit/themata_edit.html`;
        });
        