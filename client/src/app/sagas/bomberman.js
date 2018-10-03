import {all, takeEvery, put} from "redux-saga/effects";

import {retrieveCookie} from "../helpers/cookies.helper";

import {
    MODE_SET_GAME,
    GAME_PLAYER_MOVE,
    GAME_PLAYER_CURRENT_MOVE
} from "../actions/bomberman";

function launchGame(socketClient) {
    socketClient.emit("game.launch", {userToken: socketClient.socket.query.token});
}

function* sendMove(socketClient, {payload}) {
    yield put({type: GAME_PLAYER_MOVE, payload});
    if (!payload.isRollback) {
        socketClient.emit("game.player.move", {...payload, userToken: retrieveCookie("userToken")});
    }
}

function* flow(socketClient) {
    yield all([
        takeEvery(MODE_SET_GAME, launchGame, socketClient),
        takeEvery(GAME_PLAYER_CURRENT_MOVE, sendMove, socketClient) 
    ]);
}

export default flow;