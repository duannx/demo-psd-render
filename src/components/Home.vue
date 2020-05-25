<template>
    <div class="home">
        <div class="col preview">
            <h4>Personalize preview</h4>
            <div class="lds-hourglass" v-if="loading"></div>
            <div ref="preview" v-show="!loading"></div>
            <h4>Product image</h4>
            <img :src="selectedStyle.image || product.images[0].src" alt="" v-if="product && product.images">
        </div>
        <div class="col tools" v-if="product">
            <h3>{{product.title || product.name }}</h3>
            <OptionsList title="Select your fucking style" :options="styleOptions" @input="styleSelect" />
            <OptionsList title="Select your fucking color" :options="colorOptions" @input="colorSelect" />
            <template v-if="product.custom_options">
                <CustomOption :title="customOption.label" @input="selectCustomOption(customOption, $event)" :customOption="customOption" v-for="customOption in product.custom_options" />
            </template>
        </div>
    </div>
</template>
<script>
    import '@assets/style/common.scss'

    import Data from '../test-data'
    // import PSDRender from 'psd-preview'
    import { PODDesign, PSDRender } from '../../../src'
    import { appendElement } from '../../../src/helper'
    import { mapActions, mapMutations, mapState } from 'vuex'
    import OptionsList from './OptionsList'
    import CustomOption from './CustomOption'

    export default {
        name: 'App',
        components: {
            OptionsList,
            CustomOption
        },
        data() {
            return {
                selectedStyle: {},
                selectedColor: {},
                loading: true,
                customOptionValue: {}
            }
        },
        computed: {
            ...mapState(['product', 'personalize']),
            styleOptions() {
                if (!this.personalize || !this.personalize.styles || this.personalize.length == 0) return null
                let styles = null
                if (!this.product) return null
                if (this.product.options) {
                    const index = this.product.options.findIndex(elm => {
                        return elm.code = 'style'
                    })
                    if (index == -1) return null
                    styles = this.product.options[index]
                }

                const result = []
                this.personalize.styles.forEach(element => {
                    const styleIndex = ((styles || {}).values || []).findIndex(elm => {
                        return elm.id == element.style_option_id
                    })
                    const style = ((styles || {}).values || [])[styleIndex] || {}
                    result.push({
                        id: element.style_option_id,
                        text: style.label,
                        designs: element.designs,
                        image: style.group_image
                    })
                });
                return result
            },
            colorOptions() {
                if (!this.product || !this.product.options) return null
                const index = this.product.options.findIndex(elm => {
                    return elm.code == 'color'
                })
                if (index == -1) return null
                const colors = this.product.options[index]
                const result = []
                colors.values.forEach(element => {
                    result.push({
                        id: element.id,
                        text: element.label,
                        color: element.color_code,
                    })
                });
                console.log('color result', result)
                return result
            },

            customOptions() {
                if (this.customOptionValue) {
                    const result = this.personalize.custom_options
                    result.map(customOption => {
                        customOption.value = this.customOptionValue[customOption.id]
                    })
                    return result
                }
                return null
            }
        },
        methods: {
            ...mapActions(['getProductDetails', 'getProductPersonalizeAPI']),
            ...mapMutations(['setCurrentDomain']),
            styleSelect(style) {
                if (this.selectedStyle.id != style.id) {
                    this.selectedStyle = style
                    this.preview()
                }
            },
            colorSelect(color) {
                if (this.selectedColor.id != color.id) {
                    this.selectedColor = color
                    this.preview()
                }
            },
            selectCustomOption(customOption, value) {
                this.$set(this.customOptionValue, customOption.id, value)
                this.preview()
            },
            preview() {
                this.loading = true
                console.log('start preview')
                this.$refs.preview.innerHTML = ''
                if (this.selectedStyle && this.selectedStyle.designs) {
                    this.selectedStyle.designs.forEach(async design => {
                        const podDesign = new PODDesign({
                            ...design,
                            // imageHost: 'https://stag-pbimg.btdmp.com/',
                            imageHost: 'https://pbimg.btdmp.com/',
                            isDebug: true
                        }, this.customOptions, this.selectedColor.color)
                        const canPreview = podDesign.canPreview()
                        if (!canPreview.canPreview) {
                            this.loading = false
                            const span = document.createElement('span')
                            span.innerText = 'Cannot preview. ' + canPreview.reason
                            this.$refs.preview.appendChild(span)
                            return console.log('Cannot preview', canPreview)
                        }
                        try {
                            const { artwork, printArea, mockupCanvas } = await podDesign.getCanvasPreview()
                            console.log('end preview', { artwork, printArea, mockupCanvas })
                            this.$refs.preview.appendChild(mockupCanvas)
                        } catch (error) {
                            console.log('error when preview', error)
                            const span = document.createElement('span')
                            span.innerText = 'Cannot preview. ' + error.code
                            this.$refs.preview.appendChild(span)
                        }

                        this.loading = false
                    });
                }
            }
        },
        async created() {
            const domain = this.$route.query.domain || `https://printbase-standard-test-case.stag.myshopbase.net/`
            const handle = this.$route.query.handle || 'rotate-align-blend-group'

            this.setCurrentDomain(domain)
            await this.getProductDetails(handle)
            if (this.product && this.product.id) {
                await this.getProductPersonalizeAPI(this.product.id)
            }
        },
    }
</script>