/*
===========================================
SIMA
Report Module
Version : 1.0
===========================================
*/

const Report = {

    init() {

        this.renderPage();

    },



    /*
    ==========================
    HALAMAN
    ==========================
    */

    renderPage() {

        const page = document.getElementById("reports");

        if (!page) return;

        page.innerHTML = `

            <div class="report-header">

                <div class="form-group">

                    <label>Tanggal</label>

                    <input
                        type="date"
                        id="reportDate"
                    >

                </div>

                <div class="form-group">

                    <label>Kelas</label>

                    <select id="reportClass">

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
                    class="btn"
                    id="btnShowReport">

                    Tampilkan

                </button>

            </div>

            <div class="mt-20">

                <button
                    class="btn"
                    id="btnExportCSV">

                    Export CSV

                </button>

            </div>

            <div
                id="reportTable"
                class="mt-20">

            </div>

        `;

        document.getElementById("reportDate").value =
            new Date().toISOString().slice(0,10);

        document
            .getElementById("btnShowReport")
            .addEventListener("click", () => {

                this.show();

            });

        document
            .getElementById("btnExportCSV")
            .addEventListener("click", () => {

                this.exportCSV();

            });

        this.show();

    },



    /*
    ==========================
    TAMPILKAN
    ==========================
    */

    show() {

        const date =
            document.getElementById("reportDate").value;

        const kelas =
            document.getElementById("reportClass").value;

        let data = Database.getAttendance();

        if (date !== "") {

            data = data.filter(item => item.date === date);

        }

        if (kelas !== "") {

            data = data.filter(item => item.class == kelas);

        }

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

        if (data.length === 0) {

            html += `

            <tr>

                <td colspan="5" class="text-center">

                    Tidak ada data.

                </td>

            </tr>

            `;

        } else {

            data.forEach(item => {

                html += `

                <tr>

                    <td>${item.date}</td>

                    <td>${item.nis}</td>

                    <td>${item.nama}</td>

                    <td>${item.class}</td>

                    <td>${item.status}</td>

                </tr>

                `;

            });

        }

        html += `

            </tbody>

        </table>

        `;

        document.getElementById("reportTable").innerHTML = html;

    },



    /*
    ==========================
    EXPORT CSV
    ==========================
    */

    exportCSV() {

        let data = Database.getAttendance();

        const date =
            document.getElementById("reportDate").value;

        const kelas =
            document.getElementById("reportClass").value;

        if (date !== "") {

            data = data.filter(item => item.date === date);

        }

        if (kelas !== "") {

            data = data.filter(item => item.class == kelas);

        }

        let csv =
            "Tanggal,NIS,Nama,Kelas,Status\n";

        data.forEach(item => {

            csv +=
                `${item.date},${item.nis},${item.nama},${item.class},${item.status}\n`;

        });

        const blob =
            new Blob([csv], {
                type: "text/csv;charset=utf-8;"
            });

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "laporan_absensi.csv";

        link.click();

        URL.revokeObjectURL(url);

    }

};



document.addEventListener("DOMContentLoaded", () => {

    Report.init();

});
