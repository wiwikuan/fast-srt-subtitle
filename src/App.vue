<template lang="pug">
#app
  navbar
  vk-modal(:show.sync="modalShow")
    vk-modal-title
      | {{ $t("error") }}
    p
      | {{modalText}}
    p.uk-text-right
      vk-button.uk-margin-small-right(@click="modalShow = false")
        | {{ $t("close") }}
  .container
    .panel
      div(v-if="stage === 'prepare'")
        input.hidden(type="file", ref="textLoader", accept="text/plain", @change="readText")
        vk-button.inline-button(@click="loadText")
          | {{ $t("loadTextFile") }}
        vk-button.inline-button(type="primary", @click="startEdit")
          | {{ $t("startEditing") }}
        .uk-margin
          textarea.uk-textarea(rows="20", v-model="subtitleText")
        p.uk-margin
          | {{ $t("linesOfSubtitle") }}{{ subtitleText.split('\n').length }} {{ $t("lines") }}
      div(v-if="stage === 'edit'")
        vk-button.uk-margin(type="primary", @click="startReview")
          | {{ $t("startReviewing") }}
        h4
          | {{ $t("reactTime") }}{{ reactTime }}s
        input.uk-range(type="range", min="0.0" max="1.0", step="0.01", v-model="reactTime")
        h2
          | {{ $t("currentLine") }}
        h4.alt-text(v-if="currentLine === null")
          | {{ $t("emptyHint") }}
        h4(v-else)
          | {{ subtitles[currentLine] }}
        h2
          | {{ $t("comingLines") }}
        h4.alt-text(v-for="subtitle in nextLines")
          | {{ subtitle }}
        h4.alt-text(v-if="nextLines.length < 4")
          | {{ $t("eofHint") }}
      div(v-if="stage === 'review'")
        vk-button.inline-button(@click="updatePreview")
          | {{ $t("updatePreview") }}
        vk-button.inline-button(type="primary", @click="backToEdit")
          | Back to Edit Mode
        textarea.uk-margin.uk-textarea(rows="20", v-model="subtitleReview")
        vk-button.inline-button(type="primary", @click="saveSrt")
          | {{ $t("saveSrt") }}
        vk-button.inline-button(type="primary", @click="saveVtt")
          | {{ $t("saveVtt") }}
        a.hidden(ref="download", href="")
    .panel
      input.hidden(
        type="file",
        ref="videoLoader",
        accept="audio/mp4, video/mp4",
        @change="readVideo")
      vk-button(@click="loadVideo", v-if="stage === 'prepare'")
        | {{ $t("loadVideo") }}
      video.video#player.uk-margin(ref="video", controls)
        source(type="video/mp4", ref="source", src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
        track(default, label="Default", ref="caption", src="/static/empty.vtt")
      shortcut(v-show="stage === 'edit'", @operate="keyHandler")
  footer.footer
    p.footer-p
      | Originially implemented by&nbsp;
      a(href="https://github.com/wiwikuan/")
        | @wiwikuan
      | , and refactored by&nbsp;
      a(href="https://github.com/dsh0416/")
        | @dsh0416
      | &nbsp;with ❤️️.
</template>

<script>
import VTTConverter from 'srt-webvtt';

import Navbar from './components/Navbar';
import Shortcut from './components/Shortcut';

export default {
  name: 'App',
  components: {
    Navbar,
    Shortcut,
  },
  data() {
    return {
      modalText: '',
      modalShow: false,
      stage: 'prepare',
      subtitleText: '',
      subtitles: [],
      subtitleStarts: [],
      subtitleEnds: [],
      currentLine: null,
      nextLine: 0,
      previousTiming: 0,
      reactTime: 0.3,
      subtitleReview: '',
    };
  },
  computed: {
    nextLines() {
      return this.subtitles.slice(this.nextLine, this.nextLine + 4);
    },
  },
  beforeDestroy() {
    // Makesure remove all event handlers
    window.removeEventListener('keypress', this.keyHandler);
  },
  methods: {
    loadText() {
      this.$refs.textLoader.click();
    },
    loadVideo() {
      this.$refs.videoLoader.click();
    },
    readText(evt) {
      const filename = evt.target.files[0];
      this.subtitleText = ''; // Empty the previous results

      const reader = new FileReader();
      reader.onload = () => {
        this.subtitleText = reader.result;
      };

      reader.readAsText(filename);
    },
    readVideo(evt) {
      const filename = evt.target.files[0];
      const url = URL.createObjectURL(filename);
      this.$refs.source.src = url;
      this.$refs.video.load();
    },
    startEdit() {
      if (this.subtitleText.length === 0) {
        this.modalShow = true;
        this.modalText = this.$t('emptySubtitle');
      } else {
        this.subtitles = this.subtitleText.split('\n');
        this.subtitleStarts = new Array(this.subtitles.length).fill(null);
        this.subtitleEnds = new Array(this.subtitles.length).fill(null);
        this.stage = 'edit';
        this.$refs.video.load();
        window.addEventListener('keypress', this.keyHandler);
      }
    },
    startReview() {
      window.removeEventListener('keypress', this.keyHandler);
      this.stage = 'review';
      this.$refs.video.currentTime = 0;
      this.generateSubtitle();
      this.updatePreview();
    },
    keyHandler(e) {
      switch (e.key) {
        case 'k':
          // Switch to Next Line
          if (this.currentLine !== null) {
            this.subtitleEnds[this.currentLine] =
              this.$refs.video.currentTime - 0.01 - this.reactTime;
          }
          this.currentLine = this.nextLine;
          this.nextLine += 1;
          if (this.currentLine < this.subtitles.length) {
            this.subtitleStarts[this.currentLine] =
              this.$refs.video.currentTime - this.reactTime;
          } else {
            this.currentLine = null;
          }
          break;
        case 'l':
          // Stop Current Line
          if (this.currentLine !== null) {
            this.subtitleEnds[this.currentLine] =
              this.$refs.video.currentTime - 0.01 - this.reactTime;
          }
          this.currentLine = null;
          break;
        case 'u':
          // Prev 3 Secs
          this.$refs.video.currentTime -= 3;
          break;
        case 'p':
          // Skip 3 Secs
          this.$refs.video.currentTime += 3;
          break;
        case 'i':
          // Prev Line
          if (this.nextLine > 0) {
            this.currentLine = this.nextLine - 2;
            this.nextLine = this.nextLine - 1;
          }

          if (this.currentLine === -1) {
            this.currentLine = null;
          }
          break;
        case 'o':
          // Next Line
          if (this.nextLine < this.subtitles.length) {
            this.currentLine = this.nextLine;
            this.nextLine = this.nextLine + 1;
          }
          break;
        default:
          break;
      }
    },
    timeFormat(secs) {
      if (secs === null) {
        return '00:00:00,000';
      }
      const hour = `${Math.floor(secs / 60 / 60)}`.padStart(2, '0');
      const min = `${Math.floor((secs / 60) % 60)}`.padStart(2, '0');
      const sec = `${Math.floor(secs % 60)}`.padStart(2, '0');
      const mil = `${Math.floor((secs * 1000) % 1000)}`.padStart(3, '0');
      return `${hour}:${min}:${sec},${mil}`;
    },
    generateSubtitle() {
      this.subtitleReview = '';
      for (let i = 0; i < this.subtitles.length; i += 1) {
        this.subtitleReview += `${i + 1}\n`;
        this.subtitleReview += `${this.timeFormat(this.subtitleStarts[i])} --> ${this.timeFormat(this.subtitleEnds[i])}\n`;
        this.subtitleReview += `${this.subtitles[i]}\n\n`;
      }
    },
    async updatePreview() {
      const blob = new Blob(
        [this.subtitleReview], { type: 'text/plain' },
      );
      try {
        const converter = new VTTConverter(blob);
        const url = await converter.getURL();
        this.$refs.caption.src = url;
        this.$refs.caption.mode = 'showing';
        this.$refs.video.load();
      } catch (_e) {
        this.modalShow = true;
        this.modalText = this.$t('invalidSrt');
      }
    },
    backToEdit() {
      this.$refs.caption.src = '/static/empty.vtt';
      this.$refs.video.load();
      this.stage = 'edit';
      window.addEventListener('keypress', this.keyHandler);
    },
    saveSrt() {
      const a = this.$refs.download;
      const file = new Blob([this.subtitleReview], { type: 'text/plain' });
      a.href = URL.createObjectURL(file);
      a.download = 'result.srt';
      a.click();
    },
    async saveVtt() {
      const a = this.$refs.download;
      const blob = new Blob(
        [this.subtitleReview], { type: 'text/plain' },
      );
      try {
        const converter = new VTTConverter(blob);
        const url = await converter.getURL();
        a.href = url;
        a.download = 'result.vtt';
        a.click();
      } catch (_e) {
        this.modalShow = true;
        this.modalText = this.$t('invalidSrt');
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.container
  margin 20px
  @media (min-width: 800px)
    display flex
.hidden
  display none
.panel
  width 100%
  margin 10px 10px 85px 10px
  @media (min-width: 800px)
    flex 1
.inline-button
  display inline-block
  margin 0 10px 10px 0
.uk-textarea
  resize vertical
.video
  width 100%
.alt-text
  color #aaa
.footer
  position fixed
  left 0
  bottom 0
  right 0
  width 100%
  padding 20px 0 0 0
  background-color #eee
  color #000
  text-align center
</style>
