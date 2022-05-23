const wsProtocol = location.protocol.includes('https') ? 'wss:' : 'ws:';
const socket = new WebSocket(`${wsProtocol}//${location.host}`);
const sidebar = document.getElementById("mySidebar");
const main = document.getElementById("main");
const drinkingWaterPollution = document.getElementById("drinking-water-pollution");
const waterPollution = document.getElementById("water-pollution");
const drinkingWaterQuality = document.getElementById("drinking-water-quality");
const waterQuality = document.getElementById("water-quality");

socket.onmessage = (message) =>{
    const response = JSON.parse(message.data);
    drinkingWaterPollution.innerText = response[0];
    waterPollution.innerText = response[1];
    drinkingWaterQuality.innerText = response[2];
    waterQuality.innerText = response[3];
}

function openNav(city) {
    socket.send(JSON.stringify(city));
    sidebar.style.width = "20%";
}

function closeNav() {
    sidebar.style.width = "0";
    main.style.marginLeft= "0";
}
