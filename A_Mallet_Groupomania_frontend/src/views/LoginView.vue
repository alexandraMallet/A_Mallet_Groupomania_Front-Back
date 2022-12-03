<template>


  <div class="connexion-container">
    <div class="connexion-container-small">
      <mq-responsive target="sm-" tag="div">
        <Header />
      </mq-responsive>

      <div class="title">
        <h1>Bienvenue sur votre réseau social d'entreprise</h1>
      </div>

      <div v-if="!showSignup" class="login-contener">
        <form class="login" @submit.prevent="login">
          <label for="email">votre email :</label>
          <input id="email" class="input-email" v-model="email" required />

          <label for="password">votre mot de passe :</label>
          <input type="password" id="password" class="input-password" v-model="password" required />

          <p>Identifiants oubliés ?
            <br />Merci de prendre contact avec le service informatique.
          </p>

          <Button type="submit" :buttonText="buttonTextLogin" />
        </form>

        <div class="redirect-signup">
          <p>Pas encore de compte ?</p>
          <Button @click="redirectSignup" :buttonText="buttonTextRedirect" />
        </div>

      </div>

      <div v-if="showSignup" class="signup-container">

        <div class="return">
          <Button @click="redirectLogin" :buttonText="buttonBackLogin" />
        </div>

        <form class="signup-form" @submit.prevent="signup">
          <label for="email">email :</label>
          <input class="input-email" id="email" v-model="email" required />

          <label for="password">Choisissez un mot de passe :</label>
          <input type="password" class="input-password" id="password" v-model="password"
            placeholder="au moins 8 caractères, sans espace" required />

          <label for="pseudo">Choisissez un pseudo :</label>
          <input class="pseudo" id="pseudo" v-model="pseudo" required />

          <div class="image-form">
            <input type="file" id="image" class="image-input" name="image" accept="image/png, image/jpeg"
              @change="handleFileUpload($event)" required />
            <label class="label-image" for="image">Choisir une photo de profil</label>
          </div>


          <div class="preview-image">
            <img :src="selectedImageUrl">
          </div>

          <Button :buttonText="buttonTextSignup" />
        </form>

      </div>
    </div>


    <mq-responsive target="md+" tag="div">
      <div class="connexion-large">
        <img src="@/assets/logo.png" alt="logo de l'entreprise" />
      </div>
    </mq-responsive>

  </div>

</template>

<script>
import axios from 'axios';
import { MqResponsive } from "vue3-mq";
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';

export default {
  name: 'LoginView',
  components: {
    Button,
    Header,
    MqResponsive
  },
  data() {
    return {
      buttonTextLogin: "Se connecter",
      buttonTextRedirect: "S'inscrire",
      buttonTextSignup: "Envoyer",
      buttonBackLogin: "Retour",
      selectedImageUrl: '',
      showSignup: false
    };
  },
  created() {
    if (localStorage) {
      localStorage.clear();
    }
  },
  methods: {
    login() {

      const validEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      const validPassword = /^[^\s]{8,}$/;

      
  if (!this.email.match(validEmail)) {
    return alert("Veuillez renseigner un email valide")
  }
  if (!this.password.match(validPassword)) {
    return alert("Votre mot de passe comporte au moins 6 caractères, sans espaces")
  }
 
      axios.post('http://localhost:3000/api/auth/login', {
        'email': this.email,
        'password': this.password
      })
        .then(function (response) {
          const user = response.data;
          const userLogged = {
            userId: user.userId,
            isAdmin: user.isAdmin,
            token: user.token
          }
          console.log(userLogged);
          const userLoggedPseudo = user.pseudo;
          console.log(userLoggedPseudo);
          localStorage.setItem('userLogged', JSON.stringify(userLogged));
          localStorage.setItem('userLoggedPseudo', userLoggedPseudo);
        })
        .then(() => { this.$router.push('/') })
        .catch(function (error) {
          console.log(error);
        });
    },
    redirectSignup() {
      this.showSignup = true
    },
    redirectLogin() {
      this.showSignup = false
    },
    signup() {

      let formData = new FormData();
      formData.append('email', this.email);
      formData.append('pseudo', this.pseudo);
      formData.append('password', this.password);
      formData.append('image', this.file);
      console.log(formData);

      const validEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
      const validPassword = /^[^\s]{8,}$/;

      
  if (!this.email.match(validEmail)) {
    return alert("Veuillez renseigner un email valide")
  }
  if (!this.password.match(validPassword)) {
    return alert("Veuillez choisir un mot de passe d'au moins 6 caractères, sans espaces")
  }

      axios.post('http://localhost:3000/api/auth/signup',
        formData
      )
        .then(function (response) {
          console.log(formData);
          const user = response.data;
          const userLogged = {
            userId: user.userId,
            isAdmin: user.isAdmin,
            token: user.token
          }
          console.log(userLogged);
          const userLoggedPseudo = user.pseudo;
          console.log(userLoggedPseudo);
          localStorage.setItem('userLogged', JSON.stringify(userLogged));
          localStorage.setItem('userLoggedPseudo', userLoggedPseudo);
        })
        .then(() => { this.$router.push('/') })
        .catch(function (error) {
          console.log(error);
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
};
</script>
  
<style scoped lang="scss">
@import '@/styles/index.scss';

.title {
  margin-top: 200px;
  margin-bottom: 50px;
  @include center;

  h1 {
    margin-top: 30px;
    margin-bottom: 0px;
    text-align: center;

  }
}

.connexion-container {
  display: flex;
  justify-content: space-between;
}

.connexion-container-small {
  width: 100%;
}

.login-contener {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 30px;

  @include md {
    margin-top: 30px;
  }

  @include lg {
    margin-top: 30px;
    width: 90%;
  }

  form {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;

    input {
      margin-top: 10px;
      height: 30px;
      width: 250px;
      border-color: $color-secondary;
    }

    .input-email {
      margin-bottom: 20px;
    }

    p {
      font-size: 12px;
      margin-bottom: 30px;
    }
  }

  .redirect-signup {
    display: flex;
    justify-content: right;
    margin-top: 20px;
    margin-right: 20px;

    p {
      font-size: small;
    }
  }
}

.signup-container {

  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 30px;

  @include md {
    margin-top: 30px;
  }

  @include lg {
    margin-top: 30px;
    width: 90%;
  }

  .return {
    margin-left: 20px;
    margin-top: 30px;

    button {
      margin-bottom: 0;
      padding-left: 0;
      padding-right: 0;
    }
  }

  form {
    margin: 50px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;

    input {
      margin-top: 10px;
      margin-bottom: 20px;
      height: 30px;
      width: 250px;
      border-color: $color-secondary;
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
    }

    .image-input:focus+label,
    .image-input:focus-visible+label,
    .image-input:focus-within+label {
      transform: scale(1.01);
      box-shadow: 0 3px 5px 0 $color-primary;
    }

    .preview-image {
      height: 100px;
      margin-top: 20px;
      background-size: cover;
      background-position: center center;

      img {
        height: 100px;
      }
    }

  }

  button {
    margin-top: 30px;
  }


}

.connexion-large {

  width: 100%;
  background-color: $color-secondary;
  @include center;

  img {
    max-width: 100%;
    max-height: 100%;
  }

}
</style>