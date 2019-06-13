<template>
     <div v-if="itens">
        <v-alert v-for="i in itens"
            :key="i.message" :value="true" type="success">
            {{ i.message }}
        </v-alert>
    </div>
</template>

<script>
export default {
    props: ['success'],
}
</script>

<style>

</style>
