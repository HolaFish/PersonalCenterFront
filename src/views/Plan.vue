<template>
    <v-row class="fill-height pl-2 pt-2 pr-2">
        <v-col md="4">
            <v-card class="fill-height">
                <v-card-title class="justify-space-between">
                    <span>年计划</span>
                    <v-select :items="years" class="ml-3 mr-3"></v-select>
                    <v-btn icon small>
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-col>
        <v-col md="4">
            <v-card class="fill-height">
                <v-card-title class="justify-space-between">
                    <span>月计划</span>
                    <v-select :items="years" class="ml-3 mr-3"></v-select>
                    <v-btn icon small>
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-col>
        <v-col md="4">
            <v-card class="fill-height">
                <v-card-title class="justify-space-between">
                    <span>周计划</span>
                    <v-select :items="years" class="ml-3 mr-3"></v-select>
                    <v-btn icon small>
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-card-title>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data(){
        return {
            years:[2021,2022,2023]
        }
    }
}
</script>

<style>

</style>