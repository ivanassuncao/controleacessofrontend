<template>
    <v-container fluid>
        <v-layout column>
          
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagControleAcessoVisitante = false,controleacessovisitante = {},obterEmpresas(),obterSetores(),obterTipoVeiculos()] " >Novo Acesso do Visitante
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="[obterControleAcessoVisitantes(),obterControleAcessoVisitantesSaida()]">
                    Listar Acesso Visitante
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Controle Acesso Visitante</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >

                    <v-text-field v-model="controleacessovisitante.nome_empresa_visitante"   label="Empresa do visitante" class="caption"></v-text-field>
                    <v-text-field v-model="controleacessovisitante.nome_visitante"  label="Nome do visitante" class="caption"></v-text-field>
                    <v-text-field v-model="controleacessovisitante.cpf_visitante" mask="###.###.###-##" label="CPF" class="caption"></v-text-field>

                    <v-select class="caption" label="Local"
                            v-model="controleacessovisitante.empresa_id"
                            :items="empresas"
                            item-value="id"
                            :readonly="flagControleAcessoVisitante"
                            item-text="nome_empresa"
                            small
                            chips deletable-chips />      
                    <v-select class="caption" label="Setor"
                            v-model="controleacessovisitante.setor_id"
                            :items="setores"
                            item-value="id"
                            item-text="nome_setor"
                            :readonly="flagControleAcessoVisitante"
                            small
                            chips deletable-chips />        
                    <v-select class="caption" label="Tipo Veículo"
                            v-model="controleacessovisitante.tipo_veiculo_id"
                            :items="tipo_veiculos"
                            item-value="id"
                            item-text="nome_tipo_veiculo"
                            :readonly="flagControleAcessoVisitante"
                            small
                            chips deletable-chips />       
                    <v-text-field v-model="controleacessovisitante.placa_veiculo" 
                        mask="AAA-####"
                        :readonly="flagControleAcessoVisitante"
                        label="Placa do Veiculo" class="caption"></v-text-field>
     
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarControleAcessoVisitante">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoControleAcessoVisitante()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoControleAcessoVisitante()]"
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
                <span class="caption">{{this.nome_empresa_terceira}}</span>
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
            @click="[obterControleAcessoVisitantes(),obterControleAcessoVisitantesSaida()]"
            type="success"
            transition="scale-transition"
            outline
        >
        Regitrado com Sucesso.
        </v-alert>
    </v-flex>
    <v-layout row>
    <v-flex xs7 class="mr-1">
        <v-data-table  :headers="headers" :items="controleacessovisitantes" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_entrada)}}</td>
                <td>{{ props.item.nome_empresa_visitante}}</td>
                <td>{{ props.item.nome_visitante}}</td>
                <td>{{ props.item.nome_setor}}</td>
                <td>{{ props.item.placa_veiculo}}</td>

                <td class="justify-center layout px-0">
                    
                    <v-icon
                        small
                        class="mr-2"
                        @click="[alterarControleAcessoVisitante(props.item),dialogSaida = true]"
                    >
                        close
                    </v-icon>
                        
                    <v-icon
                        small
                        @click="[excluirControleAcessoVisitante(props.item),dialogExcluir = true]"
                    >
                        delete
                    </v-icon>
                </td>        
            </template>

        </v-data-table>
    </v-flex>
      <v-flex xs5 >
        <v-data-table dark :headers="headersSaida" :items="controleacessovisitantessaida" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_saida) }}</td>
                <td>{{ props.item.nome_empresa_visitante}}</td>
                <td>{{ props.item.nome_visitante}}</td>
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
            totalControleAcessoVisitantes: 0,
            flagControleAcessoVisitante: false,
            nome_empresa_visitantes: [],
            nome_visitantes: [],
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            empresas: [],
            setores:[],
            tipo_veiculos:[],
            alert: false,
            menu: false,
            menu2: false,
            dialogSaida: false,
            nome_empresa_terceira: '',
            controleacessovisitantes: [],
            controleacessovisitantessaida: [],
            controleacessovisitante: {},
            empresa_terceira_prestadores:[],
            dados: null,
            localdate: null,
            headers: [
                { text: 'Entrada',  align: 'center', value: 'data_entrada', sortable: true},
                { text: 'Empresa', align: 'left', value: 'nome_empresa_terceira' }, 
                { text: 'Nome', value: 'nome_prestador' }, 
                { text: 'Setor', value: 'nome_setor' },
                { text: 'Placa', value: 'placa_veiculo' }, 
                { text: 'Ações', value: 'name' }
            ],
            headersSaida: [
                { text: 'Saída', value: 'data_saida',sortable: true },
                { text: 'Empresa', value: 'nome_empresa_terceira' }, 
                { text: 'Nome', value: 'nome_prestador' }, 
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
         obterTipoVeiculos() {
            this.$api.query({
                query: gql`{ tipoveiculos { id nome_tipo_veiculo } }`
            }).then(res =>{
                this.tipo_veiculos = res.data.tipoveiculos
                this.erros = null
            }).catch(e=>{
                this.erros = e
            })
        },
        obterControleAcessoVisitantes() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessovisitantebydata(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id tipo_veiculo_id setor_id nome_empresa nome_empresa_visitante nome_visitante cpf_visitante nome_setor nome_tipo_veiculo placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessovisitantes = res.data.controleacessovisitantebydata
                    this.totalControleAcessoVisitantes = this.controleacessovisitantes.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessovisitantes = []
                    this.erros = e 
                })
                
              
        },
         obterControleAcessoVisitantesSaida() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessovisitantebydatasaida(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id tipo_veiculo_id setor_id nome_empresa nome_empresa_visitante nome_visitante cpf_visitante nome_setor nome_tipo_veiculo placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessovisitantessaida = res.data.controleacessovisitantebydatasaida
                    this.totalControleAcessoVisitantes = this.controleacessovisitantes.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessovisitantessaida = []
                    this.erros = e 
                })
                
              
        },
        salvarControleAcessoVisitante() {

           let dNow = new Date(moment().format("YYYY-MM-DD") + ' ' + moment().format("LTS"))
            
            if(!this.flagControleAcessoVisitante)
            {
                 this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $data_entrada: DateTime
                            $empresa_id: Int!
                            $nome_empresa_visitante: String!
                            $nome_visitante: String!
                            $cpf_visitante: String
                            $tipo_veiculo_id: Int
                            $setor_id: Int!
                            $placa_veiculo: String
                        ){
                            novoControleAcessoVisitante (
                                dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    nome_empresa_visitante: $nome_empresa_visitante
                                    nome_visitante: $nome_visitante
                                    cpf_visitante: $cpf_visitante
                                    tipo_veiculo_id: $tipo_veiculo_id
                                    setor_id: $setor_id
                                    placa_veiculo: $placa_veiculo
                                }
                            ){
                                id data_entrada empresa_id nome_empresa_visitante nome_visitante cpf_visitante tipo_veiculo_id placa_veiculo setor_id data_saida
                            }
                        }
               `,
               variables:{
                   data_entrada: this.formatDateTime(dNow),
                   empresa_id: this.controleacessovisitante.empresa_id,
                   nome_empresa_visitante: this.controleacessovisitante.nome_empresa_visitante,
                   nome_visitante: this.controleacessovisitante.nome_visitante,
                   cpf_visitante: this.controleacessovisitante.cpf_visitante,
                   tipo_veiculo_id: this.controleacessovisitante.tipo_veiculo_id,
                   setor_id: this.controleacessovisitante.setor_id,
                   placa_veiculo: this.controleacessovisitante.placa_veiculo
               }
           }).then(res=>{
                this.dados = res.data.novoControleAcessoVisitante
                this.controleacessovisitante = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagControleAcessoVisitante = false  
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
                        $nome_empresa_visitante: String!
                        $nome_visitante: String!
                        $cpf_visitante: String
                        $tipo_veiculo_id: Int
                        $setor_id: Int!
                        $placa_veiculo: String
                        $data_saida: DateTime

                    ){
                        alterarControleAcessoVisitante(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    nome_empresa_visitante: $nome_empresa_visitante
                                    nome_visitante: $nome_visitante
                                    cpf_visitante: $cpf_visitante
                                    tipo_veiculo_id: $tipo_veiculo_id
                                    setor_id: $setor_id
                                    placa_veiculo: $placa_veiculo
                                    data_saida: $data_saida
                           }
                           
                        ){
                            id data_entrada empresa_id nome_empresa_visitante  cpf_visitante nome_visitante tipo_veiculo_id placa_veiculo setor_id data_saida
                        }
                    }
                     `,
                    variables:{
                        idFiltro: this.controleacessovisitante.id,
                        empresa_id: this.controleacessovisitante.empresa_id,
                        nome_empresa_visitante: this.controleacessovisitante.nome_empresa_visitante,
                        nome_visitante: this.controleacessovisitante.nome_visitante,
                        cpf_visitante: this.controleacessovisitante.cpf_visitante,
                        tipo_veiculo_id: this.controleacessovisitante.tipo_veiculo_id,
                        setor_id: this.controleacessovisitante.setor_id,
                        data_saida: this.formatDateTime(dNow),
                    }
                }).then( res => {
                 
                    this.dados = res.data.alterarControleAcessoVisitante
                    this.controleacessovisitante = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagControleAcessoVisitante = false
                }).catch( e => {
                    
                    this.erros = e
                })

            }
                 
           
              
        },
        alterarControleAcessoVisitante(item){
            this.controleacessovisitante = {
                id: item.id,
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                nome_empresa_visitante: item.nome_empresa_visitante,
                nome_visitante: item.nome_visitante,
                setor_id: item.setor_id,
                tipo_veiculo_id: item.tipo_veiculo_id,
                placa_veiculo: item.placa_veiculo
           
            }
            this.nome_empresa_visitante = item.nome_empresa_visitante
            this.flagControleAcessoVisitante = true
            this.editedIndex = this.controleacessovisitantes.indexOf(item)
            //this.controleacessovisitante = Object.assign({}, item)
     
        },
        excluirControleAcessoVisitante(item){
             this.controleacessovisitante = {
                id: item.id,
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                nome_empresa_visitante: item.nome_empresa_visitante,
                nome_visitante: item.nome_visitante,
                setor_id: item.setor_id,
                tipo_veiculo_id: item.tipo_veiculo_id,
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
        confirmaExclusaoControleAcessoVisitante(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirControleAcessoVisitante(
                             filtro:{
                                id: $id
                            }
                        ){
                            id data_entrada empresa_id nome_empresa_visitante nome_visitante tipo_veiculo_id setor_id placa_veiculo data_saida
                        } 
                    }
               `,
               variables:{
                   id: this.controleacessovisitante.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirControleAcessoVisitante
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoControleAcessoVisitante(){
             this.controleacessovisitante = {}
        },
        confirmaSaida(){
            this.obterEmpresas()
            this.obterSetores()
            this.obterTipoVeiculos()
            this.dialog =true

        },
        naoConfirmaSaida(){
             this.controleacessovisitante = {}
        }

    },
    mounted(){
        
    }
}
</script>

<style>

</style>
