// 서버로 데이터 보내기 설정
const socket = io('http://localhost:3030');
const app = feathers();
app.configure(feathers.socketio(socket));
var username;

async function sendData(username, pose) {
    await app.service('datalist').create({
        id: username,
        keypoints: pose.keypoints
    })
}
async function updateData(username, pose) {
    await app.service('datalist').update(username, {
        keypoints: pose.keypoints
    })
}

function addTest(data) {
    document.getElementById('data').innerHTML += `<p>${data.id}</p>`;
}

// 서버에서 데이터 받기 설정
async function gotList() {
    const dataList = await app.service('datalist').find();
    dataList.forEach(addTest);
    app.service('datalist').on('created', addTest);
}

gotList();