/*
===========================================
SIMA
Local Database
Version : 1.0
===========================================
*/

const Database = {

    DB_NAME: "SIMA_DB",

    STORAGE_KEY: "SIMA_DATA",

    data: {
        students: [],
        attendance: [],
        settings: {
            schoolName: "Madrasah Ibtidaiyah",
            sync: true
        }
    },



    /*
    ==========================
    INIT
    ==========================
    */

    init() {

        const saved = localStorage.getItem(this.STORAGE_KEY);

        if (saved) {

            this.data = JSON.parse(saved);

        } else {

            this.save();

        }

    },



    /*
    ==========================
    SAVE
    ==========================
    */

    save() {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(this.data)
        );

    },



    /*
    ==========================
    STUDENTS
    ==========================
    */

    getStudents() {

        return this.data.students;

    },

    getStudent(nis) {

        return this.data.students.find(
            student => student.nis === nis
        );

    },

    addStudent(student) {

        this.data.students.push(student);

        this.save();

    },

    updateStudent(nis, student) {

        const index = this.data.students.findIndex(
            item => item.nis === nis
        );

        if (index === -1) return false;

        this.data.students[index] = student;

        this.save();

        return true;

    },

    deleteStudent(nis) {

        this.data.students =
            this.data.students.filter(
                student => student.nis !== nis
            );

        this.save();

    },



    /*
    ==========================
    ATTENDANCE
    ==========================
    */

    getAttendance() {

        return this.data.attendance;

    },

    getTodayAttendance() {

        const today = new Date().toISOString().slice(0, 10);

        return this.data.attendance.filter(
            item => item.date === today
        );

    },

    getAttendanceByClass(kelas) {

        const today = new Date().toISOString().slice(0, 10);

        return this.data.attendance.filter(item => {

            return (
                item.date === today &&
                item.class === kelas
            );

        });

    },

    saveAttendance(record) {

        const index = this.data.attendance.findIndex(item => {

            return (
                item.date === record.date &&
                item.nis === record.nis
            );

        });

        if (index === -1) {

            this.data.attendance.push(record);

        } else {

            this.data.attendance[index] = record;

        }

        this.save();

    },



    /*
    ==========================
    SETTINGS
    ==========================
    */

    getSettings() {

        return this.data.settings;

    },

    saveSettings(settings) {

        this.data.settings = settings;

        this.save();

    },



    /*
    ==========================
    RESET DATABASE
    ==========================
    */

    reset() {

        this.data = {

            students: [],

            attendance: [],

            settings: {

                schoolName: "Madrasah Ibtidaiyah",

                sync: true

            }

        };

        this.save();

    }

};



/*
===========================================
INITIALIZE DATABASE
===========================================
*/

Database.init();
