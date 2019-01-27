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
    function feederContractMonth(fdMnth) {
      const mnthArray = fdMnth.split('-');
      const rtYear = parseInt(mnthArray[0]);
      const rtMonth = parseInt(mnthArray[1]);
      const newContract = [];
    
      if (rtMonth === 12 || rtMonth === 1) {
          newContract.push('JAN');
      } else if (rtMonth === 2 || rtMonth === 3) {
          newContract.push('MAR');
      } else if (rtMonth === 4) {
          newContract.push('APR');
      } else if (rtMonth === 5) {
          newContract.push('MAY');
      } else if (rtMonth === 6 || rtMonth === 7 || rtMonth === 8) {
        newContract.push('AUG');
      } else if (rtMonth === 9) {
        newContract.push('SEP');
      } else if (rtMonth === 10) {
        newContract.push('OCT');
      } else if (rtMonth === 11) {
        newContract.push('NOV');
      } else {console.log('error')};

      if (rtMonth === 12 ) {
        newContract.push(rtYear + 1);  
      } else {
        newContract.push(rtYear);
      };
    const finalNewContract = newContract.join(' ').toString();
    return finalNewContract;
 } 

 //API that grabs the future prices and updates the object futPrices
let futPrices = {}; 
 
fetch('http://localhost:3000')
  .then(response => response.json())
  .then(data => {
    for(let props in data) {
      futPrices[props] = data[props];
    }
  console.log(futPrices);
  })
//function ran when calculator button is clicked
function calc() {

    const aveWeight = document.getElementById('aveWgt').value;
    const finishWeight = document.getElementById('finWgt').value;
    const rateOfGain = document.getElementById('rog').value;
    const costOfGain = document.getElementById('cog').value;
    const deathLoss = document.getElementById('dl').value;
    const finDay = document.getElementById('fin-date-output');
    const finContractMonth = document.getElementById('contract-month-output');
    const bidPrice = document.getElementById('bd-pr').value;
    const sellPrice = document.getElementById('sel-pr').value;
    const sellPricePh = document.getElementById('sel-pr');
    const profitOutput  = document.getElementById('profit-output');
    const feederBreakeven = document.getElementById('feeder-be');

    if(isNaN(aveWeight) || aveWeight === "" || 
       isNaN(finishWeight) || finishWeight === "" || 
       isNaN(rateOfGain) || rateOfGain === "" ||
       isNaN(costOfGain) || costOfGain === "" || 
       isNaN(deathLoss) || deathLoss === "") {
      alert("Please fill out all require fields with a number.")
    } else {
    //dof calulates how many days it will take to reach target weight
    let dof = (finishWeight - aveWeight) / rateOfGain;
    // tot calculates how much it will cost based on Cost of gain input
    let tot = (finishWeight - aveWeight) * costOfGain;
    //totDl factors in deathloss into total 
    const totDl = (tot * 100) / (100 - deathLoss);
    //breakeven gives the price you can sell a calf to breakeven on the price
    const breakEven = (totDl + (aveWeight * bidPrice)) / finishWeight;
    //beProfit is the sellPrice minus breakeven multiplied by the finish weight
    const beProfit = (sellPrice - breakEven) * finishWeight;  

    //firstDay is in this formatt yyyy-mm-dd
    const firstDay = document.getElementById('tdDate').value;
    const firDay = new Date(firstDay);
    const finDate = new Date(firDay.setDate(firDay.getDate() + dof));

    const finDateFormat = (function () {
        const arr = formatDate(finDate).split('-');
        const reorderArr = [arr[1], arr[2], arr[0]].join('/').toString();
        return reorderArr;
      })();
    
    //calculations outputs
    const futurePricesMonth = feederContractMonth(formatDate(finDate));
    
    
    finDay.innerHTML = finDateFormat;
    finContractMonth.innerHTML = futurePricesMonth + ' Feeder Cattle'; 
    feederBreakeven.innerHTML = '$ ' + ((breakEven * 100).toFixed(2) + ' CWT');  
    profitOutput.innerHTML = '$ ' + beProfit.toFixed(2) + ' /head';
   
    //update sell price with current future price on the calculated contract month 
      for(let key in futPrices) {
        if(key === futurePricesMonth && futPrices[key] !== '-') {
          sellPricePh.value = (parseFloat(futPrices[key]) / 100).toFixed(3); 
        }
      } 
    }
  } 
  //reset function resets all input fields to an empty string

  function resetValues() {
   allInputs = document.getElementsByTagName('input');
   allOutputs = document.getElementsByTagName('p');
  //  sets Purchase Date to current date
   document.getElementById('tdDate').value = formatDate(modayrString);
  // sets all inputs to an empty string
   for(let i = 0; i < allInputs.length; i++) {
     if(allInputs[i].type !== 'date') {
       allInputs[i].value = '';
     }
    }
  // sets all outputs to an empty string 
    for(let j = 0; j < allOutputs.length; j++) {
      allOutputs[j].innerHTML = '';
    }
  }


// function increments bid price by .5
function incrementor() {
  let bid = parseFloat(document.getElementById('bd-pr').value); 
  
  if(isNaN(bid)) {
    alert('Please input a starting bid.');
  } else {
    bid = isNaN(bid) ? 0 : bid;
    bid = bid + (5/100); 
    document.getElementById('bd-pr').value = bid.toFixed(2); 
    calc();
  }
  
}
// function decrements bid price by .5
function decrementor() {
  let bid = parseFloat(document.getElementById('bd-pr').value); 
  if(isNaN(bid)) {
    alert('Please input a starting bid.');
  } else {
    bid = isNaN(bid) ? 0 : bid;
    bid = bid - (5/100); 
    document.getElementById('bd-pr').value = bid.toFixed(2); 
    calc();
  }

}

document.getElementById('calc').addEventListener('click', calc);
document.getElementById('bid-up').addEventListener('click', incrementor);
document.getElementById('bid-down').addEventListener('click', decrementor);
document.getElementById('reset').addEventListener('click', resetValues);
document.getElementById('bd-pr').addEventListener('change', calc); 
document.getElementById('sel-pr').addEventListener('change', calc); 
  
