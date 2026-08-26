import "dotenv/config"

const apiResponse = async (message) => {
    const options = {
        method : "POST",
        headers : {
            "x-goog-api-key" : process.env.GEMINI_API_KEY,
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(
            {
                model : "gemini-3.6-flash",
                input : message,
            },
        )
    };

    try {
        let result = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions`,options);
        let data  = await result.json();
        console.log(JSON.stringify(data, null, 2));
        
        const outputStep = data.steps.find(
            step => step.type === "model_output"
        );
        
        return outputStep.content[0].text;
        // return data.steps[1].content[0].text;
    } catch (error) {
        console.log(error);
    }
}

export default apiResponse;