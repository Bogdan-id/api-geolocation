<template>
	<header>
		<div class="header_container">
			<div class="header_sec"></div>
			<div class="header_sec"><span class="title">GeoIP</span></div>
			<div class="header_sec">
				<div 
					class="lang-wrapper"
					@click="langPanel = !langPanel"
					>
					<span class="language">{{ $t('title.lang').toUpperCase() }}</span>
					<LangIcon :class="langIcon"></LangIcon>
					<div :class="langMenu">
						<span @click="changeLang('en')" class="lang-val" :style="enColor">EN</span>
						<span @click="changeLang('ru')" class="lang-val" :style="ruColor">RU</span>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
<script>
import LangIcon from '../assets/lang-icon.vue'

export default {
	data: () => ({
		langPanel: false,
	}),
	methods: {
		changeLang(val) {
			this.$i18n.locale = val
			this.switchLang
		}
	},
	computed: {
		langIcon() {
			return this.langPanel ? 'lang-icon active' : 'not-active'
		},
		langMenu() {
			return this.langPanel ? 'lang-panel active' : 'lang-panel'
		},
		currentLocale() {
			return this.$i18n.locale
		},
		enColor() {
			return this.currentLocale === 'en' ? 'color: #656BF2;' : ''
		},
		ruColor() {
			return this.currentLocale === 'ru' ? 'color: #656BF2;' : ''
		},
		switchLang() {
			return this.$store.dispatch('change_language', this.$t('title.lang'))
		}
	},
	mounted() {
		this.switchLang
	},
	components: {
		LangIcon
	},
}
</script>

<style scoped>
header {
	position: fixed;
	width: 100%;
	height: 48px;
	left: 0px;
	top: 0px;
}
.header_container {
	width: 100%;
	height: 100%;
	display: flex;
	color: #FFFFFF;
	background: #656BF2;
}
.header_sec {
	width: 33.3%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.title {
	font-family: Open Sans;
	font-style: normal;
	font-weight: 800;
	font-size: 18px;
	line-height: 25px;
}
.lang-panel {
	opacity: 0;
	transition: all 0.3s;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	background: #FFFFFF;
	box-shadow: 0px 20px 50px rgba(229, 229, 229, 0.8);
	position: absolute;
	top: 40px;
	color: black;
	padding: 8px 5px;
	border-radius: 8px;
	font-family: Open Sans;
	font-style: normal;
	font-weight: normal;
	font-size: 18px;
	line-height: 25px;
	min-width: 56px;
	min-height: 92px;
}
.lang-icon {
	transition: all 0.3s;
}
.lang-wrapper {
	display: flex;
	align-items: center;
}
.lang-wrapper, .language:hover {
	cursor: pointer;
}
.lang-val {
	text-align: center;
}
.language {
	padding: 3px;
}
.active {
	opacity: 1;
}
.not-active {
	opacity: 0;
}
</style>
