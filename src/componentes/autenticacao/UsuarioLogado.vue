<template>
    <v-card v-if="usuario" class="ma-3 pa-2">
        <v-layout align-center
            justify-space-around
             wrap>
             <v-avatar color="indigo">
                <v-icon dark>account_circle</v-icon>
            </v-avatar>
             <v-flex sm5 md3 hidden-xs-only>
              <strong class="ma-2" v-html="usuario.nome"></strong>
              <span
                class="grey--text"
              >
                &nbsp;({{ usuario.email }})
              </span>
            </v-flex>
            <v-flex>

                <span class="ml-1 caption"><strong>Perfis: </strong></span>
                <span class="caption red--text text--darken-2">
                    {{ perfis }}</span>
            </v-flex>
            <v-flex>
            </v-flex>
            <v-flex shrink>
                <v-btn small=true color="error"
                    @click="[setUsuario(null),refresh()]">
                    Sair
                </v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters(['usuario']),
        perfis() {
            if(!this.usuario && !this.usuario.perfis) return null
            return this.usuario.perfis.map(p => p.nome).join(', ')
        }
    },
    methods: mapActions(['setUsuario']),
            refresh(){
                window.location.reload()
            }
}
</script>

<style>

</style>
