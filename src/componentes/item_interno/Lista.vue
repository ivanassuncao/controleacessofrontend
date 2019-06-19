<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagItemInterno = false,iteminterno = {}] " >Novo Item Interno
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterItemInternos">
                    Listar Item Interno
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Item Interno</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="iteminterno.nome_item" label="Nome" class="caption"></v-text-field>
                    <v-text-field v-model="iteminterno.unidade" label="Unidade" class="caption"></v-text-field>
                    <v-checkbox v-model="iteminterno.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarItemInterno">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoItemInterno()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoItemInterno()]"
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
                    @click="obterItemInternos"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
            <v-flex>
                <v-data-table :pagination.sync="pagination" :total-items="totalItemInternos" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_item}}</td>
                        <td>{{ props.item.unidade }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarItemInterno(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirItemInterno(props.item),dialogExcluir = true]"
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
        return this.iteminternos.filter(iteminterno => {
        return iteminterno.nome_item.toLowerCase().includes(this.search.toLowerCase())
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
            dialogExcluir: false,
            totalItemInternos: 0,
            flagItemInterno: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            iteminternos: [],
            iteminterno: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_item' },
                { text: 'Unidade', value: 'unidade' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        obterItemInternos() {

                this.$api.query({
                query: gql`
                    query {
                        itemsinternos {
                            id nome_item unidade ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.iteminternos = res.data.itemsinternos
                    this.totalItemInternos = this.iteminternos.length
                    this.erros = null
                }).catch( e =>{
                    this.iteminternos = []
                    this.erros = e 
                })
                
              
        },
        salvarItemInterno() {

             if(!this.flagItemInterno){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_item: String!
                            $unidade: String!
                            $ativo: Boolean
                        ){
                            novoItemInterno (
                                dados:{
                                    nome_item: $nome_item
                                    unidade: $unidade
                                    ativo: $ativo
                                }
                            ){
                                id nome_item unidade ativo
                            }
                        }
               `,
               variables:{
                   nome_item: this.iteminterno.nome_item,
                   unidade: this.iteminterno.unidade,
                   ativo: this.iteminterno.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoItemInterno
                this.iteminterno = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagItemInterno = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_item: String
                        $unidade: String
                         $ativo: Boolean

                    ){
                        alterarItemInterno(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_item: $nome_item
                                unidade: $unidade
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_item unidade ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.iteminterno.id,
                        nome_item: this.iteminterno.nome_item,
                        unidade: this.iteminterno.unidade,
                        ativo: this.iteminterno.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarItemInterno
                    this.iteminterno = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagItemInterno = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarItemInterno(item){
            this.iteminterno = {
                id: item.id,
                nome_item: item.nome_item,
                unidade: item.unidade,
                ativo: item.ativo
            
            }
            this.flagItemInterno = true
            this.editedIndex = this.iteminternos.indexOf(item)
            //this.iteminterno = Object.assign({}, item)
            this.dialog = true
        },
        excluirItemInterno(item){
             this.iteminterno = {
                id: item.id,
                nome_item: item.nome_item,
                unidade: item.unidade,
                 ativo: item.ativo
            
            }
        },
        close () {
            this.dialog = false
        },
        getValorBoleano (valorboleano) {
            if (valorboleano === true) return 'Sim'
            else if (valorboleano === false) return 'Não'
            else return ''
        },
        confirmaExclusaoItemInterno(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirItemInterno(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_item unidade
                        } 
                    }
               `,
               variables:{
                   id: this.iteminterno.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirItemInterno
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoItemInterno(){
             this.iteminterno = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
