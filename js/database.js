/*
===========================================
SIMA
Database Manager
Version : 1.0
===========================================
*/

const db = new Dexie("SIMA_DATABASE");

db.version(1).stores({

    students: "nis,nama,kelas",

    attendance: "[date+nis],date,kelas,status",

    settings: "key"

});

const Database = {

    /*
    ===========================================
    STUDENTS
    ===========================================
    */

    async getStudents(){

        return await db.students
        .orderBy("nama")
        .toArray();

    },



    async getStudent(nis){

        return await db.students.get(nis);

    },



    async saveStudent(student){

        return await db.students.put({

            nis:student.nis,

            nama:student.nama,

            jk:student.jk,

            kelas:student.kelas,

            created:new Date().toISOString()

        });

    },



    async deleteStudent(nis){

        return await db.students.delete(nis);

    },



    async clearStudents(){

        return await db.students.clear();

    },



    /*
    ===========================================
    ATTENDANCE
    ===========================================
    */

    async saveAttendance(data){

        return await db.attendance.put(data);

    },



    async getAttendance(){

        return await db.attendance.toArray();

    },



    async getAttendanceByDate(date){

        return await db.attendance

        .where("date")

        .equals(date)

        .toArray();

    },



    async getAttendanceByClass(date,kelas){

        const data=await db.attendance

        .where("date")

        .equals(date)

        .toArray();

        return data.filter(

            item=>item.kelas==kelas

        );

    },



    async deleteAttendance(date,nis){

        return await db.attendance.delete([

            date,

            nis

        ]);

    },



    async clearAttendance(){

        return await db.attendance.clear();

    },



    /*
    ===========================================
    SETTINGS
    ===========================================
    */

    async saveSetting(key,value){

        return await db.settings.put({

            key,

            value

        });

    },



    async getSetting(key){

        const data=

        await db.settings.get(key);

        return data?data.value:null;

    },



    /*
    ===========================================
    DASHBOARD
    ===========================================
    */

    async dashboard(){

        const students=

        await db.students.count();

        const today=

        Utils.today();

        const attendance=

        await this.getAttendanceByDate(today);

        return{

            students:students,

            hadir:attendance.filter(

                x=>x.status=="Hadir"

            ).length,

            izin:attendance.filter(

                x=>x.status=="Izin"

            ).length,

            sakit:attendance.filter(

                x=>x.status=="Sakit"

            ).length,

            alfa:attendance.filter(

                x=>x.status=="Alfa"

            ).length

        };

    },



    /*
    ===========================================
    IMPORT
    ===========================================
    */

    async importStudents(data){

        await db.students.clear();

        await db.students.bulkPut(data);

    },



    async importAttendance(data){

        await db.attendance.clear();

        await db.attendance.bulkPut(data);

    },



    /*
    ===========================================
    EXPORT
    ===========================================
    */

    async export(){

        return{

            students:await db.students.toArray(),

            attendance:await db.attendance.toArray(),

            settings:await db.settings.toArray()

        };

    },



    /*
    ===========================================
    RESET
    ===========================================
    */

    async reset(){

        await db.students.clear();

        await db.attendance.clear();

        await db.settings.clear();

    }

};
