/*
===========================================
SIMA
Attendance Module
Version : 1.0
===========================================
*/

const Attendance = {

    currentClass: "",

    /*
    ==========================
    INIT
    ==========================
    */

    init() {

        this.renderPage();

    },



    /*
    ==========================
    HALAMAN
    ==========================
    */

    renderPage() {

        const page = document.getElementById("attendance");

        if (!page) return;

        page.innerHTML = `

            <div class="attendance-header">

                <div>

                    <h2 id="attendanceTitle">
                        Absensi
                    </h2>

                    <p id="attendanceDate"></p>

                </div>

                <button
                    class="btn"
                    id="btnAllPresent">

                    Tandai Semua Hadir

                </button>

            </div>

            <div id="attendanceList"></div>

            <div class="mt-20">

                <button
                    class="btn"
                    id="btnSaveAttendance">

                    Simpan Absensi

                </button>

            </div>

        `;

        document
            .getElementById("btnAllPresent")
            .addEventListener("click", () => {

                this.markAllPresent();

            });

        document
            .getElementById("btnSaveAttendance")
            .addEventListener("click", () => {

                this.save();

            });

    },



    /*
    ==========================
    BUKA KELAS
    ==========================
    */

    open(kelas) {

        this.currentClass = kelas;

        document.getElementById(
            "attendanceTitle"
        ).textContent = "Absensi Kelas " + kelas;

        document.getElementById(
            "attendanceDate"
        ).textContent = new Date().toLocaleDateString("id-ID");

        this.renderList();

    },



    /*
    ==========================
    LIST SISWA
    ==========================
    */

    renderList() {

        const list =
            document.getElementById("attendanceList");

        const students = Database
            .getStudents()
            .filter(item => item.kelas == this.currentClass);

        if (students.length === 0) {

            list.innerHTML = `
                <div class="card text-center">

                    Belum ada siswa pada kelas ini.

                </div>
            `;

            return;

        }

        let html = "";

        students.forEach(student => {

            html += `

            <div class="card mt-20 attendance-item">

                <div class="attendance-info">

                    <strong>${student.nama}</strong><br>

                    <small>NIS : ${student.nis}</small>

                </div>

                <div class="attendance-status">

                    <select
                        class="attendance-select"
                        data-nis="${student.nis}">

                        <option value="Hadir">
                            Hadir
                        </option>

                        <option value="Izin">
                            Izin
                        </option>

                        <option value="Sakit">
                            Sakit
                        </option>

                        <option value="Alfa">
                            Alfa
                        </option>

                    </select>

                </div>

            </div>

            `;

        });

        list.innerHTML = html;

    },



    /*
    ==========================
    TANDAI SEMUA HADIR
    ==========================
    */

    markAllPresent() {

        document
            .querySelectorAll(".attendance-select")
            .forEach(select => {

                select.value = "Hadir";

            });

    },



    /*
    ==========================
    SIMPAN
    ==========================
    */

    save() {

        const date =
            new Date().toISOString().slice(0,10);

        document
            .querySelectorAll(".attendance-select")
            .forEach(select => {

                const nis = select.dataset.nis;

                const student =
                    Database.getStudent(nis);

                if (!student) return;

                Database.saveAttendance({

                    date: date,

                    nis: student.nis,

                    nama: student.nama,

                    class: student.kelas,

                    status: select.value

                });

            });

        if(typeof App !== "undefined"){

            App.loadDashboard();

        }

        alert("Absensi berhasil disimpan.");

    }

};



document.addEventListener("DOMContentLoaded", () => {

    Attendance.init();

});
