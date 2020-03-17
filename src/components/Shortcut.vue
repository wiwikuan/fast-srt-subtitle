<template lang="pug">
vk-card.shortcuts
  vk-card-title
    | {{ $t("shortcuts") }}
  p.operation(@click="$emit('operate', { key: 'k' })")
    vk-label.shortcut-label
      | K
    span.shortcut-text
      | {{ $t("shortcutK") }}
  p.operation(@click="$emit('operate', { key: 'l' })")
    vk-label.shortcut-label
      | L
    span.shortcut-text
      | {{ $t("shortcutL") }}
  p.operation(@click="$emit('operate', { key: 'u' })")
    vk-label.shortcut-label
      | U
    vk-label.shortcut-label
      | A
    span.shortcut-text
      | {{ $t("shortcutU") }}
  p.operation(@click="$emit('operate', { key: 'p' })")
    vk-label.shortcut-label
      | P
    vk-label.shortcut-label
      | D
    span.shortcut-text
      | {{ $t("shortcutP") }}
  p.operation(@click="$emit('operate', { key: 'i' })")
    vk-label.shortcut-label
      | I
    vk-label.shortcut-label
      | W
    span.shortcut-text
      | {{ $t("shortcutI") }}
  p.operation(@click="$emit('operate', { key: 'o' })")
    vk-label.shortcut-label
      | O
    vk-label.shortcut-label
      | S
    span.shortcut-text
      | {{ $t("shortcutO") }}
  p.operation(@click="$emit('operate', { key: 'r' })")
    vk-label.shortcut-label
      | R
    span.shortcut-text
      | {{ $t("shortcutR") }}
  p.operation(@click="$emit('operate', { key: 'r' })")
    vk-label.shortcut-label
      | Q
    span.shortcut-text
      | {{ $t("shortcutQ") }}
  p.operation(@click="$emit('operate', { key: 'r' })")
    vk-label.shortcut-label
      | E
    span.shortcut-text
      | {{ $t("shortcutE") }}
</template>

<script>

export default {
  name: 'Shortcut',
};
</script>

<style lang="stylus" scoped>
.shortcut-label
  width 30px
  margin-right 10px
  text-align center
.operation
  cursor pointer
</style>
