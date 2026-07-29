/*
===========================================
SIMA
Students Module
Version : 1.0
===========================================
*/

const Students = {

    currentClass: "",

    init() {

        this.renderPage();

    },



    /*
    ==========================
    HALAMAN
    ==========================
    */

    renderPage() {

        const page = document.getElementById("students");

        if (!page) return;

        page.innerHTML = `
            <div class="students-header">

                <button class="btn" id="btnAddStudent">
                    + Tambah Siswa
                </button>

                <input
                    type="text"
                    id="searchStudent"
                    placeholder="Cari NIS atau Nama..."
                >

            </div>

            <div id="studentTable"></div>

            <div id="studentModal" class="hidden"></div>
        `;

        this.renderTable();

        this.bindEvents();

    },



    /*
    ==========================
    EVENTS
    ==========================
    */

    bindEvents() {

        document
            .getElementById("btnAddStudent")
            .addEventListener("click", () => {

                this.showForm();

            });

        document
            .getElementById("searchStudent")
            .addEventListener("keyup", e => {

                this.renderTable(e.target.value);

            });

    },



    /*
    ==========================
    TABLE
    ==========================
    */

    renderTable(keyword = "") {

        const container =
            document.getElementById("studentTable");

        let students = Database.getStudents();

        keyword = keyword.toLowerCase();

        if (keyword !== "") {

            students = students.filter(student => {

                return (

                    student.nama
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    student.nis
                        .toLowerCase()
                        .includes(keyword)

                );

            });

        }

        let html = `
            <table>

                <thead>

                    <tr>

                        <th>NIS</th>

                        <th>Nama</th>

                        <th>JK</th>

                        <th>Kelas</th>

                        <th>Aksi</th>

                    </tr>

                </thead>

                <tbody>
        `;

        if (students.length === 0) {

            html += `
                <tr>

                    <td colspan="5" class="text-center">

                        Belum ada data siswa

                    </td>

                </tr>
            `;

        } else {

            students.forEach(student => {

                html += `
                    <tr>

                        <td>${student.nis}</td>

                        <td>${student.nama}</td>

                        <td>${student.jk}</td>

                        <td>${student.kelas}</td>

                        <td>

                            <button
                                class="btn btn-edit"
                                onclick="Students.edit('${student.nis}')"
                            >
                                Edit
                            </button>

                            <button
                                class="btn btn-delete"
                                onclick="Students.remove('${student.nis}')"
                            >
                                Hapus
                            </button>

                        </td>

                    </tr>
                `;

            });

        }

        html += `
                </tbody>

            </table>
        `;

        container.innerHTML = html;

    },



    /*
    ==========================
    FORM
    ==========================
    */

    showForm(student = null) {

        const modal =
            document.getElementById("studentModal");

        modal.classList.remove("hidden");

        modal.innerHTML = `

            <div class="modal">

                <div class="modal-content">

                    <h2>

                        ${student ? "Edit" : "Tambah"} Siswa

                    </h2>

                    <div class="form-group">

                        <label>NIS</label>

                        <input
                            id="nis"
                            value="${student ? student.nis : ""}"
                            ${student ? "readonly" : ""}
                        >

                    </div>

                    <div class="form-group">

                        <label>Nama</label>

                        <input
                            id="nama"
                            value="${student ? student.nama : ""}"
                        >

                    </div>

                    <div class="form-group">

                        <label>Jenis Kelamin</label>

                        <select id="jk">

                            <option value="L">Laki-laki</option>

                            <option value="P">Perempuan</option>

                        </select>

                    </div>

                    <div class="form-group">

                        <label>Kelas</label>

                        <select id="kelas">

                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>

                        </select>

                    </div>

                    <button
                        class="btn"
                        id="btnSaveStudent"
                    >

                        Simpan

                    </button>

                    <button
                        class="btn btn-delete mt-20"
                        id="btnCancelStudent"
                    >

                        Batal

                    </button>

                </div>

            </div>

        `;

        if (student) {

            document.getElementById("jk").value = student.jk;

            document.getElementById("kelas").value = student.kelas;

        }

        document
            .getElementById("btnSaveStudent")
            .addEventListener("click", () => {

                this.save(student);

            });

        document
            .getElementById("btnCancelStudent")
            .addEventListener("click", () => {

                modal.classList.add("hidden");

            });

    },



    /*
    ==========================
    SAVE
    ==========================
    */

    save(oldStudent = null) {

        const student = {

            nis: document.getElementById("nis").value.trim(),

            nama: document.getElementById("nama").value.trim(),

            jk: document.getElementById("jk").value,

            kelas: document.getElementById("kelas").value

        };

        if (
            student.nis === "" ||
            student.nama === ""
        ) {

            alert("Lengkapi data.");

            return;

        }

        if (oldStudent) {

            Database.updateStudent(
                oldStudent.nis,
                student
            );

        } else {

            if (Database.getStudent(student.nis)) {

                alert("NIS sudah digunakan.");

                return;

            }

            Database.addStudent(student);

        }

        document
            .getElementById("studentModal")
            .classList.add("hidden");

        this.renderTable();

        if (typeof App !== "undefined") {

            App.loadDashboard();

        }

    },



    /*
    ==========================
    EDIT
    ==========================
    */

    edit(nis) {

        const student =
            Database.getStudent(nis);

        if (!student) return;

        this.showForm(student);

    },



    /*
    ==========================
    DELETE
    ==========================
    */

    remove(nis) {

        if (!confirm("Hapus siswa ini?")) {

            return;

        }

        Database.deleteStudent(nis);

        this.renderTable();

        if (typeof App !== "undefined") {

            App.loadDashboard();

        }

    }

};



document.addEventListener("DOMContentLoaded", () => {

    Students.init();

});
