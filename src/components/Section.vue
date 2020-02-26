<template>
	<section>
		<div class="form-wrapper">
			<div class="section_ip">
				<label for="ip-address" class="table-title">{{ $t('title.ip') }}</label>
				<input 
					v-model="ip"
					type="text" 
					class="ip-address"
					:style="errors ? 'border: 1px solid #FF6C6C;' : ''"
					id="ip-address"
					placeholder="000.000.00.00"
					v-mask="'###.###.##.##'"
					@blur="checkInput()"
					>
				<button 
					@click="addHover($event); validate(false); checkInput()"
					@mouseout="delHover($event)"
					class="button" 
					id="get-btn"
					>{{ $t('button.getInfo') }}
				</button>
			</div>
			<div class="section-result">
				<span class="table-title">{{ $t('title.result') }}</span>
				<div class="table-wrapper">
					<table>
						<thead>
							<tr>
								<th>{{ $t('table.ip') }}</th>
								<th>{{ $t('table.continent') }}</th>
								<th>{{ $t('table.country') }}</th>
								<th>{{ $t('table.city') }}</th>
								<th>{{ $t('table.postal') }}</th>
								<th>{{ $t('table.coordinates') }}</th>
							</tr>
						</thead>
						<tr>
							<td>{{ valPresent ? ipObj.ip : '000.000.00.00'}}</td>
							<td>{{ valPresent ? ipObj.continent : ''}}</td>
							<td>{{ valPresent ? ipObj.country : ''}}</td>
							<td>{{ valPresent ? ipObj.city : ''}}</td>
							<td>{{ valPresent ? ipObj.postCode : ''}}</td>
							<td>{{ valPresent ? ipObj.coordinates : ''}}</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="section_history">
				<span class="table-title">{{ $t('title.history') }}</span>
				<div class="table-wrapper">
					<table>
						<thead>
							<tr>
								<th>{{ $t('table.ip') }}</th>
								<th>{{ $t('table.continent') }}</th>
								<th>{{ $t('table.city') }}</th>
							</tr>
							<tr v-for="(i, k) in ipHistory[$t('title.lang')]"
								:key="k"
								>
								<td>{{ i.ip }}</td>
								<td>{{ i.continent }}</td>
								<td>{{ i.city }}</td>
							</tr>
							<tr v-if="!valPresent">
								<td>{{ '000.000.00.00' }}</td>
								<td></td>
								<td></td>
							</tr>
						</thead>
					</table>
				</div>
				<button 
					@click="addHover($event); clearHistory()"
					@mouseout="delHover($event)"
					:disabled="!valPresent"
					class="button" 
					:style="clearBtnStl"
					id="clear-btn"
					>{{ $t('button.clearHistory') }}
				</button>
			</div>
		</div>
	</section>
</template>

<script>
import gql from 'graphql-tag'

export default {
	data: () => ({
		ip: null,
		// default api language
		postIPLang: 'en',
		toggleLang: false,
		postIP: '',
		errors: false,
		ipHistory: {
			ru: [],
			en: [],
		},
	}),
		apollo: {
			postIP: {
				query: gql`query rundomFunc($ip: String!, $lang: String!) {
					postIP(ip: $ip, lang: $lang) {
						language
						ip
						countryCode
						countryName
						continentCode
						continentName
						city
						postCode
						latitude
						longitude
					}
				}`,
				variables () {
					return {
						ip: this.ip,
						lang: this.postIPLang
					}
				},
				skip () {
					return this.skipQuery
				},
			},
		},
	methods: {
		checkInput() {
			this.ip === null 
				? this.errors = true
				: this.ip.replace(/[^\d]/g, '').length !== 10 
				? this.errors = true
				: this.errors = false
		},
		clearHistory() {
			this.ipHistory.ru = []
			this.ipHistory.en = []
		},
		addHover(e) {
			e.target.classList.add('no-hover')
		},
		delHover(e) {
			e.target.classList.remove('no-hover')
		},
		validate(state) {
			if(this.ip !== null && this.ip.replace(/[^\d]/g, '').length >= 10) {
				this.fetchQuery(state)
			} else {
				return
			}
		},
		fetchQuery(state) {
			this.$apollo.queries.postIP.skip = state
		},
		toggle() {
			this.toggleLang = !this.toggleLang
			return this.toggleLang ? 'ru' : 'en'
		},
		createObject(v) {
			let t = (val) => val !== null
			return {
				'ip': v.ip,
				'continent': `${t(v.continentName) ? v.continentName + '/' + v.continentCode : '--'}`,
				'country': `${t(v.countryName) ? v.countryName + '/' + v.countryCode : '--'}`,
				'city': `${t(v.city) ? v.city : '--'}`,
				'postCode': `${t(v.postCode) ? v.postCode : '--'}`,
				'coordinates': `${t(v.latitude) ? v.latitude + '/' + v.longitude : '--'}`
			}
		},
		chooseArrLang(val) {
			switch(val.language) {
				case 'en': this.ipHistory.en.push(this.createObject(val)); break
				case 'ru': this.ipHistory.ru.push(this.createObject(val)); break
			}
			this.fetchQuery(true)
			if(this.ipHistory.ru.length !== this.ipHistory.en.length){
				this.postIPLang = this.toggle()
				this.fetchQuery(false)
			}
		},
		checkValue(ip) {
			if(ip[0].ip !== null){
				this.chooseArrLang(ip[0])
			}
		}
	},
	computed: {
		valPresent() {
			return this.ipHistory[this.$t('title.lang')].length > 0
		},
		ipObj() {
			let num = this.ipHistory[this.$t('title.lang')].length - 1
			return this.ipHistory[this.$t('title.lang')][num]
		},
		clearBtnStl() {
			return !this.valPresent ? 'background: #E6E6E6; box-shadow: 0 0 0 0;': ''
		},
	},
	watch: {
		postIP(val) {
			val !== undefined 
				? this.checkValue(val) 
				: false
		}
	},
}
</script>

<style scoped>
section {
	width: 1170px;
	margin: 105px auto 76px auto;
	background: #FFFFFF;
	box-shadow: 0px 0px 50px rgba(230, 230, 230, 0.8);
}
.form-wrapper {
	margin: 0 48px 0 48px;
	padding: 1px 0 48px 0;
}

/* Table */
table { 
	border-collapse: collapse; 
}
.table-title {
	font-family: Open Sans;
	font-size: 18px;
	display: block;
	margin: 45px 0 13px 0;
}
.table-wrapper {
	border-radius: 8px;
	overflow: hidden;
	display: inline-block;
	border: 1px solid #CCCCCC;
}
tr > td {
	text-align: center;
	padding: 20px 40px;
	border: 1px solid #CCCCCC;
	color: #969696;
	overflow: auto;
}
tr > th {
	text-align: center;
	padding: 17px 40px;
	background: #656BF2;
	font-family: Open Sans;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	line-height: 16px;
	color: #FFFFFF;
}
.section-result {
	display: flex;
	flex-wrap: wrap;

}

/* Button */
.button {
	transition: all 0.2s;
	background: #FF5252;
	opacity: 0.85;
	color: #FFFFFF;
	font-family: Open Sans;
	font-size: 16px;
	line-height: 22px;
	width: 256px;
	height: 48px;
	border-radius: 5px;
	border: 0;
	display: block;
	margin-top: 18px;
}
button:not(.no-hover):hover {
	background: #FF6C6C;
	box-shadow: 0px 0px 20px rgba(255, 108, 108, 0.7);
}
button:hover {
	cursor: pointer;
}

/* Input */
input {
	padding: 12px 18px;
	width: 396px;
	height: 45px;
	font-family: Open Sans;
	font-size: 16px;
	line-height: 22px;
	border: 1px solid #CCCCCC;
	box-sizing: border-box;
	border-radius: 8px;
}
input:focus {
	border: 1px solid #656BF2;
}
input, label {
	display: block;
}
</style>
