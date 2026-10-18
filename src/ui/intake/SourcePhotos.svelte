<script lang="ts">
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	// The photos stay on the device until "Save", so that intake with no "Save" leaves nothing.
	let { photos = $bindable() }: { photos: Blob[] } = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// A small image of each photo. The address of each one is freed when its fade ends, so that
	// the image shows until it is gone.
	const urls = new Map<Blob, string>();
	const urlOf = (photo: Blob) => {
		if (!urls.has(photo)) urls.set(photo, URL.createObjectURL(photo));
		return urls.get(photo)!;
	};
	const remove = (photo: Blob) => (photos = photos.filter((one) => one !== photo));
	function free(photo: Blob) {
		URL.revokeObjectURL(urls.get(photo) ?? '');
		urls.delete(photo);
	}
	onDestroy(() => urls.forEach((url) => URL.revokeObjectURL(url)));

	function onchange(event: Event) {
		const field = event.currentTarget as HTMLInputElement;
		photos = [...photos, ...(field.files ?? [])];
		field.value = '';
	}
</script>

<div class="wfd-sources">
	{#if photos.length}
		<ul class="wfd-sources__list" aria-label="Source photos">
			{#each photos as photo, at (photo)}
				<li class="wfd-sources__photo" transition:fade={{ duration }} onoutroend={() => free(photo)}>
					<img src={urlOf(photo)} alt="Source photo {at + 1}" />
					<button class="wfd-sources__remove" type="button" onclick={() => remove(photo)}>
						Remove
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	<label class="wfd-sources__take" for="{uid}-photo">
		Add a photo of the source
		<!-- No "capture": the phone then offers the camera and its photos, such as a photo of a cookbook. -->
		<input
			id="{uid}-photo"
			class="wfd-sources__field"
			type="file"
			accept="image/*"
			multiple
			{onchange}
		/>
	</label>
</div>

<style>
	.wfd-sources {
		display: grid;
		gap: 10px;
		justify-items: start;
	}

	.wfd-sources__list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-sources__photo {
		display: grid;
		gap: 4px;
		justify-items: center;

		& img {
			inline-size: 96px;
			block-size: 96px;
			border-radius: var(--wfd-radius-button);
			object-fit: cover;
		}
	}

	button.wfd-sources__remove {
		block-size: auto;
		min-block-size: 36px;
		padding: 0 8px;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink-2);
		font-family: inherit;
		font-size: 14px;
		font-weight: 700;
		text-decoration: underline;
		cursor: pointer;
	}

	/* The label is the button. The file field of the browser is hidden, but a screen reader has it. */
	.wfd-sources__take {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-block-size: 50px;
		padding: 0 20px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		color: var(--wfd-ink);
		font-weight: 700;
		cursor: pointer;

		&:focus-within {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-sources__field {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
</style>
