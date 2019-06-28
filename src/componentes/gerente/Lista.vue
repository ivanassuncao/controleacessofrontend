<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[obterUsuarios(),flagGerente = false,gerente = {}] " >Novo Gerente
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterGerentes">
                    Listar Gerente
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Gerente</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                     <v-select class="caption" label="Gerente"
                            v-model="gerente.usuario_id"
                            :items="usuarios"
                            item-value="id"
                            item-text="nome"
                            :readonly="flagGerente"
                            small
                            chips deletable-chips />   
                    <v-checkbox v-model="gerente.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarGerente">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
      <v-dialog v-model="dialog_usuario" max-width="500px">
         <v-card>
          <v-card-title>
            <span class="title">Registro do Usuario </span>
          </v-card-title>
           <v-card-text>
            <span class="caption">{{this.gerente.nome}}</span>
          </v-card-text>  
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                     <v-select class="caption" label="Usuário"
                            v-model="gerenteusuario.usuario_id"
                            :items="usuarios"
                            item-value="id"
                            item-text="nome"
                            :readonly="flagGerente"
                            small
                            chips deletable-chips /> 
                    <v-checkbox v-model="gerenteusuario.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarGerenteUsuario">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoGerente()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoGerente()]"
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
                    @click="obterGerentes"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
        <v-layout row>
            <v-flex xs6 class="mr-2">
                <v-data-table :pagination.sync="pagination" :total-items="totalGerentes" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                             <v-icon
                                small
                                class="mr-2"
                                @click="obterGerentesUsuarios(props.item)"
                            >
                                search
                            </v-icon>
                             <v-icon
                                small
                                class="mr-2"
                                @click="[novoGerenteUsuario(props.item),obterUsuarios()]"
                            >
                                add
                            </v-icon>
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarGerente(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirGerente(props.item),dialogExcluir = true]"
                            >
                                delete
                            </v-icon>
                        </td>        
                    </template>
                </v-data-table>
            </v-flex>
             <v-flex xs6 >
                <v-data-table :pagination.sync="pagination" :total-items="totalGerentes" dark :headers="headersUsuario" :items="gerentesusuarios" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.nome }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarGerenteUsuario(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirGerenteUsuario(props.item),dialogExcluir = true]"
                            >
                                delete
                            </v-icon>
                        </td>        
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>  
        </v-layout>
        
    </v-container>
</template>

<script>
import Erros from '../comum/Erros'
import gql from 'graphql-tag'

export default {
    computed:{
        filteredList() {
        return this.gerentes.filter(gerente => {
        return gerente.nome.toLowerCase().includes(this.search.toLowerCase())
            })
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
            dialog_usuario: false,
            dialogExcluir: false,
            totalGerentes: 0,
            flagGerente: false,
            flagUsuario: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            alert: false,
            gerentes: [],
            gerente: {},
            gerentesusuarios: [],
            gerenteusuario: {},
            usuarios:[],
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Gerente', value: 'nome' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
             headersUsuario: [
                { text: 'Usuário', value: 'nome' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        novoGerenteUsuario(item){
            this.gerenteusuario.gerente_id =  item.id
            this.gerenteusuario.nome_gerente = item.nome
            this.obterGerentesUsuarios(item)

            this.dialog_usuario = true
        },
        obterUsuarios() {
            this.$api.query({
                query: gql`{ usuariosativos { id nome } }`
            }).then(res =>{
                this.usuarios = res.data.usuariosativos
                this.erros = null
            }).catch(e=>{
                 this.usuarios = []
                this.erros = e
            })
        },
        obterGerentes() {

                this.$api.query({
                query: gql`
                    query {
                        gerentes {
                            id usuario_id nome ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.gerentes = res.data.gerentes
                    this.totalGerentes = this.gerentes.length
                    this.erros = null
                }).catch( e =>{
                    this.gerentes = []
                    this.erros = e 
                })
                
              
        },
        obterGerentesUsuarios(item) {

                this.gerente.id = item.id
              
                this.$api.query({
                query: gql`
                    query(
                        $gerente_id: Int
                    ){
                        gerenteusuarioid(
                            filtro:{
                                 gerente_id: $gerente_id
                            }
                        ) {
                            id gerente_id usuario_id nome ativo
                        }
                    }
                `,
                variables:{
                    gerente_id: this.gerente.id
                },
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.gerentesusuarios = res.data.gerenteusuarioid
                    this.erros = null
                }).catch( e =>{
                    this.gerentesusuarios = []
                    this.erros = e 
                })
                  
        },
        salvarGerente() {

             if(!this.flagGerente){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $usuario_id: Int!
                            $ativo: Boolean
                        ){
                            novoGerente (
                                dados:{
                                    usuario_id: $usuario_id
                                    ativo: $ativo
                                }
                            ){
                                id usuario_id ativo
                            }
                        }
               `,
               variables:{
                   usuario_id: this.gerente.usuario_id,
                   ativo: this.gerente.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoGerente
                this.gerente = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagGerente = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $usuario_id: Int!
                        $ativo: Boolean

                    ){
                        alterarGerente(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                usuario_id: $usuario_id
                                ativo: $ativo
                           }
                           
                        ){
                            id usuario_id ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.gerente.id,
                        usuario_id: this.gerente.usuario_id,
                        ativo: this.gerente.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarGerente
                    this.gerente = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagGerente = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        salvarGerenteUsuario() {

             if(!this.flagusuario){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $gerente_id: Int!
                            $usuario_id: Int!
                            $ativo: Boolean
                        ){
                            novoGerenteUsuario (
                                dados:{
                                    gerente_id: $gerente_id
                                    usuario_id: $usuario_id
                                    ativo: $ativo
                                }
                            ){
                                id gerente_id usuario_id ativo
                            }
                        }
               `,
               variables:{
                   gerente_id: this.gerenteusuario.gerente_id,
                   usuario_id: this.gerenteusuario.usuario_id,
                   ativo: this.gerenteusuario.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoGerenteUsuario
                this.gerenteusuario = {}
                this.erros = null
                this.alert = true
                this.dialog_usuario = false
                this.flagusuario = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $usuario_id: Int
                        $ativo: Boolean

                    ){
                        alterarGerenteUsuario(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                usuario_id: $usuario_id
                                ativo: $ativo
                           }
                           
                        ){
                            id gerente_id usuario_id ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.gerenteusuario.id,
                        usuario_id: this.gerenteusuario.usuario_id,
                        ativo: this.gerenteusuario.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarGerenteUsuario
                    this.gerenteusuario = {}
                    this.filtro = {}
                    this.erros = null
                    this.alert = true
                    this.dialog_usuario = false
                    this.flagusuario = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarGerente(item){
            this.gerente = {
                id: item.id,
                usuario_id: item.usuario_id,
                ativo: item.ativo
            
            }
            this.flagGerente = true
            this.editedIndex = this.gerentes.indexOf(item)
            //this.gerente = Object.assign({}, item)
            this.dialog = true
        },
         alterarGerenteUsuario(item){
            this.gerenteusuario = {
                id: item.id,
                gerente_id: item.gerente_id,
                usuario_id: item.usuario_id,
                ativo: item.ativo
            
            }
            this.flagusuario = true
            this.editedIndex = this.gerentesusuarios.indexOf(item)
            //this.empresaterceira = Object.assign({}, item)
            this.dialog_usuario = true
        },
        excluirGerente(item){
             this.gerente = {
                id: item.id,
                usuario_id: item.usuario_id,
                 ativo: item.ativo
            
            }
        },
        excluirGerenteUsuario(item){
             this.gerenteusuario = {
               id: item.id,
                gerente_id: item.gerente_id,
                usuario_id: item.usuario_id,
                ativo: item.ativo
            }
        },
        close () {
            this.dialog = false
            this.dialog_usuario = false
        },
        getValorBoleano (valorboleano) {
            if (valorboleano === true) return 'Sim'
            else if (valorboleano === false) return 'Não'
            else return ''
        },
        confirmaExclusaoGerente(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirGerente(
                             filtro:{
                                id: $id
                            }
                        ){
                            id usuario_id
                        } 
                    }
               `,
               variables:{
                   id: this.gerente.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirGerente
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoGerente(){
             this.gerente = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
