<template>
  <v-app>
    <v-toolbar app color="blue-grey" height="55" dark>
      <v-toolbar-title class="headline text-uppercase" >
        <span>Controle de Acesso </span>
        <span class="font-weight-light">Grupo Martins Lanna</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content
      id="scroll-target"
      class="scroll-y mt-2"
    >
     <v-layout
            column
        align-center
        justify-center
      
      >
        <Conteudo />
      </v-layout>
    
    </v-content>
    <v-footer>
      <Rodape />
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import Conteudo from './componentes/Conteudo'
import Rodape from './componentes/Rodape'

export default {
	name: 'App',
	components: { Conteudo, Rodape },
	methods: mapActions(['setUsuario']),
	created() {
		this.setUsuario(null)
	}
}
</script>
