<template>

    <Header />

    <div class="title">
        <h1>les membre du réseau social de Groupomania</h1>
    </div>

    <div v-if="userLogged.isAdmin" class="users-contener">

        <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>

    <div v-else class="unauthorized">
        <p>Contenu accessible seulement par le compte administrateur</p>
        <Button :buttonText="buttonTextUnauthorized" @click="redirection" />

    </div>

    <Footer class="footer" />

</template>
  
<script>

import axios from 'axios';
import UserCard from '@/components/UserCard.vue';
import PostsList from '@/components/PostsList.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';

export default {
    name: 'HomeView',
    components: {
        PostsList,
        UserCard,
        Header,
        Footer,
        Button
    },
    data() {
        return {
            user: {},
            users: [],
            userLogged: {},
            userId: '',
            buttonTextUnauthorized: "revenir à l'accueil"
        }
    },
    created() {

        this.userLogged = JSON.parse(localStorage.userLogged);

        axios
            .get("http://localhost:3000/api/auth", {
                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
            .then(response => {
                console.log(response.data);
                this.users = response.data;
                console.log(this.users);
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        redirection() {
            return this.$router.push('/')
        }
    }
}


</script>
  
<style scoped lang="scss">
@import '@/styles/index.scss';

.title {
    @include center;
    margin-top: 50px;
    margin-left: 20px;
    margin-right: 20px;

    h1 {
        margin-top: 30px;
        margin-bottom: 0px;
        text-align: center;

    }

    @include md {
        margin-top: 50px;
    }

    @include lg {
        margin-top: 50px;
    }
}


.users-contener,
.unauthorized {
    margin: 30px;
    @include center;
    flex-wrap: wrap;
    min-height: 500px;
}

.unauthorized {
    flex-direction: column;
    text-align: center;
}
</style>