function convertToWord() {

    let file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please upload a PDF file first");
        return;
    }

    let status = document.getElementById("status");

    status.innerHTML = "Uploading PDF...";

    setTimeout(() => {
        status.innerHTML = "Converting PDF to Word...";
    }, 1500);

    setTimeout(() => {
        status.innerHTML = "Preparing download...";
    }, 3000);

    setTimeout(() => {

        status.innerHTML = "Download Started";

        let link = document.createElement("a");

        link.href =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

        link.download = "converted.docx";

        link.click();

    }, 4500);
}



function convertToExcel() {

    let file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Please upload a PDF file first");
        return;
    }

    let status = document.getElementById("status");

    status.innerHTML = "Uploading PDF...";

    setTimeout(() => {
        status.innerHTML = "Converting PDF to Excel...";
    }, 1500);

    setTimeout(() => {
        status.innerHTML = "Preparing download...";
    }, 3000);

    setTimeout(() => {

        status.innerHTML = "Download Started";

        let link = document.createElement("a");

        link.href =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

        link.download = "converted.xlsx";

        link.click();

    }, 4500);
}
