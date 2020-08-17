     // More API functions here:
     // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

     // the link to your model provided by Teachable Machine export panel
     var $loginPage = $('.login.page');
     let model, webcam, ctx, labelContainer, maxPredictions, username, initURL, synth, sampler, casioOn, piano, pianoOn, drumOn;
     let predictionVal = [];
     let previousVal = [null, null, null, null, null, null, null, null];
     //audio Part
     let AudioContext = window.AudioContext || window.webkitAudioContext;

     //Frequency of note
     //https://pages.mtu.edu/~suits/notefreqs.html
     //Pentatronic Scale C5,D5,E5,F5, G5,A5, B5, C6
     let maxFreq = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
     var $loginPage = $('.login.page');

     async function init() {
         if (initURL === undefined || initURL.length < 5) {
             initURL = "https://teachablemachine.withgoogle.com/models/8TTYQRHkI/";
         }
         const modelURL = initURL + "model.json";
         const metadataURL = initURL + "metadata.json";

         // load the model and metadata
         // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
         // Note: the pose library adds a tmPose object to your window (window.tmPose)
         model = await tmPose.load(modelURL, metadataURL);
         maxPredictions = model.getTotalClasses();

         // Convenience function to setup a webcam
         const size = 600;
         const flip = true; // whether to flip the webcam
         webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
         await webcam.setup(); // request access to the webcam
         await webcam.play();
         window.requestAnimationFrame(loop);
         $loginPage.fadeOut();
         $loginPage.off('click');
         const body = document.querySelector("body");
         body.setAttribute("class", "green")

         // append/get elements to the DOM
         const welcome = document.getElementById("welcome");
         welcome.innerHTML = `어서오세요, ${username}! 포즈로 음악을 연주해볼까요?🎹`
         const soundControl = document.getElementById("sound")

         //Osc Type Selector
         const oscTypes = ["Sine", "Sawtooth", "Square", "Triangle", "Chords", "Piano", "Drum"]
         const oscLabel = document.createElement("label")
         oscLabel.setAttribute("for", "osc-select")
         oscLabel.innerHTML = "소리를 바꿔보기 : "
         const oscTypeSelector = document.createElement("select");
         oscTypeSelector.setAttribute("id", "osc-select")
         oscTypes.forEach(element => {
             const option = document.createElement("option");
             option.setAttribute("value", element)
             option.innerHTML = element;
             oscTypeSelector.appendChild(option)
         });
         soundControl.appendChild(oscLabel);
         soundControl.appendChild(oscTypeSelector);
         oscTypeSelector.onchange = function () {
             //  oscillator.type = oscTypeSelector.value
             if (oscTypeSelector.value === "Chords") {
                 casioOn = true;
             } else if (oscTypeSelector.value === "Piano") {
                casioOn = false;
                pianoOn = true;
            } else if (oscTypeSelector.value === "Drum") {
                casioOn = false;
                pianoOn = false;
             } else {
                 casioOn = false;
                 pianoOn = false;
                 synth.type = oscTypeSelector.value.toLowerCase();
             }

         }

         // mute button
         const muteButton = document.createElement("button");
         muteButton.setAttribute("data-muted", "false")
         muteButton.setAttribute('class', 'unmute')
         muteButton.innerText = "🔇음소거"
         soundControl.appendChild(muteButton);
         muteButton.onclick = function () {
             if (muteButton.getAttribute('data-muted') === 'false') {
                 //  gainNode.disconnect(audioCtx.destination);
                 Tone.Destination.mute = true;
                 muteButton.setAttribute('data-muted', 'true');
                 muteButton.setAttribute('class', 'mute')
                 muteButton.innerHTML = "🔈음소거 해제";
             } else {
                 // gainNode.connect(audioCtx.destination);
                 Tone.Destination.mute = false;
                 muteButton.setAttribute('data-muted', 'false');
                 muteButton.setAttribute('class', 'unmute')
                 muteButton.innerHTML = "🔇음소거";
             }
         };

         //Canvas
         const canvas = document.getElementById("canvas");
         canvas.width = size;
         canvas.height = size;
         ctx = canvas.getContext("2d");
         labelContainer = document.getElementById("label-container");
         for (let i = 0; i < maxPredictions; i++) { // and class labels
             labelContainer.appendChild(document.createElement("div"));
         }
         //Audio Part using Tone.js
         casioOn = false;
         pianoOn = false;
         drumOn = false;
         synth = new Tone.Oscillator().toDestination();
         synth.type = 'sine';
         sampler = new Tone.Sampler({
             urls: {
                 A1: "A1.mp3",
                 A2: "A2.mp3",
             },
             baseUrl: "https://tonejs.github.io/audio/casio/"
             //  onload: () => {
             //      sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
             //  }
         }).toDestination();
         piano = new Tone.Sampler({
             urls: {
                 A0: "A0.mp3",
                 C1: "C1.mp3",
                 "D#1": "Ds1.mp3",
                 "F#1": "Fs1.mp3",
                 A1: "A1.mp3",
                 C2: "C2.mp3",
                 "D#2": "Ds2.mp3",
                 "F#2": "Fs2.mp3",
                 A2: "A2.mp3",
                 C3: "C3.mp3",
                 "D#3": "Ds3.mp3",
                 "F#3": "Fs3.mp3",
                 A3: "A3.mp3",
                 C4: "C4.mp3",
                 "D#4": "Ds4.mp3",
                 "F#4": "Fs4.mp3",
                 A4: "A4.mp3",
                 C5: "C5.mp3",
                 "D#5": "Ds5.mp3",
                 "F#5": "Fs5.mp3",
                 A5: "A5.mp3",
                 C6: "C6.mp3",
                 "D#6": "Ds6.mp3",
                 "F#6": "Fs6.mp3",
                 A6: "A6.mp3",
                 C7: "C7.mp3",
                 "D#7": "Ds7.mp3",
                 "F#7": "Fs7.mp3",
                 A7: "A7.mp3",
                 C8: "C8.mp3"
             },
             release: 1,
             baseUrl: "https://tonejs.github.io/audio/salamander/"
         }).toDestination();
         drum = new Tone.Sampler({
             urls: {
                kick : "kick.mp3",
                snare : "snare.mp3",
                hihat : "hihat.mp3",
                tom1 : "tom1.mp3",
                tom2 : "tom2.mp3",
                tom3 : "tom3.mp3"
             },
             baseUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/"
         }).toDestination();
         drum.add("crash","./crash-hr.wav");
         //  //audio Part Loading
         //  audioCtx = new AudioContext();
         //  oscillator = audioCtx.createOscillator();
         //  oscillator.type = 'sine';
         //  gainNode = audioCtx.createGain();
         //  oscillator.connect(gainNode);
         //  gainNode.connect(audioCtx.destination);
         //  oscillator.detune.value = 100; // value in cents
         //  oscillator.start(0);
         //  oscillator.onended = function () {
         //      console.log('Your tone has now stopped playing!');
         //  };
         //  gainNode.gain.value = initialVol;
         //  gainNode.gain.minValue = initialVol;
         //  gainNode.gain.maxValue = initialVol;
     }

     async function loop(timestamp) {
         webcam.update(); // update the webcam frame
         now = Tone.now();
         await predict();
         window.requestAnimationFrame(loop);
     }

     async function predict() {
         // Prediction #1: run input through posenet
         // estimatePose can take in an image, video or canvas html element
         const {
             pose,
             posenetOutput
         } = await model.estimatePose(webcam.canvas);
         // Prediction 2: run input through teachable machine classification model
         const prediction = await model.predict(posenetOutput);

         for (let i = 0; i < maxPredictions; i++) {
             predictionVal[i] = prediction[i].probability.toFixed(2);
             if (previousVal[i] === null) {
                 previousVal[i] = 0.01;
             }
             const classPrediction =
                 prediction[i].className + ": " + predictionVal[i];
             labelContainer.childNodes[i].innerHTML = classPrediction;
             //casio Sampler play mode
             if (casioOn === true) {
                 if (parseFloat(predictionVal[i]) >= 0.90) {
                     //play Audio
                     //  playAudio(i, predictionVal);
                     let baseFreq = maxFreq[i] / 8;
                     if (parseFloat(predictionVal[i]) - previousVal[i] > 0.9) {
                         sampler.triggerAttackRelease([baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.8], 1)
                         previousVal[i] = predictionVal[i];
                     }
                 } else {
                     previousVal[i] = 0.01
                 }
                } else if(pianoOn === true){
                     if (parseFloat(predictionVal[i]) >= 0.90) {
                         //play Audio
                         //  playAudio(i, predictionVal);
                         let baseFreq = maxFreq[i] / 4;
                         if (parseFloat(predictionVal[i]) - previousVal[i] > 0.9) {
                             piano.triggerAttackRelease(baseFreq, 1)
                             previousVal[i] = predictionVal[i];
                         }
                     } else {
                         previousVal[i] = 0.01
                     }

             } else if(drumOn === true){

             } else {
                 // Osc Mode
                 if (predictionVal[i] >= 0.90) {
                     if (predictionVal[i] - previousVal[i] > 0.9) {
                         synth.set({
                             frequency: maxFreq[i]
                         })
                         synth.start()
                         //  synth.stop("+0.5");
                         previousVal[i] = predictionVal[i];
                     } else {
                         synth.stop("+0.5");
                     }
                 } else {
                     previousVal[i] = 0.01
                 }
             }

         }
         // finally draw the poses
         drawPose(pose);
     }

     function drawPose(pose) {
         if (webcam.canvas) {
             ctx.drawImage(webcam.canvas, 0, 0);
             // draw the keypoints and skeleton
             if (pose) {
                 const minPartConfidence = 0.5;
                 //  tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                 tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
             }
         }
     }