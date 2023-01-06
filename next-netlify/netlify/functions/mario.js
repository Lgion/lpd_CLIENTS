exports.handler = async () => {
    console.log("function run");

    const data = {name: "mario", age: 35, job: 'plumber'}

    //return repsonse to the browser
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}