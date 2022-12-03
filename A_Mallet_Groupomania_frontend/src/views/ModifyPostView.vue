<template>
    <Header />

    <div v-if="rightToChange" class="title">
        <h1>modifier cette publication :</h1>
    </div>

    <div v-if="rightToChange" class="form-contener">

        <form v-if="$data.post" class="create-post-form" @submit.prevent="modifyPost">

            <div class="text-form">
                <label for="text">Votre texte : </label>
                <textarea id="text" v-model="text"></textarea>
            </div>

            <div class="image-form">
                <input type="file" id="image" class="image-input" name="image" accept="image/png, image/jpeg"
                    @change="handleFileUpload($event)" />
                <label class="image" for="image">Modifier l'image</label>

                <div class="preview-image">
                    <img :src="imageUrl">
                </div>

            </div>

            <Button v-if="rightToChange" :buttonText="buttonText" />
        </form>

    </div>

    <div v-if="!rightToChange" class="unauthorized">

        <img :src="imageUrl">
        <h2>Cette publication n'est pas la vôtre, vous ne pouvez pas la modifier.</h2>
        <Button :buttonText="buttonTextUnauthorized" @click="redirection" />
    </div>

    <Footer class="footer" />

</template>

<script>

import axios from 'axios';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';

export default {
    name: 'ModifyPostView',
    components: {
        Button,
        Header,
        Footer
    },
    data() {
        return {
            buttonText: 'enregistrer les modifications',
            buttonTextUnauthorized: "revenir à l'accueil",
            post: '',
            text: '',
            userLoggedPseudo: '',
            file: '',
            userLogged: {},
            postId: '',
            imageUrl: '',
            selectedImageUrl: '',
            rightToChange: false
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
            .then(() => {
                this.text = this.post.text;
                this.imageUrl = this.post.imageUrl;
            })
            .catch(error => console.log(error));
    },
    methods: {
        redirection() {
            this.$router.push('/');
        },
        modifyPost() {

            let formData = new FormData();
            this.userLoggedPseudo = localStorage.userLoggedPseudo;

            formData.append('text', this.text);
            formData.append('modifiedBy', this.userLoggedPseudo);
            if (this.file) { formData.append('image', this.file) }

            console.log(formData);

            axios.put('http://localhost:3000/api/post/' + this.postId,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.userLogged.token}`
                    }
                }
            )
                .then(() => { this.$router.push('/publications/' + this.postId) })
                .catch(function () {
                    console.log('erreur');
                });
        },

        handleFileUpload(event) {
            this.file = event.target.files[0];
            console.log(this.file)
            this.imagePreview(this.file)
        },
        imagePreview(file) {
            let reader = new FileReader();
            reader.onload = event => {
                this.imageUrl = event.target.result
            }
            reader.readAsDataURL(file)
        }
    }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

.title {
    @include center;

    h1 {
        margin-top: 30px;
        margin-bottom: 0px;
        text-align: center;

    }
}

.form-contener {
    height: fit-content;
    width: 100%;
    display: flex;
    @include center;

    .create-post-form {
        width: 100%;
        padding: 20px;

        .text-form {
            display: flex;
            flex-direction: column;
            padding-top: 30px;

            label {
                padding-bottom: 20px;
                font-size: small;
                font-weight: 700;
            }

            textarea {
                min-height: 200px;
                border: 2px solid $color-tertiary;
                border-radius: 10px;
            }
        }

        .image-form {
            position: relative;
            margin-top: 10px;

            label {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 150px;
                height: 30px;
                background-color: $color-secondary;
                color: $color-tertiary;
                border-radius: 50px;
                border: 1px solid $color-primary;
                @include center;
                font-family: 'Lato';
                font-weight: 700;
                font-size: 12px;

                &:hover {
                    cursor: pointer;
                    transform: scale(1.01);
                    box-shadow: 0 3px 5px 0 $color-primary;
                }
            }

            input {
                display: inline-block;
                font-size: 5px;
                border: none;
                margin-left: 5px;
                margin-top: 0px;
                margin-bottom: 0px;
                width: 150px;
                opacity: 0;

                &:focus {
                    outline: none;
                }
            }

            .image-input:focus+label,
            .image-input:focus-visible+label,
            .image-input:focus-within+label {
                transform: scale(1.01);
                box-shadow: 0 3px 5px 0 $color-primary;
            }

            .preview-image {
                height: 100px;
                background-size: cover;
                margin-left: 30px;
                padding-top: 30px;

                img {
                    height: 100px;
                }
            }
        }

        .submit-post {
            margin: 30px;
        }
    }
}

.unauthorized {
    padding: 30px;
    display: flex;
    flex-direction: column;
    @include center;
    text-align: center;
    min-height: 500px;
    line-height: 1.5;
}
</style>