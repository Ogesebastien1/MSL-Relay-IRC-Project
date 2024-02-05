export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url: string, body: any)=>{
    const response = await fetch (url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body
    });

    const data = await response.json();

    if (!response.ok){
        let message;
        // if there is a message key in the data object then ...
        if (data?.message){
            //data.message for error is implemented in the backend side
            message = data.message;
        }else{
            message = data;
        }

        return {error: true, message};
    }

    return data;
}

export const getRequest = async (url: string) => {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok){
        let message = "An error occured!";
        // if there is a message key in the data object then ...
        if (data?.message){
            //data.message for error is implemented in the backend side
            message = data.message;
        }

        return {error: true, message};
    }

    return data;
}