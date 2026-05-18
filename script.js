const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTJkOGE2YzVkZTcyZDA3MzA1MjUzZGIxNmZkZjJhODhjMzQ4MTlhMjI3Y2JkYzFiOWZlYjY4NTg2Nzk0M2RlNzAyMGNmZTBlYzlmN2VhYWMiLCJpYXQiOjE3NzkwOTE4OTkuNTMwMDMxLCJuYmYiOjE3NzkwOTE4OTkuNTMwMDMzLCJleHAiOjQ5MzQ3NjU0OTkuNTIyOTA5LCJzdWIiOiI3NTYwMTg5OCIsInNjb3BlcyI6W119.hkozQiRy9Z-5ZsTsBI7P2mZGgNxamT88u9A3aT1srr3FK9YWmHvLdBOEGQt_cr9hhWR4i6uiT4TUtKNb_x7DL0fRyY8rptEjO5b6CSvgHGIMazYvrYun9odGIn_hPfRzCH5KuqFo_BC-wmnVn1ms0ypCAD7bwFgglCuNtL_IRx-E4o5Y_MODbPKgh08lq7l6lBTdWGIymuj9E_Q495NumtrFN4mpv9TkczYFWRztclW58yKEmWRRPbv5ka_txL2Wc_yxZhbbnBmzLwU9o5umRsWzm2gh55mphP6oV3X6k_tQ6CP16M07w-5WNn8H-E87htzMya8dKVifScRl8zVWuqBAcdK7yVUl_5EQVSnkm7p5Yxqtiy3KyIIteC-klhzIxZPNVVLuKLvUuItBKHrNlfZF-G16t8scKM_v3_Hf_K89S71gyyDJQ5SjZW9sFBdRzZKezWJSIimtPKZaHjHR28ZiD8mnisZUfK2BcQRPdnCvZOQ2XN-8Vbxq1-9tKeC0-yJ3E3x279O-zOiU_kSNWvA4RsGwc4fmQGr8wbY5q365Uk7kUDU6ZYTk-kmTo2xSazHmt_d4MKOjiHISxtbiD0HuiH69wg0ctb37jBGJ7Xz1B1V1gR59dMn34oegIXwjE88PGaVoeUC1Kcz16In3viZXVtjk9WKyqGwKVHH9QrE";



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
