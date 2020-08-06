     // More API functions here:
     // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

     // the link to your model provided by Teachable Machine export panel
     var $loginPage = $('.login.page');
     let model, webcam, ctx, labelContainer, maxPredictions, oscillator, gainNode, username, initURL, audioCtx;
     //audio Part
     let AudioContext = window.AudioContext || window.webkitAudioContext;
     //Frequency of note
     //https://pages.mtu.edu/~suits/notefreqs.html
     //Pentatronic Scale C5,D5,E5,G5,A5
     let maxFreq = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
     let maxVol = 0.02;
     let initialVol = 0.001;
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

         // append/get elements to the DOM
         const welcome = document.getElementById("welcome");
         welcome.innerHTML = `어서오세요, ${username}! 포즈로 음악을 연주해볼까요?🎹`
         const mute = document.getElementById("mute")
         const muteButton = document.createElement("button");
         muteButton.innerText = "MUTE"
         mute.appendChild(muteButton);
         const canvas = document.getElementById("canvas");
         canvas.width = size;
         canvas.height = size;
         ctx = canvas.getContext("2d");
         labelContainer = document.getElementById("label-container");
         for (let i = 0; i < maxPredictions; i++) { // and class labels
             labelContainer.appendChild(document.createElement("div"));
         }

         //audio Part Loading

         audioCtx = new AudioContext();

         oscillator = audioCtx.createOscillator();
         gainNode = audioCtx.createGain();
         oscillator.connect(gainNode);
         gainNode.connect(audioCtx.destination);



         // set options for the oscillator


         oscillator.detune.value = 100; // value in cents
         oscillator.start(0);

         oscillator.onended = function () {
             console.log('Your tone has now stopped playing!');
         };

         gainNode.gain.value = initialVol;
         gainNode.gain.minValue = initialVol;
         gainNode.gain.maxValue = initialVol;

     }

     async function loop(timestamp) {
         webcam.update(); // update the webcam frame
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
             const classPrediction =
                 prediction[i].className + ": " + prediction[i].probability.toFixed(2);
             labelContainer.childNodes[i].innerHTML = classPrediction;
             console.log();
             if (prediction[i].probability.toFixed(2) > 0.8) {
                 //play Audio
                 var playVolVal = (Math.log10(100 * prediction[i].probability.toFixed(2)) - 1) * maxVol;
                 oscillator.frequency.value = maxFreq[i];
                 gainNode.gain.value = playVolVal;
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
                 tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                 tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
             }
         }
     }