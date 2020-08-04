// Your code will go here
// open up your console - if everything loaded properly you should see 0.3.0
console.log('ml5 version:', ml5.version);

let video;
let poseNet;
let pose;
let keypoints;
let skeleton;

let brain;
let targetLabel;
let state;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded)
    poseNet.on('pose', gotPoses)
    const options = {
        inputs: 34,
        outputs: 3,
        task: 'classification',
        // debug: true,
    }
    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: './model.json',
        metadata: './model_meta.json',
        weights: './model.weights.bin'
    }
    brain.load(modelInfo, brainLoaded)
    // brain.loadData('you.json', dataReady);
}

function brainLoaded() {
    console.log('Pose Data Loaded');
}
function goClassify(inputs) {
    brain.classify(inputs, gotResult)
}

function gotResult(err, result) {
    console.log(result);
    console.log(result[0].label);
}

function dataReady() {
    brain.normalizeData();
    brain.train({
        epochs: 100
    }, finished);
}

function finished() {
    console.log(('model trained!'));
    brain.save();
}

function keyPressed() {
    if (key === 's') {
        brain.saveData();
    } else {
        targetLabel = key;
        console.log(targetLabel);
        setTimeout(() => {
            console.log('collecting');
            state = 'collecting';
            setTimeout(() => {
                console.log('stop collectiong');
                state = 'waiting'
            }, 10000);
        }, 10000);
    }
}

function gotPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        keypoints = pose.keypoints;
        //get Inputs Data & send to Classify Model
        let inputs = [];
            keypoints.forEach(element => {
                let x = element.position.x;
                let y = element.position.y;
                inputs.push(x);
                inputs.push(y);
            })
            let target = [targetLabel];
            brain.addData(inputs, target)
            goClassify(inputs)
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('ready');
}

function draw() {
    // 거울처럼 보이게 하기위한 설정
    translate(video.width, 0);
    scale(-1, 1);
    background(200);
    image(video, 0, 0, video.width, video.height);
    if (pose) {
        keypoints.forEach(element => {
            fill(255, 0, 0);
            ellipse(element.position.x, element.position.y, 10, 10);
        });
    }

    if (skeleton) {
        skeleton.forEach((element, i) => {
            let a = element[0].position;
            let b = element[1].position;
            strokeWeight(2);
            stroke(255)
            line(a.x, a.y, b.x, b.y);
        })
    }

}