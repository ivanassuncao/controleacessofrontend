<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[obterPerfis,flagUsuario = false,usuario = {}] " >Novo Usuário
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterUsuarios">
                    Listar Usuários
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Usuário</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                  <v-text-field v-model="usuario.nome" label="Nome" class="caption"></v-text-field>
                  <v-text-field v-model="usuario.email" label="E-mail" class="caption"></v-text-field>
                    <v-text-field class="caption" label="Senha"
                            v-model="usuario.senha" type="password" />
                        <v-select class="caption" label="Perfis"
                            v-model="usuario.perfis"
                            :items="perfis"
                            item-value="id"
                            item-text="rotulo"
                            attach multiple
                            small
                            chips deletable-chips />
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarUsuario">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogExcluir"
        max-width="290"
        >
        <v-card>
            <v-card-title class="title">Deseja Excluir Registro ?</v-card-title>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,naoConfirmaExclusaoUsuario()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoUsuario()]"
            >
                Excluir
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
            <v-flex>
                  <v-text-field class="caption" label="Nome"
                            v-model="search" />
            </v-flex>
            <v-flex>
                <div v-if="erros" class="caption mb-4">
                    <Erros :erros="erros" />
                </div>
                 <v-alert
                    v-model="alert"
                    dismissible
                    class="caption mb-4 "
                    small
                    @click="obterUsuarios"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                   Regitrado com Sucesso.
                </v-alert>  
            </v-flex>
            <v-flex>
                <v-data-table :pagination.sync="pagination" :total-items="totalUsuarios" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.perfis
                                .map(p => p.nome)
                                .join(', ') }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarUsuario(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirUsuario(props.item),dialogExcluir = true]"
                            >
                                delete
                            </v-icon>
                        </td>        
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
        
    </v-container>
</template>

<script>
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    computed:{
        filteredList() {
        return this.usuarios.filter(usuario => {
        return usuario.nome.toLowerCase().includes(this.search.toLowerCase())
            })
        },
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
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    components: { Erros },
    data() {
        return {
            dialog: false,
            dialogExcluir: false,
            totalUsuarios: 0,
            flagUsuario: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            usuarios: [],
            usuario: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'name' },
                { text: 'E-mail', value: 'email' },
                { text: 'Perfis', value: 'perfis' },
                { text: 'Ações', value: 'name', sortable: false }
            ],
        }
    },
    methods: {
        obterUsuarios() {

                this.$api.query({
                query: gql`
                    query {
                        usuarios {
                            id nome email perfis { nome }
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.usuarios = res.data.usuarios
                    this.totalUsuarios = this.usuarios.length
                    this.erros = null
                }).catch( e =>{
                    this.usuarios = []
                    this.erros = e 
                })
                
              
        },
        salvarUsuario() {

             if(!this.flagUsuario){
                  this.$api.mutate({
               mutation: gql `
                    mutation (
                        $nome: String!
                        $email: String!
                        $senha: String!
                        $perfis: [PerfilFiltro]
                    ){
                        novoUsuario (
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
                   nome: this.usuario.nome,
                   email: this.usuario.email,
                   senha: this.usuario.senha,
                   perfis: this.perfisSelecionados
               }
           }).then(res=>{
                this.dados = res.data.novoUsuario
                this.usuario = {}
                this.erros = null
                this.alert = true
                this.flagUsuario = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
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
                        idFiltro: this.usuario.id,
                        emailFiltro: this.usuario.email,
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
                    this.alert = true
                    this.flagUsuario = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
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
        },
        alterarUsuario(item){
            this.usuario = {
                id: item.id,
                nome: item.nome,
                email: item.email
            
            }
            this.obterPerfis()
            this.flagUsuario = true
            this.editedIndex = this.usuarios.indexOf(item)
            //this.usuario = Object.assign({}, item)
            this.dialog = true
        },
        excluirUsuario(item){
             this.usuario = {
                id: item.id,
                nome: item.nome,
                email: item.email
            
            }
        },
        close () {
            this.dialog = false
        },
        confirmaExclusaoUsuario(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                        $email: String
                    ){
                        excluirUsuario(
                             filtro:{
                                id: $id
                                email: $email
                            }
                        ){
                            id nome email
                        } 
                    }
               `,
               variables:{
                   id: this.usuario.id,
                   email: this.usuario.email
               }
           }).then( res =>{
                   this.dados = res.data.excluirUsuario
                   this.erros = null
                   this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoUsuario(){
             this.usuario = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
