<template>

    <Header />

    <div class="users-nav">
        <div v-if="authorizedUser" class="my-account">
            <UserCard v-if="$data.user" :key="user.id" :user="user" aria-label="aller à mon compte" />
        </div>


        <div v-if="userLogged.isAdmin" class="users-redirect">
            <router-link class="post-link" :to="{ name: 'UsersView' }">
                <p>Voir tout.e.s les utilisateurices</p>
            </router-link>
        </div>
    </div>

    <div class="title">
        <h1>dernières publications en ligne :</h1>
    </div>

    <div class="posts-contener">
        <PostsList />
    </div>

    <Footer class="footer"/>

</template>

<script>

import axios from 'axios';
import PostsList from '@/components/PostsList.vue';
import UserCard from '@/components/UserCard.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'HomeView',
    components: {
        PostsList,
        UserCard,
        Header,
        Footer
    },
    data() {
        return {
            authorizedUser: false,
            user: {},
            userLogged: {},
            userId: '',
        }
    },
    created() {

        this.userLogged = JSON.parse(localStorage.userLogged);

        axios.get('http://localhost:3000/api/auth/' + this.userLogged.userId, {
            headers: {
                'Authorization': `Bearer ${this.userLogged.token}`
            }
        })
            .then(response => {
                this.user = response.data;
                this.userId = response.data._id;
            })
            .then(() => {
                if (this.userId === this.userLogged.userId) {
                    this.authorizedUser = true;
                }
            })
            .catch(() => { this.$router.push('/connexion') });
    }
}


</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

.title {
    @include center;

    h1 {
        margin-top: 0px;
        margin-bottom: 30px;
        text-align: center;

    }
}

.posts-contener {
    width: 100%;
    background-color: lighten($color: $color-secondary, $amount: 5);
    padding-bottom: 30px;
}

.my-account {
    margin-right: 30px;
}

.users-nav {
    display: flex;
    justify-content: right;
    flex-wrap: wrap;
    margin-bottom: 30px;
    margin-top: 70px;
    align-items: baseline;

    @include md {
        margin-top: 30px;
    }

    @include lg {
        margin-top: 30px;
    }
}
.users-redirect {
    border: 3px solid $color-secondary;
    border-radius: 20px;
    font-size: 12px;
    width: fit-content;
    margin-right: 30px;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;

    a {
        color: $color-tertiary;
    }
}

.users-redirect:hover {
    transform: scale(1.01);
    box-shadow: 0 3px 12px 0 $color-secondary;
}
</style>