const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGI0MWY0ZTRhYjUxMmU1MjE2NDlkZTRmZmU4MTE0ZWEzOWUzYWNhNTI5ODFkOGYxMWRjYzNlYzYwM2IzN2EyMTBhOGFhYzAxMDliNDdhYWEiLCJpYXQiOjE3NzkwOTQwMzUuNzIzOTEyLCJuYmYiOjE3NzkwOTQwMzUuNzIzOTEzLCJleHAiOjQ5MzQ3Njc2MzUuNzE3NTA3LCJzdWIiOiI3NTYwMTg5OCIsInNjb3BlcyI6W119.Dk28aB0N-VLAA9rbEIjvGdhMRBxtOZX11wPpwsbi2Voi_0qbqicZ0HbOkCmiAIYZLhrmyz8mkCdHIs3WVmocFqgdzvxeEpw--3PJjaaB-LZzCvcOCckPgYQJMhjL1SwaBfiGUjjAg5CUUukX-iEZU3wkd8XeJ8F2v9LN7gI-ilE-2bQXWaGPfisHXm20wJYzsqNykZdqasrMACmSz7E-Auy10dHIDCuxaMckszMaKZFZaGSC1ed4DlnvgifDS_p-oQClMnML7t-vxEwwH7w9CxK1zvEPuyu9KtQ4YU3f38WIFIQkD35ahSua48J4dGaFV8M-oYijagIN-JX3NF3GzYxxSr51oIF1shfaa6I3QY6A-POrjB_NoY6DDyJM-NeJ8ueHxEzBsC2V_On6z4ls_L3koCGM5YF2FsQ5CaBUrHOvnpnZ6ojeuFUkyyrEheXv3DOLF3Bx4S0IYuHc1LhE_Ug0Y2bW_fCAbdRnxxDzowfHfGMUZcUY3O5oTL96vZN9elpGUwP2bAqDfT2ntiqPnCv1wHlwusH3ugHUd9mHOXiROSPVNLgWAfeFonA0OjQm_FFNMvxldeAuG6t_Jrs9dwxrf1jn9um9OzELR2PPU-vtYfrtsJsiwGlMuEql3nWTgSB3Jyp2gKQu7gxlt9LhwOu0togevIzPYp3IGKefumY";

async function convertToWord() {

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files[0]) {
        alert("Please upload PDF");
        return;
    }

    status.innerHTML = "Starting conversion...";

    try {

        // CREATE JOB

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

                        importTask: {
                            operation: "import/upload"
                        },

                        convertTask: {
                            operation: "convert",
                            input: "importTask",
                            input_format: "pdf",
                            output_format: "docx"
                        },

                        exportTask: {
                            operation: "export/url",
                            input: "convertTask"
                        }

                    }

                })

            }
        );



        const data = await response.json();

        console.log(data);



        const uploadTask =
            data.data.tasks.find(
                task => task.name === "importTask"
            );



        const formData = new FormData();



        for (const [key, value] of Object.entries(
            uploadTask.result.form.parameters
        )) {

            formData.append(key, value);

        }



        formData.append(
            "file",
            fileInput.files[0]
        );



        status.innerHTML = "Uploading PDF...";



        await fetch(
            uploadTask.result.form.url,
            {
                method: "POST",
                body: formData
            }
        );



        status.innerHTML = "Waiting for conversion...";



        setTimeout(async () => {

            const checkJob = await fetch(

                `https://api.cloudconvert.com/v2/jobs/${data.data.id}`,

                {
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`
                    }
                }

            );



            const jobData = await checkJob.json();

            console.log(jobData);



            const exportTask =
                jobData.data.tasks.find(
                    task => task.name === "exportTask"
                );



            if (exportTask.result &&
                exportTask.result.files &&
                exportTask.result.files.length > 0) {

                const downloadUrl =
                    exportTask.result.files[0].url;



                status.innerHTML =
                    "Download starting...";



                window.open(downloadUrl, "_blank");

            }

            else {

                status.innerHTML =
                    "Conversion still processing. Try again.";

            }

        }, 10000);

    }

    catch (error) {

        console.error(error);

        status.innerHTML =
            "Conversion failed";

    }

}
