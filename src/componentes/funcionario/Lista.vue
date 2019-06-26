<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagFuncionario = false,funcionario = {}] " >Novo Funcionário
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterFuncionarios">
                    Listar Funcionários
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Funcionário</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="funcionario.nome_funcionario" label="Nome" class="caption"></v-text-field>
                    <v-text-field v-model="funcionario.email_funcionario" label="E-mail" class="caption"></v-text-field>
                    <v-checkbox v-model="funcionario.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarFuncionario">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
      <v-dialog v-model="dialog_veiculo" max-width="500px">
         <v-card>
          <v-card-title>
            <span class="title">Registro do Veiculo </span>
          </v-card-title>
           <v-card-text>
            <span class="caption">{{this.funcionario.nome_funcionario}}</span>
          </v-card-text>  
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="funcionarioveiculo.placa_veiculo" label="Placa"  mask="AAA-####" class="caption"></v-text-field>
                    <v-checkbox v-model="funcionarioveiculo.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarFuncionarioVeiculo">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoFuncionario()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoFuncionario()]"
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
                    @click="obterFuncionarios"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
        <v-layout row>
            <v-flex xs8 class="mr-2">
                <v-data-table :pagination.sync="pagination" :total-items="totalFuncionarios" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_funcionario }}</td>
                        <td>{{ props.item.email_funcionario }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                             <v-icon
                                small
                                class="mr-2"
                                @click="obterFuncionariosVeiculos(props.item)"
                            >
                                search
                            </v-icon>
                             <v-icon
                                small
                                class="mr-2"
                                @click="novoFuncionarioVeiculo(props.item)"
                            >
                                add
                            </v-icon>
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarFuncionario(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirFuncionario(props.item),dialogExcluir = true]"
                            >
                                delete
                            </v-icon>
                        </td>        
                    </template>
                </v-data-table>
            </v-flex>
             <v-flex xs4 >
                <v-data-table :pagination.sync="pagination" :total-items="totalFuncionarios" dark :headers="headersVeiculo" :items="funcionariosveiculos" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.placa_veiculo }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarFuncionarioVeiculo(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirFuncionarioVeiculo(props.item),dialogExcluir = true]"
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
        return this.funcionarios.filter(funcionario => {
        return funcionario.nome_funcionario.toLowerCase().includes(this.search.toLowerCase())
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
            dialog_veiculo: false,
            dialogExcluir: false,
            totalFuncionarios: 0,
            flagFuncionario: false,
            flagveiculo: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            funcionarios: [],
            funcionario: {},
            funcionariosveiculos: [],
            funcionarioveiculo: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_funcionario' },
                { text: 'E-mail', value: 'email_funcionario' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
             headersVeiculo: [
                { text: 'Placa', value: 'placa_veiculo' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        novoFuncionarioVeiculo(item){
            this.funcionarioveiculo.funcionario_id =  item.id
            this.funcionarioveiculo.nome_funcionario = item.nome_funcionario
            this.obterFuncionariosVeiculos(item)

            this.dialog_veiculo = true
        },
        obterFuncionarios() {

                this.$api.query({
                query: gql`
                    query {
                        funcionarios {
                            id nome_funcionario email_funcionario ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.funcionarios = res.data.funcionarios
                    this.totalFuncionarios = this.funcionarios.length
                    this.erros = null
                }).catch( e =>{
                    this.funcionarios = []
                    this.erros = e 
                })
                
              
        },
        obterFuncionariosVeiculos(item) {

                this.funcionario.id = item.id
              
                this.$api.query({
                query: gql`
                    query(
                        $funcionario_id: Int
                    ){
                        funcionarioveiculoid(
                            filtro:{
                                 funcionario_id: $funcionario_id
                            }
                        ) {
                            id placa_veiculo ativo
                        }
                    }
                `,
                variables:{
                    funcionario_id: this.funcionario.id
                },
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.funcionariosveiculos = res.data.funcionarioveiculoid
                    this.erros = null
                }).catch( e =>{
                    this.funcionariosveiculos = []
                    this.erros = e 
                })
                  
        },
        salvarFuncionario() {

             if(!this.flagFuncionario){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_funcionario: String!
                            $email_funcionario: String!
                            $ativo: Boolean
                        ){
                            novoFuncionario (
                                dados:{
                                    nome_funcionario: $nome_funcionario
                                    email_funcionario: $email_funcionario
                                    ativo: $ativo
                                }
                            ){
                                id nome_funcionario email_funcionario ativo
                            }
                        }
               `,
               variables:{
                   nome_funcionario: this.funcionario.nome_funcionario,
                   email_funcionario: this.funcionario.email_funcionario,
                   ativo: this.funcionario.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoFuncionario
                this.funcionario = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagFuncionario = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_funcionario: String
                        $email_funcionario: String
                         $ativo: Boolean

                    ){
                        alterarFuncionario(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_funcionario: $nome_funcionario
                                email_funcionario: $email_funcionario
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_funcionario email_funcionario ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.funcionario.id,
                        nome_funcionario: this.funcionario.nome_funcionario,
                        email_funcionario: this.funcionario.email_funcionario,
                        ativo: this.funcionario.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarFuncionario
                    this.funcionario = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagFuncionario = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        salvarFuncionarioVeiculo() {

             if(!this.flagveiculo){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $funcionario_id: Int!
                            $placa_veiculo: String!
                            $ativo: Boolean
                        ){
                            novoFuncionarioVeiculo (
                                dados:{
                                    funcionario_id: $funcionario_id
                                    placa_veiculo: $placa_veiculo
                                    ativo: $ativo
                                }
                            ){
                                id placa_veiculo ativo
                            }
                        }
               `,
               variables:{
                   funcionario_id: this.funcionarioveiculo.funcionario_id,
                   placa_veiculo: this.funcionarioveiculo.placa_veiculo,
                   ativo: this.funcionarioveiculo.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoFuncionarioVeiculo
                this.funcionarioveiculo = {}
                this.erros = null
                this.alert = true
                this.dialog_veiculo = false
                this.flagveiculo = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $placa_veiculo: String
                        $ativo: Boolean

                    ){
                        alterarFuncionarioVeiculo(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                placa_veiculo: $placa_veiculo
                                ativo: $ativo
                           }
                           
                        ){
                            id placa_veiculo ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.funcionarioveiculo.id,
                        placa_veiculo: this.funcionarioveiculo.placa_veiculo,
                        ativo: this.funcionarioveiculo.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarFuncionarioVeiculo
                    this.funcionarioveiculo = {}
                    this.filtro = {}
                    this.erros = null
                    this.alert = true
                    this.dialog_veiculo = false
                    this.flagveiculo = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarFuncionario(item){
            this.funcionario = {
                id: item.id,
                nome_funcionario: item.nome_funcionario,
                email_funcionario: item.email_funcionario,
                ativo: item.ativo
            
            }
            this.flagFuncionario = true
            this.editedIndex = this.funcionarios.indexOf(item)
            //this.funcionario = Object.assign({}, item)
            this.dialog = true
        },
         alterarFuncionarioVeiculo(item){
            this.funcionarioveiculo = {
                id: item.id,
                funcionario_id: item.funcionario_id,
                placa_veiculo: item.placa_veiculo,
                ativo: item.ativo
            
            }
            this.flagveiculo = true
            this.editedIndex = this.funcionariosveiculos.indexOf(item)
            //this.empresaterceira = Object.assign({}, item)
            this.dialog_veiculo = true
        },
        excluirFuncionario(item){
             this.funcionario = {
                id: item.id,
                nome_funcionario: item.nome_funcionario,
                email_funcionario: item.email_funcionario,
                 ativo: item.ativo
            
            }
        },
        excluirFuncionarioVeiculo(item){
             this.funcionarioveiculo = {
               id: item.id,
                funcionario_id: item.funcionario_id,
                placa_veiculo: item.placa_veiculo,
                ativo: item.ativo
            }
        },
        close () {
            this.dialog = false
            this.dialog_veiculo = false
        },
        getValorBoleano (valorboleano) {
            if (valorboleano === true) return 'Sim'
            else if (valorboleano === false) return 'Não'
            else return ''
        },
        confirmaExclusaoFuncionario(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirFuncionario(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_funcionario email_funcionario
                        } 
                    }
               `,
               variables:{
                   id: this.funcionario.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirFuncionario
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoFuncionario(){
             this.funcionario = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
