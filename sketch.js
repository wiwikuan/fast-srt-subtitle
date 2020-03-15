let curr; // current time
let sta; // status text
let status; // = select("#status");
let tAreaText; //
let tArea;
let vidFile = "./video.mp4";
let subFile = "./subs.txt";
let subText; // load from text file
let lineStartTime = [];
let lineEndTime = [];
let reactTime = 0.4;

let currentStamping = 0;
let srt = "";

function preload() {
  vid = createVideo(vidFile);
  vid.size(640, 320);
  vid.showControls();
  subText = loadStrings(subFile);
}

function setup() {
  noCanvas();
  status = select("#status");
  tArea = select("#textArea");

  for (let i = 0; i < subText.length; i++) {
    lineStartTime[i] = null;
    lineEndTime[i] = null;

    //init all timestamps to 0
  }
  lineStartTime[0] = 0;

}

function draw() {
  curr = vid.elt.currentTime;
  sta = `Stamping Line ${currentStamping} | Playhead: ${curr}`;
  tAreaText = "";
  for (let i = 0; i < 5; i++) {
    if (i == 0) {
      tAreaText += "** 目前 ---> "
    }
    tAreaText += `${subText[currentStamping+i]} | ${lineStartTime[currentStamping+i]} --> ${lineEndTime[currentStamping+i]}` + String.fromCharCode(13, 10);
  }
  status.html(sta);
  tArea.html(tAreaText);
}

function keyPressed() {
  if (keyCode === 75) { // K
    // 按左鍵
    // set line start time to current time
    lineStartTime[currentStamping + 1] = vid.elt.currentTime - reactTime;
    if (lineStartTime[currentStamping + 1] < 0){
      lineStartTime[currentStamping + 1] = 0;
    }
    // set prev line's end time, if prev end time > currentTime;
    if (lineEndTime[currentStamping] > vid.elt.currentTime - reactTime || lineEndTime[currentStamping] == null) {
      lineEndTime[currentStamping] = vid.elt.currentTime - 0.05 - reactTime;
      if (lineEndTime[currentStamping] < 0){
        lineEndTime[currentStamping] = 0;
      }
    }
    currentStamping++;
  } else if (keyCode === 76) { // L
    lineEndTime[currentStamping] = vid.elt.currentTime - reactTime;
  } else if (keyCode === 73) { // I
    currentStamping--;
  } else if (keyCode === 79) { // O
    currentStamping++;
  } else if (keyCode === 81) {
    // Q : Make SRT
    makeSRT();
  } else if (keyCode === 85) { // U
    vid.elt.currentTime -= 3;

  } else if (keyCode === 80) { // P
    vid.elt.currentTime += 3;

  }
}

function makeSRT() {
    srt = "";
  for (let i = 0; i < subText.length; i++) {
    // line number
    srt += (i + 1) + "\n";
    // line time
    let sh, sm, ss, sms;
    let eh, em, es, ems;
    sh = floor(lineStartTime[i] / 3600);
    sm = floor((lineStartTime[i] % 3600) / 60);
    ss = floor(lineStartTime[i] % 60);
    sms = floor((lineStartTime[i] * 1000) % 1000);
    eh = floor(lineEndTime[i] / 3600);
    em = floor((lineEndTime[i] % 3600) / 60);
    es = floor(lineEndTime[i] % 60);
    ems = floor((lineEndTime[i] * 1000) % 1000);

    srt += `${sh}:${sm}:${ss},${sms} --> ${eh}:${em}:${es},${ems}\n`
    srt += subText[i];
    srt += "\n\n"
  }
  console.log(srt);
  let blob = new Blob([srt], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, 'srt.txt');
}
