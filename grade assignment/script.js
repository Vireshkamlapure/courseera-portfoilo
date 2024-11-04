function temprature(){
    var c = document.getElementById("cel").value;
    var f = (c * 9/5) + 32;
    document.getElementById("far").value = f;
}

function weight(){
    var k = document.getElementById("kilogram").value;
    var p = k * 2.2;
    document.getElementById("pound").value = p;
}

function distance(){
    var km= document.getElementById("kilometer").value ;
    var m = km * 0.62137;
    document.getElementById("miles").value = m ;
}