
let passwordDisplay = document.querySelector('.password');
let slider = document.querySelector('.range');
let number = document.querySelector('.number');
let copied = document.querySelector('.copied');
let copiedText = document.querySelector('.copiedText');

let upperCase = document.querySelector('#checkbox1');
let lowerCase = document.querySelector('#checkbox2');
let numbers = document.querySelector('#checkbox3');
let symbols = document.querySelector('#checkbox4');
let allCheckBox = document.querySelectorAll('input[type=checkbox]');

let indicator = document.querySelector('#indicator');
let generate = document.querySelector('.generate');


let password = "";
let passwordLength = 10;
let checkCount = 0;


function handleSlider(){
    slider.value = passwordLength;
    number.innerText = passwordLength;
}

//Math.random => [0,1)
function randFunc(min,max){
    return Math.floor((max-min)*Math.random() + min);
}

function randInterger(){
    return randFunc(0,10);
}

function randUpperCase(){
    return String.fromCharCode(randFunc(65,91));
}

function randlowerCase(){
    return String.fromCharCode(randFunc(97,123));
}


const symbolChars = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function randSymbols(){
    return symbolChars.charAt(randFunc(0,symbolChars.length));
}

function calcStrength(){
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasSymbols = false;
    let hasNumbers = false;

    if(upperCase.checked) hasUpperCase = true;
    if(lowerCase.checked) hasLowerCase = true;
    if(numbers.checked) hasNumbers = true;
    if(symbols.checked) hasSymbols = true;

    if((hasUpperCase && lowerCase && (hasNumbers || hasSymbols)) && password.length >= 8)      indicator.style.backgroundColor = "#0f0";
    else if((hasLowerCase||hasUpperCase) && (hasNumbers||hasSymbols) && password.length>=6)  indicator.style.backgroundColor = "#ff0";
    else  indicator.style.backgroundColor = "#f00";
    
    return;
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copiedText.innerText = "copied";
    } catch (error) {
        copiedText.innerText="failed";
    }
    copiedText.classList.add('active'); 
    setTimeout(()=>{
         copiedText.classList.remove("active");
    },1000);

}

copied.addEventListener('click',()=>{
   if(passwordDisplay.value!="")  copyContent(); 
});

//instead of click even we give input event for seekbar!!!
slider.addEventListener('input',(e)=>{
   passwordLength = e.target.value;
   handleSlider(); 
});

function countHandleFunc(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    });
    
    //edge case
    if(passwordLength < checkCount ){
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    for(let i=array.length-1 ; i>0 ;i--){
        const j = Math.floor(Math.random()*(i+1));
        let temp = array[j];
        array[j] = array[i];
        array[i] = temp; 
    }
    let str = "";
    array.forEach((value)=>{str += value});
    return str;
}

generate.addEventListener('click',()=>{

    countHandleFunc();

    if(checkCount == 0) {alert('Kindly select options !!'); return;}

    password = "";

    let funcArr = [];
    if(upperCase.checked) funcArr.push(randUpperCase);
    if(lowerCase.checked) funcArr.push(randlowerCase);
    if(symbols.checked) funcArr.push(randSymbols);
    if(numbers.checked) funcArr.push(randInterger);

    //function are passed by reference that its a call instead of arr[i] provided function is there in array
    funcArr.forEach((value,i,arr)=>{
        password += arr[i]();
    })

    for(let i=0; i<(passwordLength-funcArr.length); i++){
        let randIdx = randFunc(0,funcArr.length);
        password += funcArr[randIdx]();
    }

    password = shufflePassword(Array.from(password));
  
    passwordDisplay.value = password;
    calcStrength();
});

