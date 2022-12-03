<template>
    <div class=post-card>

        <router-link class="post-link" :to="{ name: 'OnePostView', params: { id: post._id } }">
            <div class="post-content">
                <img v-if="post.imageUrl" class="post-image" :src="post.imageUrl" :alt="altText" />
                <img v-if="!post.imageUrl" class="post-logo" src="@/assets/logo-only.png" alt="logo de l'entreprise"/>
                <p class="post-text">{{ post.text }}</p>

                <div class="post-created-infos">
                    <p>{{ post.createdAt }}</p>
                    <p>{{ post.user[0].pseudo }}</p>
                </div>
                <div class="post-modified-infos">
                    <p v-if="post.modifiedBy"> modifiée par {{ post.modifiedBy }}</p>
                    <p v-if="post.modifiedAt">le {{ post.modifiedAt.split("T")[0] }}</p>
                </div>

            </div>
        </router-link>

        <div class="like-info">
            <div class="like_icon">
                <font-awesome-icon v-show="!likeStatus" icon="fa-solid fa-heart" class="no-like"
                    @click.prevent="addOrRemoveLike">
                </font-awesome-icon>
                <font-awesome-icon v-show="likeStatus" icon="fa-solid fa-heart" class="like"
                    @click.prevent="addOrRemoveLike">
                </font-awesome-icon>
            </div>
            <p class="likes">{{ post.likes }}</p>
        </div>
    </div>

</template>

<script>

import axios from 'axios'

export default {
    name: 'PostCard',
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    emits: ['update-like'],
    data() {
        return {
            userLogged: {},
        }
    },
    created() {
        this.userLogged = JSON.parse(localStorage.userLogged);

    },
    computed: {
        likeStatus() {

            const usersLiked = this.post.usersLiked
            console.log(usersLiked)
            console.log(this.userLogged.userId)
            if (usersLiked) {
                return usersLiked.find(u => u === this.userLogged.userId);
            }
        },
        altText() {
            return `image de ${this.post.user[0].pseudo}`
        }
    },
    methods: {
        addOrRemoveLike() {
            axios.post('http://localhost:3000/api/post/' + this.post._id + '/like', {}, {

                headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }
            })
                .then(() => { this.$emit('update-like') })
                .catch(() => console.log("erreur front"));
        },
    }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

.post-card {
    height: fit-content;
    min-height: 200px;
    max-height: 400px;
    max-width: 150px;
    width: 95%;
    margin: 20px;
    border: 3px solid lighten($color: $color-tertiary, $amount: 10);
    border-radius: 20px;
    color: $color-tertiary;
    background-color: white;

    .post-link {
        color: $color-tertiary;
    }

   

    .post-image {
        object-fit: cover;
        width: 100%;
        height: 150px;
        border-radius: 17px 17px 0px 0px;
    }

    .post-logo {
        object-fit: cover;
        width: 100%;
        height: 150px;
        border-radius: 17px 17px 0px 0px;
        border-bottom: none;
    }

    .post-text {
        height: 20px;
        margin: 20px;
        justify-content: center;
        @include ellipse;
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