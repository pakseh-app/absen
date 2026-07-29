/*
===========================================
SIMA
UI Module
Version 1.0
===========================================
*/

const UI = {

    loadingEl: null,
    toastEl: null,
    modalEl: null,
    modalBody: null,

    init() {

        this.createLoading();
        this.createToast();
        this.createModal();

    },



    /*
    ===========================================
    LOADING
    ===========================================
    */

    createLoading() {

        const div = document.createElement("div");

        div.id = "loading";

        div.innerHTML = `
            <div class="loading-box">

                <div class="loading-spinner"></div>

                <p>Memuat...</p>

            </div>
        `;

        document.body.appendChild(div);

        this.loadingEl = div;

    },



    showLoading(text = "Memuat...") {

        this.loadingEl.style.display = "flex";

        this.loadingEl.querySelector("p").textContent = text;

    },



    hideLoading() {

        this.loadingEl.style.display = "none";

    },



    /*
    ===========================================
    TOAST
    ===========================================
    */

    createToast() {

        const div = document.createElement("div");

        div.id = "toast";

        document.body.appendChild(div);

        this.toastEl = div;

    },



    toast(message, type = "success") {

        this.toastEl.className = "";

        this.toastEl.classList.add(type);

        this.toastEl.innerHTML = message;

        this.toastEl.classList.add("show");

        clearTimeout(this.toastTimer);

        this.toastTimer = setTimeout(() => {

            this.toastEl.classList.remove("show");

        }, 3000);

    },



    success(msg) {

        this.toast(msg, "success");

    },



    error(msg) {

        this.toast(msg, "error");

    },



    warning(msg) {

        this.toast(msg, "warning");

    },



    info(msg) {

        this.toast(msg, "info");

    },



    /*
    ===========================================
    MODAL
    ===========================================
    */

    createModal() {

        const modal = document.createElement("div");

        modal.id = "modal";

        modal.innerHTML = `

            <div class="modal-content">

                <div class="modal-header">

                    <h3 id="modalTitle">

                    </h3>

                    <button id="closeModal">

                        ✕

                    </button>

                </div>

                <div
                    id="modalBody"
                    class="modal-body">

                </div>

            </div>

        `;

        document.body.appendChild(modal);

        this.modalEl = modal;

        this.modalBody = document.getElementById("modalBody");

        document

            .getElementById("closeModal")

            .onclick = () => {

                this.close();

            };



        modal.onclick = (e) => {

            if (e.target.id == "modal") {

                this.close();

            }

        };

    },



    open(title, html) {

        document

            .getElementById("modalTitle")

            .textContent = title;

        this.modalBody.innerHTML = html;

        this.modalEl.style.display = "flex";

    },



    close() {

        this.modalEl.style.display = "none";

    },



    /*
    ===========================================
    CONFIRM
    ===========================================
    */

    confirm(title, message, callback) {

        this.open(title, `

            <p>${message}</p>

            <div class="modal-footer">

                <button
                    id="cancelBtn"
                    class="btn btn-secondary">

                    Batal

                </button>

                <button
                    id="okBtn"
                    class="btn">

                    Ya

                </button>

            </div>

        `);

        document

            .getElementById("cancelBtn")

            .onclick = () => {

                this.close();

            };

        document

            .getElementById("okBtn")

            .onclick = () => {

                this.close();

                callback();

            };

    },



    /*
    ===========================================
    ALERT
    ===========================================
    */

    alert(title, message) {

        this.open(title, `

            <p>${message}</p>

            <div class="modal-footer">

                <button
                    id="okAlert"
                    class="btn">

                    OK

                </button>

            </div>

        `);

        document

            .getElementById("okAlert")

            .onclick = () => {

                this.close();

            };

    },



    /*
    ===========================================
    BADGE STATUS
    ===========================================
    */

    badge(status) {

        switch (status) {

            case "Hadir":

                return `<span class="badge success">Hadir</span>`;

            case "Izin":

                return `<span class="badge warning">Izin</span>`;

            case "Sakit":

                return `<span class="badge info">Sakit</span>`;

            case "Alfa":

                return `<span class="badge danger">Alfa</span>`;

            default:

                return `<span class="badge">${status}</span>`;

        }

    },



    /*
    ===========================================
    DATE
    ===========================================
    */

    showToday() {

        const el = document.getElementById("todayDate");

        if (!el) return;

        el.innerHTML = Utils.formatDate();

    },



    /*
    ===========================================
    DASHBOARD
    ===========================================
    */

    async refreshDashboard() {

        const data = await Database.dashboard();

        document.getElementById("totalStudents").textContent = data.students;

        document.getElementById("presentCount").textContent = data.hadir;

        document.getElementById("permitCount").textContent = data.izin;

        document.getElementById("sickCount").textContent = data.sakit;

        document.getElementById("absentCount").textContent = data.alfa;

    },



    /*
    ===========================================
    SYNC STATUS
    ===========================================
    */

    setSync(text, color = "#22c55e") {

        const el = document.getElementById("syncIndicator");

        if (!el) return;

        el.innerHTML = text;

        el.style.color = color;

    },



    online() {

        this.setSync("🟢 Online");

    },



    offline() {

        this.setSync("🔴 Offline", "#ef4444");

    }

};



document.addEventListener("DOMContentLoaded", async () => {

    UI.init();

    UI.showToday();

    await UI.refreshDashboard();

    if (navigator.onLine) {

        UI.online();

    } else {

        UI.offline();

    }

});



window.addEventListener("online", () => {

    UI.online();

});



window.addEventListener("offline", () => {

    UI.offline();

});
