<template>

    <nav>
        <ul>
            <li>
                <h4>Plan du site</h4>
                <router-link to="/">accueil</router-link>
                <router-link to="/publier">publier</router-link>
                <router-link to="/connexion">se déconnecter</router-link>
            </li>
            <li class="contacts">
                <h4>Contact</h4>
                <a href="mailto:service-info@groupomania.fr">contacter le service informatique</a>
                <a href="mailto:admin-rs@groupomania.fr">contacter l'admin</a>
            </li>
            <li>
                <h4>Mentions légales</h4>
                <a href="#">termes</a>
                <a href="#">gérer vos données</a>
                <a href="https://goo.gl/maps/Jb4pE7J8RjWCE3N8A" target="_blank" rel="noopener noreferrer">© CONNECT-E</a>
            </li>
        </ul>
    </nav>

</template>

<script>
import { MqResponsive } from "vue3-mq";


export default {
    name: 'Footer',
    components: {
        MqResponsive
    }
}

</script>

<style scoped lang="scss">
@import '@/styles/index.scss';

nav {
    height: 100%;
    background-color: lighten($color: $color-tertiary, $amount: 60);
    padding: 30px;
    font-size: small;


    ul {
        display: flex;
        justify-content: space-around;

        li {
            display: flex;
            flex-direction: column;

            h4 {
                margin-top: 0px;
                margin-bottom: 10px;

                @include sm {
                    margin-top: 20px;
                }
            }
        }

        @include sm {
            flex-direction: column;
        }
    }

    @include sm {
        flex-direction: column;
    }
}
</style>