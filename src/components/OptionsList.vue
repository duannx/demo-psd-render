<template>
    <div class="list-options" v-if="options">
        <div class="title">{{title}}</div>
        <div class="option" :class="{'activated': option.id == selectedOption.id}" v-for="option in options" @click="selectOption(option)">
            <img :src="option.image" alt="" v-if="option.image">
            <div v-if="option.color" class="color" :style="{'background-color': option.color}"></div>
            <span v-if="!option.image && !option.color">{{option.text}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedOption: {}
            }
        },
        props: {
            options: {
                type: Array,
                default: () => []
            },
            title: {
                type: String,
                default: "Choose the fucken one"
            }
        },
        watch: {
            options: {
                handler() {
                    if (this.options && this.options.length) {
                        this.selectOption(this.options[0])
                    }
                },
                deep: true
            }
        },
        mounted() {
            if (this.options && this.options.length) {
                this.selectOption(this.options[0])
            }
        },
        methods: {
            selectOption(option) {
                this.$emit('input', option)
                this.selectedOption = option
            }
        }
    }
</script>