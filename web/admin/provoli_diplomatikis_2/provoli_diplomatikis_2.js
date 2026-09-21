const userButton = document.querySelector('.user-button');
const popupMenu = document.querySelector('.popup-menu');

// Εμφάνιση-Απόκρυψη του μενού όταν πατάς το κουμπί χρήστη
userButton.addEventListener('click', () => {
    // Αν το μενού είναι ήδη ορατό, το κρύβουμε
    if (popupMenu.style.display === 'block') {
        popupMenu.style.display = 'none';
    } else {
        popupMenu.style.display = 'block'; // Εμφανίζουμε το μενού
    }
});

// Κλείσιμο του μενού αν κάνεις κλικ κάπου αλλού στην σελίδα
document.addEventListener('click', (e) => {
    if (!userButton.contains(e.target) && !popupMenu.contains(e.target)) {
        popupMenu.style.display = 'none';  // Απόκρυψη του μενού
    }
});

// Εμφάνιση θεματος
$(document).ready(function () {
    // παιρνω το id απο το storedData
    var storedData = sessionStorage.getItem('InfoData');
    if (storedData) {
        var parsedData = JSON.parse(storedData);
        $.ajax({
            url: 'provoli_diplomatikis_2.php',
            method: 'POST',
            data: { id: parsedData.id },
            success: function (response) {
                if (typeof response === 'string') {
                    try { response = JSON.parse(response); }
                    catch (e) { console.error('Failed to parse JSON:', e.message); return; }
                }
                var grouped = {};
                $.each(response, function (i, themata) {
                    var key = themata.themata_a_id;
                    if (!grouped[key]) {
                        grouped[key] = {
                            title: themata.title,
                            description: themata.description,
                            status: themata.status,
                            start_date: themata.start_date,
                            members: []
                        };
                    }
                    grouped[key].members.push(
                        themata.name + ' ' + themata.surname + ' (' + themata.role + ')'
                    );
                });
                
                // πληροφοριες θέματος
                var $infoContainer = $('#info');
                $.each(grouped, function (key, thema) {
                    $infoContainer.append(
                        '<li>'
                        + '<h3>' + thema.title + '</h3>'
                        + '<p><b>Περιγραφή:</b> ' + thema.description + '</p>'
                        + '<p><b>Status:</b> ' + thema.status + '</p>'
                        + '<p><b>Μέλη τριμελούς επιτροπής:</b><br>' + thema.members.join('<br>') + '</p>'
                        + '<p><b>Ημερομηνία ανάθεσης:</b> ' + thema.start_date + '</p>'
                        + '<button class="manage-btn" data-id="' + key + '" data-status="' + thema.status + '">Διαχείριση</button>'
                        + '<div class="extra-options" style="display:none;"></div>'
                        + '</li>'
                    );
                });
            },
            error: function (xhr, status, error) { console.error('Error:', error); }
        });
    } else {
        console.warn('No data found in sessionStorage.');
    }
});

// Διαχείριση θέματος
$(document).on('click', '.manage-btn', function() {
    var $btn = $(this);
    var themaId = $btn.data('id');
    var status = $btn.data('status');
    var $extra = $btn.next('.extra-options');

    // Κλείνεις αν το ίδιο είναι ήδη ανοιχτό
    if ($extra.is(':visible')) {
        $extra.slideUp();
        return;
    }

    // Κλείνεις τυχόν ανοιχτά αλλού
    $('.extra-options').slideUp();

    // Εμφάνιση ανάλογα το status
    if (status === "Ενεργή") {
        $extra.html(`
            <div style="margin-top:10px;">
                <button class="ap-btn">Καταχώρηση ΑΠ ΓΣ</button>
                <button class="cancel-btn" style="margin-left:14px;">Ακύρωση Ανάθεσης</button>
                <div class="ap-form" style="display:none; margin-top:14px;">
                    <label>Αριθμός Πρακτικού (ΑΠ):</label>
                    <input class="ap-input" type="number">
                    <button class="save-ap-btn">Αποθήκευση</button>
                </div>
                <div class="cancel-form" style="display:none; margin-top:14px;">
                    <label>Αριθμός ΓΣ:</label>
                    <input class="gs-number-input" type="number">
                    <label>Έτος ΓΣ:</label>
                    <input class="gs-year-input" type="number">
                    <label>Λόγος Ακύρωσης:</label>
                    <textarea class="cancel-reason-input" placeholder="π.χ. κατόπιν αίτησης Φοιτητή/τριας"></textarea>
                    <button class="save-cancel-btn">Αποθήκευση</button>
                </div>
            </div>
        `).slideDown();

        // Ενέργεια κουμπιού Καταχώρηση ΑΠ ΓΣ
        $extra.find('.ap-btn').on('click', function() {
            $extra.find('.cancel-form').slideUp();
            $extra.find('.ap-form').slideToggle();
        });

        // Ενέργεια κουμπιού Ακύρωση Ανάθεσης
        $extra.find('.cancel-btn').on('click', function() {
            $extra.find('.ap-form').slideUp();
            $extra.find('.cancel-form').slideToggle();
        });

        // Αποθήκευση ΑΠ
        $extra.find('.save-ap-btn').on('click', function() {
            var ap = $extra.find('.ap-input').val();
            if (!ap) {
            alert("Συμπλήρωσε τον αριθμό πρακτικού εξέτασης.");
            return;
        }
            // AJAX για καταχώρηση ΑΠ
            $.ajax({
                url: 'de_management.php',
                type: 'POST',
                data: {
                    action: 'save_ap',
                    thema_id: themaId,
                    ap: ap
                },
                success: function(response) {
                    alert("Ο ΑΠ αποθηκεύτηκε.");
                    $extra.slideUp();
                },
                error: function(xhr, status, error) {
                    alert("ΣΦΑΛΜΑ! Δεν έγινε η αποθήκευση.\n" + error + "\n" + xhr.responseText);
                }
            });
        });

        // Ακύρωση ανάθεσης
        $extra.find('.save-cancel-btn').on('click', function() {
            var gsNumber = $extra.find('.gs-number-input').val();
            var gsYear = $extra.find('.gs-year-input').val();
            var reason = $extra.find('.cancel-reason-input').val();
            if (!gsNumber || !gsYear || !reason) {
            alert("Συμπλήρωσε όλα τα πεδία (Αριθμός ΓΣ, Έτος ΓΣ, Λόγος ακύρωσης).");
            return;
            }

        // AJAX για αποθήκευση gsNumber, gsYear, reason
           $.post('de_management.php', {
           action: 'cancel',
           thema_id: themaId,
           gs_number: gsNumber,
           gs_year: gsYear,
           reason: reason
           }, function(response){
           alert("Η ακύρωση πραγματοποιήθηκε.");
           $extra.slideUp();
           });
        });   
    } 
    
    else if (status === "Υπό εξέταση") {
    $extra.html(`
        <div style="margin-top:10px;">
            <button class="exam-report-btn">Καταχώρηση Πρακτικού Εξέτασης</button>
            <button class="to-finished-btn" style="margin-left:14px;">Μετατροπή σε Περατωμένη</button>
            <div class="exam-report-form" style="display:none; margin-top:14px;">
                <label>HTML Πρακτικού Εξέτασης:</label><br>
                <textarea class="exam-report-input" style="width:100%;height:30px;" placeholder="Επικολλήστε εδώ το HTML του πρακτικού εξέτασης"></textarea>
                <button class="save-exam-report-btn" style="margin-top:6px;">Αποθήκευση</button>
            </div>
        </div>
    `).slideDown();

    // Ενέργεια κουμπιου καταχώρηση πρακτικού εξετασης
    $extra.find('.exam-report-btn').on('click', function() {
        $extra.find('.exam-report-form').slideToggle();
    });
    
    // Ενέργεια κουμπιού αποθήκευση html πρακτικού
    $extra.find('.save-exam-report-btn').on('click', function() {
        var html = $extra.find('.exam-report-input').val().trim();
        if (!html) {
            alert("Συμπλήρωσε το HTML του πρακτικού εξέτασης.");
            return;
        }
        $.post('de_management.php', {
            action: 'save_exam_report',
            thema_id: themaId,
            report_html: html
        }, function(response){
            alert("Το πρακτικό εξέτασης αποθηκεύτηκε.");
            $extra.slideUp();
        });
    });

    // Ενέργεια κουμπιού μετατροπή σε Περατωμένη
    $extra.find('.to-finished-btn').on('click', function() {
        $.post('de_management.php', {
        action: 'to_finished',
        thema_id: themaId
        }, function(response){
            var data = (typeof response === 'string') ? JSON.parse(response) : response;
            alert(data.message);
            $extra.slideUp();
        }).fail(function(xhr, status, error){
            alert("ΣΦΑΛΜΑ!\n" + error + "\n" + xhr.responseText);
        });
        });
    }
});
