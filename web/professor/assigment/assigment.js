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

    
     // Αναζήτηση και συμπλήρωση με βάση τον αριθμό μητρώου
    $(document).ready(function () {
        $('#student_id').on('input', function () {
            const query = $(this).val();
    
            if (query.length >= 2) {
                $.ajax({
                    url: 'assigment_data.php',
                    type: 'GET',
                    data: { search: query, type: 'id' },
                    success: function (response) {
                        const students = JSON.parse(response);
                        const $suggestions = $('#suggestions');
                        $suggestions.empty();
    
                        students.forEach(student => {
                            const fullName = `${student.name} ${student.surname}`;
                            $suggestions.append(
                                `<li class="suggestion-item" data-id="${student.id}" data-name="${fullName}">
                                    ${student.id}
                                 </li>`
                            );
                        });
    
                        $suggestions.show();
                    },
                    error: function (xhr, status, error) {
                        console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
                    }
                });
            } else {
                $('#suggestions').empty().hide();
            }
        });
    
        // Αναζήτηση και συμπλήρωση με βάση το όνομα
        $('#student_name').on('input', function () {
            const query = $(this).val();
    
            if (query.length >= 1) {
                $.ajax({
                    url: 'assigment_data.php',
                    type: 'GET',
                    data: { search: query, type: 'name' },
                    success: function (response) {
                        const students = JSON.parse(response);
                        const $suggestions = $('#nameSuggestions');
                        $suggestions.empty();
    
                        students.forEach(student => {
                            const fullName = `${student.name} ${student.surname}`;
                            $suggestions.append(
                                `<li class="suggestion-item" data-id="${student.id}" data-name="${fullName}">
                                    ${fullName}
                                 </li>`
                            );
                        });
    
                        $suggestions.show();
                    },
                    error: function (xhr, status, error) {
                        console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
                    }
                });
            } else {
                $('#nameSuggestions').empty().hide();
            }
        });
    
        // Αναζήτηση και συμπλήρωση με βάση τον τίτλο
$('#diploma_title').on('input', function () {
    const query = $(this).val();

    if (query.length >= 1) {
        $.ajax({
            url: 'assigment_data.php',
            type: 'GET',
            data: { search: query, type: 'title' },
            success: function (response) {
                console.log('Response:', response); 
                try {
                    const titles = JSON.parse(response);
                    const $suggestions = $('#titleSuggestions');
                    $suggestions.empty();

                    titles.forEach(student => {
                        $suggestions.append(
                            `<li class="suggestion-item" data-themata_a_id="${student.themata_a_id}" data-title="${student.title}">
                                ${student.title}
                             </li>`
                        );
                    });

                    $suggestions.show();
                } catch (e) {
                    console.error('Η απάντηση δεν είναι έγκυρο JSON:', response);
                }
            },
            error: function (xhr, status, error) {
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    } else {
        $('#titleSuggestions').empty().hide();
    }
});

    
        // Αυτόματη συμπλήρωση 
        $(document).on('click', '.suggestion-item', function () {
            const selectedId = $(this).data('id');
            const selectedName = $(this).data('name');
            const selectedTitle = $(this).data('title');
            const selectedThemataAId = $(this).data('themata_a_id'); 
        
            console.log('Selected Themata A ID:', selectedThemataAId); 
        
            
            if (selectedId) $('#student_id').val(selectedId);
            if (selectedName) $('#student_name').val(selectedName);
            if (selectedTitle) $('#diploma_title').val(selectedTitle);
            if (selectedThemataAId) $('#themata_a_id').val(selectedThemataAId);
        
            
            $('#suggestions').empty().hide();
            $('#nameSuggestions').empty().hide();
            $('#titleSuggestions').empty().hide();
        });
    });
    
    //Εισαγώγη δεδομένων
    $('#submitBtn').on('click', function () {
        const studentId = $('#student_id').val();
        const themataAId = $('#themata_a_id').val();
 
    
        console.log('Student ID:', studentId); 
        console.log('Themata A ID:', themataAId); 
    
        if (!studentId || !themataAId) {
            alert('Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.');
            return;
        }
    
        
        $.ajax({
            url: 'assigment_data.php',
            type: 'POST',
            data: {
                student_id: studentId,
                themata_a_id: themataAId,
                diploma_title: $('#diploma_title').val() 
            },
            success: function (response) {
                console.log('Response:', response); 
                const result = JSON.parse(response);
                if (result.success) {
                    alert(result.message);
                    $('#student_id').val('');
                    $('#diploma_title').val('');
                    window.location.href = '../de_projection/de_projection.html';
                } else {
                    alert(result.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Σφάλμα κατά την αποθήκευση:', error);
            }
        });
        
    });
    
    
    
    
    