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
               }); //Εμφανίζει το όνομα και το επώνυμο φοιτητή ανάλογα τα στοιχεία που κάναμε login στο header
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            } //Βγάζει το μήνυμα όταν δεν έχει γίνει σωστό login
        });
    });

    $(document).ready(function(){

        var $userInfo = $('#profil-name') 
    
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

    $(document).ready(function(){

        var $profilInfo = $('#info') 
    
        $.ajax({
            url: 'profil_data.php',
            type: 'GET',
            success: function(response) {
                var students = JSON.parse(response);
                $.each(students, function(i, student){
                $profilInfo.append('<li> <p> <strong>Ονοματεπώνυμο:</strong> ' +student.name + ' ' + student.surname +'</p>'
                    +'<p> <strong>ΑΜ:</strong> ' + student.student_id+ '</p>'
                    +'<p id="email" data-email="' +student.email+'"> <strong>Email:</strong> '+student.email + '</p>'
                    +'<p><strong>Όνομα Πατρός:</strong> ' + student.father_name + '</p>'
                    +'<p> <strong>Έτος εισαγωγής:</strong> '+ student.etos_eisag + '</p>'
                    +'<p id="phone" data-phone="' +student.phone+'" data-phone-home='+student.home_phone+'"> <strong>Τηλέφωνο Επικονώνιας:</strong> ' + student.phone + ', '+ student.home_phone+ '</p>'
                    +'<p> <strong>Διεύθυνση κατοικίας:</strong> ' + student.adress +  ' '+ student.city+ ' '+ student.tk+ '</p>'
                    +'</br> <button class="button-all" id="edit" data-val='+ student.student_id+'"><strong>Επεξεργασία πληροφορίων επικοινωνίας</strong></button></li>');
               });
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });

$(document).on('click', '#edit', function() {
    var id = $(this).data('data-val');
    var email = $(this).data('data-email');
    var phone = $(this).data('data-phone');
    var homePhone = $(this).data('data-phone-home'); //Εμφανίζονται τα στοιχεία και μπορούμε να τα επεξεργαστούμε με κλικ στο κουμπί

    sessionStorage.setItem('editData', JSON.stringify({
        id: id,
        email: email,
        phone: phone,
        homePhone: homePhone
    })); //Τα στοιχεια αποθηκεύονται στο sessionStorage

    
    console.log('Stored Data:', sessionStorage.getItem('editData'));

    
    window.location.href = `profil_edit.html`;
});