/*
===========================================
SIMA
Dexie Database
===========================================
*/

const db = new Dexie("SIMA_DB");

db.version(1).stores({

    students: "nis,nama,kelas",

    attendance: "[date+nis],date,kelas,status",

    settings: "key"

});

const Database = {

    async getStudents() {

        return await db.students.toArray();

    },

    async getStudent(nis) {

        return await db.students.get(nis);

    },

    async saveStudent(student) {

        await db.students.put(student);

    },

    async deleteStudent(nis) {

        await db.students.delete(nis);

    },



    async getAttendance() {

        return await db.attendance.toArray();

    },

    async getAttendanceByDate(date) {

        return await db.attendance
            .where("date")
            .equals(date)
            .toArray();

    },

    async saveAttendance(data) {

        await db.attendance.put(data);

    },



    async clearAttendance() {

        await db.attendance.clear();

    },



    async clearStudents() {

        await db.students.clear();

    },



    async saveSetting(key,value){

        await db.settings.put({

            key,

            value

        });

    },



    async getSetting(key){

        const data=await db.settings.get(key);

        return data?.value;

    }

};
