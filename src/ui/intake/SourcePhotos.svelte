<script lang="ts">
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import Button from '../parts/Button.svelte';
	import HiddenName from '../parts/HiddenName.svelte';

	type Props = {
		// The photos stay on the device until "Save", so that intake with no "Save" leaves nothing.
		photos: Blob[];
		// The names of the source photos that the note has. "Remove" takes only the link away: the
		// plugin does not delete a file.
		kept: string[];
		urlOf: (name: string) => string | null;
	};
	let { photos = $bindable(), kept = $bindable(), urlOf: keptUrlOf }: Props = $props();

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
	{#if kept.length || photos.length}
		<HiddenName id="{uid}-list" text="Source photos" />
		<ul class="wfd-sources__list" aria-labelledby="{uid}-list">
			{#each kept as name (name)}
				{@const src = keptUrlOf(name.split('|')[0])}
				<li class="wfd-sources__photo" transition:fade={{ duration }}>
					{#if src}<img {src} alt={name} />{/if}
					<Button kind="link" onclick={() => (kept = kept.filter((one) => one !== name))}>Remove</Button>
				</li>
			{/each}
			{#each photos as photo, at (photo)}
				<li class="wfd-sources__photo" transition:fade={{ duration }} onoutroend={() => free(photo)}>
					<img src={urlOf(photo)} alt="New source photo {at + 1}" />
					<Button kind="link" onclick={() => remove(photo)}>Remove</Button>
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
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	.wfd-sources__list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-stack);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-sources__photo {
		display: grid;
		gap: var(--wfd-space-tight);
		justify-items: center;

		& img {
			inline-size: 96px;
			block-size: 96px;
			border-radius: var(--wfd-radius-button);
			object-fit: cover;
		}
	}

	/* The label is the button. The file field of the browser is hidden, but a screen reader has it. */
	.wfd-sources__take {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		color: var(--wfd-color-text);
		font-weight: 700;
		cursor: pointer;

		&:focus-within {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
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
