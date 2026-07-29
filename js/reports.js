/*
===========================================
SIMA
Reports Module
Version : 1.0
===========================================
*/

const Reports = {

    data: [],

    filtered: [],

    async init() {

        this.render();

        await this.load();

    },



    /*
    ==========================================
    LOAD DATA
    ==========================================
    */

    async load() {

        this.data = await Database.getAttendance();

        this.filtered = [...this.data];

        this.refresh();

    },



    /*
    ==========================================
    HALAMAN
    ==========================================
    */

    render() {

        const page = document.getElementById("reports");

        if (!page) return;

        page.innerHTML = `

        <div class="toolbar">

            <div class="toolbar-left">

                <input
                    type="date"
                    id="reportDate"
                    class="input">

                <select
                    id="reportClass"
                    class="input">

                    <option value="">Semua Kelas</option>

                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>

                </select>

                <input
                    type="text"
                    id="reportSearch"
                    class="input"
                    placeholder="Cari Nama / NIS">

            </div>

            <div class="toolbar-right">

                <button
                    class="btn"
                    id="btnExportCSV">

                    Export CSV

                </button>

                <button
                    class="btn btn-secondary"
                    id="btnPrint">

                    Print

                </button>

            </div>

        </div>

        <div id="reportSummary"></div>

        <div id="reportTable"></div>

        `;



        document.getElementById("reportDate").value = Utils.today();

        document.getElementById("reportDate")
        .addEventListener("change",()=>this.filter());

        document.getElementById("reportClass")
        .addEventListener("change",()=>this.filter());

        document.getElementById("reportSearch")
        .addEventListener("input",()=>this.filter());

        document.getElementById("btnExportCSV")
        .addEventListener("click",()=>this.exportCSV());

        document.getElementById("btnPrint")
        .addEventListener("click",()=>window.print());

    },



    /*
    ==========================================
    FILTER
    ==========================================
    */

    filter(){

        const date =
        document.getElementById("reportDate").value;

        const kelas =
        document.getElementById("reportClass").value;

        const keyword =
        document.getElementById("reportSearch")
        .value
        .toLowerCase();

        this.filtered = this.data.filter(item=>{

            const matchDate =
            date=="" || item.date==date;

            const matchClass =
            kelas=="" || item.kelas==kelas;

            const matchKeyword =

                item.nama
                .toLowerCase()
                .includes(keyword)

                ||

                item.nis
                .includes(keyword);

            return (

                matchDate &&

                matchClass &&

                matchKeyword

            );

        });

        this.refresh();

    },

        /*
    ==========================================
    REFRESH
    ==========================================
    */

    refresh(){

        this.renderSummary();

        this.renderTable();

    },



    /*
    ==========================================
    SUMMARY
    ==========================================
    */

    renderSummary(){

        const el = document.getElementById("reportSummary");

        const hadir =
            this.filtered.filter(x=>x.status=="Hadir").length;

        const izin =
            this.filtered.filter(x=>x.status=="Izin").length;

        const sakit =
            this.filtered.filter(x=>x.status=="Sakit").length;

        const alfa =
            this.filtered.filter(x=>x.status=="Alfa").length;

        el.innerHTML = `

        <div class="cards">

            <div class="card">

                <h3>Hadir</h3>

                <h2>${hadir}</h2>

            </div>

            <div class="card">

                <h3>Izin</h3>

                <h2>${izin}</h2>

            </div>

            <div class="card">

                <h3>Sakit</h3>

                <h2>${sakit}</h2>

            </div>

            <div class="card">

                <h3>Alfa</h3>

                <h2>${alfa}</h2>

            </div>

        </div>

        `;

    },



    /*
    ==========================================
    TABLE
    ==========================================
    */

    renderTable(){

        const table = document.getElementById("reportTable");

        let html = `

        <table>

            <thead>

                <tr>

                    <th>Tanggal</th>

                    <th>NIS</th>

                    <th>Nama</th>

                    <th>Kelas</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

        `;

        if(this.filtered.length===0){

            html += `

                <tr>

                    <td colspan="5"

                        class="text-center">

                        Tidak ada data.

                    </td>

                </tr>

            `;

        }

        this.filtered.forEach(item=>{

            html += `

            <tr>

                <td>${item.date}</td>

                <td>${item.nis}</td>

                <td>${item.nama}</td>

                <td>${item.kelas}</td>

                <td>

                    ${UI.badge(item.status)}

                </td>

            </tr>

            `;

        });

        html += `

            </tbody>

        </table>

        `;

        table.innerHTML = html;

    },



    /*
    ==========================================
    EXPORT CSV
    ==========================================
    */

    exportCSV(){

        if(this.filtered.length===0){

            UI.warning("Tidak ada data untuk diekspor.");

            return;

        }

        let csv =
            "Tanggal,NIS,Nama,Kelas,Status\n";

        this.filtered.forEach(item=>{

            csv +=

                `"${item.date}",`+

                `"${item.nis}",`+

                `"${item.nama}",`+

                `"${item.kelas}",`+

                `"${item.status}"\n`;

        });

        const blob = new Blob(

            [csv],

            {

                type:"text/csv;charset=utf-8;"

            }

        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "laporan-absensi-"+Utils.today()+".csv";

        a.click();

        URL.revokeObjectURL(url);

        UI.success("CSV berhasil dibuat.");

    },



    /*
    ==========================================
    RELOAD
    ==========================================
    */

    async reload(){

        await this.load();

    }

};



/*
===========================================
START MODULE
===========================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Reports.init();

    }

);
