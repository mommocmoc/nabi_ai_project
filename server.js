const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
// const Tone = require("tone/build/esm/core/Tone");

// -------------Services-------------------//

class PoseDataService {
    //data 저장용 Array 생성
    constructor() {
        this.dataList = [];
    }
    // data 호출 함수
    async find() {
        return this.dataList;
    }

    //data 생성 함수
    async create(data) {

        const poseData = {
            id: data.id,
            keypoints: data.keypoints
        }

        this.dataList.push(poseData);

        return poseData
    }

    async update(id, data) {
        this.dataList.forEach(elt => {
            if (elt.id === id) {
                // elt.id = data.id
                elt.keypoints = data.keypoints
            }
        })
    }
}

// --------------Server------------------//

const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({
    extended: true
}));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register an in-memory pose data service
app.use('/datalist', new PoseDataService());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection =>
    app.channel('everybody').join(connection)
);
// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));

// Start the server
app.listen(3030).on('listening', () =>
    console.log('Feathers server listening on localhost:3030')
);

// For good measure let's create a message
// So our API doesn't look so empty
app.service('datalist').create({
    id: 'Hello From Server',
    keypoints: [1, 2, 3, 4, 5]
});

setTimeout(() => {
    app.service('datalist').update("Hello From Server", {
        id: 'Updated From Server',
        keypoints: [6, 5, 4, 3, 2, 1]
    })
}, 1000)