//#region connecting html
const minuteElement=document.querySelector("#input1");
const secondElement = document.querySelector("#input2");
/**@type {HTMLButtonElement} */
const startButton=document.querySelector("#start-button");
const pauseButton=document.querySelector("#pause-button");
const resetButton=document.querySelector("#reset-button");
const history = document.querySelector("#history");
const allHistory=document.querySelector("#all-history");
let display=[];
//#endregion connecting html

//#region checking elements existance
if(!minuteElement || !secondElement || !startButton || !pauseButton){
    throw new Error("Typing mistake or missing element");
}
//endregion checking elements existance

let intervalId, timeoutId;
let flag=false;
let state= localStorage.getItem("state") || "Idle";


//#region event handling

function changeState(newState){
    function change(){
        state=newState;
    }
    switch(state){
        case "paused":{
            if(newState==="started")change();
        }
        case "started":{
            if(newState==="paused")change();
        }
        case "paused":{
            if(newState==="reset")change();
        }
        default:
            if(newState==="started")change();
    }
    localStorage.setItem("state",state);
}



const handleStartButton=()=>{ 
    flag=false;
       changeState("started");

    startButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    
    async function tick(){
        await operation(1000);
        if(flag===true)return;
        secondElement.value++;
        secondElement.value= String(secondElement.value).padStart(2,"0");
        secondElement.innerHTML=`${secondElement.value}`;
        if(secondElement.value=='60'){
            secondElement.value=0;
            minuteElement.value++;
            minuteElement.value= String(minuteElement.value).padStart(2,"0");
            minuteElement.innerHTML=`${minuteElement}`;
        }
        tick();
    }
    function operation(ms){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve();
            },ms);
        })
    }
    tick();

}


startButton.addEventListener("click", handleStartButton);


const handlePauseButton=()=>{
    flag=true;
    changeState("paused");
    localStorage.setItem("minutes",minuteElement.value);
    localStorage.setItem("seconds",secondElement.value);
    startButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
}

pauseButton.addEventListener("click",handlePauseButton);


function showDisplay(display){
    allHistory.textContent="";
    for(let i=0;i<display.length;i++){
        const output=display[i];
        const historyList=document.createElement("div");
        historyList.textContent=`${i+1} - ${output.minutes} : ${output.seconds}`;
        allHistory.appendChild(historyList);

    }
}



const handleResetButton=()=>{
    flag=true;
    changeState("reset");
    startButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
    let x=minuteElement.value;
    let y = secondElement.value;
    localStorage.setItem("minutes",x);
    localStorage.setItem("seconds",y);
    history.textContent=` Last Recorded Time : ${x}`+" : "+` ${y}`;
    history.classList.add("text-center");
    console.log(localStorage.getItem("seconds"));
    const object = {minutes:x,
        seconds:y};
    display.push(object);
    showDisplay(display);
    minuteElement.value=0;
    secondElement.value=0;

    
}

resetButton.addEventListener("click",handleResetButton);



//#endregion event handling