<template lang="pug">
#app
 navbar
</template>

<script>
import Navbar from './components/Navbar';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      stage: 'prepare',
    };
  },
};
</script>

<style>
</style>
