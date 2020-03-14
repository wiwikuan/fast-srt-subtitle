<template lang="pug">
vk-card.shortcuts
  vk-card-title
    | {{ $t("shortcuts") }}
  p
    vk-label.shortcut-label
      | K
    span.shortcut-text
      | {{ $t("shortcutK") }}
  p
    vk-label.shortcut-label
      | L
    span.shortcut-text
      | {{ $t("shortcutL") }}
  p
    vk-label.shortcut-label
      | U
    span.shortcut-text
      | {{ $t("shortcutU") }}
  p
    vk-label.shortcut-label
      | P
    span.shortcut-text
      | {{ $t("shortcutP") }}
  p
    vk-label.shortcut-label
      | I
    span.shortcut-text
      | {{ $t("shortcutI") }}
  p
    vk-label.shortcut-label
      | O
    span.shortcut-text
      | {{ $t("shortcutO") }}
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
