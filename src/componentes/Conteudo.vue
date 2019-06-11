<template>

	<v-layout column>
		<v-flex>
			<UsuarioLogado />
		</v-flex>
		<v-flex>
			<v-tabs centered grow  height=50 light icons-and-text>
				<v-tabs-slider color="cyan"></v-tabs-slider>

				<v-tab v-show="!usuario">
					Autenticação
					<v-icon >fingerprint</v-icon>
				</v-tab>

				<v-tab>
					Usuários
					<v-icon>people</v-icon>
				</v-tab>

				<v-tab>
					Perfis
					<v-icon>how_to_reg</v-icon>
				</v-tab>

				<v-tab>
					Funcionários
					<v-icon>people</v-icon>
				</v-tab>

				<v-tab>
					Empresas Terceiras
					<v-icon>business</v-icon>
				</v-tab>

				<v-tab>
					Acesso Funcionário
					<v-icon>call_split</v-icon>
				</v-tab>

				<v-tab>
					Prestador de Serviço
					<v-icon>business</v-icon>
				</v-tab>

				<v-tab>
					Visitante
					<v-icon>present_to_all</v-icon>
				</v-tab>

				<v-tab-item v-show="!usuario">
					<AutenticacaoAbas />
				</v-tab-item>

				<v-tab-item>
					<UsuarioAbas />
				</v-tab-item>

				<v-tab-item>
					<PerfilAbas />
				</v-tab-item>

				<v-tab-item>
					<!--FuncionarioAbas /-->
				</v-tab-item>

			</v-tabs>
		</v-flex>
	</v-layout>

</template>

<script>
import { mapGetters } from 'vuex'
import AutenticacaoAbas from './autenticacao/Abas'
import UsuarioLogado from './autenticacao/UsuarioLogado'
import UsuarioAbas from './usuario/Abas'
import PerfilAbas from './perfil/Abas'
//import FuncionarioAbas from './funcionario/Abas'

export default {
	computed: {
        ...mapGetters(['usuario'])
    },
	components: {
		AutenticacaoAbas,
		UsuarioLogado,
		UsuarioAbas,
		PerfilAbas,
	},

}
</script>

<style>


</style>
