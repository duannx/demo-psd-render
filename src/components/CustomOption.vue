<template>
    <div class="custom-option">
        <label>{{title}}</label>
        <template v-if="customOption && customOption.type =='file'">
            <input type="file" @change="uploadFile">
        </template>
        <template v-if="customOption && customOption.type =='text'">
            <input type="text" @input="inputText">
        </template>
        <template v-if="customOption && customOption.type == 'picture'">

        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedValue: ''
            }
        },
        props: {
            customOption: {
                type: Object,
                default: () => {

                }
            },
            title: ""
        },
        methods: {
            select(value) {
                this.selectedValue = value
                this.$emit('input', this.selectedValue)
            },
            uploadFile(event) {
                const input = event.target
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        console.log('e.target.value', e.target, e.target.value)
                        this.select(e.target.result)
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            },
            inputText(event) {
                this.select(event.target.value)
            }
        }
    }
</script>