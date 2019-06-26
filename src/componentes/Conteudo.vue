<template>

	<v-layout column>

		<v-flex>
			<UsuarioLogado />
		</v-flex >
		<v-flex >
			<v-tabs show-arrows centered height="50" grow light icons-and-text>
				<v-tabs-slider color="cyan"></v-tabs-slider>

				<v-tab class="caption" v-show="!usuario">
					Autenticação
					<v-icon >fingerprint</v-icon>
				</v-tab>

				<v-tab class="caption" v-show="usuario">
					Usuários
					<v-icon>people</v-icon>
				</v-tab>

				<v-tab class="caption" v-show="usuario">
					Perfis
					<v-icon>how_to_reg</v-icon>
				</v-tab>
				
				
				<v-tab class="caption"  v-show="usuario">
					Cadastros
					<v-icon>dialpad</v-icon>
				</v-tab>
		
				<v-tab class="caption"  v-show="usuario">
					Acesso Funcionário
					<v-icon>call_split</v-icon>
				</v-tab>

				<v-tab class="caption"  v-show="usuario">
					Prestador de Serviço
					<v-icon>business</v-icon>
				</v-tab>

				<v-tab class="caption"  v-show="usuario">
					Acesso Visitante
					<v-icon>present_to_all</v-icon>
				</v-tab>

				<v-tab-item v-show="!usuario">
					<AutenticacaoAbas />
				</v-tab-item>

				<v-tab-item  >
					<UsuarioAbas />
				</v-tab-item>

				<v-tab-item  >
					<PerfilAbas />
				</v-tab-item>

				<v-tab-item>
					<CadastroAbas />
				</v-tab-item>


				<v-tab-item>
					<AcessoInternoFuncionario />
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
import AcessoInternoFuncionario from './controle_acesso_funcionario/Abas'
import CadastroAbas from './cadastro/Abas'

export default {
	computed: {
        ...mapGetters(['usuario'])
    },
	components: {
		AutenticacaoAbas,
		UsuarioLogado,
		UsuarioAbas,
		PerfilAbas,
		AcessoInternoFuncionario,
		CadastroAbas
	},

}
</script>

<style>


</style>
