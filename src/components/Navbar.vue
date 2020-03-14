<template lang="pug">
vk-navbar
  vk-navbar-nav
    vk-navbar-nav-item(title="Fast SRT Subtitle Toolkit", active)
  vk-navbar-nav(slot="right")
    vk-navbar-nav-dropdown(title="Language")
      vk-navbar-nav-dropdown-nav
        vk-nav-item(title="English")
        vk-nav-item(title="繁體中文")
        vk-nav-item(title="简体中文")
    vk-navbar-nav-item(icon="github", title="GitHub", href="https://github.com/dsh0416/fast-srt-subtitle")
</template>

<script>

export default {
  name: 'Navbar',
};
</script>

<style>
</style>
