<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Novo Perfil</h1>
                    <v-divider class="mb-3" />
                        <div v-if="erros">
                            <Erros :erros="erros" />
                        </div>
                          <v-alert
                            v-model="alert"
                            dismissible
                            class="caption"
                            small
                            type="success"
                            transition="scale-transition"
                            outline
                            >
                            Regitrado com Sucesso.
                        </v-alert>
                        <v-text-field  class="caption" label="Nome"
                            v-model="perfil.nome" />
                        <v-text-field class="caption" label="Rótulo"
                            v-model="perfil.rotulo" />
                        <v-btn color="success" small outline class="caption ml-0 mt-3"
                            @click="novoPerfil">
                            Novo Perfil
                        </v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Resultado</h1>
                    <v-divider />
                    <template v-if="dados">
                        <v-text-field label="ID" readonly
                            v-model="dados.id" />
                        <v-text-field label="Nome" readonly
                            v-model="dados.nome" />
                        <v-text-field label="Rótulo" readonly
                            v-model="dados.rotulo" />
                    </template>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    components: { Erros },
    data() {
        return {
            perfil: {},
            dados: null,
            erros: null,
            alert: false
        }
    },
    methods: {
        novoPerfil() {
           this.$api.mutate({
               mutation: gql `
                    mutation (
                        $nome: String!
                        $rotulo: String!
                    ){
                        novoPerfil(
                            dados:{
                                nome: $nome
                                rotulo: $rotulo
                            }
                        ){
                            id nome rotulo
                        }
                    }
               `,
               variables:{
                   nome: this.perfil.nome,
                   rotulo: this.perfil.rotulo
               }
           }).then(res =>{
               this.dados = res.data.novoPerfil
               this.perfil = {}
               this.erros = null
                this.alert = true
           }).catch(e =>{
               this.erros = e
           })
        }
    }
}
</script>

<style>

</style>
