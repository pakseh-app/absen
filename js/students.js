/*
===========================================
SIMA
Students Module
Version : 1.0
===========================================
*/

const Students = {

    students: [],

    filterClass: "",

    keyword: "",

    async init() {

        await this.load();

        this.render();

    },



    /*
    ===========================================
    LOAD DATA
    ===========================================
    */

    async load() {

        this.students = await Database.getStudents();

    },



    /*
    ===========================================
    RENDER PAGE
    ===========================================
    */

    render() {

        const page = document.getElementById("students");

        if (!page) return;

        page.innerHTML = `

            <div class="toolbar">

                <div class="toolbar-left">

                    <input
                        type="text"
                        id="searchStudent"
                        class="input"
                        placeholder="Cari nama atau NIS">

                    <select
                        id="filterClass"
                        class="input">

                        <option value="">Semua Kelas</option>

                        <option value="1">Kelas 1</option>
                        <option value="2">Kelas 2</option>
                        <option value="3">Kelas 3</option>
                        <option value="4">Kelas 4</option>
                        <option value="5">Kelas 5</option>
                        <option value="6">Kelas 6</option>

                    </select>

                </div>

                <button
                    id="btnAddStudent"
                    class="btn">

                    + Tambah Siswa

                </button>

            </div>

            <div id="studentTable"></div>

        `;

        document

            .getElementById("searchStudent")

            .addEventListener("input",(e)=>{

                this.keyword=e.target.value.toLowerCase();

                this.refresh();

            });

        document

            .getElementById("filterClass")

            .addEventListener("change",(e)=>{

                this.filterClass=e.target.value;

                this.refresh();

            });

        document

            .getElementById("btnAddStudent")

            .addEventListener("click",()=>{

                this.form();

            });

        this.refresh();

    },



    /*
    ===========================================
    FILTER
    ===========================================
    */

    getFiltered() {

        let data=[...this.students];

        if(this.keyword!=""){

            data=data.filter(item=>{

                return (

                    item.nama

                    .toLowerCase()

                    .includes(this.keyword)

                    ||

                    item.nis

                    .includes(this.keyword)

                );

            });

        }

        if(this.filterClass!=""){

            data=data.filter(

                item=>item.kelas==this.filterClass

            );

        }

        return data;

    },



    /*
    ===========================================
    TABLE
    ===========================================
    */

    refresh(){

        const table=document.getElementById("studentTable");

        const data=this.getFiltered();

        let html=`

        <table>

        <thead>

        <tr>

        <th>NIS</th>

        <th>Nama</th>

        <th>JK</th>

        <th>Kelas</th>

        <th width="150">

        Aksi

        </th>

        </tr>

        </thead>

        <tbody>

        `;

        if(data.length===0){

            html+=`

            <tr>

            <td colspan="5"

            class="text-center">

            Belum ada data siswa.

            </td>

            </tr>

            `;

        }

        data.forEach(student=>{

            html+=`

            <tr>

            <td>${student.nis}</td>

            <td>${student.nama}</td>

            <td>${student.jk}</td>

            <td>${student.kelas}</td>

            <td>

                <button

                    class="btn-small edit"

                    onclick="Students.edit('${student.nis}')">

                    Edit

                </button>

                <button

                    class="btn-small danger"

                    onclick="Students.remove('${student.nis}')">

                    Hapus

                </button>

            </td>

            </tr>

            `;

        });

        html+=`

        </tbody>

        </table>

        `;

        table.innerHTML=html;

    },

        /*
    ===========================================
    FORM TAMBAH / EDIT
    ===========================================
    */

    form(student = null) {

        const edit = student !== null;

        UI.open(

            edit ? "Edit Siswa" : "Tambah Siswa",

            `

            <div class="form-group">

                <label>NIS</label>

                <input
                    id="studentNIS"
                    class="input"
                    type="text"
                    value="${edit ? student.nis : ""}"
                    ${edit ? "readonly" : ""}>

            </div>

            <div class="form-group">

                <label>Nama Lengkap</label>

                <input
                    id="studentName"
                    class="input"
                    type="text"
                    value="${edit ? student.nama : ""}">

            </div>

            <div class="form-group">

                <label>Jenis Kelamin</label>

                <select
                    id="studentGender"
                    class="input">

                    <option value="L"
                        ${edit && student.jk=="L" ? "selected" : ""}>

                        Laki-laki

                    </option>

                    <option value="P"
                        ${edit && student.jk=="P" ? "selected" : ""}>

                        Perempuan

                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>Kelas</label>

                <select
                    id="studentClass"
                    class="input">

                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>

                </select>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    id="cancelStudent">

                    Batal

                </button>

                <button
                    class="btn"
                    id="saveStudent">

                    Simpan

                </button>

            </div>

        `
        );

        if(edit){

            document.getElementById("studentClass").value = student.kelas;
        }

        document
            .getElementById("cancelStudent")
            .onclick = () => UI.close();

        document
            .getElementById("saveStudent")
            .onclick = () => this.save(edit);

    },



    /*
    ===========================================
    SIMPAN
    ===========================================
    */

    async save(edit = false) {

        const nis = document
            .getElementById("studentNIS")
            .value
            .trim();

        const nama = document
            .getElementById("studentName")
            .value
            .trim();

        const jk = document
            .getElementById("studentGender")
            .value;

        const kelas = document
            .getElementById("studentClass")
            .value;

        if(nis === ""){

            UI.error("NIS wajib diisi.");

            return;

        }

        if(!Utils.validNIS(nis)){

            UI.error("NIS hanya boleh angka.");

            return;

        }

        if(nama === ""){

            UI.error("Nama siswa wajib diisi.");

            return;

        }

        if(!edit){

            const cek = await Database.getStudent(nis);

            if(cek){

                UI.error("NIS sudah digunakan.");

                return;

            }

        }

        await Database.saveStudent({

            nis,

            nama,

            jk,

            kelas

        });

        await this.load();

        this.refresh();

        UI.close();

        UI.success("Data siswa berhasil disimpan.");

        if(typeof Sheets !== "undefined"){

            Sheets.syncStudents();

        }

        if(typeof UI.refreshDashboard === "function"){

            UI.refreshDashboard();

        }

    },



    /*
    ===========================================
    EDIT
    ===========================================
    */

    async edit(nis){

        const student = await Database.getStudent(nis);

        if(!student){

            UI.error("Data tidak ditemukan.");

            return;

        }

        this.form(student);

    },



    /*
    ===========================================
    HAPUS
    ===========================================
    */

    remove(nis){

        UI.confirm(

            "Hapus Data",

            "Yakin ingin menghapus siswa ini?",

            async()=>{

                await Database.deleteStudent(nis);

                await this.load();

                this.refresh();

                UI.success("Data berhasil dihapus.");

                if(typeof Sheets !== "undefined"){

                    Sheets.syncStudents();

                }

                if(typeof UI.refreshDashboard==="function"){

                    UI.refreshDashboard();

                }

            }

        );

    }

};



document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Students.init();

    }

);
