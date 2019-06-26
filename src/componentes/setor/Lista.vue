<template>
    <v-container fluid>
        <v-layout column>
            
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                  <v-flex>
                       <v-btn color="success" small outline dark class="caption  ml-0 mb-2" v-on="on"  @click="[flagSetor = false,setor = {}] " >Novo Setor
                             <v-icon dark right>add</v-icon>
                       </v-btn>
                        <v-btn small color="primary" outline class="caption  ml-0 mb-2"
                    @click="obterSetores">
                    Listar Setores
                     <v-icon dark right>search</v-icon>
                </v-btn>
                  </v-flex>
                </template>
         <v-card>
          <v-card-title>
            <span class="title">Registro de Setor</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex >
                    <v-text-field v-model="setor.nome_setor" label="Nome" class="caption"></v-text-field>
                    <v-checkbox v-model="setor.ativo" label="Ativo" class="caption" ></v-checkbox>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
            <v-btn color="blue darken-1" flat @click="salvarSetor">Salvar</v-btn>
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
                @click="[dialogExcluir = false,naoConfirmaExclusaoSetor()]"
            >
                Não Excluir
            </v-btn>

            <v-btn
                color="green darken-1"
                flat="flat"
                @click="[dialogExcluir = false,confirmaExclusaoSetor()]"
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
                    @click="obterSetores"
                    type="success"
                    transition="scale-transition"
                    outline
                >
                Regitrado com Sucesso.
                </v-alert>
            </v-flex>
        <v-layout row>
            <v-flex xs8 class="mr-2">
                <v-data-table :pagination.sync="pagination" :total-items="totalSetors" :headers="headers" :items="filteredList" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_setor }}</td>
                        <td>{{ getValorBoleano(props.item.ativo) }}</td>
                        <td class="justify-center layout px-0">
                            <v-icon
                                small
                                class="mr-2"
                                @click="alterarSetor(props.item)"
                            >
                                edit
                            </v-icon>
                             
                            <v-icon
                                small
                                @click="[excluirSetor(props.item),dialogExcluir = true]"
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
        return this.setores.filter(setor => {
        return setor.nome_setor.toLowerCase().includes(this.search.toLowerCase())
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
            totalSetors: 0,
            flagSetor: false,
            pagination: {},
            search: '',
            editedIndex: -1,
            erros: null,
            perfis: [],
            alert: false,
            setores: [],
            setor: {},
            dados: null,
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_setor' },
                { text: 'Ativo', value: 'valorboleano' }, 
                { text: 'Ações', value: 'name', sortable: false }
               
            ]
        }
    },
    methods: {

        obterSetores() {

                this.$api.query({
                query: gql`
                    query {
                        setores {
                            id nome_setor ativo
                        }
                    }
                `,
                fetchPolicy: 'network-only'
                }).then( res =>{
                    this.setores = res.data.setores
                    this.totalSetors = this.setores.length
                    this.erros = null
                }).catch( e =>{
                    this.setores = []
                    this.erros = e 
                })
                
              
        },
        salvarSetor() {

             if(!this.flagSetor){
                  this.$api.mutate({
                    mutation: gql `
                        mutation (
                            $nome_setor: String!
                            $ativo: Boolean
                        ){
                            novoSetor (
                                dados:{
                                    nome_setor: $nome_setor
                                    ativo: $ativo
                                }
                            ){
                                id nome_setor ativo
                            }
                        }
               `,
               variables:{
                   nome_setor: this.setor.nome_setor,
                   ativo: this.setor.ativo
               }
           }).then(res=>{
                this.dados = res.data.novoSetor
                this.setor = {}
                this.erros = null
                this.alert = true
                this.dialog = false
                this.flagSetor = false  
           }).catch(e=>{
               this.erros = e
           })
             }else{
                this.$api.mutate({
                 mutation: gql `
                    mutation (
                        $idFiltro: Int
                        $nome_setor: String
                         $ativo: Boolean

                    ){
                        alterarSetor(
                            filtro:{
                                 id: $idFiltro
                            }
                           dados:{
                                nome_setor: $nome_setor
                                ativo: $ativo
                           }
                           
                        ){
                            id nome_setor ativo
                        }
                    }
               `,
                    variables:{
                        idFiltro: this.setor.id,
                        nome_setor: this.setor.nome_setor,
                        ativo: this.setor.ativo

                    }
                }).then( res => {
                    this.dados = res.data.alterarSetor
                    this.setor = {}
                    this.filtro = {}
                    this.erros = null
                     this.alert = true
                     this.dialog = false
                    this.flagSetor = false
                }).catch( e => {
                    this.erros = e
                })
             }
              
        },
      
        alterarSetor(item){
            this.setor = {
                id: item.id,
                nome_setor: item.nome_setor,
                ativo: item.ativo
            
            }
            this.flagSetor = true
            this.editedIndex = this.setors.indexOf(item)
            //this.setor = Object.assign({}, item)
            this.dialog = true
        },
        
        excluirSetor(item){
             this.setor = {
                id: item.id,
                nome_setor: item.nome_setor,
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
        confirmaExclusaoSetor(){
              this.$api.mutate({
               mutation: gql`
                    mutation (
                        $id: Int
                    ){
                        excluirSetor(
                             filtro:{
                                id: $id
                            }
                        ){
                            id nome_setor
                        } 
                    }
               `,
               variables:{
                   id: this.setor.id,
               }
           }).then( res =>{
                   this.dados = res.data.excluirSetor
                   this.erros = null
                    this.alert = true
                   this.filtro = {} 
           }).catch(e =>{
               this.erros = e
           })
        },
        naoConfirmaExclusaoSetor(){
             this.setor = {}
        }

    },
    mounted(){
     
    }
}
</script>

<style>

</style>
