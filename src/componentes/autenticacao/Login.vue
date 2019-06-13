<template>
 <div class="blue-grey lighten-5 text-xs-center">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark  height="55" color="blue-grey">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
   
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href="https://martinslanna.com.br" target="_blank" v-on="on">
                      <v-icon large>mdi-codepen</v-icon>
                    </v-btn>
                  </template>
                  <span>Codepen</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="email" name="login" v-model="usuario.email" label="E-mail" type="text"></v-text-field>
                  <v-text-field id="password" v-on:keyup.13="login" prepend-icon="lock" v-model="usuario.senha" name="password" label="Senha" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="caption" flat small  @click="login">Acessar</v-btn>
              </v-card-actions>
              <div v-if="erros">
                            <Erros :erros="erros" />
                        </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
 </div>
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
