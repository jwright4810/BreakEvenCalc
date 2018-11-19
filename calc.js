



const todaysDate = new Date().toString().split(' ');
const modayrString = todaysDate.slice(0,4).toString();

//formatDate function formats date in yyy-mm-dd
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
//automatically returns current date in yyyy-mm-dd format when page is loaded
document.getElementById('tdDate').value = formatDate(modayrString);
console.log('todays date', formatDate(modayrString)); 

//contractMonth will take in a date and output a contract month in this format- Jan 2019
 function contractMonth(fdMnth) {
    const mnthArray = fdMnth.split('-');
    const rtYear = parseInt(mnthArray[0]);
    const rtMonth = parseInt(mnthArray[1]);
    const rtDay = parseInt(mnthArray[2]);


    if (rtYear === 2018) {
        return true;
    };
    
 } 

 contractMonth("2018-11-18");


function calc() {
    const aveWeight = document.getElementById('aveWgt').value;
    const finishWeight = document.getElementById('finWgt').value;
    const rateOfGain = document.getElementById('rog').value;
    const costOfGain = document.getElementById('cog').value;
    const deathLoss = document.getElementById('dl').value;

    //dof calulates how many days it will take to reach target weight
    let dof = (finishWeight - aveWeight) / rateOfGain;
    // tot calculates how much it will cost based on Cost of gain input
    let tot = dof * costOfGain;
    //totDl factors in deathloss into total 
    let totDl = (tot * 100) / (100 - deathLoss);


    //firstDay is in this formatt yyyy-mm-dd
    const firstDay = document.getElementById('tdDate').value;
    const firDay = new Date(firstDay);
    const finDate = new Date(firDay.setDate(firDay.getDate() + dof));

   
   
    console.log('finish date', formatDate(finDate));
    console.log('days on feed', dof);
    console.log('total cost', tot);
    console.log('total price w/ dl', totDl);
}





