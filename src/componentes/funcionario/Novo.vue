<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Novo Funcionário</h1>
                    <v-divider class="mb-3" />
                        <div v-if="erros">
                            <Erros :erros="erros" />
                        </div>
                        <v-text-field class="caption" label="Nome"
                            v-model="funcionario.nome_funcionario" />
                        <v-text-field class="caption" label="E-mail"
                            v-model="funcionario.email_funcionario" />
                        <v-btn color="success" class="ml-0 mt-3"
                            @click="novoFuncionario">
                            Novo Funcionário
                        </v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Resultado</h1>
                    <v-divider />
                    <template v-if="dados">
                        <v-text-field label="ID" readonly
                            v-model="dados.id" />
                        <v-text-field label="Nome" readonly
                            v-model="dados.nome_funcionario" />
                        <v-text-field label="Rótulo" readonly
                            v-model="dados.email_funcioanrio" />
                    </template>
                </v-layout>
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
            funcionario: {},
            dados: null,
            erros: null
        }
    },
    methods: {
        novoFuncionario() {
            // implementar
        }
    }
}
</script>

<style>

</style>
