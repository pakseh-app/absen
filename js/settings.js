/*
===========================================
SIMA
Settings Module
Version : 1.0
===========================================
*/

const Settings = {

    async init() {

        this.render();

        await this.load();

    },



    /*
    ===========================================
    HALAMAN
    ===========================================
    */

    render() {

        const page = document.getElementById("settings");

        if (!page) return;

        page.innerHTML = `

        <div class="card">

            <h2>Pengaturan</h2>

            <br>

            <label>

                URL Google Apps Script

            </label>

            <input

                id="scriptUrl"

                class="input"

                placeholder="https://script.google.com/macros/s/..."

            >

            <br><br>

            <button

                class="btn"

                id="saveSettings">

                Simpan Pengaturan

            </button>

        </div>



        <div class="card">

            <h2>Backup Database</h2>

            <br>

            <button

                class="btn"

                id="backupBtn">

                Download Backup

            </button>

        </div>



        <div class="card">

            <h2>Restore Database</h2>

            <br>

            <input

                type="file"

                id="restoreFile"

                accept=".json">

        </div>



        <div class="card">

            <h2>Reset Semua Data</h2>

            <br>

            <button

                class="btn danger"

                id="resetBtn">

                Reset Database

            </button>

        </div>



        <div class="card">

            <h2>Tentang Aplikasi</h2>

            <p>

                SIMA v1.0

            </p>

            <p>

                Sistem Informasi Absensi Madrasah

            </p>

            <p>

                Offline + Google Sheets Sync

            </p>

        </div>

        `;

        this.bind();

    },



    /*
    ===========================================
    EVENT
    ===========================================
    */

    bind(){

        document

        .getElementById("saveSettings")

        .onclick=()=>this.save();

        document

        .getElementById("backupBtn")

        .onclick=()=>this.backup();

        document

        .getElementById("restoreFile")

        .addEventListener(

            "change",

            (e)=>this.restore(e)

        );

        document

        .getElementById("resetBtn")

        .onclick=()=>this.reset();

    },



    /*
    ===========================================
    LOAD
    ===========================================
    */

    async load(){

        const url=

        await Database.getSetting(

            "scriptUrl"

        );

        if(url){

            document

            .getElementById("scriptUrl")

            .value=url;

        }

    },



    /*
    ===========================================
    SAVE
    ===========================================
    */

    async save(){

        const url=

        document

        .getElementById("scriptUrl")

        .value

        .trim();

        await Database.saveSetting(

            "scriptUrl",

            url

        );

        UI.success(

            "Pengaturan berhasil disimpan."

        );

    },

      /*
    ===========================================
    BACKUP DATABASE
    ===========================================
    */

    async backup(){

        try{

            UI.showLoading("Membuat backup...");

            const data = await Database.export();

            Utils.download(

                "SIMA_Backup_" + Utils.today() + ".json",

                data

            );

            UI.hideLoading();

            UI.success("Backup berhasil dibuat.");

        }catch(err){

            console.error(err);

            UI.hideLoading();

            UI.error("Backup gagal.");

        }

    },



    /*
    ===========================================
    RESTORE DATABASE
    ===========================================
    */

    async restore(event){

        const file = event.target.files[0];

        if(!file){

            return;

        }

        try{

            UI.showLoading("Memulihkan database...");

            const data = await Utils.readFile(file);

            if(data.students){

                await Database.importStudents(

                    data.students

                );

            }

            if(data.attendance){

                await Database.importAttendance(

                    data.attendance

                );

            }

            if(data.settings){

                for(const item of data.settings){

                    await Database.saveSetting(

                        item.key,

                        item.value

                    );

                }

            }

            UI.hideLoading();

            UI.success("Restore berhasil.");

            if(typeof Students!=="undefined"){

                await Students.load();

                Students.refresh();

            }

            if(typeof Reports!=="undefined"){

                await Reports.reload();

            }

            if(typeof UI.refreshDashboard==="function"){

                await UI.refreshDashboard();

            }

        }catch(err){

            console.error(err);

            UI.hideLoading();

            UI.error("File backup tidak valid.");

        }

    },



    /*
    ===========================================
    RESET DATABASE
    ===========================================
    */

    reset(){

        UI.confirm(

            "Reset Database",

            "Semua data akan dihapus. Lanjutkan?",

            async()=>{

                try{

                    UI.showLoading("Menghapus data...");

                    await Database.reset();

                    UI.hideLoading();

                    UI.success("Database berhasil direset.");

                    location.reload();

                }catch(err){

                    console.error(err);

                    UI.hideLoading();

                    UI.error("Reset gagal.");

                }

            }

        );

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

        Settings.init();

    }

);
