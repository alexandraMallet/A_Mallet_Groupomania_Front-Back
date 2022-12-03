<template>
    <mq-responsive target="md+" tag="div">

        <div class="header-app-large">
            <img alt="Logo de l'entreprise" src="../assets/icon-left-font-monochrome-white-rogne.png">

            <nav v-if="auth">
                <router-link to="/">accueil</router-link> |
                <router-link to="/publier">publier</router-link> |
                <router-link to="/connexion">se déconnecter</router-link>
            </nav>
        </div>
    </mq-responsive>

    <mq-responsive target="sm-" tag="div">
        <div class="header-app-small">

            <nav v-if="auth">
                <router-link to="/">accueil</router-link>
                <router-link to="/publier">publier</router-link>
                <router-link to="/connexion">se déconnecter</router-link>
            </nav>
        </div>


    </mq-responsive>



</template>


<script>
import { MqResponsive } from "vue3-mq";


export default {
    name: 'Header',
    components: {
        MqResponsive
    },
    data() {
        return {
            auth: null
        }
    },
    created() {
        this.auth = localStorage.length;
    }
}

</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

.header-app-small {
    position: relative;
    display: flex;
    flex-direction: column;
    height: fit-content;
    @include center;

    nav {
        position: relative;
        display: flex;
        flex-direction: column;
        @include center;
        margin-top: 30px;

        a {
            padding: 5px;
        }
    }
}

.header-app-small::before {
    content: "";
      background-image: url('@/assets/icon-left-font-monochrome-white-rogne.png');
      min-height: 150px;
      background-color: $color-secondary;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      opacity: 0.5;
}

.header-app-large {
    display: flex;
    justify-content: space-between;
    background-color: $color-secondary;
    height: 150px;


    nav {
        display: flex;
        padding-top: 60px;
        padding-left: 50px;

        a {
            margin-right: 10px;
            margin-left: 10px;
        }
    }

    img {
        height: 50px;
        margin: 50px;
    }
}
</style>