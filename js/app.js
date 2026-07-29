/*
===========================================
SIMA
Main Application
Version 2.0
===========================================
*/

const App = {

    currentPage: "dashboard",

    async init() {

        this.initMenu();

        this.initClassButton();

        // Tampilkan tanggal
        if (typeof UI !== "undefined") {
            UI.showToday();
        }

        // Refresh dashboard
        if (typeof UI !== "undefined") {
            await UI.refreshDashboard();
        }

        // Muat data siswa
        if (typeof Students !== "undefined") {
            await Students.load();
            Students.render();
        }

    },



    /*
    ===========================================
    MENU
    ===========================================
    */

    initMenu() {

        document.querySelectorAll(".menu").forEach(btn => {

            btn.onclick = () => {

                document.querySelectorAll(".menu")
                    .forEach(x => x.classList.remove("active"));

                btn.classList.add("active");

                this.showPage(btn.dataset.page);

            };

        });

    },



    /*
    ===========================================
    SHOW PAGE
    ===========================================
    */

    showPage(page) {

        this.currentPage = page;

        document.querySelectorAll(".page")
            .forEach(p => p.classList.remove("active"));

        const active = document.getElementById(page);

        if (active) {

            active.classList.add("active");

        }

        const title = document.getElementById("pageTitle");

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

    },



    /*
    ===========================================
    PILIH KELAS
    ===========================================
    */

    initClassButton() {

        document.querySelectorAll(".class-card").forEach(card => {

            card.onclick = () => {

                const kelas = card.dataset.class;

                this.showPage("attendance");

                document.querySelectorAll(".menu")
                    .forEach(m => {

                        m.classList.remove("active");

                        if (m.dataset.page === "attendance") {

                            m.classList.add("active");

                        }

                    });

                if (typeof Attendance !== "undefined" &&
                    typeof Attendance.open === "function") {

                    Attendance.open(kelas);

                }

            };

        });

    }

};



document.addEventListener("DOMContentLoaded", async () => {

    await App.init();

});
