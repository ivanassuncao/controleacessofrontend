<template>
    <v-container fluid>
        <v-tabs class="title" dark height=35 color="blue-grey darken-4"
            slider-color="blue">
            <v-tab class="caption" ripple>
                Empresa
            </v-tab>
            <v-tab class="caption" >
				Setor
			</v-tab>

            <v-tab class="caption">
					Funcionários
			</v-tab>

            <v-tab class="caption">
					Empresas Terceiras
			</v-tab>

            <v-tab class="caption">
					Item Interno
			</v-tab>

            <v-tab class="caption">
					Tipo de Veículo
			</v-tab>

            <v-tab-item>
                <EmpresaAbas />
            </v-tab-item>

             <v-tab-item>
                <SetorAbas />
            </v-tab-item>

            <v-tab-item>
                <FuncionarioAbas />
            </v-tab-item>

            <v-tab-item>
                <EmpresaTerceiraoAbas />
            </v-tab-item>

            <v-tab-item>
                <ItemInternoAbas />
            </v-tab-item>
        
            <v-tab-item>
                <TipoVeiculoAbas />
            </v-tab-item>

        </v-tabs>
    </v-container>
</template>

<script>
import EmpresaAbas from '../empresa/Abas'
import SetorAbas from '../setor/Abas'
import FuncionarioAbas from '../funcionario/Abas'
import EmpresaTerceiraoAbas from '../empresa_terceira/Abas'
import ItemInternoAbas from '../item_interno/Abas'
import TipoVeiculoAbas from '../tipo_veiculo/Abas'

export default {
    components: { EmpresaAbas,
                    SetorAbas,
                    FuncionarioAbas,
                    EmpresaTerceiraoAbas,
                    ItemInternoAbas,
                    TipoVeiculoAbas }
}
</script>

<style>

</style>
