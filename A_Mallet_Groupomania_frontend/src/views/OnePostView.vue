<template>
    <Header />

    <div class="title">
        <h1>publication de {{ post.user[0].pseudo }}, du {{ post.createdAt }}</h1>
    </div>

    <div v-if="$data.post" class="post-card">

        <div class="img-container">
            <img :src="post.imageUrl" :alt="altText" />
        </div>

        <p class="post-text">{{ post.text }}</p>

        <div class="post-created-infos">
            <p>{{ post.createdAt }}</p>
            <p>{{ post.user[0].pseudo }}</p>
        </div>
        <div class="post-modified-infos">
            <p v-if="post.modifiedBy"> modifiée par {{ post.modifiedBy }}</p>
            <p v-if="post.modifiedAt">le {{ post.modifiedAt.split("T")[0] }}</p>
        </div>

        <div class="like-info">
            <div class="like_icon">
                <font-awesome-icon v-if="!likeStatus" icon="fa-solid fa-heart" class="no-like"
                    @click.prevent="addOrRemoveLike">
                </font-awesome-icon>
                <font-awesome-icon v-else icon="fa-solid fa-heart" class="like" @click.prevent="addOrRemoveLike">
                </font-awesome-icon>
            </div>
            <p class="likes">{{ post.likes }}</p>
        </div>
    </div>


    <div v-if="rightToChange" class="modify">
        <Button type="submit" :buttonText="buttonTextModifier" @click="linkToModify" />
        <Button type="submit" :buttonText="buttonTextSupprimer" @click="deletePost" />
    </div>

    <Footer class="footer" />

</template>

<script>

import axios from 'axios'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';

export default {
    name: 'OnePostView',
    components: {
        Button,
        Header,
        Footer
    },
    data() {
        return {
            post: {},
            buttonTextModifier: 'modifier',
            buttonTextSupprimer: 'supprimer',
            userLogged: {},
            rightToChange: false,
            postId: '',
            likeStatus: false
        }
    },
    computed: {
        altText() {
            return `image de ${this.post.user[0].pseudo}`
        }
    },
    created() {

        this.userLogged = JSON.parse(localStorage.userLogged);
        this.postId = this.$route.params.id;

        axios.get('http://localhost:3000/api/post/' + this.postId, {
            headers: {
                'Authorization': `Bearer ${this.userLogged.token}`
            }
        })
            .then(response => {
                console.log(response.data);
                this.post = response.data;
            })
            .then(() => {
                if ((this.post.userId === this.userLogged.userId) || this.userLogged.isAdmin) {
                    this.rightToChange = true;
                }
            })
            .catch(error => console.log(error));
    },
    mounted() {
        this.changeLikeStatus()
    },
    methods: {
        linkToModify() {
            this.$router.push('/modifier-publication/' + this.postId);
        },
        deletePost() {
            axios.delete('http://localhost:3000/api/post/' + this.postId, {
                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(() => {
                    this.$router.push('/');
                })
                .catch(error => console.log(error));

        },
        getPost() {
            axios.get('http://localhost:3000/api/post/' + this.postId, {
                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.post = response.data;
                })
                .then(() => {
                    if ((this.post.userId === this.userLogged.userId) || this.userLogged.isAdmin) {
                        this.rightToChange = true;
                    }
                })
                .then(() => this.changeLikeStatus())
                .catch(error => console.log(error));
        },
        addOrRemoveLike() {
            axios.post('http://localhost:3000/api/post/' + this.post._id + '/like', {}, {

                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(() => { this.getPost() })
                .catch(() => console.log("erreur front"));
        },
        changeLikeStatus() {
            const usersLiked = this.post.usersLiked
            console.log(this.post.usersLiked);
            if (usersLiked) {
                this.likeStatus = usersLiked.find(u => u === this.userLogged.userId);
            }
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

.post-card {
    height: fit-content;
    margin: 50px 20px 30px 20px;
    border: 3px solid lighten($color: $color-tertiary, $amount: 10);
    border-radius: 20px;
    color: $color-tertiary;
    background-color: white;

    .img-container {
        @include center;

        img {
            max-width: 100%;
            max-height: 100%;
            margin: 30px;
        }

    }




    .post-text {
        margin: 20px;
        text-align: justify;
        line-height: 1.5em;
    }

    .post-created-infos {
        display: flex;
        justify-content: space-between;
        margin: 0px 10px;
        font-size: smaller;
        font-weight: 700;
        height: 20px;
    }

    .post-modified-infos {
        display: flex;
        justify-content: right;
        font-size: smaller;
        height: 20px;

        p {
            margin-right: 10px;
        }
    }


}

.like-info {
    display: flex;
    margin-left: 20px;

    p {
        margin-left: 5px;
        margin-right: 10px;
    }



    .no-like {
        height: 20px;
        color: $color-secondary;
    }

    .no-like:hover {
        transform: scale(1.09);
        cursor: pointer;
    }

    .like {
        height: 20px;
        color: $color-primary;
    }

    .like:hover {
        transform: scale(1.09);
        cursor: pointer;
    }
}
</style>