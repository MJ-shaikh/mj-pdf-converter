alert("JavaScript Loaded");
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWU0M2JlYzQ3YTJjNTcwNDYwZmMzZmRiNDVkNzRjNjM2OGIzYjc5M2I2MDk3NmM1Y2I4MGYzNTY3NTBmMTk1MzcwMzljYWEyYWQ2YjAyMWUiLCJpYXQiOjE3NzkwOTMxNTcuNDM4OTUxLCJuYmYiOjE3NzkwOTMxNTcuNDM4OTUzLCJleHAiOjQ5MzQ3NjY3NTcuNDMzNzksInN1YiI6Ijc1NjAxODk4Iiwic2NvcGVzIjpbXX0.cG5KS1mozsgSENQIqaTx0to8KqIA4rkmctbrjWH3uytUDCRtc91BCvWicU-7-Lso2xHDFnAj9RcNhn_OOQ41UqIoDeolvqXz7nDROJQgoMkIWGUQ3OuIFnfad1BSe1geVpMA3v5l8Asfd192LGWc5uu52Lv_yG7B5g1ieizE2H3wDLA1-LQ035hX1ZF0QK8QeUBFGjZMENcMD1pQhpCcVIV1qI5fw2Ap31BjLAT340EWAnpdt8hQc4s3OQ5h8m0ik9QfiFcRjYrnspWGVmQxZ6Jvokb1C3UhmO8GKMhbwPkfT82Wtodm4mLGxNfKlX6mc8DwNnhtUGnigGa3_dO8dCkdXuIrzOrKuc7aSUBb_VwJgkhrcEIwEorQ5uhGtxlhe2mj0of6hCQZoaeZPHKG0og-90P1ksnblCppHKQUomQv0bNubZIo7fX6dl68-VsCCnmyEQxEaC2Xm-_eFexcUxuF2BEWOOOkJhOEwNgwljYb4v6XrklD3l6l0obItE2D_rSA7orK-t6mcgjqEzCkQjSu8L-5f7ryyvT7w7uLJ0MGZI-RwaCvqVYjKB-vdMIDwPFwQZ0TDOHaf-JCJ5mWLZsygdhzxqFmVfdvlAO_aOYoN6-crwp9YlEbTpQ3SJK5AnZEH2FcwhbDWCJhmHNDVRypuheqMvmJ8kRtuJ1ZTrY";



async function convertToWord() {

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {

        alert("Please upload a PDF file");
        return;
    }

    const file = fileInput.files[0];

    status.innerHTML = "Creating conversion job...";

    try {

        // CREATE CLOUDCONVERT JOB

        const response = await fetch(
            "https://api.cloudconvert.com/v2/jobs",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    tasks: {

                        "upload-file": {
                            operation: "import/upload"
                        },

                        "convert-file": {
                            operation: "convert",
                            input: "upload-file",
                            input_format": "pdf",
                            "output_format": "docx"
                        },

                        "export-file": {
                            operation: "export/url",
                            input: "convert-file"
                        }

                    }

                })

            }
        );



        const job = await response.json();

        console.log(job);

        status.innerHTML = "Uploading PDF...";



        // FIND UPLOAD TASK

        const uploadTask = job.data.tasks.find(
            task => task.name === "upload-file"
        );



        // CREATE FORM DATA

        const formData = new FormData();



        // ADD REQUIRED PARAMETERS

        for (const [key, value] of Object.entries(
            uploadTask.result.form.parameters
        )) {

            formData.append(key, value);

        }



        // ADD FILE

        formData.append("file", file);



        // UPLOAD FILE

        await fetch(uploadTask.result.form.url, {

            method: "POST",
            body: formData

        });



        status.innerHTML = "Converting PDF to Word...";



        // WAIT FOR CONVERSION

        let completed = false;

        while (!completed) {

            await new Promise(resolve => setTimeout(resolve, 3000));



            const statusResponse = await fetch(

                `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,

                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`
                    }
                }

            );



            const statusData = await statusResponse.json();

            console.log(statusData);



            if (statusData.data.status === "finished") {

                completed = true;



                const exportTask = statusData.data.tasks.find(
                    task => task.name === "export-file"
                );



                const downloadUrl =
                    exportTask.result.files[0].url;



                status.innerHTML =
                    "Conversion completed. Download starting...";



                window.open(downloadUrl, "_blank");

            }

        }

    }

    catch (error) {

        console.error(error);

        status.innerHTML =
            "Error during conversion";

    }

}





async function convertToExcel() {

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {

        alert("Please upload a PDF file");
        return;
    }

    const file = fileInput.files[0];

    status.innerHTML = "Creating conversion job...";

    try {

        const response = await fetch(
            "https://api.cloudconvert.com/v2/jobs",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    tasks: {

                        "upload-file": {
                            operation: "import/upload"
                        },

                        "convert-file": {
                            operation: "convert",
                            input: "upload-file",
                            "input_format": "pdf",
                            "output_format": "xlsx"
                        },

                        "export-file": {
                            operation: "export/url",
                            input: "convert-file"
                        }

                    }

                })

            }
        );



        const job = await response.json();

        status.innerHTML = "Uploading PDF...";



        const uploadTask = job.data.tasks.find(
            task => task.name === "upload-file"
        );



        const formData = new FormData();



        for (const [key, value] of Object.entries(
            uploadTask.result.form.parameters
        )) {

            formData.append(key, value);

        }



        formData.append("file", file);



        await fetch(uploadTask.result.form.url, {

            method: "POST",
            body: formData

        });



        status.innerHTML = "Converting PDF to Excel...";



        let completed = false;

        while (!completed) {

            await new Promise(resolve => setTimeout(resolve, 3000));



            const statusResponse = await fetch(

                `https://api.cloudconvert.com/v2/jobs/${job.data.id}`,

                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`
                    }
                }

            );



            const statusData = await statusResponse.json();



            if (statusData.data.status === "finished") {

                completed = true;



                const exportTask = statusData.data.tasks.find(
                    task => task.name === "export-file"
                );



                const downloadUrl =
                    exportTask.result.files[0].url;



                status.innerHTML =
                    "Conversion completed. Download starting...";



                window.open(downloadUrl, "_blank");

            }

        }

    }

    catch (error) {

        console.error(error);

        status.innerHTML =
            "Error during conversion";

    }

}
