<template lang="pug">
vk-navbar
  vk-navbar-nav
    vk-navbar-nav-item(title="Fast SRT Subtitle Toolkit", active)
  vk-navbar-nav(slot="right")
    vk-navbar-nav-dropdown(title="Language")
      vk-navbar-nav-dropdown-nav
        vk-nav-item(title="English", @click="$i18n.locale = 'en'")
        vk-nav-item(title="繁體中文", @click="$i18n.locale = 'zh-tw'")
        vk-nav-item(title="简体中文", @click="$i18n.locale = 'zh-cn'")
    vk-navbar-nav-item(icon="github", title="GitHub", href="https://github.com/dsh0416/fast-srt-subtitle")
    vk-navbar-nav-item(
      v-show="!isElectron"
      icon="cloud-download",
      :title="$t('downloadApp')",
      href="https://github.com/dsh0416/fast-srt-subtitle/actions?query=workflow%3A%22Electron+CD%22")
</template>

<script>

export default {
  name: 'Navbar',
  computed: {
    isElectron() {
      return window && window.process && window.process.versions.electron;
    },
  },
};
</script>

<style>
</style>
