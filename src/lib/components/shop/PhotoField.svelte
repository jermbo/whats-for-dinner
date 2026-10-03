<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { shrinkPhoto } from '$lib/data/photo-capture';

	/**
	 * Takes the photo of a product. A tap opens the rear camera of the phone. The photo becomes
	 * small before the field gives it to the form, so the large file stays only in memory.
	 * @type {{ blob?: Blob | null }}
	 */
	let { blob = $bindable(null) } = $props();

	let address = $state('');
	let problem = $state('');

	// The field shows the small photo through a temporary address, and gives the address back.
	$effect(() => {
		if (!blob) return;
		const made = URL.createObjectURL(blob);
		address = made;
		return () => {
			address = '';
			URL.revokeObjectURL(made);
		};
	});

	/** @param {Event & { currentTarget: HTMLInputElement }} event */
	async function pick(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		try {
			blob = await shrinkPhoto(file);
			problem = '';
		} catch {
			problem = 'The app cannot read this photo. Take the photo again.';
		} finally {
			// The same file can be selected again.
			input.value = '';
		}
	}
</script>

<div class="stack stack--tight">
	<label class={['photo-field', address && 'photo-field--filled']}>
		<input
			class="visually-hidden"
			type="file"
			accept="image/*"
			capture="environment"
			onchange={pick}
		/>
		{#if address}
			<img class="photo-field__image" src={address} alt="The package of the product" />
			<span class="photo-field__again">Take the photo again</span>
		{:else}
			<Icon name="camera" />
			Take a photo of the package
		{/if}
	</label>

	{#if problem}
		<p class="card card--notice" role="alert">{problem}</p>
	{/if}
</div>

<style>
	.photo-field {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-block-size: 7rem;
		overflow: hidden;
		font-weight: 600;
		color: var(--color-accent-strong);
		background: var(--color-accent-soft);
		border: 1.5px dashed var(--color-accent-strong);
		border-radius: var(--radius);
		cursor: pointer;

		&.photo-field--filled {
			border-style: solid;
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}

	.photo-field__image {
		display: block;
		inline-size: 100%;
		max-block-size: 12rem;
		object-fit: contain;
	}

	/* A dark label on the photo, as on the photo of a recipe card. */
	.photo-field__again {
		position: absolute;
		inset-block-end: var(--space-2);
		inset-inline-end: var(--space-2);
		padding: var(--space-1) var(--space-3);
		font-size: 0.8rem;
		color: #ffffff;
		background: rgb(0 0 0 / 0.6);
		border-radius: var(--radius-pill);
	}
</style>
