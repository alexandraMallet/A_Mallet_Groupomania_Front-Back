<template>
    <Header />
    <div class="title">
        <h1>Que souhaitez-vous partager aujourd'hui ?</h1>
    </div>

    <div class="form-contener">
        <form class="create-post-form" @submit.prevent="submitPost">

            <div class="text-form">
                <label for="text">votre texte :</label>
                <textarea id="text" v-model="text"></textarea>
            </div>

            <div class="image-form">
                <input type="file" id="image" class="image-input" name="image" accept="image/png, image/jpeg"
                    @change="handleFileUpload($event)" />
                <label class="image" for="image">Choisir une image</label>

                <div class="preview-image">
                    <img :src="selectedImageUrl" />
                </div>
            </div>

            <Button class="submit-post" :buttonText="buttonText" />
        </form>

    </div>

    <Footer class="footer" />
</template>

<script>

import axios from 'axios';
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'CreatePostView',
    components: {
        Button,
        Header,
        Footer
    },
    data() {
        return {
            buttonText: 'publier',
            text: '',
            file: '',
            selectedImageUrl: ''
        }
    },
    methods: {
        submitPost() {

            const userLogged = JSON.parse(localStorage.userLogged);
            // const userPseudo = localStorage.userPseudo;

            let formData = new FormData();
            // formData.append('userPseudo', userPseudo);
            formData.append('text', this.text);
            formData.append('image', this.file);

            console.log(formData);

            axios.post('http://localhost:3000/api/post',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userLogged.token}`
                    }
                }
            ).then(function () {
                console.log('publication publiée !');
            })
                .then(() => { this.$router.push('/') })
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
                this.selectedImageUrl = event.target.result
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
            margin-bottom: 20px;

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
</style>