export function sendMesToWebsocket(websocket, message) {
    if (1 === websocket.readyState) {
        websocket.send(message);
    }
}

export function closeWebsocket(websocket) {
    if ([0,1].includes(websocket.readyState)) {
        websocket.close();
    }
}