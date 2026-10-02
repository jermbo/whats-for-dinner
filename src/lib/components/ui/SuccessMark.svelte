<!-- A check mark that draws itself. It confirms an action, such as "Cooked". -->
<svg class="success-mark" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
	<circle class="success-mark__disc" cx="26" cy="26" r="24" />
	<path class="success-mark__check" d="M15 27l8 8 15-17" />
</svg>

<style>
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.success-mark {
		inline-size: 4rem;
		block-size: 4rem;
		animation: pop 0.6s var(--ease-spring) both;
	}

	.success-mark__disc {
		fill: var(--color-accent);
	}

	.success-mark__check {
		fill: none;
		stroke: var(--color-on-accent);
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 36;
		stroke-dashoffset: 36;
		animation: draw 0.4s 0.3s var(--ease-out) forwards;
	}
</style>
