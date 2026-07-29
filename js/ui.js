/*
===========================================
SIMA
UI Module
Version : 1.0
===========================================
*/

const UI = {

    toastTimer: null,

    init() {

        this.createToast();

        this.createLoading();

    },



    /*
    ===================================
    TOAST
    ===================================
    */

    createToast() {

        if (document.getElementById("toast")) return;

        const toast = document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.minWidth = "280px";
        toast.style.padding = "14px 18px";
        toast.style.borderRadius = "12px";
        toast.style.background = "#2563EB";
        toast.style.color = "#FFFFFF";
        toast.style.fontWeight = "600";
        toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";
        toast.style.zIndex = "99999";
        toast.style.display = "none";

        document.body.appendChild(toast);

    },



    /*
    ===================================
    SHOW TOAST
    ===================================
    */

    toast(message, type = "info") {

        const toast = document.getElementById("toast");

        if (!toast) return;

        clearTimeout(this.toastTimer);

        let color = "#2563EB";

        switch(type){

            case "success":
                color = "#22C55E";
                break;

            case "warning":
                color = "#EAB308";
                break;

            case "error":
                color = "#EF4444";
                break;

        }

        toast.style.background = color;

        toast.textContent = message;

        toast.style.display = "block";

        this.toastTimer = setTimeout(() => {

            toast.style.display = "none";

        },3000);

    },



    /*
    ===================================
    LOADING
    ===================================
    */

    createLoading(){

        if(document.getElementById("loading")) return;

        const loading = document.createElement("div");

        loading.id = "loading";

        loading.innerHTML = `
            <div class="loading-box">
                Memuat...
            </div>
        `;

        loading.style.position = "fixed";
        loading.style.left = "0";
        loading.style.top = "0";
        loading.style.right = "0";
        loading.style.bottom = "0";
        loading.style.background = "rgba(255,255,255,.6)";
        loading.style.display = "none";
        loading.style.justifyContent = "center";
        loading.style.alignItems = "center";
        loading.style.zIndex = "99998";

        document.body.appendChild(loading);

    },



    /*
    ===================================
    SHOW LOADING
    ===================================
    */

    showLoading(){

        const loading = document.getElementById("loading");

        if(loading){

            loading.style.display = "flex";

        }

    },



    /*
    ===================================
    HIDE LOADING
    ===================================
    */

    hideLoading(){

        const loading = document.getElementById("loading");

        if(loading){

            loading.style.display = "none";

        }

    },



    /*
    ===================================
    CONFIRM
    ===================================
    */

    confirm(message){

        return window.confirm(message);

    }

};



document.addEventListener("DOMContentLoaded",()=>{

    UI.init();

});
