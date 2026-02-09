const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    userButton.addEventListener('click', () => {
        
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
        }
    }); //Εμφανίζει με το κλικ το μενού χρήατη οταν πατάμε στο εικονίδιο λογαριασμού πανω δεξια

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
           }); //Εμφανίζει το όνομα και το επώνυμο φοιτητή ανάλογα τα στοιχεία που κάναμε login στο header
        },
        error: function(xhr, status, error) {
            
            console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
        } //Βγάζει το μήνυμα όταν δεν έχει γίνει σωστό login
    });
});


    $(document).ready(function() {
        const editData = JSON.parse(sessionStorage.getItem('editData'));
    
        
        if (editData) {
            console.log("Δεδομένα προς εμφάνιση:", editData);
    
            
            $('#email').val(editData.email); 
            $('#phone').val(editData.phone); 
            $('#phone-home').val(editData.phone_home); 
            $('#adress').val(editData.adress); 
            $('#city').val(editData.city); 
            $('#tk').val(editData.tk); 
        }
    });  //Εμφανίζει τα παραπάνω στοιχεία

    $(document).ready(function () {
    $('#submitBtn').on('click', function (event) {
        event.preventDefault();  //Με το κλικ ο φοιτητής ανεβάζει θέμα

        const editData = JSON.parse(sessionStorage.getItem('editData'));
        const email = $('#email').val();
        const phone = $('#phone').val();
        const phone_home = $('#phone-home').val();
        const id = editData.id;
        const adress = $('#adress').val();
        const city = $('#city').val();
        const tk = $('#tk').val();

        var formData = new FormData();
        formData.append('id', id); 
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('phone_home', phone_home);
        formData.append('adress', adress);
        formData.append('city', city);
        formData.append('tk', tk);

        $.ajax({
            url: 'profil_edit_data.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
            console.log("Απάντηση από PHP:", response);
            if (response.includes("Επιτυχής")) {
                window.location.href = 'profil.html';
            } else {
                alert(response);
            }
        },
            error: function (xhr, status, error) {
                console.error('Σφάλμα AJAX:', error);
                console.log(xhr.responseText);
                alert('Η εισαγωγή απέτυχε.');
            }
        });
    });
});
    