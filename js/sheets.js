/*
===========================================
SIMA
Google Sheets Sync
Version : 1.0
===========================================
*/

const Sheets = {

    /*
    ===========================================
    GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT
    ===========================================
    */

    API_URL: "",



    /*
    ===========================================
    STATUS SYNC
    ===========================================
    */

    setStatus(text, color = "green") {

        const indicator = document.getElementById("syncIndicator");

        if (!indicator) return;

        indicator.textContent = text;

        indicator.style.color = color;

    },



    /*
    ===========================================
    CEK URL API
    ===========================================
    */

    isConfigured() {

        return this.API_URL !== "";

    },



    /*
    ===========================================
    KIRIM DATA SISWA
    ===========================================
    */

    async syncStudents() {

        if (!this.isConfigured()) return;

        this.setStatus("🔄 Sinkronisasi...", "orange");

        try {

            await fetch(this.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    action: "students",

                    data: Database.getStudents()

                })

            });

            this.setStatus("🟢 Tersinkron", "green");

        }

        catch(error){

            console.error(error);

            this.setStatus("🔴 Gagal Sinkron", "red");

        }

    },



    /*
    ===========================================
    KIRIM DATA ABSENSI
    ===========================================
    */

    async syncAttendance() {

        if (!this.isConfigured()) return;

        this.setStatus("🔄 Sinkronisasi...", "orange");

        try{

            await fetch(this.API_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"attendance",

                    data:Database.getAttendance()

                })

            });

            this.setStatus("🟢 Tersinkron","green");

        }

        catch(error){

            console.error(error);

            this.setStatus("🔴 Gagal Sinkron","red");

        }

    },



    /*
    ===========================================
    SINKRON SEMUA DATA
    ===========================================
    */

    async syncAll(){

        if(!navigator.onLine){

            this.setStatus("📴 Offline","gray");

            return;

        }

        await this.syncStudents();

        await this.syncAttendance();

    }

};



/*
===========================================
AUTO SYNC
===========================================
*/

window.addEventListener("online",()=>{

    Sheets.syncAll();

});



/*
===========================================
SYNC SAAT APLIKASI DIBUKA
===========================================
*/

document.addEventListener("DOMContentLoaded",()=>{

    if(navigator.onLine){

        Sheets.syncAll();

    }
    else{

        Sheets.setStatus("📴 Offline","gray");

    }

});
