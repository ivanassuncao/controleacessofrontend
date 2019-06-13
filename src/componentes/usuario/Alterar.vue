<template>
    <v-container fluid>
        <v-layout  row wrap align-center>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Filtrar Usuário</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field class="caption" label="ID"
                        v-model.number="filtro.id" />
                    <v-text-field class="caption" label="E-mail"
                        v-model="filtro.email" />

                    <h1 class="mt-4 title">Alterar Usuário</h1>
                    <v-divider class="mb-3" />
                    <v-text-field class="caption" label="Nome"
                        v-model="usuario.nome" />
                    <v-text-field class="caption" label="E-mail"
                        v-model="usuario.email" />
                    <v-text-field class="caption" label="Senha"
                        v-model="usuario.senha" type="password" />
                    <v-flex xs6>
                         <v-select class="caption" label="Perfis"
                        v-model="usuario.perfis"
                        :items="perfis"
                        item-value="id"
                        item-text="rotulo"
                        attach multiple
                        chips deletable-chips />
                    </v-flex>  
                    <v-flex xs6>
                    <v-btn class="caption ml-0 mt-3"
                        outline
                        small
                        @click="obterPerfis">
                        ...
                    </v-btn>
                    </v-flex>   
      
                    <v-btn color="warning" class="caption ml-0 mt-3"
                        outline
                        small
                        @click="alterarUsuario">
                        Alterar Usuário
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex v-show="false">
                <v-layout column class="ma-3">
                    <h1 class="title">Resultado</h1>
                    <v-divider />
                    <template v-if="dados">
                        <v-text-field label="ID" readonly
                            v-model="dados.id" />
                        <v-text-field label="Nome" readonly
                            v-model="dados.nome" />
                        <v-text-field label="E-mail" readonly
                            v-model="dados.email" />
                        <v-text-field label="Perfis" readonly
                            :value="perfisRotulos" />
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
            filtro: {},
            usuario: {},
            perfis: [],
            dados: null,
            erros: null
        }
    },
    computed: {
        perfisRotulos() {
            return this.dados && this.dados.perfis &&
                this.dados.perfis.map(p => p.nome).join(', ')
        },
        perfisSelecionados() {
            if(this.usuario.perfis) {
                return this.usuario.perfis.map(id => ({ id }))
            } else {
                return null
            }
        }
    },
    methods: {
        alterarUsuario() {
           this.$api.mutate({
               mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $emailFiltro: String
                        $nome: String
                        $email: String
                        $senha: String
                        $perfis: [PerfilFiltro]

                    ){
                        alterarUsuario(
                            filtro:{
                                 id: $idFiltro
                                 email: $emailFiltro
                            }
                           dados:{
                                nome: $nome
                                email: $email
                                senha: $senha
                                perfis: $perfis
                           }
                           
                        ){
                            id nome email perfis { nome }
                        }
                    }
               `,
               variables:{
                   idFiltro: this.filtro.id,
                   emailFiltro: this.filtro.email,
                   nome: this.usuario.nome,
                   email: this.usuario.email,
                   senha: this.usuario.senha,
                   perfis: this.perfisSelecionados
               }
           }).then( res => {
               this.dados = res.data.alterarUsuario
               this.usuario = {}
               this.filtro = {}
               this.erros = null
           }).catch( e => {
               this.erros = e
           })
        },
        obterPerfis() {
          this.$api.query({
                query: gql`{ perfis { id rotulo } }`
            }).then(res =>{
                this.perfis = res.data.perfis
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        }
    }
}
</script>

<style>

</style>
