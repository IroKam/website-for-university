-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 04 Ιουν 2025 στις 19:29:41
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `web`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `announce`
--

CREATE TABLE `announce` (
  `announce_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `announce` text NOT NULL,
  `create_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `announce`
--

INSERT INTO `announce` (`announce_id`, `themata_b_id`, `professor_id`, `announce`, `create_date`) VALUES
(1, 7, 3, 'Ανακοινώνεται ότι η παρουσίαση της διπλωματικής εργασίας του/της φοιτητή/τριας John Ioannou,με τίτλο \"trest student\", θα πραγματοποιηθεί στις 2025-05-31 22:35:00, μέσω Διαδικτυακά (ζοομ).Η παρουσίαση είναι ανοικτή προς το κοινό.', '2025-05-29 17:08:29');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `cancel`
--

CREATE TABLE `cancel` (
  `cancel_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `cancel_reason` text DEFAULT NULL,
  `cancel_number` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `exams`
--

CREATE TABLE `exams` (
  `exams_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `tropos` enum('δια ζώσης','διαδικτυακά') NOT NULL,
  `aithousa` text DEFAULT NULL,
  `presentation_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `exetasi_info`
--

CREATE TABLE `exetasi_info` (
  `id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `exam_datetime` datetime NOT NULL,
  `method` enum('Δια ζώσης','Διαδικτυακά') NOT NULL,
  `details` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `exetasi_info`
--

INSERT INTO `exetasi_info` (`id`, `themata_b_id`, `exam_datetime`, `method`, `details`, `created_at`) VALUES
(1, 7, '2025-05-31 22:35:00', 'Διαδικτυακά', 'ζοομ', '2025-05-29 15:35:34');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `grades`
--

CREATE TABLE `grades` (
  `grade_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `grade` decimal(4,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `quality_targets` decimal(5,2) DEFAULT NULL,
  `duration` decimal(5,2) DEFAULT NULL,
  `deliverables_quality` decimal(5,2) DEFAULT NULL,
  `presentation` decimal(5,2) DEFAULT NULL,
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `grades`
--

INSERT INTO `grades` (`grade_id`, `themata_b_id`, `professor_id`, `grade`, `created_at`, `quality_targets`, `duration`, `deliverables_quality`, `presentation`, `comments`) VALUES
(11, 6, 1, 8.70, '2025-05-15 17:57:17', 8.00, 10.00, 10.00, 9.00, ''),
(12, 6, 4, 10.00, '2025-05-15 17:59:38', 10.00, 10.00, 10.00, 10.00, ''),
(15, 6, 6, 8.60, '2025-05-27 08:33:11', 8.00, 10.00, 10.00, 8.00, ''),
(18, 7, 3, 9.10, '2025-06-02 12:44:45', 9.00, 10.00, 10.00, 7.00, ''),
(19, 7, 1, 8.60, '2025-06-02 12:45:08', 8.00, 10.00, 10.00, 8.00, ''),
(20, 7, 2, 9.30, '2025-06-02 12:46:44', 9.00, 10.00, 10.00, 9.00, ''),
(21, 8, 1, 0.00, '2025-06-03 17:26:59', NULL, NULL, NULL, NULL, NULL),
(22, 9, 1, 0.00, '2025-06-03 17:50:59', NULL, NULL, NULL, NULL, NULL);

--
-- Δείκτες `grades`
--
DELIMITER $$
CREATE TRIGGER `check_completion_and_update_grade` AFTER INSERT ON `grades` FOR EACH ROW BEGIN
    DECLARE count_grades INT;
    DECLARE avg_grade DECIMAL(4,2);

    -- Μέτρηση βαθμών για το συγκεκριμένο themata_b_id
    SELECT COUNT(*) INTO count_grades
    FROM grades
    WHERE themata_b_id = NEW.themata_b_id;

    -- Αν έχουν υποβληθεί 3 βαθμολογίες
    IF count_grades = 3 THEN
        -- Υπολογισμός μέσου όρου
        SELECT ROUND(AVG(grade), 2) INTO avg_grade
        FROM grades
        WHERE themata_b_id = NEW.themata_b_id;

        -- Ενημέρωση πίνακα themata_b (χωρίς αλλαγή status)
        UPDATE themata_b
        SET grade = avg_grade,
            end_date = NOW()
        WHERE themata_b_id = NEW.themata_b_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `grammatia`
--

CREATE TABLE `grammatia` (
  `grammatia_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmhma` varchar(255) NOT NULL,
  `telephone` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `grammatia`
--

INSERT INTO `grammatia` (`grammatia_id`, `user_id`, `tmhma`, `telephone`) VALUES
(1, 19, 'CEID', 2147483647),
(2, 20, 'CEID', 2147483647),
(3, 21, 'CEID', 2147483647),
(4, 22, 'CEID', 2147483647);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `invitations`
--

CREATE TABLE `invitations` (
  `invitation_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `status` enum('Ανοιχτή','Αποδεκτή','Απορριφθείσα') DEFAULT 'Ανοιχτή',
  `sent_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `response_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `invitations`
--

INSERT INTO `invitations` (`invitation_id`, `themata_b_id`, `student_id`, `professor_id`, `status`, `sent_date`, `response_date`) VALUES
(1, 6, 10433999, 4, 'Αποδεκτή', '2025-01-13 20:21:18', '2025-01-20 16:19:48'),
(6, 6, 10433999, 6, 'Αποδεκτή', '2025-01-17 17:17:06', '2025-01-20 22:25:41'),
(13, 7, 10434002, 1, 'Αποδεκτή', '2025-05-28 12:32:36', '2025-05-28 12:32:52'),
(14, 7, 10434002, 2, 'Αποδεκτή', '2025-05-28 12:32:37', '2025-05-28 12:33:09'),
(15, 7, 10434002, 5, 'Απορριφθείσα', '2025-05-28 12:32:40', NULL),
(16, 8, 10434000, 1, 'Απορριφθείσα', '2025-06-03 17:31:54', '2025-06-03 17:32:59'),
(17, 8, 10434000, 2, 'Αποδεκτή', '2025-06-03 17:34:14', '2025-06-03 17:34:47'),
(18, 8, 10434000, 3, 'Αποδεκτή', '2025-06-03 17:34:20', '2025-06-03 17:35:41'),
(19, 9, 10434001, 2, 'Αποδεκτή', '2025-06-03 17:51:29', '2025-06-03 17:51:58'),
(20, 9, 10434001, 3, 'Αποδεκτή', '2025-06-03 17:51:32', '2025-06-03 17:52:22');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `professors`
--

CREATE TABLE `professors` (
  `professor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `telephone` int(11) NOT NULL,
  `adress` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `tk` int(11) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `office_contact` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `professors`
--

INSERT INTO `professors` (`professor_id`, `user_id`, `name`, `surname`, `telephone`, `adress`, `city`, `tk`, `department`, `office_contact`) VALUES
(1, 13, 'Andreas', 'Komninos', 2147483647, 'kokmotou 69', 'thessaloniki', 20972, 'CEID', '2610996915'),
(2, 14, 'Vasilis', 'Foukaras', 2147483647, 'Vatomourias 69', 'thessaloniki', 20442, 'CEID', '2610996915'),
(3, 15, 'Basilis', 'Karras', 2147483647, 'Pantanasis 69', 'Patra', 20662, 'CEID', '2610995511'),
(4, 16, 'Eleni', 'Voyiatzaki', 2147483647, 'lootlake 69', 'New York', 20332, 'CEID', '2617536915'),
(5, 17, 'Andrew', 'Hozier Byrne', 2147483647, 'Mpofa 9', 'Kolonia', 90972, 'CEID', '2610170390'),
(6, 18, 'Nikos', 'Korobos', 2147483647, 'Araksou 69', 'Giotopoli', 77972, 'CEID', '2610324365');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `professor_notes`
--

CREATE TABLE `professor_notes` (
  `note_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `professor_notes`
--

INSERT INTO `professor_notes` (`note_id`, `professor_id`, `themata_b_id`, `note`, `created_at`) VALUES
(1, 1, 6, 'καλά πάμε', '2025-05-07 16:21:41');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `father_name` varchar(100) NOT NULL,
  `etos_eisag` year(4) NOT NULL,
  `phone` int(11) NOT NULL,
  `home_phone` int(11) DEFAULT NULL,
  `adress` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `tk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `students`
--

INSERT INTO `students` (`student_id`, `user_id`, `name`, `surname`, `father_name`, `etos_eisag`, `phone`, `home_phone`, `adress`, `city`, `tk`) VALUES
(10433999, 2, 'Makis', 'Makopoulos', 'Orestis', '2019', 69788852, NULL, 'Athina', 'Patra', 22364),
(10434000, 3, 'John', 'Lennon', 'George', '2020', 2147483647, 2147483647, 'Ermou 19', 'Athens', 10431),
(10434001, 4, 'Petros', 'Verikokos', 'Giannis', '2020', 2147483647, 2147483647, 'Adrianou 9', 'Thessaloniki', 54248),
(10434002, 5, 'John', 'Ioannou', 'George', '2014', 2147483647, 2147483647, 'Ermou 19', 'Patra', 26231),
(10434003, 6, 'Robert', 'Smith', 'Alex', '2020', 2147483647, 2147483647, 'Fascination 19', 'London', 1989),
(10434004, 7, 'Rex', 'Tyrannosaurus', 'Daspletosaurus', '2020', 2147483647, 2147483647, 'Cretaceous 19', 'Laramidia', 54321),
(10434005, 8, 'Paul', 'Mescal ', 'Paul', '2000', 2147483647, 2147483647, 'Smith 59', 'New York', 18931),
(10434006, 9, 'Pedro', 'Pascal', 'José ', '2024', 2147483647, 2147483647, 'Johnson 90', 'New York', 10444),
(10434007, 10, 'David', 'Gilmour', 'Douglas', '2020', 2147483647, 2147483647, 'Sortef 19', 'Athens', 10441),
(10434008, 11, 'Lana', 'Del Rey', 'George', '2020', 2147483647, 2147483647, 'Groove 19', 'Los Angeles', 99041),
(10434009, 12, 'Stevie', 'Nicks', 'Jess ', '2020', 2147483647, 2147483647, 'Magic 19', 'New Orleans', 10531);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `themata_a`
--

CREATE TABLE `themata_a` (
  `themata_a_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `professor_id` int(11) NOT NULL,
  `pdf_file` varchar(255) DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('open','close') DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `themata_a`
--

INSERT INTO `themata_a` (`themata_a_id`, `title`, `description`, `professor_id`, `pdf_file`, `creation_date`, `status`) VALUES
(1, 'trest student', 'για παράδειγμα θέλω ', 3, 'Tigger.txt', '2025-05-28 09:57:31', 'open'),
(2, 'Αποδοτικοί αλγόριθμοι για υπολογιστικώς δύσκολα προβλήματα σε τυχαία γραφήματα και γραφήματα τομής ετικετών', 'Σε ένα τυχαίο γράφημα τομής ετικετών, κάθε κορυφή επιλέγει\r\nανεξάρτητα ένα τυχαίο υποσύνολο ενός συνόλου χαρακτηριστικών\r\nκαι στη συνέχεια δυο κορυφές ενώνονται αν και μόνο εάν έχουν\r\nεπιλέξει τουλάχιστον ένα κοινό χαρακτηριστικό. Τα μοντέλο αυτό,\r\nκαθώς και διάφορες γενικεύσεις του, χρησιμοποιείται για τη\r\nμοντελοποίηση συσχετίσεων μεταξύ ατόμων σε κοινωνικά δίκτυα, για\r\nτην περιγραφή του δικτύου συγκρούσεων σε κατανεμημένα\r\nσυστήματα διαμοίρασης κοινών πόρων, για την μελέτη της ασφαλούς\r\nεπικοινωνίας μεταξύ κόμβων σε ασύρματα δίκτυα και άλλα. Σκοπός\r\nτης διπλωματικής αυτής εργασίας είναι η μελέτη υπολογιστικά\r\nδύσκολων γραφοθεωρητικών προβλημάτων για τα οποία υπάρχουν\r\nαποδοτικοί πιθανοτικοί αλγόριθμοι όταν η είσοδος είναι ένα τυχαίο\r\nγράφημα τομής ετικετών, με έμφαση στο πρόβλημα του\r\nισομορφισμού γραφημάτων', 1, 'ajax κώδικας.txt', '2025-01-03 18:00:28', 'open'),
(3, 'test', 'adiaforo', 1, NULL, '2025-01-04 13:53:20', 'open'),
(5, 'gsrhdrf', 'ujbsusjfvrg jefbhes', 1, NULL, '2025-01-08 17:41:24', 'open'),
(6, 'test1', 'εξεταση', 1, 'Βάση Δεδομένων.txt', '2025-02-19 14:13:13', 'open'),
(7, 'Δευτερό τεστ', '', 3, NULL, '2025-05-28 10:31:57', 'open');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `themata_b`
--

CREATE TABLE `themata_b` (
  `themata_b_id` int(11) NOT NULL,
  `themata_a_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `status` enum('Υπό Ανάθεση','Ενεργή','Υπό εξέταση','Ακυρωμένη','Περατωμένη') NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `date_en` date DEFAULT NULL,
  `date_yexams` date DEFAULT NULL,
  `proxeiro_file` varchar(255) DEFAULT NULL,
  `extra_links` text DEFAULT NULL,
  `proxeiro_uploaded_at` datetime DEFAULT NULL,
  `allow_grading` tinyint(1) DEFAULT 0,
  `grade` decimal(4,2) DEFAULT NULL,
  `link` text DEFAULT NULL,
  `paper` text DEFAULT NULL,
  `ap_gs` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `themata_b`
--

INSERT INTO `themata_b` (`themata_b_id`, `themata_a_id`, `student_id`, `status`, `start_date`, `end_date`, `date_en`, `date_yexams`, `proxeiro_file`, `extra_links`, `proxeiro_uploaded_at`, `allow_grading`, `grade`, `link`, `paper`, `ap_gs`) VALUES
(6, 2, 10433999, 'Περατωμένη', '2025-01-08', '2025-05-27', NULL, '2025-05-08', 'Ergastiriaki_Askisi_24-25-1.0.pdf', NULL, NULL, 1, 9.10, '', '', NULL),
(7, 1, 10434002, 'Περατωμένη', '2025-05-28', '2025-06-02', '2025-05-28', '2025-05-29', 'uploads/proxeira/68384ab3df258_Διπλωματικές-2024-2025-Νικολετσέας-IοT-Lab.pdf', 'φηεκφηΑΚΛΗλΚΣνω', '2025-05-29 15:09:56', 1, 9.00, 'https://www.ceid.upatras.gr/sites/default/files/pages/diplomatiki_ergasia_tmiyp_0.pdf', 'praktiko_axiologisis_diplomatikon_ergasion-v2.pdf', NULL),
(8, 6, 10434000, 'Υπό εξέταση', '2025-06-03', NULL, '2025-06-03', '2025-06-03', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL),
(9, 3, 10434001, 'Ενεργή', '2025-06-03', NULL, '2025-06-03', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `trimelis`
--

CREATE TABLE `trimelis` (
  `trimelis_id` int(11) NOT NULL,
  `themata_b_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `role` enum('Επιβλέπων','Μέλος Τριμελούς') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `trimelis`
--

INSERT INTO `trimelis` (`trimelis_id`, `themata_b_id`, `professor_id`, `role`) VALUES
(7, 6, 1, 'Επιβλέπων'),
(9, 6, 4, 'Μέλος Τριμελούς'),
(10, 6, 6, 'Μέλος Τριμελούς'),
(11, 7, 3, 'Επιβλέπων'),
(16, 7, 1, 'Μέλος Τριμελούς'),
(17, 7, 2, 'Μέλος Τριμελούς'),
(18, 8, 1, 'Επιβλέπων'),
(19, 8, 2, 'Μέλος Τριμελούς'),
(20, 8, 3, 'Μέλος Τριμελούς'),
(21, 9, 1, 'Επιβλέπων'),
(22, 9, 2, 'Μέλος Τριμελούς'),
(23, 9, 3, 'Μέλος Τριμελούς');

--
-- Δείκτες `trimelis`
--
DELIMITER $$
CREATE TRIGGER `update_themata_b_status` AFTER INSERT ON `trimelis` FOR EACH ROW BEGIN
  DECLARE count_members INT DEFAULT 0;

  -- Μέτρησε μέλη Τριμελούς
  SELECT COUNT(*) INTO count_members
  FROM trimelis
  WHERE themata_b_id = NEW.themata_b_id AND role = 'Μέλος Τριμελούς';

  -- Αν υπάρχουν τουλάχιστον 2
  IF count_members >= 2 THEN
    -- Ενημέρωσε themata_b
    UPDATE themata_b
    SET status = 'Ενεργή',
        date_en = CURDATE()
    WHERE themata_b_id = NEW.themata_b_id;

    -- Ακύρωσε όλες τις άλλες προσκλήσεις
    UPDATE invitations
    SET status = 'Απορριφθείσα'
    WHERE themata_b_id = NEW.themata_b_id
      AND status = 'Ανοιχτή';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Φοιτητής','Διδάσκων','Γραμματεία') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `role`) VALUES
(2, '104333999@students.upatras.gr', '55555', 'Φοιτητής'),
(3, 'st10434000@upnet.gr', '12345', 'Φοιτητής'),
(4, 'st10434001@upnet.gr', '11111', 'Φοιτητής'),
(5, 'st10434002@upnet.gr', '24596', 'Φοιτητής'),
(6, 'st10434003@upnet.gr', '74747', 'Φοιτητής'),
(7, 'st10434004@upnet.gr', '44569', 'Φοιτητής'),
(8, 'st10434005@upnet.gr', '25255', 'Φοιτητής'),
(9, 'st10434006@upnet.gr', '47563', 'Φοιτητής'),
(10, 'st10434007@upnet.gr', '74569', 'Φοιτητής'),
(11, 'st10434008@upnet.gr', '45628', 'Φοιτητής'),
(12, 'st10434009@upnet.gr', '55564', 'Φοιτητής'),
(13, 'akomninos@ceid.upatras.gr', '12345', 'Διδάσκων'),
(14, 'vasfou@ceid.upatras.gr', '99999', 'Διδάσκων'),
(15, 'karras@nterti.com', '14568', 'Διδάσκων'),
(16, 'eleni@ceid.gr', '56846', 'Διδάσκων'),
(17, 'hozier@ceid.upatras.gr', '14589', 'Διδάσκων'),
(18, 'nikos.korobos12@gmail.com', '15489', 'Διδάσκων'),
(19, 'grammateia123@upatras.gr', '12345', 'Γραμματεία'),
(20, 'grammateia124@upatras.gr', '12345', 'Γραμματεία'),
(21, 'grammateia125@upatras.gr', '12345', 'Γραμματεία'),
(22, 'grammateia126@upatras.gr', '12345', 'Γραμματεία');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `announce`
--
ALTER TABLE `announce`
  ADD PRIMARY KEY (`announce_id`),
  ADD KEY `themata_b_id` (`themata_b_id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Ευρετήρια για πίνακα `cancel`
--
ALTER TABLE `cancel`
  ADD PRIMARY KEY (`cancel_id`),
  ADD KEY `themata_b_id` (`themata_b_id`);

--
-- Ευρετήρια για πίνακα `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exams_id`),
  ADD KEY `themata_b_id` (`themata_b_id`);

--
-- Ευρετήρια για πίνακα `exetasi_info`
--
ALTER TABLE `exetasi_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `themata_b_id` (`themata_b_id`);

--
-- Ευρετήρια για πίνακα `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD KEY `themata_b_id` (`themata_b_id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Ευρετήρια για πίνακα `grammatia`
--
ALTER TABLE `grammatia`
  ADD PRIMARY KEY (`grammatia_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`invitation_id`),
  ADD KEY `themata_b_id` (`themata_b_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Ευρετήρια για πίνακα `professors`
--
ALTER TABLE `professors`
  ADD PRIMARY KEY (`professor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `professor_notes`
--
ALTER TABLE `professor_notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `professor_id` (`professor_id`),
  ADD KEY `themata_b_id` (`themata_b_id`);

--
-- Ευρετήρια για πίνακα `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Ευρετήρια για πίνακα `themata_a`
--
ALTER TABLE `themata_a`
  ADD PRIMARY KEY (`themata_a_id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Ευρετήρια για πίνακα `themata_b`
--
ALTER TABLE `themata_b`
  ADD PRIMARY KEY (`themata_b_id`),
  ADD KEY `themata_a_id` (`themata_a_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Ευρετήρια για πίνακα `trimelis`
--
ALTER TABLE `trimelis`
  ADD PRIMARY KEY (`trimelis_id`),
  ADD KEY `themata_b_id` (`themata_b_id`),
  ADD KEY `professor_id` (`professor_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `announce`
--
ALTER TABLE `announce`
  MODIFY `announce_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `cancel`
--
ALTER TABLE `cancel`
  MODIFY `cancel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `exams`
--
ALTER TABLE `exams`
  MODIFY `exams_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `exetasi_info`
--
ALTER TABLE `exetasi_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `grades`
--
ALTER TABLE `grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT για πίνακα `grammatia`
--
ALTER TABLE `grammatia`
  MODIFY `grammatia_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT για πίνακα `invitations`
--
ALTER TABLE `invitations`
  MODIFY `invitation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT για πίνακα `professors`
--
ALTER TABLE `professors`
  MODIFY `professor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT για πίνακα `professor_notes`
--
ALTER TABLE `professor_notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10434010;

--
-- AUTO_INCREMENT για πίνακα `themata_a`
--
ALTER TABLE `themata_a`
  MODIFY `themata_a_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT για πίνακα `themata_b`
--
ALTER TABLE `themata_b`
  MODIFY `themata_b_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT για πίνακα `trimelis`
--
ALTER TABLE `trimelis`
  MODIFY `trimelis_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `announce`
--
ALTER TABLE `announce`
  ADD CONSTRAINT `announce_ibfk_1` FOREIGN KEY (`themata_b_id`) REFERENCES `themata_b` (`themata_b_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announce_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`professor_id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `exetasi_info`
--
ALTER TABLE `exetasi_info`
  ADD CONSTRAINT `exetasi_info_ibfk_1` FOREIGN KEY (`themata_b_id`) REFERENCES `themata_b` (`themata_b_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
