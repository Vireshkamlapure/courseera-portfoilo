function updateRate(){
    var rate = document.getElementById('rate').value ; 
    document.getElementById('rate-val').innerText = rate ;
}

function compute(){
    var principle = document.getElementById('principle').value;
    var rate = document.getElementById('rate').value;
    var years = document.getElementById('years').value;

    var interest = principle*rate*years / 100 ; 
    var amount = parseInt(principle) + parseFloat(interest);

    var result = document.getElementById('result');

    var year = new Date().getFullYear() + parseInt(years);

    if(principle <= 0 )
    {
        alert("Enter Valid positive amout ");
        document.getElementById('principle').focus();
    }
    else {
        result.innerHTML = "If you deposit $" + "<mark>" + principle + "</mark>" + ",\<br\> at an interest rate of " + "<mark>" + rate + "%" + "</mark>" + "\<br\> You will receive an amount of $" + "<mark>" + amount + "</mark>" + ",\<br\> in the year " + "<mark>" + year + "</mark>" + "\<br\>";
    }

}