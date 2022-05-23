const wsProtocol = location.protocol.includes('https') ? 'wss:' : 'ws:';
const socket = new WebSocket(`${wsProtocol}//${location.host}`);

const sidebar = document.getElementById("mySidebar");
const sideDrinkingWaterPollution = document.getElementById("sidebar-drinking-water-pollution");
const sideWaterPollution = document.getElementById("sidebar-water-pollution");
const sideDrinkingWaterQuality = document.getElementById("sidebar-drinking-water-quality");
const sideWaterQuality = document.getElementById("sidebar-water-quality");

const bottomNav = document.getElementById("myNav");
const navDrinkingWaterPollution = document.getElementById("nav-drinking-water-pollution");
const navWaterPollution = document.getElementById("nav-water-pollution");
const navDrinkingWaterQuality = document.getElementById("nav-drinking-water-quality");
const navWaterQuality = document.getElementById("nav-water-quality");

let navOpen = false;
let sidebarOpen = false;

socket.onmessage = (message) =>{
    const response = JSON.parse(message.data);
    sideDrinkingWaterPollution.innerText = response[0];
    sideWaterPollution.innerText = response[1];
    sideDrinkingWaterQuality.innerText = response[2];
    sideWaterQuality.innerText = response[3];
    navDrinkingWaterPollution.innerText = response[0];
    navWaterPollution.innerText = response[1];
    navDrinkingWaterQuality.innerText = response[2];
    navWaterQuality.innerText = response[3];
}

//check whether ws is in closing state or not
function isOpen(ws) { 
    return ws.readyState === ws.OPEN 
}

function openNav(city) {
    if (!isOpen(socket)) {
        return;
    };
    socket.send(JSON.stringify(city));
    if (window.innerWidth > 1000) {
        sidebar.style.width = "220px";
        sidebar.style.right = "0";
        sidebarOpen = true;
    } else if (window.innerWidth <= 1000) {
        bottomNav.style.height = "170px";
        bottomNav.style.bottom = "0";
        navOpen = true;
    }
}

function closeSidebar() {
    sidebar.style.width = "0";
    sidebar.style.right = "-50px";
    sidebarOpen = false;
}

function closeNav() {
    bottomNav.style.height = "0";
    bottomNav.style.bottom = "-50px";
    navOpen = false;
}

window.addEventListener('resize', () => {
    if (window.matchMedia('(max-width: 1000px)').matches && sidebarOpen) {
        closeSidebar();
    } else if (window.matchMedia('(min-width: 1001px)').matches && navOpen) {
        closeNav()
    }
});
