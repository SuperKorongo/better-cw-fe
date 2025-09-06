<script lang="ts">
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { getBrandName, getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
	import { onMount } from 'svelte';

	onMount(() => {
		loading.set(false);
	});
</script>

<main>
	<h1 class="title"><GlowingText text={getBrandName('extended')} /></h1>
	<h3>
		{getTranslation('aboutUs.mainDescription1').replace('{BRAND}', getBrandName('short'))}
	</h3>
	<h3>
		{getTranslation('aboutUs.mainDescription2').replace('{BRAND}', getBrandName('short'))}
	</h3>
	<h3>
		{getTranslation('aboutUs.mainDescription3')}
	</h3>
	<Accordion multiple>
		<Panel open>
			<Header>
				<h2>🎬{getTranslation('aboutUs.sharingFreeVideos')}</h2>
			</Header>
			<Content>
				<article>
					<h3>{getTranslation('aboutUs.free.t1')}</h3>
					<h3>{getTranslation('aboutUs.free.t2')}</h3>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.free.t3')}</b>: {getTranslation('aboutUs.free.t4')}
					</span>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.free.t5')}</b>: {getTranslation('aboutUs.free.t6')}
					</span>
				</article>
			</Content>
		</Panel>
		<Panel open>
			<Header>
				<h2>💲{getTranslation('aboutUs.sharingPaidVideos')}</h2>
			</Header>
			<Content>
				<article>
					<h1>{getTranslation('aboutUs.howCanIEarnMoney.title')}</h1>
					<h3>
						<b>{getTranslation('aboutUs.howCanIEarnMoney.t1')}</b>
						{getTranslation('aboutUs.howCanIEarnMoney.t2')}
					</h3>
					<h3>{getTranslation('aboutUs.howCanIEarnMoney.t3')}</h3>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howCanIEarnMoney.t4')}</b>: {getTranslation(
							'aboutUs.howCanIEarnMoney.t5'
						)}
						<a
							onclick={onClickInternalLink}
							data-sveltekit-preload-data="tap"
							href={getHrefWithLanguage('/upload')}
						>
							{getTranslation('aboutUs.howCanIEarnMoney.t6')}
						</a>
						{getTranslation('aboutUs.howCanIEarnMoney.t7')}
					</span>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howCanIEarnMoney.t8')}</b>: {getTranslation(
							'aboutUs.howCanIEarnMoney.t9'
						)}
					</span>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howCanIEarnMoney.t10')}</b>: {getTranslation(
							'aboutUs.howCanIEarnMoney.t11'
						)}
					</span>
				</article>
				<article>
					<h1>{getTranslation('aboutUs.howToWithdraw.title')}</h1>
					<h3>
						{getTranslation('aboutUs.howToWithdraw.t1').replace('{BRAND}', getBrandName('short'))}
					</h3>
					<h3><b>{getTranslation('aboutUs.howToWithdraw.t2')}</b></h3>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howToWithdraw.t3')}</b>: {getTranslation(
							'aboutUs.howToWithdraw.t4'
						)}
						<a
							onclick={onClickInternalLink}
							data-sveltekit-preload-data="tap"
							href={getHrefWithLanguage('/admin/withdraw')}
						>
							{getTranslation('aboutUs.howToWithdraw.t5')}
						</a>
						{getTranslation('aboutUs.howToWithdraw.t6')}
					</span>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howToWithdraw.t7')}</b>: {getTranslation(
							'aboutUs.howToWithdraw.t8'
						)}
					</span>
					<span class="span-list">
						- <b>{getTranslation('aboutUs.howToWithdraw.t9')}</b>: {getTranslation(
							'aboutUs.howToWithdraw.t10'
						)}
					</span>
					<h3>
						{getTranslation('aboutUs.howToWithdraw.t11')}
					</h3>
				</article>
				<article>
					<h1>{getTranslation('aboutUs.buyerProtection.title')}</h1>
					<h3>{getTranslation('aboutUs.buyerProtection.t1')}</h3>
					<span class="span-list">{getTranslation('aboutUs.buyerProtection.t2')}</span>
					<span class="span-list">{getTranslation('aboutUs.buyerProtection.t3')}</span>
					<h3>{getTranslation('aboutUs.buyerProtection.t4')}</h3>
				</article>
				<article>
					<h1>{getTranslation('aboutUs.disclaimer.title')}</h1>
					<h3>
						{getTranslation('aboutUs.disclaimer.t1')}
						<b>{getTranslation('aboutUs.disclaimer.t2')}</b>
						{getTranslation('aboutUs.disclaimer.t3')}
					</h3>
					<h3>
						{getTranslation('aboutUs.disclaimer.t4')}<a target="_blank" href="https://mega.nz"
							>mega.nz</a
						>
						{getTranslation('aboutUs.disclaimer.t5').replace('{BRAND}', getBrandName('short'))}
					</h3>
					<h3><b>{getTranslation('aboutUs.disclaimer.t6')}</b>:</h3>
					<span class="span-list">{getTranslation('aboutUs.disclaimer.t7')}</span>
					<span class="span-list">
						{getTranslation('aboutUs.disclaimer.t8').replace('{BRAND}', getBrandName('short'))}
					</span>
				</article>
				<article>
					<h1>{getTranslation('aboutUs.anyMegaLink.title')}</h1>
					<h3>
						<b>{getTranslation('aboutUs.anyMegaLink.t1')}</b>{getTranslation(
							'aboutUs.anyMegaLink.t2'
						)}
					</h3>
					<span class="span-list">{getTranslation('aboutUs.anyMegaLink.t3')}</span>
					<span class="span-list">{getTranslation('aboutUs.anyMegaLink.t4')}</span>
				</article>
				<article>
					<h1>{getTranslation('aboutUs.buyerNeverConfirms.title')}</h1>
					<h3>
						<b>{getTranslation('aboutUs.buyerNeverConfirms.t1')}</b>{getTranslation(
							'aboutUs.buyerNeverConfirms.t2'
						)}
					</h3>
					<h3>{getTranslation('aboutUs.buyerNeverConfirms.t3')}</h3>
				</article>
			</Content>
		</Panel>
	</Accordion>
</main>

<style>
	.title {
		text-align: center;
		font-size: 50px;
		font-weight: 900;
		font-variant: small-caps;
		margin-bottom: 60px;
	}
	main {
		top: var(--navbar-height);
		box-sizing: border-box;
		position: absolute;
		background-color: white;
		z-index: -1;
		box-shadow: 0px 0px 10px 5px #686800;
		color: #333;
		padding: 10px 50px;
	}

	article {
		margin-bottom: 55px;
	}

	h1 {
		font-size: 30px;
	}
	h3 {
		font-weight: normal;
		line-height: 28px;
	}

	.span-list {
		display: block;
		margin-bottom: 10px;
	}

	a {
		color: #1976d2;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		main {
			left: 2.5%;
			width: 95%;
		}
	}
	@media (min-width: 600px) {
		main {
			left: 10%;
			width: 80%;
		}
	}
	@media (min-width: 1200px) {
		main {
			left: 20%;
			width: 60%;
		}
	}
	@media (min-width: 1600px) {
		main {
			left: 25%;
			width: 50%;
		}
	}
</style>
