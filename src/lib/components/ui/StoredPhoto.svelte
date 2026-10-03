<script>
	import { photoAddress } from '$lib/photo-address.svelte';

	/**
	 * A photo from the database, as an image that fills its box. The box has a soft color until
	 * the photo is read.
	 * With no "alt" text, the photo is decoration: the text next to it gives the meaning.
	 * @type {{ id: string, alt?: string, fit?: 'cover' | 'contain' }}
	 */
	let { id, alt = '', fit = 'cover' } = $props();

	const address = photoAddress(() => id);
</script>

<span class="stored-photo">
	{#if address.current}
		<img class="stored-photo__image" style:object-fit={fit} src={address.current} {alt} />
	{/if}
</span>

<style>
	.stored-photo {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		overflow: hidden;
		background: var(--color-accent-soft);
		border-radius: inherit;
	}

	.stored-photo__image {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		animation: rise 0.3s var(--ease-out);
	}
</style>
