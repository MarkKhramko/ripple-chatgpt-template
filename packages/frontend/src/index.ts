import { mount } from 'ripple';
// @ts-expect-error: known issue, we're working on it
import { App } from '#components/App.ripple';

import '../styles/main.css';

mount(App, {
	target: document.getElementById('root'),
});
