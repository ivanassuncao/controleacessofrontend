<template>
    <v-container fluid>
        <v-layout>
             <v-flex>
             </v-flex>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Login</h1>
                    <v-divider class="mb-3" />
                        <div v-if="erros">
                            <Erros :erros="erros" />
                        </div>
                        <v-text-field class="caption" label="E-mail"
                            v-model="usuario.email" />
                        <v-text-field class="caption" label="Senha"
                            v-model="usuario.senha" type="password" />
                        <v-btn color="primary" class="ml-0 mt-3"
                            @click="login">
                            Logar
                        </v-btn>
                </v-layout>
            </v-flex>
             <v-flex>
             </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    components: { Erros },
    data() {
        return {
            usuario: {},
            dados: null,
            erros: null
        }
    },
    computed: {
        perfis() {
            return this.dados && this.dados.perfis &&
                this.dados.perfis.map(p => p.nome).join(',')
        }
    },
    methods: {
        ...mapActions(['setUsuario']),
        login() {
            this.$api.query({
                query: gql `
                    query(
                        $email: String!
                        $senha: String!
                    ){
                        login(
                            dados:{
                                email: $email
                                senha: $senha
                            }
                        ){
                            id nome email token perfis { nome }
                        }
                    }
                `,
                variables: {
                    email: this.usuario.email,
                    senha: this.usuario.senha
                }
            }).then(res =>{
                this.dados = res.data.login
                this.setUsuario(this.dados)
                this.usuario = {}
                this.erros = null
            }).catch(e => {
                this.erros = e
            })
        }
    }
}
</script>

<style>

</style>
