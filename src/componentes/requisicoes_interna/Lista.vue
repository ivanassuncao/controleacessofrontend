<template>
    <v-container fluid>

        <v-layout column>
          
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagRequisicoesInterna = false,requisicoesinterna = {},obterEmpresas(),obterSetores(),obterItems()] " >Nova Requisição
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="[obterRequisicoesInternas()]">
                    Listar Requisições
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Requisição </span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >

                    <v-select class="caption" label="Local"
                            v-model="requisicoesinterna.empresa_id"
                            :items="empresas"
                            item-value="id"
                            :readonly="flagRequisicoesInterna"
                            item-text="nome_empresa"
                            small
                            chips deletable-chips />      
                    <v-select class="caption" label="Setor"
                            v-model="requisicoesinterna.setor_id"
                            :items="setores"
                            item-value="id"
                            item-text="nome_setor"
                            :readonly="flagRequisicoesInterna"
                            small
                            chips deletable-chips />        
                    <v-select class="caption" label="Item"
                            v-model="requisicoesinterna.item_id"
                            :items="items"
                            item-value="id"
                            item-text="nome_item"
                            :readonly="flagRequisicoesInterna"
                            small
                            chips deletable-chips />       
          
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarRequisicoesInterna">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoRequisicoesInterna()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoRequisicoesInterna()]"
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
            <v-card-title class="title">Confirmar Aprovação ?</v-card-title>
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
            @click="[obterRequisicoesInternas()]"
            type="success"
            transition="scale-transition"
            outline
        >
        Regitrado com Sucesso.
        </v-alert>
    </v-flex>
    <v-flex>
        <v-data-table  :headers="headers" :items="requisicoesinternas" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_requisicao)}}</td>
                <td>{{ props.item.nome_empresa}}</td>
                <td>{{ props.item.nome}}</td>
                <td>{{ props.item.nome_setor}}</td>
                <td>{{ props.item.nome_item}}</td>
                 <td>{{ props.item.unidade}}</td>
                <td>{{ getDateTime(props.item.data_aprovacao)}}</td>

                <td class="justify-center layout px-0">
                    
                    <v-icon
                        v-if="!props.item.data_aprovacao"
                        small
                        class="mr-2"
                        @click="[alterarRequisicoesInterna(props.item),dialogSaida = true]"
                    >
                        close
                    </v-icon>
                        
                    <v-icon
                        v-if="!props.item.data_aprovacao"
                        small
                        @click="[excluirRequisicoesInterna(props.item),dialogExcluir = true]"
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
import { mapGetters } from 'vuex'
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
            totalRequisicoesInternas: 0,
            flagRequisicoesInterna: false,
            items: [],
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            empresas: [],
            setores:[],
            alert: false,
            menu: false,
            menu2: false,
            dialogSaida: false,
            requisicoesinternas: [],
            requisicoesinterna: {},
            dados: null,
            localdate: null,
            headers: [
                { text: 'Requisição',  align: 'center', value: 'data_entrada', sortable: true},
                { text: 'Empresa', align: 'left', value: 'nome_empresa' }, 
                { text: 'Requisitante', value: 'nome' }, 
                { text: 'Setor', value: 'nome_setor' },
                { text: 'Item', value: 'nome_item' }, 
                { text: 'Unid', value: 'unidade' }, 
                { text: 'Aprovação', value: 'data_aprovacao' }, 
                { text: 'Ações', value: 'name' }
            ]
        }
    },
    computed: {
        ...mapGetters(['usuario'])
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
         obterSetores() {
            this.$api.query({
                query: gql`{ setores { id nome_setor } }`
            }).then(res =>{
                this.setores = res.data.setores
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        },
         obterItems() {
            this.$api.query({
                query: gql`{ itemsinternos { id nome_item unidade } }`
            }).then(res =>{
                this.items = res.data.itemsinternos
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        },
        obterRequisicoesInternas() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        requisicoesinternabydata(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_requisicao usuario_id gerente_id empresa_id item_id setor_id nome_empresa nome_setor nome_item nome unidade data_aprovacao
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.requisicoesinternas = res.data.requisicoesinternabydata
                    this.totalRequisicoesInternas = this.requisicoesinternas.length
                    this.erros = null
                }).catch( e =>{
                    this.requisicoesinternas = []
                    this.erros = e 
                })
                
              
        },
        salvarRequisicoesInterna() {

           let dNow = new Date(moment().format("YYYY-MM-DD") + ' ' + moment().format("LTS"))
            
            if(!this.flagRequisicoesInterna)
            {
                 this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $data_requisicao: DateTime
                            $empresa_id: Int!
                            $setor_id: Int!
                            $usuario_id: Int!
                            $item_id: Int!
                        ){
                            novoRequisicoesInterna (
                                dados:{
                                    data_requisicao: $data_requisicao
                                    empresa_id: $empresa_id
                                    setor_id: $setor_id
                                    usuario_id: $usuario_id
                                    item_id: $item_id                                
                                   
                                }
                            ){
                                id data_requisicao empresa_id usuario_id gerente_id setor_id data_aprovacao
                            }
                        }
               `,
               variables:{
                        data_requisicao: this.formatDateTime(dNow),
                        empresa_id: this.requisicoesinterna.empresa_id,
                        setor_id: this.requisicoesinterna.setor_id,
                        item_id: this.requisicoesinterna.item_id,
                        usuario_id: this.usuario.id
               }
           }).then(res=>{
                this.dados = res.data.novoRequisicoesInterna
                this.requisicoesinterna = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagRequisicoesInterna = false  
           }).catch(e=>{
               this.erros = e
           })

            }else{
                 
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $empresa_id: Int!
                        $setor_id: Int!
                        $usuario_id: Int!
                        $item_id: Int!

                    ){
                        alterarRequisicoesInterna(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                    empresa_id: $empresa_id
                                    setor_id: $setor_id
                                    usuario_id: $usuario_id
                                    item_id: $item_id       
                           }
                           
                        ){
                            id data_requisicao empresa_id item_id setor_id nome_empresa nome_setor nome_item nome unidade data_aprovacao
                        }
                    }
                     `,
                    variables:{
                        idFiltro: this.requisicoesinterna.id,
                        empresa_id: this.requisicoesinterna.empresa_id,
                        setor_id: this.requisicoesinterna.setor_id,
                        item_id: this.requisicoesinterna.item_id,
                        usuario_id: this.usuario.id
                    }
                }).then( res => {
                 
                    this.dados = res.data.alterarRequisicoesInterna
                    this.requisicoesinterna = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagRequisicoesInterna = false
                }).catch( e => {
                    
                    this.erros = e
                })

            }
                 
           
              
        },
        alterarRequisicoesInterna(item){
            this.requisicoesinterna = {
                id: item.id,
                data_requisicao: item.data_requisicao,
                empresa_id: item.empresa_id,
                item_id: item.item_id,
                usuario_id: item.usuario_id,
                setor_id: item.setor_id
           
            }
            this.flagRequisicoesInterna = true
            this.editedIndex = this.requisicoesinternas.indexOf(item)
            //this.requisicoesinterna = Object.assign({}, item)
     
        },
        excluirRequisicoesInterna(item){
             this.requisicoesinterna = {
                id: item.id,
                data_requisicao: item.data_requisicao,
                empresa_id: item.empresa_id,
                item_id: item.item_id,
                usuario_id: item.usuario_id,
                setor_id: item.setor_id
            
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
        confirmaExclusaoRequisicoesInterna(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirRequisicoesInterna(
                             filtro:{
                                id: $id
                            }
                        ){
                            id data_requisicao empresa_id item_id setor_id nome_empresa nome_setor nome_item nome unidade data_aprovacao
                        } 
                    }
               `,
               variables:{
                   id: this.requisicoesinterna.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirRequisicoesInterna
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoRequisicoesInterna(){
             this.requisicoesinterna = {}
        },
        confirmaSaida(){
             let dNow = new Date(moment().format("YYYY-MM-DD") + ' ' + moment().format("LTS"))

                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $empresa_id: Int!
                        $setor_id: Int!
                        $usuario_id: Int!
                        $item_id: Int!
                        $gerente_id: Int
                        $data_aprovacao: DateTime

                    ){
                        aprovarRequisicoesInterna(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                    empresa_id: $empresa_id
                                    setor_id: $setor_id
                                    usuario_id: $usuario_id
                                    item_id: $item_id   
                                    gerente_id: $gerente_id
                                    data_aprovacao: $data_aprovacao

                           }
                           
                        ){
                             id data_requisicao empresa_id item_id setor_id nome_empresa nome_setor nome_item nome unidade data_aprovacao
                        }
                    }
                     `,
                    variables:{
                        idFiltro: this.requisicoesinterna.id,
                        empresa_id: this.requisicoesinterna.empresa_id,
                        setor_id: this.requisicoesinterna.setor_id,
                        item_id: this.requisicoesinterna.item_id,
                        usuario_id: this.requisicoesinterna.usuario_id,
                        gerente_id: this.usuario.id,
                        data_aprovacao: this.formatDateTime(dNow)

                    }
                }).then( res => {
                 
                    this.dados = res.data.aprovarRequisicoesInterna
                    this.requisicoesinterna = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagRequisicoesInterna = false
                }).catch( e => {
                    
                    this.erros = e
                })
        },
        naoConfirmaSaida(){
             this.requisicoesinterna = {}
        }

    },
    mounted(){
        
    }
}
</script>

<style>

</style>
