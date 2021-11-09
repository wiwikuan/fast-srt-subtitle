const SRT_ID = 'srtFile';
const VIDEO_ID = 'videoFile';

const srtInput = document.querySelector('#srtFile');
const videoInput = document.querySelector('#videoFile');
const video = document.querySelector('#video');
const textArea = document.querySelector('#textArea');
const status = document.querySelector('#status');
let reactTime = 0.4;
let subTexts = [];
let currentStamping = 0;
let lines = [];

function clamp(num) {
  return Math.max(num, 0);
}

const keyMap = {
  'k': video => {
    Kkeyfunction(video, reactTime);
  },
  'l': video => {
    Lkeyfunction(video, reactTime);
  },
  'i': () => {
    if (currentStamping != 0) {
      currentStamping -= 1;
      status.textContent = getCurrentStatus();
    }
  },
  'o': () => {
    currentStamping += 1;
    status.textContent = getCurrentStatus();
  },
  'u': () => (video.currentTime -= 2),
  'p': () => (video.currentTime += 2),
  'q': () => makeSRT(),
  ' ': () => PlayORPause()
};

function getCurrentStatus() {
  return `Stamping Line ${currentStamping} | Playhead: ${video.currentTime}`;
}

var IsHold = 0;
var IsAllowRepeatKey = { 'i': true, 'o': true, 'u': true, 'p': true };

function execHotkey(keyMap) {
  document.addEventListener('keypress', function (e) {
    if (IsInput !== 0 || IsHold !== 0) { //IsInput跟IsHold同時等於0時，才會往下執行，防止輸入字幕時觸發鍵盤事件，與按住鍵盤時連續觸發
      return;
    }
    const execFn = keyMap[e.key.toLowerCase()];
    if (typeof execFn === 'function') {
      execFn(video);
      updateContent();
    }
    if (!IsAllowRepeatKey[e.key.toLowerCase()]) { //不允許連按的按鍵IsHold會+1，防止連續觸發，允許連按的按鍵IsHold不會變，所以依然會連續觸發
      IsHold += 1;
    }
  });
}

document.addEventListener('keyup', function () {
  IsHold = 0;
});

function updateContent() {
  const head = '** 目前 ---> ';

  const content = subTexts
    .slice(currentStamping, currentStamping + 5)
    .map((text, i) => {
      const [timeStart, timeEnd] = lines[currentStamping + i];
      return `${i === 0 ? head : ''}${text} | ${timeStart} --> ${timeEnd}`;
    })
    .join('\n');

  textArea.value = content;
}

function handleFileUpload(e) {
  if (e.target.files !== null) {
    const reader = new FileReader();
    const file = e.target.files[0];

    /*
      if it's srt file, fill text area with srt content
      if it's video, load it into video tag
    */
    reader.onload = function () {
      if (e.target.id === SRT_ID) {
        subTexts = reader.result.split('\n');
        subTexts.forEach((_, i) => (lines[i] = [null, null]));
        lines[0][0] = 0;

        updateContent();

        execHotkey(keyMap);
      }
    };

    reader.onerror = function () {
      alert('無法讀取檔案！');
    };

    if (e.target.id === SRT_ID) {
      reader.readAsText(file);
    } else {
      video.src = URL.createObjectURL(file);
      var objectURL = URL.createObjectURL(file); //載入影片時使wavesurfer也載入影片
      wavesurfer.load(objectURL);
    }
  }
  document.getElementById('video').focus();
}

videoInput.addEventListener('change', handleFileUpload);
srtInput.addEventListener('change', handleFileUpload);

video.addEventListener('timeupdate', function (e) {
  status.textContent = getCurrentStatus();
  wavesurfer.seekTo(video.currentTime / wavesurfer.getDuration()); //影片時間線更新時也會更新wavesurfer的時間線
});

function makeSRT() {
  srt = '';
  for (let i = 0; i < subTexts.length; i++) {
    // line number
    srt += i + 1 + '\n';
    // line time
    let sh, sm, ss, sms;
    let eh, em, es, ems;
    const [timeStart, timeEnd] = lines[i];
    const leftPad = str => `${str}`.padStart(2, '0');
    const leftPad3 = str => `${str}`.padStart(3, '0');
    sh = leftPad(Math.floor(timeStart / 3600));
    sm = leftPad(Math.floor((timeStart % 3600) / 60));
    ss = leftPad(Math.floor(timeStart % 60));
    sms = leftPad3(Math.floor((timeStart * 1000) % 1000));
    eh = leftPad(Math.floor(timeEnd / 3600));
    em = leftPad(Math.floor((timeEnd % 3600) / 60));
    es = leftPad(Math.floor(timeEnd % 60));
    ems = leftPad3(Math.floor((timeEnd * 1000) % 1000));

    srt += `${sh}:${sm}:${ss},${sms} --> ${eh}:${em}:${es},${ems}\n`;
    srt += subTexts[i];
    srt += '\n\n';
  }
  console.log(srt);
  let blob = new Blob([srt], {
    type: 'text/plain;charset=utf-8'
  });
  const a = document.createElement('a');
  const file = new Blob([srt], { type: 'text/plain;charset=utf-8' });
  a.href = URL.createObjectURL(file);
  a.download = 'srt.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

document.getElementById('MakeSrtBtn').addEventListener('click', function () {
  makeSRT();
  document.getElementById('video').focus();
});

function PlayORPause() {
  if (document.activeElement !== document.getElementById('video')) {
    if (video.paused === true) {
      video.play();
    } else {
      video.pause();
    }
  }
}

var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  barWidth: 1,
  height: 100 //默認128
});

var pxPerSec = 40;

wavesurfer.on('ready', function () {
  wavesurfer.zoom(pxPerSec); //根據pxPerSec縮放波形圖，pxPerSec代表每秒有幾像素，越大越寬
  wavesurfer.setMute(true); //波形圖本身也是一個聲音的撥放器因此把聲音靜音
  document.getElementById('subtainer').style.width = Math.round(pxPerSec * wavesurfer.getDuration()) + 'px'; //載入完成後改變字幕軸寬度使之與波形圖一致
});

function UpdateLoadingFlag(Percentage) {
  if (document.getElementById("status")) {
    document.getElementById("status").innerText = "Loading " + Percentage + "%";
  }
}

wavesurfer.on('loading', function (Percentage) { //波形圖載入時在status顯示載入百分比
  UpdateLoadingFlag(Percentage);
});

video.addEventListener('play', function () {
  wavesurfer.play();
});

video.addEventListener('pause', function () {
  wavesurfer.pause();
  wavesurfer.seekTo(video.currentTime / wavesurfer.getDuration());
});

wavesurfer.on('seek', function (seekprogress) { //這裡用比較奇怪的方法完成波形圖與影片時間線的同步，要解決這個問題就不能使用瀏覽器內建的影片撥放控制器，要自制撥放、暫停...等等的按鈕，先這樣應急
  if (video.paused === true && Math.abs(video.currentTime - seekprogress * wavesurfer.getDuration()) > 0.00001) { //影片暫停時才能精細的調整時間，但時間差距不能小於0.00001秒，以免無限的迴圈
    video.currentTime = seekprogress * wavesurfer.getDuration();
  }
  if (Math.abs(video.currentTime - seekprogress * wavesurfer.getDuration()) > 0.3) { //當點擊波形圖更改時間線時，時間差距要大於0.3秒才會觸發，並且影片會暫停，影片播放時也會更新時間線所以設定0.3秒做為門檻
    video.pause();
    video.currentTime = seekprogress * wavesurfer.getDuration();
  }
});

document.getElementById("checkbox").addEventListener('change', function () {
  if (this.checked) {
    reactTime = 0.4;
  } else {
    reactTime = 0;
  }
});

wavesurfer.on('scroll', function (e) {
  document.getElementById('subbox').scrollLeft = e.target.scrollLeft;
});

var SubWidth = [];
var SubLeft = [];

function MakeSub(SubSequence) {
  if (SubSequence < 0) {
    return;
  }
  if ((lines[SubSequence][0] !== null) && (lines[SubSequence][1] !== null)) {
    if (document.getElementById('sub' + (SubSequence)) !== null) { //新增字幕條時如果已經存在舊的字幕條將刪除舊字幕條
      document.getElementById('sub' + (SubSequence)).remove();
    }
    SubWidth[SubSequence] = pxPerSec * (lines[SubSequence][1] - lines[SubSequence][0]);
    SubLeft[SubSequence] = pxPerSec * lines[SubSequence][0];

    var div = document.createElement("div");
    div.setAttribute('id', 'sub' + (SubSequence));
    div.style.overflow = "hidden";
    div.style.fontSize = "100%";
    div.style.background = "Cyan";
    div.style.height = "100%";
    div.style.position = "absolute";
    div.style.border = "1px #000000 solid";
    div.style.userSelect = "none";
    div.style.left = pxPerSec * lines[SubSequence][0] + "px";
    div.style.width = pxPerSec * (lines[SubSequence][1] - lines[SubSequence][0]) + "px";
    div.innerHTML = '<div class="subleft"></div><div class="subright"></div>' + subTexts[SubSequence];
    document.getElementById("subtainer").appendChild(div);
  }
}

function Kkeyfunction(video, reactTime = 0) {
  if (currentStamping >= lines.length) {
    return;
  }
  lines[currentStamping + 1][0] = clamp(video.currentTime - reactTime);
  if (currentStamping >= 0) {
    if (lines[currentStamping][1] > video.currentTime - reactTime || lines[currentStamping][1] === null) {
      lines[currentStamping][1] = clamp(video.currentTime - 0.03 - reactTime);
    }
  }
  MakeSub(currentStamping);
  MakeSub(currentStamping + 1);
  currentStamping += 1;
}

function Lkeyfunction(video, reactTime = 0) {
  lines[currentStamping] = [
    lines[currentStamping][0],
    video.currentTime - reactTime
  ];
  if (lines[currentStamping][1] > lines[currentStamping + 1][0] && (lines[currentStamping + 1][0] !== null)) {
    lines[currentStamping + 1][0] = clamp(lines[currentStamping][1] + 0.03);
  }
  MakeSub(currentStamping);
  MakeSub(currentStamping + 1);
}

document.getElementById("subtainer").addEventListener('mousedown', function (e) { //用事件代理監聽字幕條兩端的拖動元素，這樣不用註冊很多監聽器，當拖動完成後會更新時間，如同K鍵,L鍵的效果
  var OmouseX = e.pageX;
  var PID = e.target.parentNode.id;
  var SubSequence = PID.substr(3);
  document.getElementById(PID).style.zIndex = 1; //使字幕條拖動時不會被遮擋，當拖動停止後會更新時間並用K鍵,L鍵更新元素，所以新的元素不會有zIndex，以後的元素不會被新元素遮擋
  var newWidth;
  if (e.target.className.toLowerCase() == 'subleft') {
    window.addEventListener('mousemove', Lresize);
    window.addEventListener('mouseup', stopLresize);

    function Lresize(e) {
      document.getElementById(PID).style.width = (SubWidth[SubSequence] - e.pageX + OmouseX) + "px";
      document.getElementById(PID).style.left = (SubLeft[SubSequence] + e.pageX - OmouseX) + "px";
    }

    function stopLresize() {
      window.removeEventListener('mousemove', Lresize);
      window.removeEventListener('mouseup', stopLresize);

      GetnewWidth();
      currentStamping = (Number(SubSequence) - 1);
      video.currentTime = (SubWidth[SubSequence] - newWidth + SubLeft[SubSequence]) / pxPerSec;
      Kkeyfunction(video);
      updateContent();
    }
  }

  if (e.target.className.toLowerCase() == 'subright') {
    window.addEventListener('mousemove', Rresize);
    window.addEventListener('mouseup', stopRresize);

    function Rresize(e) {
      document.getElementById(PID).style.width = (SubWidth[SubSequence] + e.pageX - OmouseX) + "px";
    }

    function stopRresize() {
      window.removeEventListener('mousemove', Rresize);
      window.removeEventListener('mouseup', stopRresize);

      GetnewWidth();
      currentStamping = Number(SubSequence);
      video.currentTime = (newWidth + SubLeft[SubSequence]) / pxPerSec;
      Lkeyfunction(video);
      updateContent();
    }
  }

  function GetnewWidth() {  //當拖動停止時取得目前的新寬度，但是最低不會低於10px
    newWidth = Number(document.getElementById(PID).style.width.split('px')[0]);
    if (newWidth < 10) {
      newWidth = 10;
    }
  }

});

var IsInput = 0; //檢測現在是否有開啟的輸入框

document.getElementById("subtainer").addEventListener('dblclick', function (e) { //雙擊字幕條本體可以產生輸入框，輸入後的內容會改變subTexts裡的內容，也可以取消

  if (IsInput === 0 && e.target.id !== "subtainer") { //目前有輸入框時不會動作，啟動後IsInput會設為1，關閉後IsInput會重新設定為0
    IsInput = 1;
    var input = document.createElement("input");
    var button = document.createElement("button");
    var SubSequence = e.target.id.substr(3);
    var InputID = e.target.id + 'input';

    MakeInput();
    MakeBtn();

    currentStamping = Number(SubSequence);
    updateContent();

    document.getElementById(InputID).addEventListener('keydown', PressEnter);
    document.getElementById("MakeBtnID").addEventListener('click', PressBtn);

  }

  function MakeInput() {
    createInputAndBtn(input, InputID, SubLeft[SubSequence]);
    input.value = subTexts[SubSequence];
    document.getElementById(InputID).focus();
  }

  function MakeBtn() {
    createInputAndBtn(button, "MakeBtnID", 170 + SubLeft[SubSequence]); //預設輸入框的長度為170px為了不擋到輸入框將取消鈕距離左邊+170px
    button.innerHTML = '取消';
  }

  function createInputAndBtn(ele, eleID, eleLeft) {
    ele.setAttribute('id', eleID);
    document.getElementById("subtainer").appendChild(ele);
    ele.style.zIndex = 1;
    ele.style.position = "absolute";
    ele.style.height = "110%";
    ele.style.left = eleLeft + "px";
  }

  function PressEnter(e) {
    if (e.keyCode === 13) { // Enter的keyCode是13
      removeInputAndBtn();
      subTexts[SubSequence] = input.value + '\n';
      MakeSub(currentStamping);
      updateContent();
    }
  }

  function PressBtn() {
    removeInputAndBtn();
  }

  function removeInputAndBtn() {
    document.getElementById("MakeBtnID").removeEventListener('click', PressBtn);
    document.getElementById(InputID).removeEventListener('keydown', PressEnter);
    document.getElementById("MakeBtnID").remove();
    document.getElementById(InputID).remove();
    IsInput = 0;
  }

});
