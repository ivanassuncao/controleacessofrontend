<template>
    <v-container fluid>
        <v-tabs
            class="title" dark color="blue-grey darken-4"
            slider-color="blue">
            <v-tab class="caption" ripple>
                Login
            </v-tab>
            <v-tab class="caption" ripple>
                Registrar
            </v-tab>
            <v-tab-item>
                <Login />
            </v-tab-item>
            <v-tab-item>
                <Registrar />
            </v-tab-item>

        </v-tabs>
    </v-container>
</template>

<script>
import Registrar from './Registrar'
import Login from './Login'
export default {
    components: { Registrar, Login }
}
</script>

<style>

</style>
