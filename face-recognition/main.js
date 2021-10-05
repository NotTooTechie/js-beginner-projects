let fileToUploadInput;
let video;
let selfieCanvas;
let photo;
let result;
let takeSelfieButton;
let compareButton;
let selfieCard;
let govtIdCard;
let resultCard;

let width = 400;
let height = 300;
let streaming = false;

let selfieData; 
let selfieReaderEvent;
let documentUploadEvent;
const mimeType = 'image/png';

const REGION = "eu-west-2";
const AWS_POOL_ID = "POOL-ID";

window.onload = () => {
    selfieCard = document.getElementById ("selfieCard");
    govtIdCard = document.getElementById ("govtIdCard");
    resultCard = document.getElementById ("resultCard");
    compareButton = document.getElementById ("compareButton");
    takeSelfieButton = document.getElementById("takeSelfieButton");
    fileToUploadInput = document.getElementById("fileToUpload");
    video = document.getElementById("video");
    selfieCanvas = document.getElementById ("selfieCanvas");
   
    compareButton.addEventListener ("click", () => {
        compareImages(documentUploadEvent,selfieReaderEvent);
    });

    fileToUploadInput.addEventListener("change", () => {
        loadImage();
    });

    takeSelfieButton.addEventListener("click", (e) => {
        takeSelfie();
        e.preventDefault();
    });

    document.getElementById ("restartButton").addEventListener ("click", () => {
        restart ();
    })

    selfieCanvas.style.display = "none";
    govtIdCard.style.display = "none";
    resultCard.style.display = "none";
    initVideo ();
}

function restart () {
    resultCard.style.display = "none";
    selfieCard.style.display = "";
}

function takeSelfie () {
    var context = selfieCanvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height); 
        selfieData = context.getImageData (0,0,width,height);
        selfieCanvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                selfieReaderEvent = e;
                selfieCanvas.style.display = "block";
                video.style.display = "none";
                stopVideo ();
                setTimeout (()=> {
                    selfieCard.style.display = "none";
                    govtIdCard.style.display = "";
                },2000);
            };
            reader.readAsArrayBuffer(blob);
          }, mimeType);
}

function stopVideo () {
    video.pause ();
    video.srcObject = null;
    navigator.getUserMedia({audio: false, video: true},
        function(stream) {
            var track = stream.getVideoTracks()[0];
            console.log ("stopping video " + stream.getVideoTracks().length);
            track.stop();
        },
        function(error){
            console.log('getUserMedia() error', error);
        });
}

function initVideo () {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        selfieCanvas.setAttribute('width', width);
        selfieCanvas.setAttribute('height', height);
        streaming = true;
        takeSelfieButton.disabled = false;
      }
    }, false);
}

function loadImage() {
    if (fileToUploadInput.files && fileToUploadInput.files[0]) {
        var img = document.getElementById('govIdImg');
        img.onload = () => {
            URL.revokeObjectURL(img.src);  // no longer needed, free memory
        }
        img.src = URL.createObjectURL(fileToUploadInput.files[0]); // set src to blob url
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById ("compareButton").disabled = false;
            documentUploadEvent = e;
        };
        reader.readAsArrayBuffer(fileToUploadInput.files[0]);
    }
}

function compareImages(sourceImg,targetImg) {
    anonymousLogin();
    AWS.region = REGION;
    var rekognition = new AWS.Rekognition();
    var params = {
        SourceImage: {
            Bytes: sourceImg.target.result
        },
        TargetImage: {
            Bytes: targetImg.target.result
        }
    };

    rekognition.compareFaces(params, function (err, data) {
        let result;
        if (err) {
            console.log(err, err.stack); 
        }
        else {
            let faceMatches = data.FaceMatches;
            if (faceMatches.length == 0) {
                console.log ("No Match");
                result = "Match not Found";
            } else {
                console.log ("Match found");
                result = "Match found";
            }
            document.getElementById ("govtIdCard").style.display = "none";
            document.getElementById ("resultCard").style.display = "";
            document.getElementById ("resultMessage").innerText = result;
        }
    });
}

function anonymousLogin() {

    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_POOL_ID,
    });
    AWS.config.credentials.get(function () {
        
    });
}
