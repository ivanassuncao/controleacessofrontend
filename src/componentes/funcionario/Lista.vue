<template>
    <v-container fluid>
        <v-layout column>
            <v-flex>
                <v-btn color="primary" class="ml-0 mb-4"
                    @click="obterFuncionarios">
                    Obter Funcionários
                </v-btn>
            </v-flex>
            <v-flex>
                <div v-if="erros" class="mb-4">
                    <Erros :erros="erros" />
                </div>
            </v-flex>
            <v-flex>
                <v-data-table :headers="headers" :items="perfis" 
                    hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.nome_funcionario }}</td>
                        <td>{{ props.item.email_funcionario }}</td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Erros from '../comum/Erros'

export default {
    components: { Erros },
    data() {
        return {
            erros: null,
            perfis: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nome', value: 'nome_funcionario' },
                { text: 'E-mail', value: 'email_funcionario' },
            ],
        }
    },
    methods: {
        obterFuncionarios() {
            // implementar
        }
    }
}
</script>

<style>

</style>
