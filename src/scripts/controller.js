import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";
require('datatables.net-dt');

function controller(){
    //URL
    // const baseUrl = "http://localhost/api/admission";
    const baseUrl = "http://kemakom.cs.upi.edu/api/admission";
    //Data-Table
    const dtOpt = {
            "ajax" : {
                "url" : `${baseUrl}`,  
            },
            "order" : [0,"desc"],
            "columns" : [
                { 
                    "data" : "id",
                    visible : false, 
                },
                { "data" : "name" },
                { "data" : "GREScore" },
                { "data" : "TOEFLScore" },
                { "data" : "UnivRating" },
                { "data" : "SOP" },
                { "data" : "LOR" },
                { "data" : "CGPA" },
                { "data" : "RES" },
                { "data" : "AdmChance" },
                {
                    sortable: false,
                    render: function ( data, full, row ) {
                        const id = row.id;
                        return `<button type="button" class="btn btn-warning text-white" data-toggle="modal" data-target="#theModal" data-id="${id}">Edit</button>`;
                    }
                },
                {
                    sortable: false,
                    render: function ( data, type, row ) {
                        const id = row.id;
                        return `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#delModal" data-id="${id}">Delete</button>`;
                    }
                },
            ]
    };
    const table = $("#example").DataTable(dtOpt);
 

    const getData = async () => {
        table.ajax.reload();
    }

    const popData = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/${id}`);
            const json = await response.json();
            if(json.error) {
                getMsg("OKA");
            } else {
                console.log(id);
                renderModal(json.data);
                console.log(json.data);
            }
        } catch(error) {
           getMsg(error);
        }
    }

    const insertData = async (data) => {
        try {
            const opt = {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(data)
            }
            const response = await fetch(`${baseUrl}`,opt);
            const json = await response.json();
            getMsg(json.msg);
            $("#theModal").modal('hide');
            getData();
        } catch(error) {
            getMsg(error);
        }
    }

    const updateData = async (data) => {
        try {
            console.log("MAsuk Sini loh");
            const opt = {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(data)
            }
            const response = await fetch(`${baseUrl}/${data.id}`,opt);
            const json = await response.json();
            getMsg(json.msg);
            $("#theModal").modal('hide');
            getData();
        } catch(error) {
            getMsg(error);
        }
    }

    const removeData = async (dataId) => {
        try {
            const opt = {
                method: "DELETE",
            }
            const response = await fetch(`${baseUrl}/${dataId}`,opt);
            const json = await response.json();
            getMsg(json.msg);
            $("#delModal").modal('hide');
            getData();
        } catch(error) {
            getMsg(error);
        }
    }

    const renderModal = (data) => {

        const inputId = document.querySelector("#inputId");
        const inputName = document.querySelector("#inputName");
        const inputGREScore = document.querySelector("#inputGREScore");
        const inputTOEFLScore = document.querySelector("#inputTOEFLScore");
        const inputUnivRating = document.querySelector("#inputUnivRating");
        const inputSOP = document.querySelector("#inputSOP");
        const inputLOR = document.querySelector("#inputLOR");
        const inputCGPA = document.querySelector("#inputCGPA");
        const inputRES = document.querySelector("#inputRES");
        const inputAdmChance = document.querySelector("#inputAdmChance");

        inputId.value = (data != null) ? data.id : '';   
        inputName.value = (data != null) ? data.name : '';
        inputGREScore.value = (data != null) ?data.GREScore : '';
        inputTOEFLScore.value = (data != null) ? data.TOEFLScore : '';
        inputUnivRating.value = (data != null) ? data.UnivRating : '';
        inputSOP.value = (data != null) ? data.SOP : '';
        inputLOR.value = (data != null) ? data.LOR : '';
        inputCGPA.value = (data != null) ? data.CGPA : '';
        inputRES.value = (data != null) ? data.RES : '';
        inputAdmChance.value = (data != null) ? data.AdmChance : '';   

    }

    const getMsg = (message = "General Error") => {
        alert(message);
    };

    document.addEventListener("DOMContentLoaded", () => {

        getData();

        $("#buttonSave").on("click", () => {
            const data = {
                name: inputName.value,
                GREScore: inputGREScore.value,
                TOEFLScore: inputTOEFLScore.value,
                UnivRating: inputUnivRating.value,
                SOP: inputSOP.value,
                LOR: inputLOR.value,
                CGPA: inputCGPA.value,
                RES: inputRES.value,
                AdmChance: inputAdmChance.value
            };
            insertData(data);
        });

        $("#buttonUpdate").on("click", () => {
            const data = {
                id: Number.parseInt(inputId.value),
                name: inputName.value,
                GREScore: inputGREScore.value,
                TOEFLScore: inputTOEFLScore.value,
                UnivRating: inputUnivRating.value,
                SOP: inputSOP.value,
                LOR: inputLOR.value,
                CGPA: inputCGPA.value,
                RES: inputRES.value,
                AdmChance: inputAdmChance.value
            };
            updateData(data);

        });

        $("#buttonDelete").on("click", () => {
            const data = document.querySelector("#delId").value;
            removeData(data);
        });



        $("#theModal").on('show.bs.modal', function (ev) {
            var link = $(ev.relatedTarget);
            var id = link.data('id');
            if(id){
                $(this).find('.modal-header').text('Edit Data');
                $("#buttonSave").css('display','none');
                $("#buttonUpdate").css('display','block');
                popData(id);
            }else{
                $(this).find('.modal-header').text('Add Data');
                $("#buttonUpdate").css('display','none');
                $("#buttonSave").css('display','block');
                renderModal(null);
            }
        });
        $("#delModal").on('show.bs.modal', function (ev) {
            var link = $(ev.relatedTarget);
            var id = link.data('id');
            if(id){
                document.querySelector("#delId").value = id;
            }
        });

    });
}
export default controller;