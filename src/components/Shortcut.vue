<template lang="pug">
vk-card.shortcuts
  vk-card-title
    | Shortcuts
  p
    vk-label.shortcut-label
      | K
    span.shortcut-text
      | Switch to Next Line
  p
    vk-label.shortcut-label
      | L
    span.shortcut-text
      | Stop Current Line
  p
    vk-label.shortcut-label
      | U
    span.shortcut-text
      | Prev 3 Secs
  p
    vk-label.shortcut-label
      | P
    span.shortcut-text
      | Skip 3 Secs
  p
    vk-label.shortcut-label
      | I
    span.shortcut-text
      | Prev Line
  p
    vk-label.shortcut-label
      | O
    span.shortcut-text
      | Skip Line
</template>

<script>

export default {
  name: 'Shortcut',
};
</script>

<style lang="stylus" scoped>
.shortcut-label
  width 30px
  text-align center
.shortcut-text
  margin-left 10px
</style>
