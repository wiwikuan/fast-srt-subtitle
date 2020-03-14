  #!/bin/sh
  apk update && apk update --no-cache git
  \&& cd /var/fastSrtSubtitle
  \&& git clone https://github.com/wiwikuan/fast-srt-subtitle.git
  \&& cd fast-srt-subtitle
  \&& npm install http-server
  \&& http-server -p 1234
