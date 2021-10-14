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
let videoStream;

let width = 400;
let height = 300;
let streaming = false;

let selfieData;
let govtIdData;
const mimeType = 'image/png';

const REGION = "eu-west-2";
const AWS_POOL_ID = "POOL-ID";

window.onload = () => {
    selfieCard = document.getElementById("selfieCard");
    govtIdCard = document.getElementById("govtIdCard");
    resultCard = document.getElementById("resultCard");
    compareButton = document.getElementById("compareButton");
    takeSelfieButton = document.getElementById("takeSelfieButton");
    fileToUploadInput = document.getElementById("fileToUpload");
    video = document.getElementById("video");
    selfieCanvas = document.getElementById("selfieCanvas");

    compareButton.addEventListener("click", () => {
        compareImages(govtIdData, selfieData);
    });

    fileToUploadInput.addEventListener("change", () => {
        loadImage();
    });

    takeSelfieButton.addEventListener("click", (e) => {
        takeSelfie();
        e.preventDefault();
    });

    document.getElementById("restartButton").addEventListener("click", () => {
        restart();
    })

    selfieCanvas.style.display = "none";
    govtIdCard.style.display = "none";
    resultCard.style.display = "none";
    initVideo();
}

function restart() {
    resultCard.style.display = "none";
    selfieCard.style.display = "";
}

async function takeSelfie() {
    selfieCanvas.getContext('2d').drawImage(video, 0, 0, width, height);
    selfieData = await getSelfieData (selfieCanvas);
    selfieCanvas.style.display = "block";
    video.style.display = "none";
    stopVideo();
    await new Promise(resolve => setTimeout(resolve, 1000));
    selfieCard.style.display = "none";
    govtIdCard.style.display = "";
}


async function getSelfieData(selfieCanvas) {
    let blob = await new Promise(resolve => selfieCanvas.toBlob(resolve, mimeType));
    return getFileReaderData (blob);
}

function stopVideo() {
    video.pause();
    video.srcObject = null;
    videoStream.getTracks().forEach(track => track.stop());
}

async function initVideo() {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = videoStream;
    video.play();

    video.addEventListener('canplay', function (ev) {
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

async function loadImage() {
    if (fileToUploadInput.files && fileToUploadInput.files[0]) {
        var img = document.getElementById('govIdImg');
        img.onload = () => {URL.revokeObjectURL(img.src)};
        img.src = URL.createObjectURL(fileToUploadInput.files[0]); 
        govtIdData = await getFileReaderData (fileToUploadInput.files[0]);
        document.getElementById("compareButton").disabled = false;
    }
}

function getFileReaderData (blob) {
    return new Promise (resolve => {
        const reader = new FileReader ();
        reader.onload = function (e) {
            resolve (e.target.result);
        };
        reader.readAsArrayBuffer(blob);
    });
}

function compareImages(sourceImg, targetImg) {
    anonymousLogin();
    AWS.region = REGION;
    var rekognition = new AWS.Rekognition();
    var params = {
        SourceImage: {
            Bytes: sourceImg
        },
        TargetImage: {
            Bytes: targetImg
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
                console.log("No Match");
                result = "Match not Found";
            } else {
                console.log("Match found");
                result = "Match found";
            }
            document.getElementById("govtIdCard").style.display = "none";
            document.getElementById("resultCard").style.display = "";
            document.getElementById("resultMessage").innerText = result;
        }
    });
}

function anonymousLogin() {
    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWS_POOL_ID,
    });
    AWS.config.credentials.get(function () {});
}
