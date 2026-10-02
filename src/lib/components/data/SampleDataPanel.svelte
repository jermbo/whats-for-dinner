<script>
	import { countSampleData, loadSampleData, removeSampleData } from '$lib/data/sample';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';

	const count = live(countSampleData, 0);
	const loaded = $derived(count.current > 0);

	async function add() {
		await loadSampleData();
		status.say('The sample data is added.');
	}

	async function remove() {
		await removeSampleData();
		status.say('The sample data is removed.');
	}
</script>

<section class="card" aria-labelledby="sample-title">
	<h2 class="card__title" id="sample-title">Sample data</h2>

	<p>
		Ingredients, recipes, pantry items, a menu, and cook history for tests. Your own data stays.
	</p>
	<p class="muted">
		A reset removes the changes that you made to the sample data. It also sets the date of the last
		pantry check to 5 days ago.
	</p>

	<p role="status">
		<strong>{loaded ? 'The sample data is on this device.' : 'There is no sample data.'}</strong>
	</p>

	<div class="cluster">
		<button class="button button--primary" type="button" onclick={add}>
			{loaded ? 'Reset the sample data' : 'Add the sample data'}
		</button>
		<button class="button button--danger" type="button" onclick={remove} disabled={!loaded}>
			Remove the sample data
		</button>
	</div>
</section>
