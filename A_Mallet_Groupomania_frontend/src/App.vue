<template>
  <router-view />
</template>

<!-- <script>
import { MqResponsive } from "vue3-mq";
export default {
    components: {
        MqResponsive
    }
}

</script> -->



<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import '@/styles/index.scss';

#app {
  font-family: 'Lato', sans-serif;
}

h1 {
  color: $color-primary;
}

h2 {
  color: $color-tertiary;
}

h3 {
  color: $color-tertiary;
}

a {
        text-decoration: none;

    }

nav {

  a {
    font-weight: bold;
    color: $color-tertiary;

    &.router-link-exact-active {
      color: darken($color: $color-primary, $amount: 10)
    }

    &:hover {
      transform: scale(1.05);
    }
  }
}

.footer {
  margin-top: 50px;
}

</style>