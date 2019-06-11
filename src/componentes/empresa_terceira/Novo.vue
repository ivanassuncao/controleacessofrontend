<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-layout column class="ma-3">
                    <h1 class="title">Nova Empresa Terceira</h1>
                    <v-divider class="mb-3" />
                        <div v-if="erros">
                            <Erros :erros="erros" />
                        </div>
                        <v-text-field class="caption" label="Nome"
                            v-model="empresa_terceira.nome_empresa_terceira" />
                        <v-text-field class="caption" label="CPF/CNPJ"
                            v-model="empresa_terceira.cnpj_cpf" />
                        <v-btn color="success" class="ml-0 mt-3"
                            @click="novoEmpresaTerceira">
                            Novo Empresa Terceira
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
                            v-model="dados.nome_empresa_terceira" />
                        <v-text-field label="Rótulo" readonly
                            v-model="dados.cnpj_cpf" />
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
            empresa_terceira: {},
            dados: null,
            erros: null
        }
    },
    methods: {
        novoEmpresaTerceira() {
            // implementar
        }
    }
}
</script>

<style>

</style>
