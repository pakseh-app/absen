/*
===========================================
SIMA
Utility Functions
Version : 1.0
===========================================
*/

const Utils = {

    /*
    =====================================
    FORMAT TANGGAL
    =====================================
    */

    formatDate(date = new Date()) {

        return date.toLocaleDateString("id-ID", {

            weekday: "long",

            year: "numeric",

            month: "long",

            day: "numeric"

        });

    },



    /*
    =====================================
    FORMAT YYYY-MM-DD
    =====================================
    */

    today() {

        return new Date().toISOString().slice(0,10);

    },



    /*
    =====================================
    GENERATE ID
    =====================================
    */

    uuid() {

        return Date.now().toString(36) +

            Math.random()

            .toString(36)

            .substring(2,10);

    },



    /*
    =====================================
    CEK ONLINE
    =====================================
    */

    isOnline() {

        return navigator.onLine;

    },



    /*
    =====================================
    SIMPAN LOCAL
    =====================================
    */

    save(key,value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },



    /*
    =====================================
    AMBIL LOCAL
    =====================================
    */

    load(key,defaultValue=null){

        const data=localStorage.getItem(key);

        if(!data){

            return defaultValue;

        }

        return JSON.parse(data);

    },



    /*
    =====================================
    HAPUS LOCAL
    =====================================
    */

    remove(key){

        localStorage.removeItem(key);

    },



    /*
    =====================================
    DEBOUNCE
    =====================================
    */

    debounce(callback,delay=300){

        let timer;

        return (...args)=>{

            clearTimeout(timer);

            timer=setTimeout(()=>{

                callback(...args);

            },delay);

        };

    },



    /*
    =====================================
    VALIDASI NIS
    =====================================
    */

    validNIS(nis){

        return /^[0-9]+$/.test(nis);

    },



    /*
    =====================================
    EXPORT JSON
    =====================================
    */

    download(filename,data){

        const blob=new Blob(

            [

                JSON.stringify(

                    data,

                    null,

                    2

                )

            ],

            {

                type:"application/json"

            }

        );

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download=filename;

        a.click();

        URL.revokeObjectURL(url);

    },



    /*
    =====================================
    IMPORT JSON
    =====================================
    */

    async readFile(file){

        return await new Promise(resolve=>{

            const reader=new FileReader();

            reader.onload=e=>{

                resolve(

                    JSON.parse(

                        e.target.result

                    )

                );

            };

            reader.readAsText(file);

        });

    },



    /*
    =====================================
    STATUS ABSENSI
    =====================================
    */

    attendanceColor(status){

        switch(status){

            case "Hadir":

                return "#22C55E";

            case "Izin":

                return "#EAB308";

            case "Sakit":

                return "#3B82F6";

            case "Alfa":

                return "#EF4444";

            default:

                return "#64748B";

        }

    },



    /*
    =====================================
    JUMLAH SISWA PER KELAS
    =====================================
    */

    countByClass(data,kelas){

        return data.filter(

            item=>item.kelas==kelas

        ).length;

    },



    /*
    =====================================
    SORT NAMA
    =====================================
    */

    sortName(data){

        return data.sort((a,b)=>{

            return a.nama.localeCompare(b.nama);

        });

    }

};
