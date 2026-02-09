const userButton = document.querySelector('.user-button');
    const popupMenu = document.querySelector('.popup-menu');

    userButton.addEventListener('click', () => {
        
        if (popupMenu.style.display === 'block') {
            popupMenu.style.display = 'none';
        } else {
            popupMenu.style.display = 'block'; 
        }
    });  //Με το κλικ στο εικονίδιο λογαριασμού ανοίγει το μενού χρήστη

    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
            popupMenu.style.display = 'none'; 
        }
    });   //κλικ οπουδήποτε και κλείνει

   $(document).ready(function(){

    var $userInfo = $('#user-info');  //Υπεύθυνο για το όνομα φοιτητή στο header με βάσει το login

    $.ajax({
        url: '../profil_data.php',
        type: 'GET',
        success: function (response) {
            const students = JSON.parse(response);
            $.each(students, function (i, student) {
                $userInfo.append('<a>' + student.name + ' ' + student.surname + '</a>');
            });  //Το όνομα του φοιτητή με βάσει το login στο Προφιλ
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα φόρτωσης ονόματος:', error);  //Error για λάθος σύνδεση
        }
    });
});

$('#section-ypo-anathesi, #section-energi, #section-exetasi, #section-peratomeni').hide(); //Αποκρύπτει τα συγκεκριμένα πεδία

$.ajax({
    url: 'get_status.php',
    type: 'GET',
    success: function (res) {
        const status = res.status;

        switch (status) {
            case 'Υπό Ανάθεση':
                $('#section-ypo-anathesi').show();
                break;
            case 'Ενεργή':
                $('#section-energi').show();
                break;
            case 'Υπό εξέταση':
                $('#section-exetasi').show();
                break;
            case 'Περατωμένη':
                $('#section-peratomeni').show();
                break;
        }  //Λαμβάνει απο την βάση την πορεία της διπλωματικής
    },
    error: function () {
        console.error('Αποτυχία φόρτωσης status.');
    }
});  //Βγάζει error άμα δεν έχει γίνει σύνδεση

$(document).ready(function () {
    $.ajax({
        url: 'ypo_anathesi.php',
        type: 'GET',
        success: function (data) {
            const response = JSON.parse(data); //Φορτώνει τα δεδομένα

            if (response.diplomas.length === 1) {
                const diploma = response.diplomas[0]; // Αν υπάρχει μόνο μία διπλωματική, χρησιμοποιούμε το ID της απευθείας και αποκρύπτουμε το select
                window.currentDiplomaId = diploma.themata_b_id; // Αποθήκευση του ID της διπλωματικής σε global μεταβλητή
            }

            response.professors.forEach(p => {
                $('#professor-list').append(`
                    <li>
                        ${p.name} ${p.surname} 
                        <button class="invite-button" data-id="${p.professor_id}">Πρόσκληση</button>
                    </li>`);
            }); // Λίστα καθηγητών με κουμπί Πρόσκληση

            response.invitations.forEach(i => {
                $('#sent-invitations').append(`
                    <li>
                        ${i.prof_name} ${i.prof_surname}
                        <p><strong>Κατάσταση:</strong> ${i.status}</p>
                    </li>`);
            }); // Εμφάνιση αποσταλμένων προσκλήσεων (χωρίς ID διπλωματικής)
        },
        error: function (xhr, status, error) {
            console.error("Σφάλμα κατά τη φόρτωση δεδομένων:", error);
        } //Βγάζει error άμα δεν έχει γίνει σύνδεση
    });
});

$(document).on('click', '.invite-button', function () {
    const professor_id = $(this).data('id');
    const themata_b_id = window.currentDiplomaId; //Αποστολή πρόσκλησης

    if (!themata_b_id) {
        alert("Δεν εντοπίστηκε διπλωματική εργασία.");
        return;
    }  //Error σε περιπτωση που δεν υπάρχει θέμα διπλωματικής για τον φοιτητή

    $.ajax({
        url: 'ypo_anathesi.php',
        type: 'POST',
        data: {
            action: 'invite_professor',
            themata_b_id: themata_b_id,
            professor_id: professor_id
        },
        success: function (response) {
            alert(response);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Σφάλμα αποστολής πρόσκλησης:", error);
        }  //Error στην αποστολή προσκλησης
    });
});


$.ajax({
    url: 'active.php',
    type: 'GET',
    success: function (data) {
        const response = JSON.parse(data);
        response.active.forEach(a => {
            let committeeHtml = '';
            a.committee.forEach(m => {
                committeeHtml += `- ${m.name} ${m.surname} (${m.role})<br>`;
            });

            $('#active-diplomas').append(`
                <li>
                    <strong>Τίτλος:</strong> ${a.title}<br>
                    <strong>Ημέρες από Ανάθεση:</strong> ${a.days_active}<br>
                    <strong>Τριμελής Επιτροπή:</strong><br>
                    ${committeeHtml}
                </li><br>
            `);
        }); //Φορτώνει τις ενεργές διπλωματικές
    },
    error: function (xhr, status, error) {
        console.error("Σφάλμα κατά τη φόρτωση ενεργών διπλωματικών:", error);
    }
});  //Error κατα την φόρτωση

$('#exetasi-form').on('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    $.ajax({
        url: 'exetasi.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            try {
                const res = JSON.parse(data);
                if (res.success) {
                    $('#exetasi-result').text("Η υποβολή έγινε επιτυχώς.");
                    $('#exetasi-form')[0].reset();
                } else if (res.error) {
                    $('#exetasi-result').css('color', 'red').text(res.error);
                }
            } catch (e) {
                $('#exetasi-result').css('color', 'red').text("Σφάλμα απάντησης από τον διακομιστή.");
            }
        },
        error: function () {
            $('#exetasi-result').css('color', 'red').text("Αποτυχία αποστολής.");
        }
    });
});   //Υποβολή φόρμας υπο εξέταση

$('#exam-info-form').on('submit', function (e) {
    e.preventDefault();

    const data = {
        exam_datetime: $('#exam_datetime').val(),
        method: $('#method').val(),
        details: $('#details').val()
    };

    $.ajax({
        url: 'exetasi_save_info.php',
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.success) {
                $('#exam-info-result').text("Η καταχώρηση έγινε επιτυχώς.");
                $('#exam-info-form')[0].reset();
            } else {
                $('#exam-info-result').css('color', 'red').text(res.error || "Σφάλμα.");
            }
        },
        error: function () {
            $('#exam-info-result').css('color', 'red').text("Σφάλμα σύνδεσης με τον διακομιστή.");
        }
    });
});  //Υποβολή φόρμας στοιχείων εξέτασης

$.ajax({
    url: 'get_praktiko_info.php',
    type: 'GET',
    success: function (res) {
        // Πρακτικό
      if (res.grade_exists && res.paper) {
    $('#praktiko-section').html(`
        <a href="../../uploads/papers/${res.paper}" target="_blank">${res.paper}</a>
    `);
} else {
    $('#praktiko-section').text("Δεν είναι ακόμη διαθέσιμο.");
}  //Φόρτωση πρακτικό και Νημερτή


        // Νημερτής
        if (res.link) {
            $('#nimertis-form').hide();
            $('#nimertis-result').html(`<a href="${res.link}" target="_blank">${res.link}</a>`);
        }
    },
    error: function () {
        $('#praktiko-section').text("Σφάλμα κατά τη φόρτωση.");
        $('#nimertis-section').text("Σφάλμα κατά τη φόρτωση.");
    }
});

$('#nimertis-form').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
        url: 'save_nimertis.php',
        type: 'POST',
        data: { link: $('#nimertis-link').val() },
        success: function (res) {
            if (res.success) {
                $('#nimertis-form').hide();
                $('#nimertis-result').html("Ο σύνδεσμος καταχωρήθηκε επιτυχώς.");
            } else {
                $('#nimertis-result').css('color', 'red').text(res.error || 'Σφάλμα.');
            } //Υποβολή σύνδεσμου Νημερτή
        },
        error: function () {
            $('#nimertis-result').css('color', 'red').text('Αποτυχία σύνδεσης.');  //Error
        }
    });
});


$.ajax({
    url: 'completed.php',
    type: 'GET',
    success: function (res) {
        if (!res.completed || res.completed.length === 0) return;

        $('#completed-section').empty();

        res.completed.forEach(d => {
    const startDate = d.start_date ? new Date(d.start_date) : null;
    const today = new Date();
    const daysPassed = startDate ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) : '—';

    const filePath = d.pdf_file ? `../../professor/themata_create/uploads/${d.pdf_file}` : null;
    const paperPath = d.paper ? `../../uploads/papers/${d.paper}` : null;

    let committeeHTML = 'Δεν έχουν οριστεί ακόμη μέλη τριμελούς.';
    if (d.committee && d.committee.length > 0) {
        committeeHTML = '<ul>' + d.committee.map(m =>
            `<li>${m.name} ${m.surname} (${m.role})</li>`).join('') + '</ul>';
    }

    $('#completed-section').append(`
        <div style="background:#e0e0e0; padding:15px; border-radius:8px; margin-bottom:20px;">
            <h3>${d.title}</h3>
            <p><strong>Περιγραφή:</strong> ${d.description}</p>
            <p><strong>Συνημμένο αρχείο:</strong> ${filePath ? `<a href="${filePath}" target="_blank">${d.pdf_file}</a>` : '—'}</p>
            <p><strong>Κατάσταση:</strong> ${d.status}</p>
            <p><strong>Ημέρες από την ανάθεση:</strong> ${daysPassed}</p>
            <p><strong>Ημ/νία Ολοκλήρωσης:</strong> ${d.end_date || '—'}</p>
            <p><strong>Ημ/νία Έγκρισης:</strong> ${d.date_en || '—'}</p>
            <p><strong>Ημ/νία Εξέτασης:</strong> ${d.date_exams || '—'}</p>
            <p><strong>Βαθμός:</strong> ${d.grade || '—'}</p>
            <p><strong>Σύνδεσμος Νημερτής:</strong> ${d.link ? `<a href="${d.link}" target="_blank">${d.link}</a>` : '—'}</p>
            <p><strong>Πρακτικό Εξέτασης:</strong> ${paperPath ? `<a href="${paperPath}" target="_blank">${d.paper}</a>` : '—'}</p>
            <p><strong>Τριμελής Επιτροπή:</strong> ${committeeHTML}</p>
        </div>
    `);
});  //Φόρτωση των περατωμένων διπλωματικών

    },
    error: function () {
        $('#completed-section').html('<p>Σφάλμα κατά τη φόρτωση περατωμένων εργασιών.</p>'); //Error
    }
});
