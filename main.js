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
    if (currentStamping >= lines.length) {
      return;
    }

    lines[currentStamping + 1][0] = clamp(video.currentTime - reactTime);
    if (lines[currentStamping][1] > video.currentTime - reactTime || lines[currentStamping][1] === null) {
      lines[currentStamping][1] = clamp(video.currentTime - 0.03 - reactTime);
    }

    currentStamping += 1;
  },
  'l': video => {
    lines[currentStamping] = [
      lines[currentStamping][0],
      video.currentTime - reactTime
    ];
  },
  'i': () => {
    currentStamping -= 1;
  },
  'o': () => {
    currentStamping += 1;
  },
  'u': () => (video.currentTime -= 2),
  'p': () => (video.currentTime += 2),
  'q': () => makeSRT(),
  ' ': () => PlayORPause()
};

function getCurrentStatus() {
  return `Stamping Line ${currentStamping} | Playhead: ${video.currentTime}`;
}

function execHotkey(keyMap) {
  document.addEventListener('keypress', function (e) {
    const execFn = keyMap[e.key.toLowerCase()];
    if (typeof execFn === 'function') {
      execFn(video);
      updateContent();
    }
  });
}

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
  document.getElementById('subtainer').style.width = Math.round(pxPerSec * wavesurfer.getDuration()) + 'px';
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
