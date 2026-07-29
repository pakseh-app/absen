/*
===========================================
SIMA
Sistem Informasi Absensi Madrasah
Main Application
Version : 1.0
===========================================
*/

const App = {

    currentPage: "dashboard",

    init() {

        this.showToday();

        this.initMenu();

        this.initClassButton();

        this.loadDashboard();

    },



    /*
    ===========================
    TANGGAL
    ===========================
    */

    showToday() {

        const el = document.getElementById("todayDate");

        if (!el) return;

        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };

        el.textContent = new Date().toLocaleDateString("id-ID", options);

    },



    /*
    ===========================
    MENU
    ===========================
    */

    initMenu() {

        const menus = document.querySelectorAll(".menu");

        menus.forEach(menu => {

            menu.addEventListener("click", () => {

                menus.forEach(item => item.classList.remove("active"));

                menu.classList.add("active");

                const page = menu.dataset.page;

                this.changePage(page);

            });

        });

    },



    /*
    ===========================
    PINDAH HALAMAN
    ===========================
    */

    changePage(page) {

        this.currentPage = page;

        document.querySelectorAll(".page").forEach(section => {

            section.classList.remove("active");

        });

        const activePage = document.getElementById(page);

        if (activePage) {

            activePage.classList.add("active");

        }

        const title = document.getElementById("pageTitle");

        if (title) {

            switch (page) {

                case "dashboard":
                    title.textContent = "Dashboard";
                    break;

                case "students":
                    title.textContent = "Data Siswa";
                    break;

                case "attendance":
                    title.textContent = "Absensi";
                    break;

                case "reports":
                    title.textContent = "Laporan";
                    break;

                case "settings":
                    title.textContent = "Pengaturan";
                    break;

            }

        }

    },



    /*
    ===========================
    DASHBOARD
    ===========================
    */

    loadDashboard() {

        if (typeof Database === "undefined") return;

        const students = Database.getStudents();

        const attendance = Database.getTodayAttendance();

        document.getElementById("totalStudents").textContent = students.length;

        document.getElementById("presentCount").textContent =
            attendance.filter(item => item.status === "Hadir").length;

        document.getElementById("permitCount").textContent =
            attendance.filter(item => item.status === "Izin").length;

        document.getElementById("sickCount").textContent =
            attendance.filter(item => item.status === "Sakit").length;

        document.getElementById("absentCount").textContent =
            attendance.filter(item => item.status === "Alfa").length;

    },



    /*
    ===========================
    PILIH KELAS
    ===========================
    */

    initClassButton() {

        document.querySelectorAll(".class-card").forEach(button => {

            button.addEventListener("click", () => {

                const kelas = button.dataset.class;

                if (typeof Attendance !== "undefined") {

                    Attendance.open(kelas);

                }

                this.changePage("attendance");

                document.querySelectorAll(".menu").forEach(menu => {

                    menu.classList.remove("active");

                    if (menu.dataset.page === "attendance") {

                        menu.classList.add("active");

                    }

                });

            });

        });

    }

};



/*
===========================================
START APPLICATION
===========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    App.init();

});
