const userButton = document.querySelector('.user-button');
const popupMenu = document.querySelector('.popup-menu');
var fullName = ''; 

    // Εμφάνιση - Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
    userButton.addEventListener('click', () => {
        // Αν το μενού είναι ήδη ορατό, το κρύβει
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
                fullName = professor.name + ' ' + professor.surname;
                $userInfo.append('<a>' +professor.name + ' ' + professor.surname + '</a>');
               });
            },
            error: function(xhr, status, error) {
                
                console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
            }
        });
    });

          //Διπλωματικές Υπό Ανάθεση
          $(document).ready(function(){

            var $profilInfo = $('#de_ypo') 
        
            $.ajax({
                url: 'under_assigment.php',
                type: 'GET',
                success: function(response) {
                    var ypo = JSON.parse(response);
                    $.each(ypo, function(i, item) {
                        var professorsList = item.professors.map(function(professor) {
                            return '<li class="professor-card">' + professor.name 
                                + '<p>Κατάσταση: ' + (professor.status || ' ') +'</p>'
                                + '<p>Ημερομηνία Πρόσκλησης: ' + (professor.sent_date || ' ') + '</p>' 
                                + '<p> Ημερομηνία Απάντησεις: ' + (professor.response_date || ' ') + '</p></li>';
                        }).join('');
                    
                        $profilInfo.append(`
                            <li class="diploma-item">
                                <h3 class="toggle-details" data-id="ypo-${item.themata_b_id}" style="cursor:pointer; color:#003399; text-decoration:underline;">
                                    ${item.title}
                                </h3>
                                <div class="details" id="details-ypo-${item.themata_b_id}" style="display:none;">
                                    <p>Όνομα Φοιτητή: ${item.student_name} ${item.student_surname} ΑΜ: ${item.student_id}</p>
                                    <p>Ημερομηνία Έναρξης: ${item.start_date}</p>
                                    <ul>Καθηγητές που έχουν προσκληθεί: ${professorsList}</ul>
                                    <button class="button-all" id="cancel" data-val="${item.themata_b_id}">Διαγραφή</button>
                                </div>
                            </li>
                        `);
                        
                    });
                },
                error: function(xhr, status, error) {
                    
                    console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
                }
            });
        });

        // Κουμπί ακύρωσης
        $(document).on('click', '#cancel', function(){
            var id = $(this).attr('data-val');
            var action ='cancelRecord';
            $.ajax({
                url: "under_assigment.php",
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

        //Διπλωματικές Ενεργές
        $(document).ready(function(){

            var $profilInfo = $('#active') 
        
            $.ajax({
                url: 'active.php',
                type: 'GET',
                success: function(response) {
                    var active = JSON.parse(response);
                    $.each(active, function(i, item) {
                        var isEligibleForCancel = false;

                        // Έλεγχος αν έχουν περάσει 2 έτη
                        var startDate = new Date(item.start_date);
                        var twoYearsAgo = new Date();
                        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
                        if (startDate <= twoYearsAgo) {
                            // Ελέγχουμε αν ο χρήστης είναι επιβλέπων
                            item.professors.forEach(function(prof) {
                                if (prof.role === "Επιβλέπων") {
                                    isEligibleForCancel = true;
                                }
                            });
                        }
                        //Λίστα καθηγητών
                        var professorsList = item.professors.map(function(professor) {
                            return '<li class="professor-card">' + professor.name 
                                + '<p>Ρόλος: ' + professor.role +'</p></li>';
                        }).join('');

                        // Φόρμα ακύρωσης
                        var cancelFormHTML = '';
                        if (isEligibleForCancel) {
                            cancelFormHTML = `
                                <div class="cancel-form">
                                    <h4>Ακύρωση Ανάθεσης (μόνο Επιβλέπων & μετά από 2 έτη)</h4>
                                    <input type="text" class="gs-number" placeholder="Αριθμός Γ.Σ." data-id="${item.themata_b_id}">
                                    <input type="text" class="gs-year" placeholder="Έτος Γ.Σ." data-id="${item.themata_b_id}">
                                    <button class="button-all cancel-assignment" data-id="${item.themata_b_id}">Ακύρωση Ανάθεσης</button>
                                </div>
                            `;
                        }

                        var markButtonHTML = '';
                        item.professors.forEach(function(prof) {
                            if (prof.role === "Επιβλέπων") {
                                markButtonHTML = `<button class="button-all mark-under-review" data-id="${item.themata_b_id}">Μετάβαση σε Υπό Εξέταση</button>`;
                            }
                        });
                    
                        $profilInfo.append(`
                            <li class="diploma-item">
                                <h3 class="toggle-details" data-id="${item.themata_b_id}" style="cursor:pointer; color:#003399; text-decoration:underline;">
                                    ${item.title}
                                </h3>
                                <div class="details" id="details-${item.themata_b_id}" style="display:none;">
                                    <p>Όνομα Φοιτητή: ${item.student_name} ${item.student_surname} ΑΜ: ${item.student_id}</p>
                                    <p>Ημερομηνία Έναρξης: ${item.start_date}</p>
                                    <ul>Καθηγητές: ${professorsList}</ul>
                                    <textarea maxlength="300" placeholder="Γράψε νέα σημείωση..." class="note-text" data-id="${item.themata_b_id}"></textarea>
                                    <button class="button-all save-note" data-id="${item.themata_b_id}">Αποθήκευση Σημείωσης</button>
                                    <div class="note-list" id="notes-${item.themata_b_id}"></div>
                                    ${cancelFormHTML}
                                    ${markButtonHTML}
                                </div>
                            </li>
                        `);
                        
                        
                    });
                },
                error: function(xhr, status, error) {
                    
                    console.error('Σφάλμα κατά τη φόρτωση δεδομένων:', error);
                }
            });
        });

        // Αποθήκευση σημείωσης
$(document).on('click', '.save-note', function () {
    var themata_b_id = $(this).data('id');
    var note = $('.note-text[data-id="' + themata_b_id + '"]').val().trim();

    if (note.length === 0) {
        alert("Η σημείωση είναι κενή.");
        return;
    }

    $.ajax({
        url: 'active.php',
        type: 'POST',
        data: {
            action: 'addNote',
            themata_b_id: themata_b_id,
            note: note
        },
        success: function (response) {
            alert(response);
            $('.note-text[data-id="' + themata_b_id + '"]').val('');
            loadNotes(themata_b_id);
        },
        error: function (xhr, status, error) {
            alert("Προέκυψε σφάλμα κατά την αποθήκευση της σημείωσης: " + error);
        }
    });
});


// Φόρτωση σημειώσεων
function loadNotes(themata_b_id) {
    $.ajax({
        url: 'active.php',
        type: 'GET',
        data: {
            action: 'getNotes',
            themata_b_id: themata_b_id
        },
        success: function (data) {
            var notes = JSON.parse(data);
            var html = notes.map(function (n, index) {
                return '<div class="note-entry" data-note-id="' + n.note_id + '">'
                     + '<p>' + n.note + '<br><small>' + n.created_at + '</small></p>'
                     + '<button class="delete-note button-all" data-id="' + n.note_id + '" data-themata="' + themata_b_id + '">Διαγραφή</button>'
                     + '</div>';
            }).join('');
            $('#notes-' + themata_b_id).html(html);
        },
        error: function (xhr, status, error) {
            alert("Προέκυψε σφάλμα κατά τη φόρτωση σημειώσεων: " + error);
        }
    });
}



// Αυτόματη φόρτωση σημειώσεων
$(document).ajaxSuccess(function (event, xhr, settings) {
    if (settings.url === 'active.php') {
        setTimeout(function () {
            $('.save-note').each(function () {
                var id = $(this).data('id');
                loadNotes(id);
            });
        }, 500);
    }
});

$(document).on('click', '.delete-note', function () {
    var note_id = $(this).data('id');
    var themata_b_id = $(this).data('themata');
    
    if (confirm("Είσαι σίγουρος ότι θες να διαγράψεις αυτή τη σημείωση;")) {
        $.ajax({
            url: 'active.php',
            type: 'POST',
            data: {
                action: 'deleteNote',
                note_id: note_id
            },
            success: function (response) {
                alert(response);
                loadNotes(themata_b_id);
            },
            error: function (xhr, status, error) {
                alert("Προέκυψε σφάλμα κατά τη διαγραφή της σημείωσης: " + error);
            }
        });
    }
});


// Άνοιγμα/Κλείσιμο πληροφοριών διπλωματικής
$(document).on('click', '.toggle-details', function () {
    var id = $(this).data('id');
    $('#details-' + id).slideToggle(); // κάνει εφέ ανοιγοκλείσματος
});

// Ακύρωση ανάθεσης από επιβλέποντα
$(document).on('click', '.cancel-assignment', function () {
    var id = $(this).data('id');
    var gs_number = $('.gs-number[data-id="' + id + '"]').val().trim();
    var gs_year = $('.gs-year[data-id="' + id + '"]').val().trim();

    if (!gs_number || !gs_year) {
        alert("Συμπλήρωσε αριθμό και έτος Γ.Σ.");
        return;
    }

    if (confirm("Επιβεβαιώνεις την ακύρωση της ανάθεσης;")) {
        $.ajax({
            url: 'active.php',
            type: 'POST',
            data: {
                action: 'cancelAssignmentByProfessor',
                themata_b_id: id,
                cancel_number: gs_number,
                year: gs_year
            },
            success: function (response) {
                alert(response);
                location.reload(); 
            },
            error: function (xhr, status, error) {
                alert("Προέκυψε σφάλμα κατά την ακύρωση: " + error);
            }
        });
    }
});


// Μετάβαση σε "Υπό Εξέταση"
$(document).on('click', '.mark-under-review', function () {
    var id = $(this).data('id');
    if (confirm("Επιβεβαιώνετε την αλλαγή κατάστασης σε 'Υπό Εξέταση';")) {
        $.ajax({
            url: 'active.php',
            type: 'POST',
            data: {
                action: 'markAsUnderReview',
                themata_b_id: id
            },
            success: function (response) {
                alert(response);
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Προέκυψε σφάλμα κατά την αλλαγή κατάστασης: " + error);
            }
        });
    }
});


// Διπλωματικές Υπό Εξέταση
$(document).ready(function () {
    var $examsInfo = $('#exams');

    $.ajax({
        url: 'under_review.php',
        type: 'GET',
        success: function (response) {
            var data = JSON.parse(response);
            $.each(data, function (i, item) {
                var professorsList = item.professors.map(function (professor) {
                    return '<li class="professor-card">' + professor.name + 
                           '<p>Ρόλος: ' + professor.role + '</p></li>';
                }).join('');

// Κουμπί ενεργοποίησης βαθμολόγησης για Επιβλέποντα
var enableGradingHTML = '';
var isSupervisor = false;

item.professors.forEach(function (prof) {
    if (prof.name === fullName && prof.role === "Επιβλέπων") {
        isSupervisor = true;
    }
});

if (isSupervisor && !item.allow_grading) {
    enableGradingHTML = `
        <button class="button-all enable-grading" data-id="${item.themata_b_id}">
            Ενεργοποίηση Βαθμολόγησης
        </button>
    `;
}

// Εμφάνιση φόρμας ή βαθμών
var gradingSectionHTML = '';
if (item.allow_grading) {
    gradingSectionHTML = `
        <div class="grading-section" id="grading-${item.themata_b_id}">
            <p><strong>Βαθμολόγηση:</strong></p>
            <div class="grade-form">
                <input type="number" placeholder="Ποιότητα/Στόχοι (0-10)" class="crit quality" step="0.1">
                <input type="number" placeholder="Διάρκεια (0-10)" class="crit duration" step="0.1">
                <input type="number" placeholder="Πληρότητα Παραδοτέων (0-10)" class="crit deliverables" step="0.1">
                <input type="number" placeholder="Παρουσίαση (0-10)" class="crit presentation" step="0.1">
                <textarea placeholder="Σχόλια" class="comments"></textarea>
                <button class="button-all submit-grade" data-id="${item.themata_b_id}">Καταχώρηση Βαθμού</button>
            </div>
            <div class="grade-list" id="grade-list-${item.themata_b_id}"></div>
        </div>
    `;
    // Εμφάνιση βαθμών
setTimeout(() => {
    loadGrades(item.themata_b_id);
}, 100);

}



               var proxeiroHTML = '';
                if (item.proxeiro_file) {
                    proxeiroHTML = `<p><a href="../../${item.proxeiro_file}" target="_blank" style="color:#0066cc;"> Δες Πρόχειρο Κείμενο</a></p>`;
                } else {
                    proxeiroHTML = `<p style="color:gray;">Δεν έχει ανέβει πρόχειρο κείμενο.</p>`;
                }

                let extraLinksHTML = '';
                if (item.extra_links) {
                    extraLinksHTML = `<p><a href="${item.extra_links}" target="_blank" style="color:#0066cc;">Επιπλέον Σύνδεσμος</a></p>`;
                }

                let examInfoHTML = '';
                if (item.exam_datetime) {
                    examInfoHTML = `
                        <div class="exam-info">
                            <p><strong>Εξέταση:</strong> ${item.exam_datetime}</p>
                            <p><strong>Μέθοδος:</strong> ${item.method}</p>
                            <p><strong>Λεπτομέρειες:</strong> ${item.details}</p>
                        </div>
                    `;
                }

                let announcementHTML = '';
                const hasExamDetails = item.exam_datetime && item.method && item.details;

                if (hasExamDetails && isSupervisor) {
                   announcementHTML = `
                    <div class="announcement-box">
                        <p><strong>Δημιουργία Ανακοίνωσης:</strong></p>
<textarea id="announce-text-${item.themata_b_id}" rows="6" style="width:100%; resize:vertical;">Ανακοινώνεται ότι η παρουσίαση της διπλωματικής εργασίας του/της φοιτητή/τριας ${item.student_name} ${item.student_surname},με τίτλο "${item.title}", θα πραγματοποιηθεί στις ${item.exam_datetime}, ${item.method} (${item.details}).Η παρουσίαση είναι ανοικτή προς το κοινό.</textarea>
                        <button class="button-all save-announcement" data-id="${item.themata_b_id}">Αποθήκευση Ανακοίνωσης</button>
                    </div>
                `;

                }


                $examsInfo.append(`
    <li class="diploma-item">
        <h3 class="toggle-details" data-id="exams-${item.themata_b_id}" style="cursor:pointer; color:#003399; text-decoration:underline;">
            ${item.title}
        </h3>
        <div class="details" id="details-exams-${item.themata_b_id}" style="display:none;">
            <p>Όνομα Φοιτητή: ${item.student_name} ${item.student_surname} ΑΜ: ${item.student_id}</p>
            <p>Ημερομηνία Έναρξης: ${item.start_date}</p>
            <ul>Καθηγητές: ${professorsList}</ul>
            ${proxeiroHTML}
            ${extraLinksHTML}
            ${examInfoHTML}
            ${announcementHTML}
            ${enableGradingHTML}
            ${gradingSectionHTML}
        </div>
    </li>
`);


            });
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα κατά τη φόρτωση δεδομένων (Υπό Εξέταση):', error);
        }
    });
});

$(document).on('click', '.save-announcement', function () {
    const id = $(this).data('id');
    const content = $(`#announce-text-${id}`).val();

    $.ajax({
        url: 'save_announcement.php',
        type: 'POST',
        data: {
            themata_b_id: id,
            announce: content
        },
        success: function (response) {
            alert(response);
        },
        error: function (xhr, status, error) {
            alert("Προέκυψε σφάλμα κατά την αποθήκευση της ανακοίνωσης: " + error);
        }
    });
});



$(document).on('click', '.enable-grading', function () {
    var id = $(this).data('id');
    if (confirm("Να ενεργοποιηθεί η δυνατότητα βαθμολόγησης;")) {
        $.ajax({
            url: 'under_review.php',
            type: 'POST',
            data: {
                action: 'enable_grading',
                themata_b_id: id
            },
            success: function (response) {
                alert(response);
            },
            error: function (xhr, status, error) {
                alert("Προέκυψε σφάλμα κατά την ενεργοποίηση της βαθμολόγησης: " + error);
            }
        });
    }
});


$(document).on('click', '.submit-grade', function () {
    var id = $(this).data('id');
    var $section = $('#grading-' + id);

    var data = {
        action: 'submit_grade',
        themata_b_id: id,
        quality_targets: parseFloat($section.find('.quality').val()),
        duration: parseFloat($section.find('.duration').val()),
        deliverables_quality: parseFloat($section.find('.deliverables').val()),
        presentation: parseFloat($section.find('.presentation').val()),
        comments: $section.find('.comments').val()
    };

    // Έλεγχος ορίων
    if ([data.quality_targets, data.duration, data.deliverables_quality, data.presentation].some(val => isNaN(val) || val < 0 || val > 10)) {
        alert("Οι βαθμοί πρέπει να είναι από 0 έως 10.");
        return;
    }

    console.log(data);

    $.ajax({
        url: 'under_review.php',
        type: 'POST',
        data: data,
        success: function (response) {
            alert(response);
            loadGrades(id);
        },
        error: function (xhr, status, error) {
            alert("Προέκυψε σφάλμα κατά την υποβολή βαθμολογίας: " + error);
        }
    });
});


function loadGrades(themata_b_id) {
    $.ajax({
        url: 'under_review.php',
        type: 'GET',
        data: {
            action: 'get_grades',
            themata_b_id: themata_b_id
        },
        success: function (data) {
            var grades = JSON.parse(data);
            var html = grades.map(function (g) {
                return `<div class="grade-entry">
                    <p><strong>${g.name} ${g.surname}</strong> – Τελικός: ${g.grade}</p>
                    <ul>
                        <li>Ποιότητα/Στόχοι: ${g.quality_targets}</li>
                        <li>Διάρκεια: ${g.duration}</li>
                        <li>Πληρότητα Παραδοτέων: ${g.deliverables_quality}</li>
                        <li>Παρουσίαση: ${g.presentation}</li>
                    </ul>
                    <p>Σχόλια: ${g.comments || '-'}</p>
                </div>`;
            }).join('');

            $('#grade-list-' + themata_b_id).html(html);
        },
        error: function (xhr, status, error) {
            alert("Προέκυψε σφάλμα κατά τη φόρτωση των βαθμολογιών: " + error);
        }
    });
}



// Διπλωματικές Περατωμένες
$(document).ready(function () {
    var $completedInfo = $('#completed');

    $.ajax({
        url: 'completed.php',
        type: 'GET',
        success: function (response) {
            var data = JSON.parse(response);
            $.each(data, function (i, item) {
                var professorsList = item.professors.map(function (professor) {
                    return '<li class="professor-card">' + professor.name + '<p>Ρόλος: ' + professor.role + '</p></li>';
                }).join('');

                var finalFileHTML = item.link ? `<p><a href="${item.link}" target="_blank">Τελικό Κείμενο</a></p>` : '<p style="color:gray;">Δεν υπάρχει σύνδεσμος τελικού κειμένου</p>';
                var gradeFormHTML = item.paper ? `<p><a href="${item.paper}" target="_blank">Έντυπο Βαθμολογίας</a></p>` : '<p style="color:gray;">Δεν έχει ανέβει έντυπο βαθμολογίας</p>';

                $completedInfo.append(`
                    <li class="diploma-item">
                        <h3 class="toggle-details" data-id="completed-${item.themata_b_id}" style="cursor:pointer; color:#003399; text-decoration:underline;">
                            ${item.title}
                        </h3>
                        <div class="details" id="details-completed-${item.themata_b_id}" style="display:none;">
                            <p><strong>Τελικός Βαθμός:</strong> ${item.grade}</p>
                            <p>Όνομα Φοιτητή: ${item.student_name} ${item.student_surname} ΑΜ: ${item.student_id}</p>
                            <p>Ημερομηνία Έναρξης: ${item.start_date}</p>
                            ${finalFileHTML}
                            ${gradeFormHTML}
                            <ul>Καθηγητές: ${professorsList}</ul>
                            <button class="button-all view-grades" data-id="${item.themata_b_id}">Αναλυτική Βαθμολογία</button>
                            <div class="grade-list" id="grade-list-completed-${item.themata_b_id}" style="display:none;"></div>
                        </div>
                    </li>
                `);
            });
        },
        error: function (xhr, status, error) {
            console.error('Σφάλμα κατά τη φόρτωση περατωμένων:', error);
        }
    });
});

$(document).on('click', '.view-grades', function () {
    var id = $(this).data('id');
    var $gradeList = $('#grade-list-completed-' + id);
    $gradeList.toggle();

    if ($gradeList.is(':visible') && $gradeList.is(':empty')) {
        $.ajax({
            url: 'under_review.php',
            type: 'GET',
            data: {
                action: 'get_grades',
                themata_b_id: id
            },
            success: function (data) {
                var grades = JSON.parse(data);
                var html = grades.map(function (g) {
                    return `<div class="grade-entry">
                        <p><strong>${g.name} ${g.surname}</strong> – Τελικός: ${g.grade}</p>
                        <ul>
                            <li>Ποιότητα/Στόχοι: ${g.quality_targets}</li>
                            <li>Διάρκεια: ${g.duration}</li>
                            <li>Πληρότητα Παραδοτέων: ${g.deliverables_quality}</li>
                            <li>Παρουσίαση: ${g.presentation}</li>
                        </ul>
                        <p>Σχόλια: ${g.comments || '-'}</p>
                    </div>`;
                }).join('');

                $gradeList.html(html);
            },
            error: function (xhr, status, error) {
                alert("Προέκυψε σφάλμα κατά τη φόρτωση των βαθμολογιών: " + error);
            }
        });
    }
});

