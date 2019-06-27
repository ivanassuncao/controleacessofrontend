<template>
    <v-container fluid>
        <v-layout column>
          
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagControleAcessoEmpresaTerceira = false,controleacessoempresaterceira = {},obterEmpresas(),obterEmpresaTerceiras(),obterSetores(),obterTipoVeiculos()] " >Novo Acesso do Prestador de Serviço
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="[obterControleAcessoEmpresaTerceiras(),obterControleAcessoEmpresaTerceirasSaida()]">
                    Listar Acesso Prestador de Serviço
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Controle Acesso Prestador de Serviço</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                   
                    <v-select class="caption" label="Empresa do Serviço"
                            v-model="controleacessoempresaterceira.empresa_terceira_id"
                            :items="empresa_terceiras"
                             @input="obterEmpresasTerceirasPrestadores(controleacessoempresaterceira.empresa_terceira_id)"
                            item-value="id"
                            item-text="nome_empresa_terceira"
                            :readonly="flagControleAcessoEmpresaTerceira"
                            small
                            chips deletable-chips />    
                    <v-select class="caption" label="Local"
                            v-model="controleacessoempresaterceira.empresa_id"
                            :items="empresas"
                            @input="obterEmpresasTerceirasPrestadores(controleacessoempresaterceira.empresa_terceira_id)"
                            item-value="id"
                            :readonly="flagControleAcessoEmpresaTerceira"
                            item-text="nome_empresa"
                            small
                            chips deletable-chips />      
                    <v-select class="caption" label="Prestador de Serviço"
                            v-model="controleacessoempresaterceira.prestador_id"
                            :items="empresa_terceira_prestadores"
                            item-value="id"
                            item-text="nome_prestador"
                            :readonly="flagControleAcessoEmpresaTerceira"
                            small
                            chips deletable-chips />
                    <v-select class="caption" label="Setor"
                            v-model="controleacessoempresaterceira.setor_id"
                            :items="setores"
                            item-value="id"
                            item-text="nome_setor"
                            :readonly="flagControleAcessoEmpresaTerceira"
                            small
                            chips deletable-chips />        
                    <v-select class="caption" label="Tipo Veículo"
                            v-model="controleacessoempresaterceira.tipo_veiculo_id"
                            :items="tipo_veiculos"
                            item-value="id"
                            item-text="nome_tipo_veiculo"
                            :readonly="flagControleAcessoEmpresaTerceira"
                            small
                            chips deletable-chips />       
                    <v-text-field v-model="controleacessoempresaterceira.placa_veiculo" 
                        mask="AAA-####"
                        :readonly="flagControleAcessoEmpresaTerceira"
                        label="Placa do Veiculo" class="caption"></v-text-field>
     
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarControleAcessoEmpresaTerceira">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoControleAcessoEmpresaTerceira()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoControleAcessoEmpresaTerceira()]"
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
            @click="[obterControleAcessoEmpresaTerceiras(),obterControleAcessoEmpresaTerceirasSaida()]"
            type="success"
            transition="scale-transition"
            outline
        >
        Regitrado com Sucesso.
        </v-alert>
    </v-flex>
    <v-layout row>
    <v-flex xs7 class="mr-1">
        <v-data-table  :headers="headers" :items="controleacessoempresaterceiras" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_entrada)}}</td>
                <td>{{ props.item.nome_empresa_terceira}}</td>
                <td>{{ props.item.nome_prestador}}</td>
                <td>{{ props.item.nome_setor}}</td>
                <td>{{ props.item.placa_veiculo}}</td>

                <td class="justify-center layout px-0">
                    
                    <v-icon
                        small
                        class="mr-2"
                        @click="[alterarControleAcessoEmpresaTerceira(props.item),dialogSaida = true]"
                    >
                        close
                    </v-icon>
                        
                    <v-icon
                        small
                        @click="[excluirControleAcessoEmpresaTerceira(props.item),dialogExcluir = true]"
                    >
                        delete
                    </v-icon>
                </td>        
            </template>

        </v-data-table>
    </v-flex>
      <v-flex xs5 >
        <v-data-table dark :headers="headersSaida" :items="controleacessoempresaterceirassaida" 
            hide-actions class="elevation-4">
            <template slot="items" slot-scope="props">
                <td>{{ getDateTime(props.item.data_saida) }}</td>
                <td>{{ props.item.nome_empresa_terceira}}</td>
                <td>{{ props.item.nome_prestador}}</td>
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
            totalControleAcessoEmpresaTerceiras: 0,
            flagControleAcessoEmpresaTerceira: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            empresa_terceiras: [],
            empresas: [],
            setores:[],
            prestadores:[],
            tipo_veiculos:[],
            alert: false,
            menu: false,
            menu2: false,
            dialogSaida: false,
            nome_empresa_terceira: '',
            controleacessoempresaterceiras: [],
            controleacessoempresaterceirassaida: [],
            controleacessoempresaterceira: {},
            empresa_terceira_prestadores:[],
            dados: null,
            localdate: null,
            headers: [
                { text: 'Entrada',  align: 'center', value: 'data_entrada', sortable: true},
                { text: 'Empresa do Serviço', align: 'left', value: 'nome_empresa_terceira' }, 
                { text: 'Prestador do Serviço', value: 'nome_prestador' }, 
                { text: 'Setor', value: 'nome_setor' },
                { text: 'Placa', value: 'placa_veiculo' }, 
                { text: 'Ações', value: 'name' }
            ],
            headersSaida: [
                { text: 'Saída', value: 'data_saida',sortable: true },
                { text: 'Empresa do Serviço', value: 'nome_empresa_terceira' }, 
                { text: 'Prestador do Serviço', value: 'nome_prestador' }, 
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
         obterEmpresaTerceiras() {
            this.$api.query({
                query: gql`{ empresasterceiras { id nome_empresa_terceira } }`
            }).then(res =>{
                this.empresa_terceiras = res.data.empresasterceiras
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
        obterControleAcessoEmpresaTerceiras() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessoempresaterceirabydata(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id empresa_terceira_id prestador_id tipo_veiculo_id setor_id nome_empresa nome_empresa_terceira nome_prestador cpf nome_setor nome_tipo_veiculo placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessoempresaterceiras = res.data.controleacessoempresaterceirabydata
                    this.totalControleAcessoEmpresaTerceiras = this.controleacessoempresaterceiras.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessoempresaterceiras = []
                    this.erros = e 
                })
                
              
        },
         obterControleAcessoEmpresaTerceirasSaida() {

                this.$api.query({
                query: gql`
                    query(
                            $data_inicial: DateTime
                            $data_final: DateTime  
                        ){
                        controleacessoempresaterceirabydatasaida(
                             filtro:{
                               data_inicial: $data_inicial
                               data_final: $data_final
                           } 
                        )
                         {
                           id data_entrada empresa_id empresa_terceira_id prestador_id tipo_veiculo_id setor_id nome_empresa nome_empresa_terceira nome_prestador cpf nome_setor nome_tipo_veiculo placa_veiculo data_saida
                        }
                    }
                `,
                  variables:{
                    data_inicial: this.data_inicial,
                    data_final: this.data_final
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.controleacessoempresaterceirassaida = res.data.controleacessoempresaterceirabydatasaida
                    this.totalControleAcessoEmpresaTerceiras = this.controleacessoempresaterceiras.length
                    this.erros = null
                }).catch( e =>{
                    this.controleacessoempresaterceirassaida = []
                    this.erros = e 
                })
                
              
        },
        obterEmpresasTerceirasPrestadores(item) {

                this.empresa_terceira = item
              
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
                            id nome_prestador cpf
                        }
                    }
                `,
                variables:{
                    empresa_terceira_id: this.empresa_terceira
                },
                fetchPolicy: 'no-cache'
                }).then( res =>{
                    this.empresa_terceira_prestadores = res.data.empresaterceiraprestadorid
                    this.erros = null
                }).catch( e =>{
                    this.empresa_terceira_prestadores = []
                    this.erros = e 
                })
                  
        },
        salvarControleAcessoEmpresaTerceira() {

           let dNow = new Date(moment().format("YYYY-MM-DD") + ' ' + moment().format("LTS"))
            
            if(!this.flagControleAcessoEmpresaTerceira)
            {
                 this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $data_entrada: DateTime
                            $empresa_id: Int!
                            $empresa_terceira_id: Int!
                            $prestador_id: Int!
                            $tipo_veiculo_id: Int
                            $setor_id: Int!
                            $placa_veiculo: String
                        ){
                            novoControleAcessoEmpresaTerceira (
                                dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    empresa_terceira_id: $empresa_terceira_id
                                    prestador_id: $prestador_id
                                    tipo_veiculo_id: $tipo_veiculo_id
                                    setor_id: $setor_id
                                    placa_veiculo: $placa_veiculo
                                }
                            ){
                                id data_entrada empresa_id empresa_terceira_id prestador_id tipo_veiculo_id placa_veiculo setor_id data_saida
                            }
                        }
               `,
               variables:{
                   data_entrada: this.formatDateTime(dNow),
                   empresa_id: this.controleacessoempresaterceira.empresa_id,
                   empresa_terceira_id: this.controleacessoempresaterceira.empresa_terceira_id,
                   prestador_id: this.controleacessoempresaterceira.prestador_id,
                   tipo_veiculo_id: this.controleacessoempresaterceira.tipo_veiculo_id,
                   setor_id: this.controleacessoempresaterceira.setor_id,
                   placa_veiculo: this.controleacessoempresaterceira.placa_veiculo
               }
           }).then(res=>{
                this.dados = res.data.novoControleAcessoEmpresaTerceira
                this.controleacessoempresaterceira = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagControleAcessoEmpresaTerceira = false  
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
                        $empresa_terceira_id: Int!
                        $prestador_id: Int!
                        $tipo_veiculo_id: Int
                        $setor_id: Int!
                        $placa_veiculo: String
                        $data_saida: DateTime

                    ){
                        alterarControleAcessoEmpresaTerceira(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                    data_entrada: $data_entrada
                                    empresa_id: $empresa_id
                                    empresa_terceira_id: $empresa_terceira_id
                                    prestador_id: $prestador_id
                                    tipo_veiculo_id: $tipo_veiculo_id
                                    setor_id: $setor_id
                                    placa_veiculo: $placa_veiculo
                                    data_saida: $data_saida
                           }
                           
                        ){
                            id data_entrada empresa_id empresa_terceira_id prestador_id tipo_veiculo_id placa_veiculo setor_id data_saida
                        }
                    }
                     `,
                    variables:{
                        idFiltro: this.controleacessoempresaterceira.id,
                        empresa_id: this.controleacessoempresaterceira.empresa_id,
                        empresa_terceira_id: this.controleacessoempresaterceira.empresa_terceira_id,
                        prestador_id: this.controleacessoempresaterceira.prestador_id,
                        tipo_veiculo_id: this.controleacessoempresaterceira.tipo_veiculo_id,
                        setor_id: this.controleacessoempresaterceira.setor_id,
                        data_saida: this.formatDateTime(dNow),
                    }
                }).then( res => {
                 
                    this.dados = res.data.alterarControleAcessoEmpresaTerceira
                    this.controleacessoempresaterceira = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagControleAcessoEmpresaTerceira = false
                }).catch( e => {
                    
                    this.erros = e
                })

            }
                 
           
              
        },
        alterarControleAcessoEmpresaTerceira(item){
            this.controleacessoempresaterceira = {
                id: item.id,
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                empresa_terceira_id: item.empresa_terceira_id,
                prestador_id: item.prestador_id,
                setor_id: item.setor_id,
                tipo_veiculo_id: item.tipo_veiculo_id,
                placa_veiculo: item.placa_veiculo
           
            }
            this.nome_empresa_terceira = item.nome_empresa_terceira
            this.flagControleAcessoEmpresaTerceira = true
            this.editedIndex = this.controleacessoempresaterceiras.indexOf(item)
            //this.controleacessoempresaterceira = Object.assign({}, item)
     
        },
        excluirControleAcessoEmpresaTerceira(item){
             this.controleacessoempresaterceira = {
                id: item.id,
                data_entrada: item.data_entrada,
                empresa_id: item.empresa_id,
                empresa_terceira_id: item.empresa_terceira_id,
                prestador_id: item.prestador_id,
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
        confirmaExclusaoControleAcessoEmpresaTerceira(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirControleAcessoEmpresaTerceira(
                             filtro:{
                                id: $id
                            }
                        ){
                            id data_entrada empresa_id empresa_terceira_id prestador_id tipo_veiculo_id setor_id placa_veiculo data_saida
                        } 
                    }
               `,
               variables:{
                   id: this.controleacessoempresaterceira.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirControleAcessoEmpresaTerceira
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoControleAcessoEmpresaTerceira(){
             this.controleacessoempresaterceira = {}
        },
        confirmaSaida(){
            this.obterEmpresas()
            this.obterEmpresaTerceiras()
            this.obterSetores()
            this.obterTipoVeiculos()
            this.obterEmpresasTerceirasPrestadores(this.controleacessoempresaterceira.empresa_terceira_id)
            this.dialog =true

        },
        naoConfirmaSaida(){
             this.controleacessoempresaterceira = {}
        }

    },
    mounted(){
        
    }
}
</script>

<style>

</style>
