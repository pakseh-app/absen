/*
===========================================
SIMA
Attendance Module
Version : 1.0
===========================================
*/

const Attendance = {

    currentClass: "",

    students: [],

    records: [],



    /*
    ===========================================
    INIT
    ===========================================
    */

    async init() {

        this.render();

    },



    /*
    ===========================================
    HALAMAN
    ===========================================
    */

    render() {

        const page = document.getElementById("attendance");

        if (!page) return;

        page.innerHTML = `

        <div class="toolbar">

            <div class="toolbar-left">

                <select
                    id="attendanceClass"
                    class="input">

                    <option value="">Pilih Kelas</option>

                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>

                </select>

            </div>

            <div class="toolbar-right">

                <button
                    class="btn btn-secondary"
                    id="btnAllPresent">

                    ✓ Semua Hadir

                </button>

                <button
                    class="btn"
                    id="btnSaveAttendance">

                    💾 Simpan

                </button>

            </div>

        </div>

        <div id="attendanceTable"></div>

        `;

        document

            .getElementById("attendanceClass")

            .addEventListener("change", async (e)=>{

                this.currentClass = e.target.value;

                await this.loadStudents();

                this.refresh();

            });

        document

            .getElementById("btnAllPresent")

            .addEventListener("click",()=>{

                this.markAllPresent();

            });

        document

            .getElementById("btnSaveAttendance")

            .addEventListener("click",()=>{

                this.save();

            });

    },



    /*
    ===========================================
    LOAD SISWA
    ===========================================
    */

    async loadStudents(){

        let data = await Database.getStudents();

        data = data.filter(

            item=>item.kelas==this.currentClass

        );

        this.students = data;

    },



    /*
    ===========================================
    TABLE
    ===========================================
    */

    refresh(){

        const table = document.getElementById("attendanceTable");

        if(this.currentClass===""){

            table.innerHTML=`

                <div class="card">

                    Pilih kelas terlebih dahulu.

                </div>

            `;

            return;

        }

        if(this.students.length===0){

            table.innerHTML=`

                <div class="card">

                    Belum ada siswa pada kelas ini.

                </div>

            `;

            return;

        }

        let html=`

        <table>

        <thead>

        <tr>

            <th width="120">

                NIS

            </th>

            <th>

                Nama

            </th>

            <th width="220">

                Status

            </th>

        </tr>

        </thead>

        <tbody>

        `;

        this.students.forEach(student=>{

            html+=`

            <tr>

                <td>

                    ${student.nis}

                </td>

                <td>

                    ${student.nama}

                </td>

                <td>

                    <select

                        class="attendance-status input"

                        data-nis="${student.nis}"

                        data-name="${student.nama}"

                        data-class="${student.kelas}">

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

                </td>

            </tr>

            `;

        });

        html+=`

        </tbody>

        </table>

        `;

        table.innerHTML = html;

    },

        /*
    ===========================================
    TANDAI SEMUA HADIR
    ===========================================
    */

    markAllPresent() {

        const selects = document.querySelectorAll(".attendance-status");

        selects.forEach(select => {

            select.value = "Hadir";

        });

        UI.success("Semua siswa ditandai Hadir.");

    },



    /*
    ===========================================
    SIMPAN ABSENSI
    ===========================================
    */

    async save() {

        if (this.currentClass === "") {

            UI.warning("Pilih kelas terlebih dahulu.");

            return;

        }

        const selects = document.querySelectorAll(".attendance-status");

        if (selects.length === 0) {

            UI.warning("Tidak ada data siswa.");

            return;

        }

        UI.showLoading("Menyimpan absensi...");

        const today = Utils.today();

        let total = 0;

        for (const select of selects) {

            const record = {

                date: today,

                nis: select.dataset.nis,

                nama: select.dataset.name,

                kelas: select.dataset.class,

                status: select.value,

                updated: new Date().toISOString()

            };

            await Database.saveAttendance(record);

            total++;

        }

        UI.hideLoading();

        UI.success(total + " absensi berhasil disimpan.");



        /*
        ===========================
        REFRESH DASHBOARD
        ===========================
        */

        if (typeof UI.refreshDashboard === "function") {

            await UI.refreshDashboard();

        }



        /*
        ===========================
        GOOGLE SHEETS
        ===========================
        */

        if (

            typeof Sheets !== "undefined" &&

            typeof Sheets.syncAttendance === "function"

        ) {

            try {

                await Sheets.syncAttendance();

            }

            catch (err) {

                console.error(err);

            }

        }

    },



    /*
    ===========================================
    LOAD ABSENSI HARI INI
    ===========================================
    */

    async loadTodayAttendance() {

        const today = Utils.today();

        const records = await Database.getAttendanceByDate(today);

        if (records.length === 0) return;

        setTimeout(() => {

            records.forEach(record => {

                const select = document.querySelector(

                    `.attendance-status[data-nis="${record.nis}"]`

                );

                if (select) {

                    select.value = record.status;

                }

            });

        }, 100);

    },



    /*
    ===========================================
    BUKA KELAS
    ===========================================
    */

    async openClass(kelas) {

        this.currentClass = kelas;

        const select = document.getElementById("attendanceClass");

        if (select) {

            select.value = kelas;

        }

        await this.loadStudents();

        this.refresh();

        await this.loadTodayAttendance();

    }

};



/*
===========================================
START MODULE
===========================================
*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Attendance.init();

    }

);
