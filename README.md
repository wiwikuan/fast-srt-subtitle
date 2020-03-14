# fast-srt-subtitle
Make SRT Caption Fast!!!! This is a fast and dirty javascript SRT caption tool.

* Copy all the files to a folder.
* Put video.mp4 in the same folder.
* Put transcription (newline separated) to subs.txt in the same folder.
* Open a node.js http-server in that folder. (Don't use Python's web server, which has video-seeking problem)
* Goto your local http-server in Firefox/Chrome/Safari. 
* Controls:
  * K: Timestamp this line's end time & next line's start time 
  * L: Timestamp this line's end time
  * I: Scroll back one line 
  * O: Scroll forward one line
  * U: Rewind 5 seconds
  * P: Forward 5 seconds
  * Q: Make SRT File

## Usage
With npm, excute these command
``` bash
npm i
npm start
```

Enjoy.
