<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagControleAcessoFuncionario = false,controleacessofuncionario = {},obterEmpresas(),obterFuncionarios()] " >Novo Acesso do Funcionário
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterControleAcessoFuncionarios">
                    Listar Acesso Funcionário
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Controle Acesso Funcionário</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-select class="caption" label="Empresa"
                            v-model="controleacessofuncionario.empresa_id"
                            :items="empresas"
                            item-value="id"
                            item-text="nome_empresa"
                            small
                            chips deletable-chips />
                    <v-select class="caption" label="Funcionário"
                            v-model="controleacessofuncionario.funcionario_id"
                            :items="funcionarios"
                            item-value="id"
                            item-text="nome_funcionario"
                            small
                            chips deletable-chips />        
                    <v-text-field v-model="controleacessofuncionario.placa_veiculo" 
                        mask="AAA-####"
                        label="Placa do Veiculo" class="caption"></v-text-field>
     
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarControleAcessoFuncionario">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoControleAcessoFuncionario()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoControleAcessoFuncionario()]"
            >
                Excluir
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
<v-layout row wrap>
    <v-flex xs12 sm6 md4>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Data Inicial"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
    <v-spacer></v-spacer>
    <v-flex xs12 sm6 md4>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Data Final"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
    <v-spacer></v-spacer>
  </v-layout>
    <v-flex>
        <div v-if="erros" class="caption mb-4">
            <Erros :erros="erros" />
        </div>
            <v-alert
            v-model="alert"
            dismissible
            class="caption mb-4 "
            small
            @click="obterControleAcessoFuncionarios"
            type="success"
            transition="scale-transition"
            outline
        >
        Regitrado com Sucesso.
        </v-alert>
    </v-flex>
    <v-flex>
        <v-data-table :pagination.sync="pagination" :total-items="totalControleAcessoFuncionarios" :headers="headers" :items="filteredList" 
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
                        @click="alterarControleAcessoFuncionario(props.item)"
                    >
                        edit
                    </v-icon>
                        
                    <v-icon
                        small
                        @click="[excluirControleAcessoFuncionario(props.item),dialogExcluir = true]"
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
        return this.controleacessofuncionarios.filter(controleacessofuncionario => {
        return controleacessofuncionario.nome_item.toLowerCase().includes(this.search.toLowerCase())
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
            date: new Date().toISOString().substr(0, 10),
            dialog: false,
            dialogExcluir: false,
            totalControleAcessoFuncionarios: 0,
            flagControleAcessoFuncionario: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            funcionarios: [],
            empresas: [],
            alert: false,
            menu: false,
            menu2: false,
            controleacessofuncionarios: [],
            controleacessofuncionario: {},
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
         obterEmpresas() {
            this.$api.query({
                query: gql`{ empresas { id nome_empresa } }`
            }).then(res =>{
                this.empresas = res.data.empresas
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        },
         obterFuncionarios() {
            this.$api.query({
                query: gql`{ funcionarios { id nome_funcionario } }`
            }).then(res =>{
                this.funcionarios = res.data.funcionarios
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        },
        obterControleAcessoFuncionarios() {

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
                    this.controleacessofuncionarios = res.data.itemsinternos
                    this.totalControleAcessoFuncionarios = this.controleacessofuncionarios.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessofuncionarios = []
                    this.erros = e 
                })
                
              
        },
        salvarControleAcessoFuncionario() {
           let data = new Date();
        
             if(!this.flagControleAcessoFuncionario){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $data_entrada: DateTime!
                            $empresa_id: Int!
                            $funcionario_id: Int!
                            $placa_veiculo: String
                        ){
                            novoControleAcessoFuncionario (
                                dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    funcionario_id: $funcionario_id
                                    placa_veiculo: $placa_veiculo
                                }
                            ){
                                id data_entrada empresa_id funcionario_id placa_veiculo
                            }
                        }
               `,
               variables:{
                   data_entrada: data.format("dd/MM/yyyy HH:mm:ss"),
                   empresa_id: this.controleacessofuncionario.empresa_id,
                   funcionario_id: this.controleacessofuncionario.funcionario_id,
                   placa_veiculo: this.controleacessofuncionario.placa_veiculo
               }
           }).then(res=>{
                this.dados = res.data.novoControleAcessoFuncionario
                this.controleacessofuncionario = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagControleAcessoFuncionario = false  
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
                        alterarControleAcessoFuncionario(
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
                        idFiltro: this.controleacessofuncionario.id,
                        nome_item: this.controleacessofuncionario.nome_item,
                        unidade: this.controleacessofuncionario.unidade,
                        ativo: this.controleacessofuncionario.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarControleAcessoFuncionario
                    this.controleacessofuncionario = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagControleAcessoFuncionario = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarControleAcessoFuncionario(item){
            this.controleacessofuncionario = {
                id: item.id,
                nome_item: item.nome_item,
                unidade: item.unidade,
                ativo: item.ativo
            
            }
            this.flagControleAcessoFuncionario = true
            this.editedIndex = this.controleacessofuncionarios.indexOf(item)
            //this.controleacessofuncionario = Object.assign({}, item)
            this.dialog = true
        },
        excluirControleAcessoFuncionario(item){
             this.controleacessofuncionario = {
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
        confirmaExclusaoControleAcessoFuncionario(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirControleAcessoFuncionario(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_item unidade
                        } 
                    }
               `,
               variables:{
                   id: this.controleacessofuncionario.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirControleAcessoFuncionario
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoControleAcessoFuncionario(){
             this.controleacessofuncionario = {}
        }

    },
    mounted(){
        
    }
}
</script>

<style>

</style>
