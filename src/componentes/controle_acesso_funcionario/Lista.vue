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
                    @click="[obterControleAcessoFuncionarios(),obterControleAcessoFuncionariosSaida()]">
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
                   
                    <v-select class="caption" label="Funcionário"
                            v-model="controleacessofuncionario.funcionario_id"
                            :items="funcionarios"
                            item-value="id"
                          
                            item-text="nome_funcionario"
                            :readonly="flagControleAcessoFuncionario"
                            small
                            chips deletable-chips />    
                     <v-select class="caption" label="Empresa"
                            v-model="controleacessofuncionario.empresa_id"
                            :items="empresas"
                            @input="obterFuncionariosVeiculos(controleacessofuncionario.funcionario_id)"
                            item-value="id"
                            :readonly="flagControleAcessoFuncionario"
                            item-text="nome_empresa"
                            small
                            chips deletable-chips />            
                    <v-text-field v-model="controleacessofuncionario.placa_veiculo" 
                        mask="AAA-####"
                        :readonly="flagControleAcessoFuncionario"
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
        <v-dialog
        v-model="dialogSaida"
        max-width="290"
        >
        <v-card>
            <v-card-title class="title">Confirmar Saída ?</v-card-title>
            <v-card-text>
                <span class="caption">{{this.nomefuncionario}}</span>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            color="green darken-1"
                flat="flat"
                @click="[dialogSaida = false,naoConfirmaSaida()]"
            >
                Não
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogSaida = false,confirmaSaida()]"
            >
                Sim
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
        :return-value.sync="data_inicial"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="data_inicial"
            label="Data Inicial"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="data_inicial" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(data_inicial)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
    <v-spacer></v-spacer>
    <v-flex xs12 sm6 md4>
      <v-dialog
        ref="dialog"
        v-model="menu2"
        :return-value.sync="data_final"
        persistent
        lazy
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="data_final"
            label="Data Final"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="data_final" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(data_final)">OK</v-btn>
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
            @click="[obterControleAcessoFuncionarios(),obterControleAcessoFuncionariosSaida()]"
            type="success"
            transition="scale-transition"
            outline
        >
        Regitrado com Sucesso.
        </v-alert>
    </v-flex>
    <v-layout row>
    <v-flex xs5 class="mr-2">
        <v-data-table  :headers="headers" :items="controleacessofuncionarios" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_entrada)}}</td>
                <td>{{ props.item.nome_funcionario}}</td>
                <td>{{ props.item.placa_veiculo}}</td>

                <td class="justify-center layout px-0">
                    
                    <v-icon
                        small
                        class="mr-2"
                        @click="[alterarControleAcessoFuncionario(props.item),dialogSaida = true]"
                    >
                        close
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
      <v-flex xs7 >
        <v-data-table dark :headers="headersSaida" :items="controleacessofuncionariossaida" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_saida) }}</td>
                <td>{{ props.item.nome_funcionario}}</td>
                <td>{{ props.item.placa_veiculo}}</td>
                <td>{{ getDateTime(props.item.data_entrada)}}</td>
                
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
var moment = require('moment')


export default {
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    components: { Erros },
    directives: {moment},
    data() {
        return {
            data_inicial: new Date().toISOString().substr(0, 10),
            data_final: new Date().toISOString().substr(0, 10),
            dialog: false,
            dialogExcluir: false,
            totalControleAcessoFuncionarios: 0,
            flagControleAcessoFuncionario: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            funcionarios: [],
            funcionario:{},
            empresas: [],
            alert: false,
            menu: false,
            menu2: false,
            dialogSaida: false,
            nomefuncionario: '',
            controleacessofuncionarios: [],
            controleacessofuncionariossaida: [],
            controleacessofuncionario: {},
            funcionarioveiculo:{},
            dados: null,
            localdate: null,
            headers: [
                { text: 'Entrada', value: 'data_entrada' },
                { text: 'Funcionário', value: 'nome_funcionario' }, 
                { text: 'Placa', value: 'placa_veiculo' }, 
                { text: 'Ações', value: 'name', sortable: false }
            ],
            headersSaida: [
                { text: 'Saída', value: 'data_saida' },
                { text: 'Funcionário', value: 'nome_funcionario' }, 
                { text: 'Placa', value: 'placa_veiculo' }, 
                { text: 'Entrada', value: 'data_entrada' }
                
            ],
        }
    },
    methods: {
         formatDate (date) {
                    return moment(date).format('YYYY-MM-DD')
        },
         formatDateTime (date) {
                    return moment(date).format('YYYY-MM-DD hh:mm:ss')
        },
         getDateTime (date) {
             if(date) return moment(date).format('DD-MM-YY hh:mm')
             else return ''
        },
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
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessofuncionariobydata(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id funcionario_id nome_empresa nome_funcionario placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessofuncionarios = res.data.controleacessofuncionariobydata
                    this.totalControleAcessoFuncionarios = this.controleacessofuncionarios.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessofuncionarios = []
                    this.erros = e 
                })
                
              
        },
         obterControleAcessoFuncionariosSaida() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessofuncionariobydatasaida(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id funcionario_id nome_empresa nome_funcionario placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessofuncionariossaida = res.data.controleacessofuncionariobydatasaida
                    this.totalControleAcessoFuncionarios = this.controleacessofuncionarios.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessofuncionariossaida = []
                    this.erros = e 
                })
                
              
        },
        obterFuncionariosVeiculos(item) {

                this.funcionario = item
              
                this.$api.query({
                query: gql`
                    query(
                        $funcionario_id: Int
                    ){
                        funcionarioveiculoidativo(
                            filtro:{
                                 funcionario_id: $funcionario_id
                            }
                        ) {
                            id placa_veiculo ativo
                        }
                    }
                `,
                variables:{
                    funcionario_id: this.funcionario
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.funcionarioveiculo = res.data.funcionarioveiculoidativo
                    this.controleacessofuncionario.placa_veiculo =  this.funcionarioveiculo.placa_veiculo
                    this.erros = null
                }).catch( e =>{
                    this.funcionarioveiculo = {}
                    this.erros = e 
                })
                  
        },
        salvarControleAcessoFuncionario() {

           let dNow = new Date(moment().format("YYYY-MM-DD") + ' ' + moment().format("LTS"))
            
            if(!this.flagControleAcessoFuncionario)
            {
                 this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $data_entrada: DateTime
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
                                id data_entrada empresa_id funcionario_id placa_veiculo data_saida
                            }
                        }
               `,
               variables:{
                   data_entrada: this.formatDateTime(dNow),
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
                        $data_entrada: DateTime
                        $empresa_id: Int!
                        $funcionario_id: Int!
                        $placa_veiculo: String
                        $data_saida: DateTime

                    ){
                        alterarControleAcessoFuncionario(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    funcionario_id: $funcionario_id
                                    placa_veiculo: $placa_veiculo
                                    data_saida: $data_saida
                           }
                           
                        ){
                            id data_entrada empresa_id funcionario_id placa_veiculo data_saida
                        }
                    }
                     `,
                    variables:{
                        idFiltro: this.controleacessofuncionario.id,
                        empresa_id: this.controleacessofuncionario.empresa_id,
                        funcionario_id: this.controleacessofuncionario.funcionario_id,
                        placa_veiculo: this.controleacessofuncionario.placa_veiculo,
                        data_saida: this.formatDateTime(dNow),
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
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                funcionario_id: item.funcionario_id,
                placa_veiculo: item.placa_veiculo,
           
            }
            this.nomefuncionario = item.nome_funcionario
            this.flagControleAcessoFuncionario = true
            this.editedIndex = this.controleacessofuncionarios.indexOf(item)
            //this.controleacessofuncionario = Object.assign({}, item)
     
        },
        excluirControleAcessoFuncionario(item){
             this.controleacessofuncionario = {
                id: item.id,
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                funcionario_id: item.funcionario_id,
                placa_veiculo: item.placa_veiculo
            
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
                            id data_entrada empresa_id funcionario_id placa_veiculo data_saida
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
        },
        confirmaSaida(){
            this.obterEmpresas(),
            this.obterFuncionarios(),
            this.dialog =true

        },
        naoConfirmaSaida(){
             this.controleacessofuncionario = {}
        }

    },
    mounted(){
        
    }
}
</script>

<style>

</style>
