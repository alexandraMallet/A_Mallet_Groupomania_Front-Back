
<template>
  <button>{{ buttonText }}</button>
</template>

<script>

export default {
  name: 'Button',
  props: {
    buttonText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/index.scss';

button {
  height: fit-content;
  width: fit-content;
  min-width: 150px;
  background-color: $color-secondary;
  color: $color-tertiary;
  border-radius: 50px;
  border: 1px solid $color-primary;
  padding: 10px;
  margin: 10px;
  font-family: 'Lato';
  font-weight: 700;
  }

  button:hover {
    transform: scale(1.01);
    box-shadow: 0 3px 5px 0 $color-primary;
    cursor: pointer;
}
</style>