module.exports.getDate = getDate;

function getDate(){
    const today = new Date();
    
    const options={
        weekday: "long",
        month: "long",
        day: "numeric"
    };
    return today.toLocaleDateString("en-US",options);
}
module.exports.getDay = getDay;
function getDay(){
    const today = new Date();
    
    const options={
        weekday: "long"
    };
    return today.toLocaleDateString("en-US",options);
}