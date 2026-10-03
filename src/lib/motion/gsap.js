// GSAP and the plugins that the app uses. Import GSAP from this file, so that each plugin is
// registered one time. GSAP is for gestures and physics. CSS does the simple changes.
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

export { gsap, Draggable, InertiaPlugin };
