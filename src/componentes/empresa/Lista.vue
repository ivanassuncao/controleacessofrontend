<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagempresa = false,empresa = {}] " >Nova Empresa
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterEmpresas">
                    Listar Empresas
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Empresa</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="empresa.nome_empresa" label="Nome" class="text-uppercase caption"></v-text-field>
                    <v-text-field v-model="empresa.cnpj" mask="##.###.###/####-##" label="CNPJ" class="caption"></v-text-field>
                    <v-checkbox v-model="empresa.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarEmpresa">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoEmpresa()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoEmpresa()]"
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
                    @click="obterEmpresas"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
            <v-flex>
                <v-data-table :pagination.sync="pagination" :total-items="totalempresas" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_empresa }}</td>
                        <td>{{ props.item.cnpj }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarEmpresa(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirEmpresa(props.item),dialogExcluir = true]"
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
        return this.empresas.filter(empresa => {
        return empresa.nome_empresa.toLowerCase().includes(this.search.toLowerCase())
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
            totalempresas: 0,
            flagempresa: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            empresas: [],
            empresa: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_empresa' },
                { text: 'CNPJ', value: 'cnpj' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        obterEmpresas() {

                this.$api.query({
                query: gql`
                    query {
                        empresas {
                            id nome_empresa cnpj ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.empresas = res.data.empresas
                    this.totalempresas = this.empresas.length
                    this.erros = null
                }).catch( e =>{
                    this.empresas = []
                    this.erros = e 
                })
                
              
        },
        salvarEmpresa() {

             if(!this.flagempresa){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_empresa: String!
                            $cnpj: String!
                            $ativo: Boolean
                        ){
                            novaEmpresa (
                                dados:{
                                    nome_empresa: $nome_empresa
                                    cnpj: $cnpj
                                    ativo: $ativo
                                }
                            ){
                                id nome_empresa cnpj ativo
                            }
                        }
               `,
               variables:{
                   nome_empresa: this.empresa.nome_empresa,
                   cnpj: this.empresa.cnpj,
                   ativo: this.empresa.ativo
               }
           }).then(res=>{
                this.dados = res.data.novaEmpresa
                this.empresa = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagempresa = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_empresa: String
                        $cnpj: String
                        $ativo: Boolean

                    ){
                        alterarEmpresa(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_empresa: $nome_empresa
                                cnpj: $cnpj
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_empresa cnpj ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.empresa.id,
                        nome_empresa: this.empresa.nome_empresa,
                        cnpj: this.empresa.cnpj,
                        ativo: this.empresa.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarEmpresa
                    this.empresa = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagempresa = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarEmpresa(item){
            this.empresa = {
                id: item.id,
                nome_empresa: item.nome_empresa,
                cnpj: item.cnpj,
                ativo: item.ativo
            
            }
            this.flagempresa = true
            this.editedIndex = this.empresas.indexOf(item)
            //this.empresa = Object.assign({}, item)
            this.dialog = true
        },
        excluirEmpresa(item){
             this.empresa = {
                id: item.id,
                nome_empresa: item.nome_empresa,
                cnpj: item.cnpj,
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
        confirmaExclusaoEmpresa(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirEmpresa(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_empresa cnpj
                        } 
                    }
               `,
               variables:{
                   id: this.empresa.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirEmpresa
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoEmpresa(){
             this.empresa = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
