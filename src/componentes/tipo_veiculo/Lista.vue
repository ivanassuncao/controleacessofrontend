<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagtipoveiculo = false,tipoveiculo = {}] " >Novo Tipo de Veículo
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterTipoVeiculos">
                    Listar Tipo de Veículos
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Tipo de Veiculo</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="tipoveiculo.nome_tipo_veiculo" label="Nome" class="text-uppercase caption"></v-text-field>
                    <v-checkbox v-model="tipoveiculo.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarTipoVeiculo">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoTipoVeiculo()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoTipoVeiculo()]"
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
                    @click="obterTipoVeiculos"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
            <v-flex>
                <v-data-table :pagination.sync="pagination" :total-items="totaltipoveiculos" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_tipo_veiculo }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarTipoVeiculo(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirTipoVeiculo(props.item),dialogExcluir = true]"
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
        return this.tipoveiculos.filter(tipoveiculo => {
        return tipoveiculo.nome_tipo_veiculo.toLowerCase().includes(this.search.toLowerCase())
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
            totaltipoveiculos: 0,
            flagtipoveiculo: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            tipoveiculos: [],
            tipoveiculo: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_tipo_veiculo' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        obterTipoVeiculos() {

                this.$api.query({
                query: gql`
                    query {
                        tipoveiculos {
                            id nome_tipo_veiculo  ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.tipoveiculos = res.data.tipoveiculos
                    this.totaltipoveiculos = this.tipoveiculos.length
                    this.erros = null
                }).catch( e =>{
                    this.tipoveiculos = []
                    this.erros = e 
                })
                
              
        },
        salvarTipoVeiculo() {

             if(!this.flagtipoveiculo){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_tipo_veiculo: String!
                            $ativo: Boolean
                        ){
                            novoTipoVeiculo (
                                dados:{
                                    nome_tipo_veiculo: $nome_tipo_veiculo
                                    ativo: $ativo
                                }
                            ){
                                id nome_tipo_veiculo ativo
                            }
                        }
               `,
               variables:{
                   nome_tipo_veiculo: this.tipoveiculo.nome_tipo_veiculo,
                   ativo: this.tipoveiculo.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoTipoVeiculo
                this.tipoveiculo = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagtipoveiculo = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_tipo_veiculo: String
                        $ativo: Boolean

                    ){
                        alterarTipoVeiculo(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_tipo_veiculo: $nome_tipo_veiculo
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_tipo_veiculo ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.tipoveiculo.id,
                        nome_tipo_veiculo: this.tipoveiculo.nome_tipo_veiculo,
                        ativo: this.tipoveiculo.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarTipoVeiculo
                    this.tipoveiculo = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagtipoveiculo = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarTipoVeiculo(item){
            this.tipoveiculo = {
                id: item.id,
                nome_tipo_veiculo: item.nome_tipo_veiculo,
                ativo: item.ativo
            
            }
            this.flagtipoveiculo = true
            this.editedIndex = this.tipoveiculos.indexOf(item)
            //this.tipoveiculo = Object.assign({}, item)
            this.dialog = true
        },
        excluirTipoVeiculo(item){
             this.tipoveiculo = {
                id: item.id,
                nome_tipo_veiculo: item.nome_tipo_veiculo,
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
        confirmaExclusaoTipoVeiculo(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirTipoVeiculo(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_tipo_veiculo cnpj
                        } 
                    }
               `,
               variables:{
                   id: this.tipoveiculo.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirTipoVeiculo
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoTipoVeiculo(){
             this.tipoveiculo = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
