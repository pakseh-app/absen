/*
===========================================
SIMA
Google Sheets Sync
Version : 1.0
===========================================
*/

const Sheets = {

    scriptUrl: "",

    syncing: false,



    /*
    ===========================================
    INIT
    ===========================================
    */

    async init(){

        this.scriptUrl = await Database.getSetting("scriptUrl") || "";

        window.addEventListener("online", () => {

            this.autoSync();

        });

    },



    /*
    ===========================================
    URL VALIDATION
    ===========================================
    */

    async reloadConfig(){

        this.scriptUrl = await Database.getSetting("scriptUrl") || "";

    },



    isReady(){

        return this.scriptUrl !== "";

    },



    /*
    ===========================================
    REQUEST
    ===========================================
    */

    async request(action,data={}){

        await this.reloadConfig();

        if(!this.isReady()){

            return {

                success:false,

                message:"URL Apps Script belum diisi."

            };

        }

        const response = await fetch(this.scriptUrl,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                action,

                data

            })

        });

        return await response.json();

    },



    /*
    ===========================================
    SYNC STUDENTS
    ===========================================
    */

    async syncStudents(){

        if(!navigator.onLine) return;

        if(this.syncing) return;

        this.syncing = true;

        try{

            UI.setSync("☁ Sinkronisasi...","#2563eb");

            const students = await Database.getStudents();

            await this.request(

                "syncStudents",

                students

            );

            UI.online();

        }catch(err){

            console.error(err);

            UI.offline();

        }

        this.syncing = false;

    },



    /*
    ===========================================
    SYNC ATTENDANCE
    ===========================================
    */

    async syncAttendance(){

        if(!navigator.onLine) return;

        if(this.syncing) return;

        this.syncing = true;

        try{

            UI.setSync("☁ Sinkronisasi...","#2563eb");

            const attendance = await Database.getAttendance();

            await this.request(

                "syncAttendance",

                attendance

            );

            UI.online();

        }catch(err){

            console.error(err);

            UI.offline();

        }

        this.syncing = false;

    },

        /*
    ===========================================
    DOWNLOAD STUDENTS
    ===========================================
    */

    async downloadStudents(){

        try{

            const result = await this.request("getStudents");

            if(!result.success){

                return;

            }

            if(Array.isArray(result.data)){

                await Database.importStudents(result.data);

            }

        }catch(err){

            console.error(err);

        }

    },



    /*
    ===========================================
    DOWNLOAD ATTENDANCE
    ===========================================
    */

    async downloadAttendance(){

        try{

            const result = await this.request("getAttendance");

            if(!result.success){

                return;

            }

            if(Array.isArray(result.data)){

                await Database.importAttendance(result.data);

            }

        }catch(err){

            console.error(err);

        }

    },



    /*
    ===========================================
    FULL SYNC
    ===========================================
    */

    async fullSync(){

        if(!navigator.onLine){

            return;

        }

        try{

            UI.setSync("☁ Sinkronisasi...","#2563eb");

            await this.syncStudents();

            await this.syncAttendance();

            await this.downloadStudents();

            await this.downloadAttendance();

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

            UI.success("Sinkronisasi selesai.");

            UI.online();

        }catch(err){

            console.error(err);

            UI.offline();

        }

    },



    /*
    ===========================================
    AUTO SYNC
    ===========================================
    */

    async autoSync(){

        if(!navigator.onLine){

            return;

        }

        await this.fullSync();

    },



    /*
    ===========================================
    RETRY
    ===========================================
    */

    retry(){

        setTimeout(()=>{

            if(navigator.onLine){

                this.fullSync();

            }

        },5000);

    }

};



/*
===========================================
AUTO START
===========================================
*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await Sheets.init();

        if(navigator.onLine){

            await Sheets.fullSync();

        }

    }

);



window.addEventListener(

    "online",

    ()=>{

        Sheets.fullSync();

    }

);



window.addEventListener(

    "offline",

    ()=>{

        UI.offline();

    }

);
