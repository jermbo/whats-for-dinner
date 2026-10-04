<script>
	import { getPhoto } from '$lib/data/photo-storage';
	import { formatQuantity } from '$lib/util/format';

	/**
	 * The picture of one product, as a square. The photo is a blob in the database. The square
	 * reads it when it comes into view, and shows it through a temporary address.
	 * A product with no photo shows its package size, or the first letter of its name.
	 * The picture is decoration: the element around it gives the name of the product.
	 * @type {{ product: import('$lib/types').Product, unit?: import('$lib/types').Unit }}
	 */
	let { product, unit } = $props();

	/** @type {HTMLElement | undefined} */
	let box = $state();
	let seen = $state(false);
	let address = $state('');

	const text = $derived(
		unit && product.quantity > 0
			? formatQuantity(product.quantity, unit)
			: product.name.slice(0, 1).toUpperCase()
	);

	$effect(() => {
		if (!box || seen) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) seen = true;
		});
		observer.observe(box);
		return () => observer.disconnect();
	});

	$effect(() => {
		const id = product.photoId;
		if (!id || !seen) return;

		let made = '';
		let closed = false;
		getPhoto(id).then((photo) => {
			if (!photo || closed) return;
			made = URL.createObjectURL(photo.blob);
			address = made;
		});

		// The address is good only while the square is open. The square gives it back, so that the
		// browser can release the memory.
		return () => {
			closed = true;
			address = '';
			if (made) URL.revokeObjectURL(made);
		};
	});
</script>

<span class="product-photo" bind:this={box} aria-hidden="true">
	{#if address}
		<img class="product-photo__image" src={address} alt="" />
	{:else if !product.photoId}
		<span class="product-photo__text">{text}</span>
	{/if}
</span>

<style>
	.product-photo {
		display: grid;
		place-items: center;
		inline-size: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		background: var(--paper-deep);
		border-radius: inherit;
	}

	.product-photo__image {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.product-photo__text {
		padding: var(--space-1);
		font-size: 0.7rem;
		font-weight: 800;
		line-height: 1.1;
		text-align: center;
	}
</style>
