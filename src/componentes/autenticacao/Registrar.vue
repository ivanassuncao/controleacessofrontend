<template>
    <v-container fluid>
        <v-layout >
                <v-flex>
               
            </v-flex>
            <v-flex>
                <v-layout  column  >
                    <h1 class="title">Registrar</h1>
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
                        <v-text-field class="caption" label="Nome"
                            v-model="usuario.nome" />
                        <v-text-field class="caption"  label="E-mail"
                            v-model="usuario.email" />
                        <v-text-field class="caption"  label="Senha"
                            v-model="usuario.senha" type="password" />
                        <v-btn color="success" outline small class="caption ml-0 mt-3"
                            @click="registrar">
                            Registrar
                        </v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
               
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
            usuario: {},
            dados: null,
            erros: null,
            alert: false
        }
    },
    computed: {
        perfis() {
            return this.dados && this.dados.perfis &&
                this.dados.perfis.map(p => p.nome).join(',')
        }
    },
    methods: {
        registrar() {
            this.$api.mutate({
                mutation: gql ` 
                    mutation(
                        $nome: String!
                        $email: String!
                        $senha: String!
                    ){
                        registrarUsuario(
                            dados:{
                                nome: $nome
                                email: $email
                                senha: $senha
                            }
                        ){
                            id nome email perfis { nome }
                        }
                    }
                `,
                variables: {
                    nome: this.usuario.nome,
                    email: this.usuario.email,
                    senha: this.usuario.senha
                }
            }).then(res =>{
                this.dados = res.data.registrarUsuario
                this.usuario = {}
                this.erros = null
                this.alert = true
            }).catch(e=>{
                this.erros = e
                this.alert = false
            })
        }
    }
}
</script>

<style>

</style>
