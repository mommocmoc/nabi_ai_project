// Your code will go here
// open up your console - if everything loaded properly you should see 0.3.0
console.log('ml5 version:', ml5.version);

let video;
let model;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    const options ={
        inputs : 34,
        outputs : 3,
        task : 'classification',
        debug : true,
    }
    model = ml5.neuralNetwork(options);
}

function draw() {
    // 거울처럼 보이게 하기위한 설정
    translate(video.width, 0);
    scale(-1, 1); 
    background(200);
    image(video, 0, 0, video.width, video.height);

}