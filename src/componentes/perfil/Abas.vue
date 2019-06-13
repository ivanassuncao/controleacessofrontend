<template>
    <v-container fluid>
        <v-tabs class="title" dark height=35 color="blue-grey darken-4"
            slider-color="blue">
            <v-tab class="caption" ripple>
                Lista
            </v-tab>

            <v-tab class="caption" ripple>
                Consulta
            </v-tab>

            <v-tab class="caption" ripple>
                Novo
            </v-tab>

            <v-tab class="caption" ripple>
                Alterar
            </v-tab>
            
            <v-tab class="caption" ripple>
                Excluir
            </v-tab>

            <v-tab-item>
                <Lista />
            </v-tab-item>

            <v-tab-item>
                <Consulta />
            </v-tab-item>

            <v-tab-item>
                <Novo />
            </v-tab-item>
            
            <v-tab-item>
                <Alterar />
            </v-tab-item>
            
            <v-tab-item>
                <Excluir />
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>

<script>
import Lista from './Lista'
import Consulta from './Consulta'
import Novo from './Novo'
import Alterar from './Alterar'
import Excluir from './Excluir'

export default {
    components: { Lista, Consulta, Novo, Alterar, Excluir }
}
</script>

<style>

</style>
