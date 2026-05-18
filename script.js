function convertToWord() {

    let file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please upload a PDF file first");
        return;
    }

    document.getElementById("status").innerHTML =
    "PDF to Word conversion started...";

    // Future conversion code here
}

function convertToExcel() {

    let file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please upload a PDF file first");
        return;
    }

    document.getElementById("status").innerHTML =
    "PDF to Excel conversion started...";

    // Future conversion code here
}
