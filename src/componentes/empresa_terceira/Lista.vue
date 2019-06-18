<template>
    <v-container fluid>
    <v-layout column>     

    <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagempresaterceira = false,empresaterceira = {}] " >Nova Empresa Terceira
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterEmpresaTerceiras">
                    Listar Empresas Terceiras
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Empresa Terceira</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="empresaterceira.nome_empresa_terceira" label="Nome" class="caption"></v-text-field>
                    <v-text-field v-model="empresaterceira.cnpj_cpf" mask="##.###.###/####-##" label="CNPJ" class="caption"></v-text-field>
                    <v-checkbox v-model="empresaterceira.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarEmpresaTerceira">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_prestador" max-width="500px">
         <v-card>
          <v-card-title>
            <span class="title">Registro do Prestador</span>
          </v-card-title>
           <v-card-text>
            <span class="caption">{{this.empresaterceira.nome_empresa_terceira}}</span>
          </v-card-text>  
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="empresaterceiraprestador.nome_prestador" label="Nome" class="caption"></v-text-field>
                    <v-text-field v-model="empresaterceiraprestador.cpf" mask="###.###.###-##" label="CPF" class="caption"></v-text-field>
                    <v-checkbox v-model="empresaterceiraprestador.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarEmpresaTerceiraPrestador">Salvar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialogExcluir"
        max-width="290"
        >
        <v-card >
            <v-card-title  class="title">Deseja Excluir Registro ?</v-card-title>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,naoConfirmaExclusaoempresaterceira()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoEmpresaTerceira()]"
            >
                Excluir
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

     <v-dialog
        v-model="dialogPrestadorExcluir"
        max-width="290"
        >
        <v-card >
            <v-card-title  class="title">Deseja Excluir Registro ?</v-card-title>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            color="green darken-1"
                flat="flat"
                @click="[dialogPrestadorExcluir = false,naoConfirmaExclusaoEmpresaTerceiraPrestador()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogPrestadorExcluir = false,confirmaExclusaoEmpresaTerceiraPrestador()]"
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
                    @click="obterEmpresaTerceiras"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
            <v-layout row>
            <v-flex xs7 class="mr-4">
                <v-data-table :pagination.sync="pagination" :total-items="totalempresaterceiras" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_empresa_terceira }}</td>
                        <td>{{ props.item.cnpj_cpf }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            <v-icon
                                small
                                class="mr-2"
                                @click="obterEmpresaTerceiraPrestadores(props.item)"
                            >
                                search
                            </v-icon>
                             <v-icon
                                small
                                class="mr-2"
                                @click="novaEmpresaTerceiraPrestador(props.item)"
                            >
                                add
                            </v-icon>
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarEmpresaTerceira(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirEmpresaTerceira(props.item),dialogExcluir = true]"
                            >
                                delete
                            </v-icon>
                        </td>        
                    </template>
                </v-data-table>
            </v-flex>
             <v-flex xs5 >
                <v-data-table :headers="headersSub" :items="empresasterceirasprestadores" 
                    hide-actions dark class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.nome_prestador }}</td>
                        <td>{{ props.item.cpf }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarEmpresaTerceiraPrestador(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirEmpresaTerceiraPrestador(props.item),dialogPrestadorExcluir  = true]"
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
        return this.empresasterceiras.filter(empresaterceira => {
        return empresaterceira.nome_empresa_terceira.toLowerCase().includes(this.search.toLowerCase())
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
            dialog_prestador: false,
            dialogExcluir: false,
            dialogPrestadorExcluir: false,
            totalempresaterceiras: 0,
            flagempresaterceira: false,
            flagprestador: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            empresasterceiras: [],
            empresasterceirasprestadores: [],
            empresaterceira: {},
            empresaterceiraprestador: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_empresa_terceira' },
                { text: 'CNPJ', value: 'cnpj_cpf' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
            headersSub: [
                { text: 'Nome', value: 'nome_prestador' },
                { text: 'CPF', value: 'cpf' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ],
        }
    },
    methods: {
        novaEmpresaTerceiraPrestador(item){
            this.empresaterceiraprestador.empresa_terceira_id =  item.id
            this.empresaterceira.nome_empresa_terceira = item.nome_empresa_terceira
            this.obterEmpresaTerceiraPrestadores(item)

            this.dialog_prestador = true
        },
        obterEmpresaTerceiras() {

                this.$api.query({
                query: gql`
                    query {
                        empresasterceiras {
                            id nome_empresa_terceira cnpj_cpf ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.empresasterceiras = res.data.empresasterceiras
                    this.totalempresaterceiras = this.empresasterceiras.length
                    this.erros = null
                }).catch( e =>{
                    this.empresasterceiras = []
                    this.erros = e 
                })
                
              
        },
        obterEmpresaTerceiraPrestadores(item) {

                this.empresaterceira.id = item.id
              
                this.$api.query({
                query: gql`
                    query(
                        $empresa_terceira_id: Int
                    ){
                        empresaterceiraprestadorid(
                            filtro:{
                                 empresa_terceira_id: $empresa_terceira_id
                            }
                        ) {
                            id nome_prestador cpf ativo
                        }
                    }
                `,
                variables:{
                    empresa_terceira_id: this.empresaterceira.id
                },
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.empresasterceirasprestadores = res.data.empresaterceiraprestadorid
                    this.erros = null
                }).catch( e =>{
                    this.empresasterceirasprestadores = []
                    this.erros = e 
                })
                
              
        },
        salvarEmpresaTerceira() {

             if(!this.flagempresaterceira){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_empresa_terceira: String!
                            $cnpj_cpf: String!
                            $ativo: Boolean
                        ){
                            novaEmpresaTerceira (
                                dados:{
                                    nome_empresa_terceira: $nome_empresa_terceira
                                    cnpj_cpf: $cnpj_cpf
                                    ativo: $ativo
                                }
                            ){
                                id nome_empresa_terceira cnpj_cpf ativo
                            }
                        }
               `,
               variables:{
                   nome_empresa_terceira: this.empresaterceira.nome_empresa_terceira,
                   cnpj_cpf: this.empresaterceira.cnpj_cpf,
                   ativo: this.empresaterceira.ativo
               }
           }).then(res=>{
                this.dados = res.data.novaEmpresaTerceira
                this.empresaterceira = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagempresaterceira = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_empresa_terceira: String
                        $cnpj_cpf: String
                        $ativo: Boolean

                    ){
                        alterarEmpresaTerceira(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_empresa_terceira: $nome_empresa_terceira
                                cnpj_cpf: $cnpj_cpf
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_empresa_terceira cnpj_cpf ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.empresaterceira.id,
                        nome_empresa_terceira: this.empresaterceira.nome_empresa_terceira,
                        cnpj_cpf: this.empresaterceira.cnpj_cpf,
                        ativo: this.empresaterceira.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarEmpresaTerceira
                    this.empresaterceira = {}
                    this.filtro = {}
                    this.erros = null
                    this.alert = true
                    this.dialog = false
                    this.flagempresaterceira = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
         salvarEmpresaTerceiraPrestador() {

             if(!this.flagprestador){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $empresa_terceira_id: Int!
                            $nome_prestador: String!
                            $cpf: String!
                            $ativo: Boolean
                        ){
                            novaEmpresaTerceiraPrestador (
                                dados:{
                                    empresa_terceira_id: $empresa_terceira_id
                                    nome_prestador: $nome_prestador
                                    cpf: $cpf
                                    ativo: $ativo
                                }
                            ){
                                id nome_prestador cpf ativo
                            }
                        }
               `,
               variables:{
                   empresa_terceira_id: this.empresaterceiraprestador.empresa_terceira_id,
                   nome_prestador: this.empresaterceiraprestador.nome_prestador,
                   cpf: this.empresaterceiraprestador.cpf,
                   ativo: this.empresaterceiraprestador.ativo
               }
           }).then(res=>{
                this.dados = res.data.novaEmpresaTerceiraPrestador
                this.empresaterceiraprestador = {}
                this.erros = null
                this.alert = true
                this.dialog_prestador = false
                this.flagprestador = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_prestador: String
                        $cpf: String
                        $ativo: Boolean

                    ){
                        alterarEmpresaTerceiraPrestador(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_prestador: $nome_prestador
                                cpf: $cpf
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_prestador cpf ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.empresaterceiraprestador.id,
                        nome_prestador: this.empresaterceiraprestador.nome_prestador,
                        cpf: this.empresaterceiraprestador.cpf,
                        ativo: this.empresaterceiraprestador.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarEmpresaTerceiraPrestador
                    this.empresaterceiraprestador = {}
                    this.filtro = {}
                    this.erros = null
                    this.alert = true
                    this.dialog_prestador = false
                    this.flagprestador = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
        alterarEmpresaTerceira(item){
            this.empresaterceira = {
                id: item.id,
                nome_empresa_terceira: item.nome_empresa_terceira,
                cnpj_cpf: item.cnpj_cpf,
                ativo: item.ativo
            
            }
            this.flagempresaterceira = true
            this.editedIndex = this.empresasterceiras.indexOf(item)
            //this.empresaterceira = Object.assign({}, item)
            this.dialog = true
        },
         alterarEmpresaTerceiraPrestador(item){
            this.empresaterceiraprestador = {
                id: item.id,
                empresa_terceira_id: item.empresa_terceira_id,
                nome_prestador: item.nome_prestador,
                cpf: item.cpf,
                ativo: item.ativo
            
            }
            this.flagprestador = true
            this.editedIndex = this.empresasterceirasprestadores.indexOf(item)
            //this.empresaterceira = Object.assign({}, item)
            this.dialog_prestador = true
        },
        excluirEmpresaTerceira(item){
             this.empresaterceira = {
                id: item.id,
                nome_empresa_terceira: item.nome_empresa_terceira,
                cnpj_cpf: item.cnpj_cpf,
                 ativo: item.ativo
            
            }
        },
        excluirEmpresaTerceiraPrestador(item){
             this.empresaterceiraprestador = {
                id: item.id,
                empresa_terceira_id: item.empresa_terceira_id,
                nome_prestador: item.nome_prestador,
                cpf: item.cpf,
                ativo: item.ativo
            }
        },
        close () {
            this.dialog = false
             this.dialog_prestador = false
        },
        getValorBoleano (valorboleano) {
            if (valorboleano === true) return 'Sim'
            else if (valorboleano === false) return 'Não'
            else return ''
        },
        confirmaExclusaoEmpresaTerceira(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirEmpresaTerceira(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_empresa_terceira cnpj_cpf
                        } 
                    }
               `,
               variables:{
                   id: this.empresaterceira.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirEmpresaTerceira
                   this.erros = null
                   this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        confirmaExclusaoEmpresaTerceiraPrestador(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirEmpresaTerceiraPrestador(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_prestador cpf
                        } 
                    }
               `,
               variables:{
                   id: this.empresaterceiraprestador.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirEmpresaTerceiraPrestador
                   this.erros = null
                   this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoEmpresaTerceira(){
             this.empresaterceira = {}
        },
        naoConfirmaExclusaoEmpresaTerceiraPrestador(){
             this.empresaterceiraprestador = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
