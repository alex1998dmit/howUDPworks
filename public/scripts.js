// Utils -----
function clearArea() {
    $( "button" ).remove();
    $(".state-sign").remove();
    $(".client-sign").css("border-bottom", "0px solid green");
    $(".server-sign").css("border-bottom", "0px solid green");	
    $(".arrow").css("opacity", "0.1");
}

function generateRandomSeq() {
    let min = 1;
    let max = 65555;
    return  Math.round( min - 0.5 + Math.random() * (max - min + 1));
}
// -----------------------------
// Start state 
class Main {
    constructor() {
        this.state = new BeforeStart(this);
        this.signState = "";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "53";        
        this.side = "client";
        this.arrow = "first";
        this.srcPort = this.portClient;
        this.dstPort = this.portServer;
        this.srcIp = this.ipClient;
        this.dstIp = this.ipServer;
    }

    clickFirstButton() {
        clearArea();
        this.state.clickFirstButton();
    }

    clickSecondButton() {
        clearArea();
        this.state.clickSecondButton();
    }

    render(){
        this.changeStatusSign();
        this.showIPs();
        this.showSide();
        this.showArrow();        
        this.changeClientStatus();
        this.changeServerStatus();
    }

    changeStatusSign() {
        $("#status-signs").html(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showIPs() {        
        $("#clientId").text(`${this.ipClient}:${this.portClient}`);
        $("#serverId").text(`${this.ipServer}:${this.portServer}`);
    }

    showSide() {
        $(`.${this.side}-sign`).css("border-bottom", "4px solid green");	 
    }

    showArrow() {
        $(`.arrow`).css("opacity", 0.1);
        $(`.arrow-${this.arrow}`).css("opacity", "1");
    }

    changeTable() {
        $("tbody").append(`
            <tr>
                <td class="table-src-ip">${this.srcIp}</td>
                <td class="table-dst-ip">${this.dstIp}</td>
                <td class="table-src-port">${this.srcPort}</td>
                <td class="table-dst-port">${this.dstPort}</td>
            </tr>
        `);
    }

    changeClientStatus() {
        $(".client-sign h6").text(this.clientStatus);
    }

    changeServerStatus() {
        $(".server-sign h6").text(this.serverStatus);
    }

    setParamsDefault() {
        this.signState = "";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "110";
        this.seq = 0;
        this.ack = 0;
        this.side = "client";
        this.arrow = "first";
        this.cli = [];
        this.srcPort = this.portClient;
        this.dstPort = this.portServer;
        this.clientStatus = "";
        this.serverStatus = "";     
    }
}
// -------------------------------------------------------------------
class BeforeStart {
    constructor(mainState) {
        this.mainState = mainState;
    }

    clickFirstButton() {
        this.mainState.state = new StartState(this.mainState);
        this.mainState.render();      
    }
}
// -------------------------------------------------------------------
class StartState {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.addButtonForSynRequest();
    }

    setParams() {
        this.mainState.signState = "Начальное состояние. Подготовка к отправке запроса на DNS-сервер";
        this.mainState.arrow = "first";
        this.mainState.changeTable();
    }

    clickFirstButton() {
        this.mainState.state = new SendedRequest(this.mainState);
        this.mainState.render();
    }

    addButtonForSynRequest() {
        $("#start-state-button").append(`<button type="button" id="send-first-flag-button" class="btn btn-primary first-button">Отпавить запрос</button>`);
    }
}
// ---------------------------------------------------------------------------------
class SendedRequest {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
    }

    setParams() {
        this.mainState.signState = "Клиент выполнил DNS-запрос.";
        this.mainState.side = "server";
        this.renderAcceptButton();
        this.renderRejectButton();
    }

    clickFirstButton() {
        this.mainState.state = new ServerReceived(this.mainState);
        this.mainState.render();
    }

    clickSecondButton() {
        this.mainState.state = new ServerReject(this.mainState);
        this.mainState.render();
    }

    renderAcceptButton() {
        $("#start-state-button").append(`<button type="button" id="received-syn-server" class="btn btn-success first-button">Accept</button>`);
    }

    renderRejectButton() {
        $("#start-state-button").append(`<button type="button" id="reject-syn-server" class="btn btn-danger second-button">Reject</button>`);
    }
}
// ---------------------------------------------------------------------------------
class ServerReceived {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.renderAckAndSynButtons();
    }

    setParams() {
        this.mainState.signState = "DNS-Сервер получил запрос.";
        this.mainState.side = 'server';
        this.mainState.arrow = 'second';
        [this.mainState.srcPort, this.mainState.dstPort] = [this.mainState.dstPort, this.mainState.srcPort];
        [this.mainState.srcIp, this.mainState.dstIp] = [this.mainState.dstIp, this.mainState.srcIp];
        this.mainState.changeTable();
    }

    clickFirstButton() {
        this.mainState.state = new SendedResponce(this.mainState);
        this.mainState.render();
    }

    renderAckAndSynButtons() {
        $("#start-state-button").append(`<button type="button" id="send-syn-ack" class="btn btn-success first-button">Send responce</button>`);
    }
}
// ---------------------------------------------------------------------------------
class ServerReject {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.renderButtons();
    }

    setParams() {
        this.mainState.signState = "Сервер не принял запрос. Запуск таймера.";
        this.mainState.arrow = "second";
    }


    clickFirstButton() {
        this.mainState.state = new StartState(this.mainState);
        this.mainState.render();
    }

    renderButtons() {
        $("#start-state-button").append(`<button type="button" id="send-rst" class="btn btn-success first-button">Timeout is over</button>`);
    }
}
// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------
class SendedResponce {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.renderAckAndSynButtons();
    }

    setParams() {
        this.mainState.signState = "DNS-Сервер отправил ответ.";
        this.mainState.side = 'client';
        this.mainState.srcPort = this.mainState.portServer;
        this.mainState.dstPort = this.mainState.portClient;
    }

    clickFirstButton() {
        this.mainState.state = new ClientGetResponce(this.mainState);
        this.mainState.render();
    }

    renderAckAndSynButtons() {
        $("#start-state-button").append(`<button type="button" id="send-syn-ack" class="btn btn-success first-button">Received responce</button>`);
    }
}

class ClientGetResponce {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.countDatagramParams();
        this.renderDatagram();
    }

    setParams() {
        this.mainState.signState = "Клиент получил ответ";
        this.mainState.side = 'client';
        [this.mainState.srcIp, this.mainState.dstIp] = [this.mainState.dstIp, this.mainState.srcIp];
    }

    clickFirstButton() {
        this.mainState.state = new SendedResponce(this.mainState);
        this.mainState.render();
    }

    countDatagramParams() {
        this.portSenderLen = this.mainState.srcPort.length -1;
        this.portReceivedLen = this.mainState.dstPort.length - 1;
        this.data = 'example.com'.length - 1;
        this.datagramLength  = (64 + this.data);
    }

    renderDatagram() {
        const datagram = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Порт отправителя</th>
                    <th scope="col">Порт получателя</th>
                    <th scope="col">Длина датаграммы</th>
                    <th scope="col">Контрольная сумма</th>
                    <th scope="col">Данные</th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td>${this.mainState.srcPort}</td>
                        <td>${this.mainState.dstPort}</td>
                        <td>${this.datagramLength}</td>
                        <td>0</td>
                        <td>example.com</td>
                    </tr>
            </tbody>
        </table>
        `;
        $('#datagram').append(datagram);
    }
}
// -------------------------------------------------------------------
// Logic
let tcp = new Main();

$(document).on ("click", ".first-button",  (e) => {
    tcp.clickFirstButton(e.target);
    console.log(tcp);
});

$(document).on ("click", ".second-button",  (e) => {
    tcp.clickSecondButton(e.target);
    console.log(tcp);
});