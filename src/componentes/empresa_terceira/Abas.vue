<template>
    <v-container fluid>
        <v-tabs class="title" dark color="blue-grey darken-4"
            slider-color="blue">
            <v-tab ripple>
                Lista
            </v-tab>

            <v-tab-item>
                <Lista />
            </v-tab-item>

        </v-tabs>
    </v-container>
</template>

<script>
import Lista from './Lista'

export default {
    components: { Lista }
}
</script>

<style>

</style>
