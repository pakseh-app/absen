/*
===========================================
SIMA
Database (IndexedDB)
Version : 2.0 FINAL
===========================================
*/

const Database = {

    db: null,

    async init() {

        return new Promise((resolve, reject) => {

            const request = indexedDB.open("SIMA_DB", 1);

            request.onerror = () => reject(request.error);

            request.onupgradeneeded = (event) => {

                const db = event.target.result;

                if (!db.objectStoreNames.contains("students")) {

                    db.createObjectStore("students", {
                        keyPath: "nis"
                    });

                }

                if (!db.objectStoreNames.contains("attendance")) {

                    db.createObjectStore("attendance", {
                        keyPath: ["date", "nis"]
                    });

                }

                if (!db.objectStoreNames.contains("settings")) {

                    db.createObjectStore("settings", {
                        keyPath: "key"
                    });

                }

            };

            request.onsuccess = () => {

                this.db = request.result;

                resolve();

            };

        });

    },



    /*
    ==========================================
    STUDENTS
    ==========================================
    */

    async getStudents() {

        return this.getAll("students");

    },

    async getStudent(nis) {

        return new Promise((resolve) => {

            const tx = this.db.transaction("students", "readonly");

            const store = tx.objectStore("students");

            const req = store.get(nis);

            req.onsuccess = () => resolve(req.result);

            req.onerror = () => resolve(null);

        });

    },

    async addStudent(student) {

        return this.put("students", student);

    },

    async updateStudent(student) {

        return this.put("students", student);

    },

    async deleteStudent(nis) {

        return new Promise((resolve) => {

            const tx = this.db.transaction("students", "readwrite");

            tx.objectStore("students").delete(nis);

            tx.oncomplete = () => resolve();

        });

    },



    /*
    ==========================================
    ATTENDANCE
    ==========================================
    */

    async getAttendance() {

        return this.getAll("attendance");

    },

    async getTodayAttendance() {

        const today = new Date().toISOString().slice(0,10);

        const all = await this.getAttendance();

        return all.filter(item => item.date === today);

    },

    async saveAttendance(record) {

        return this.put("attendance", record);

    },



    /*
    ==========================================
    SETTINGS
    ==========================================
    */

    async saveSetting(key,value){

        return this.put("settings",{

            key:key,

            value:value

        });

    },

    async getSetting(key){

        return new Promise(resolve=>{

            const tx=this.db.transaction("settings","readonly");

            const store=tx.objectStore("settings");

            const req=store.get(key);

            req.onsuccess=()=>{

                resolve(req.result);

            };

            req.onerror=()=>{

                resolve(null);

            };

        });

    },



    /*
    ==========================================
    GENERIC
    ==========================================
    */

    put(storeName,data){

        return new Promise(resolve=>{

            const tx=this.db.transaction(storeName,"readwrite");

            tx.objectStore(storeName).put(data);

            tx.oncomplete=()=>resolve();

        });

    },

    getAll(storeName){

        return new Promise(resolve=>{

            const tx=this.db.transaction(storeName,"readonly");

            const store=tx.objectStore(storeName);

            const req=store.getAll();

            req.onsuccess=()=>{

                resolve(req.result);

            };

        });

    },



    /*
    ==========================================
    CLEAR DATABASE
    ==========================================
    */

    async clear(){

        const stores=[

            "students",

            "attendance",

            "settings"

        ];

        for(const name of stores){

            await new Promise(resolve=>{

                const tx=this.db.transaction(name,"readwrite");

                tx.objectStore(name).clear();

                tx.oncomplete=()=>resolve();

            });

        }

    }

};



/*
===========================================
START DATABASE
===========================================
*/

Database.init();
