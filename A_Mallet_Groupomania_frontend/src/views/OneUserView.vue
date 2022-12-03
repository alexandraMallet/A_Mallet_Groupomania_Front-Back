<template>

    <Header />

    <div class="title">
        <h1>profil de :</h1>
    </div>

    <div v-if="$data.user" class="user-card">
        <div v-if="authorized" class="one-profile">

            <div class="user-infos">
                <h2>{{ user.pseudo }}</h2>
                <img :src="user.avatarUrl" :alt="altText"/>
            </div>

            <div v-if="$data.user.posts" class="user-posts">
                <div v-if="posts.length" class="user-posts-list">
                    <PostCard v-for="post in antechrono" :key="post.id" :post="post" class="post-card"
                        @update-like="updateLike" />
                </div>
                <div v-else class="no-posts">
                    <p>Il n'y a pas de publications de cette personne.</p>
                </div>
            </div>

        </div>
        <div v-else>
            <p>Ce compte n'est pas le vôtre : informations non-accessibles</p>
            <Button :buttonText="buttonTextUnauthorized" @click="redirection" />

        </div>

    </div>

    <Button v-if="rightToModify" :buttonText="buttonTextModifier" @click="linkToModify" />
    <Button v-if="rightToDelete" :buttonText="buttonTextSupprimer" @click="deleteUser" />

    <Footer class="footer"/>

</template>

<script>

import axios from 'axios'
import Button from '@/components/Button.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import PostCard from '@/components/PostCard.vue';

export default {
    name: 'OneUserView',
    components: {
        Button,
        PostCard,
        Header,
        Footer
    },
    data() {
        return {
            buttonTextModifier: 'modifier',
            buttonTextSupprimer: 'supprimer',
            buttonTextUnauthorized: 'revenir aux publications',
            authorized: false,
            user: {},
            userLogged: {},
            rightToModify: false,
            rightToDelete: false,
            userId: '',
            posts: []
        }
    },
    computed: {
        antechrono() {
            return [...this.posts].reverse();
        },
        altText() {
            return `photo de profil de ${this.user.pseudo}`
        }
    },
    created() {
        this.userLogged = JSON.parse(localStorage.userLogged);
        this.userId = this.$route.params.id;


        axios.get('http://localhost:3000/api/auth/' + this.userId, {
            headers: {
                'Authorization': `Bearer ${this.userLogged.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                this.user = response.data;
                this.posts = this.user.posts;
            })
            .then(() => {
                if (this.userId === this.userLogged.userId) {
                    this.rightToModify = true;
                }
                if ((this.userId === this.userLogged.userId) || this.userLogged.isAdmin) {
                    this.authorized = true;
                    this.rightToDelete = true;
                }
            })
            .catch(error => console.log(error));

    },
    methods: {
        updateLike() {
            axios.get('http://localhost:3000/api/auth/' + this.userId, {
                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.user = response.data;
                    this.posts = this.user.posts;
                })
                .then(() => {
                    if (this.userId === this.userLogged.userId) {
                        this.rightToModify = true;
                    }
                    if ((this.userId === this.userLogged.userId) || this.userLogged.isAdmin) {
                        this.authorized = true;
                        this.rightToDelete = true;
                    }
                })
                .catch(error => console.log(error));
        },
        linkToModify() {
            this.$router.push('/modifier-compte/' + this.userId);
        },
        redirection() {
            this.$router.push('/');
        },
        deleteUser() {
            axios.delete('http://localhost:3000/api/auth/' + this.userId, {
                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(() => {
                    this.$router.push('/');
                    console.log('utilisateurice supprimée')
                })
                .catch(error => console.log(error));

        }
    }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

.title {
    margin-left: 50px;

    h1 {
        margin-top: 100px;
        margin-bottom: 0px;
        font-size: large;

        @include md {
            margin-top: 50px;
        }

        @include lg {
            margin-top: 50px;
        }

    }
}

.user-card {
    padding: 20px;

    .user-infos {
        display: flex;
        justify-content: space-around;
        margin-top: 30px;

        img {
            width: 100px;
            border: 2px solid $color-tertiary;
            border-radius: 50px;
        }
    }

    .user-posts {
        min-width: 302px;
        margin-top: 30px;
        @include center;

        .post-card {
            min-width: 300px;
        }

        .user-posts-list {
            @include md {
                display: flex;
                flex-wrap: wrap;
                @include center;
            }

            @include lg {
                display: flex;
                flex-wrap: wrap;
                @include center;
            }

        }

        .no-posts {
            border: 3px solid $color-secondary;
            border-radius: 30px;
            padding-left: 10px;
            padding-right: 10px;
            text-align: center;
        }


    }
}
</style>