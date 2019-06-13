<template>
    <v-container fluid>
        <v-layout column>
            <v-flex>
                <v-btn small color="primary" outline class="caption ml-0 mb-4"
                    @click="obterPerfis">
                    Listar Perfis
                </v-btn>
            </v-flex>
            <v-flex>
                <div v-if="erros" class="caption mb-4">
                    <Erros :erros="erros" />
                </div>
            </v-flex>
            <v-flex>
                <v-data-table :pagination.sync="pagination" :total-items="totalPerfis" :headers="headers" :items="perfis" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome }}</td>
                        <td>{{ props.item.rotulo }}</td>
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
    components: { Erros },
    data() {
        return {
            totalPerfis: 0,
            pagination: {},
            erros: null,
            perfis: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome' },
                { text: 'Rótulo', value: 'rotulo' },
            ],
        }
    },
    methods: {
        obterPerfis() {
             this.$api.query({
              query: gql `
                    query {
                        perfis {
                            id nome rotulo
                        }
                    }
              `,
              fecthPolicy: 'network-only'
          }).then(res => {
                this.perfis =  res.data.perfis
                this.totalPerfis = this.perfis.length
                this.erros = null
          }).catch(e => {
                this.perfis = []
                this.erros = e
          })
        }
    }
}
</script>

<style>

</style>
