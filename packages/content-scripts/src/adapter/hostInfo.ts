import globalEvent from "../globalEvent";

globalEvent.addListener('ws_clockTower_msg', msg => {
    if (msg instanceof Array && msg[0] === 'gs') {

    }
})