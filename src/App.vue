<script>
export default {
  name: 'App',
  mounted() {
    console.log(this.$storage);
    this.$storage.setItem('hcp', { age: 12, sex: 'man' });
    this.$storage.removeItem('hcp');
    this.$storage.clearAll();
  }
}

</script>

<template>
  <router-view></router-view>
</template>

<style ></style>
