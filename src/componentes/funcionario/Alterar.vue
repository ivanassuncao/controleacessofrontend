<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Filtrar Funcionário</h1>
                    <v-divider class="mb-3" />
                    <div v-if="erros">
                        <Erros :erros="erros" />
                    </div>
                    <v-text-field label="ID"
                        v-model.number="filtro.id" />
                    <v-text-field label="Nome"
                        v-model="filtro.nome" />

                    <h1 class="mt-4 title">Alterar Funcionário</h1>
                    <v-divider class="mb-3" />
                    <v-text-field label="Nome"
                        v-model="funcionario.nome_funcionario" />
                    <v-text-field label="E-mail"
                        v-model="funcionario.email_funcionario" />

                    <v-btn color="warning" class="ml-0 mt-3"
                        @click="alterarPerfil">
                        Alterar Funcionário
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="headline">Resultado</h1>
                    <v-divider />
                    <template v-if="dados">
                        <v-text-field label="ID" readonly
                            v-model="dados.id" />
                        <v-text-field label="Nome" readonly
                            v-model="dados.nome_funcionario" />
                        <v-text-field label="E-mail" readonly
                            v-model="dados.email_funcionario" />
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
            filtro: {},
            funcionario: {},
            dados: null,
            erros: null
        }
    },
    methods: {
        alterarPerfil() {
            // implementar
        }
    }
}
</script>

<style>

</style>
