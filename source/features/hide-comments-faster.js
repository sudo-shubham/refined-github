import {h} from 'dom-chef';
import select from 'select-dom';
import delegate from 'delegate';
import * as pageDetect from '../libs/page-detect';

function handleMenuOpening(event) {
	const hideButton = select('.js-comment-hide-button', event.delegateTarget.parentElement);
	if (!hideButton) {
		// User unable to hide or menu already created
		return;
	}

	// Disable default behavior
	hideButton.classList.remove('js-comment-hide-button');

	const comment = hideButton.closest('.unminimized-comment');
	const form = select('.js-comment-minimize', comment);

	// Generate dropdown items
	for (const reason of select.all('[name="classifier"] :not([value=""])', comment)) {
		form.append(
			<button
				name="classifier"
				value={reason.value}
				class="dropdown-item btn-link"
				role="menuitem">
				{reason.textContent}
			</button>
		);
	}

	// Drop previous form controls
	select('.btn', form).remove();
	select('[name="classifier"]', form).remove();

	// Imitate existing menu
	form.classList.add('dropdown-menu', 'dropdown-menu-sw', 'text-gray-dark', 'show-more-popover', 'anim-scale-in');

	// Show menu on top of moreMenu when "Hide" is clicked
	// Hide it when moreMenu closes
	const moreMenu = hideButton.closest('details');
	hideButton.addEventListener('click', () => form.removeAttribute('hidden'));
	moreMenu.addEventListener('toggle', () => form.setAttribute('hidden', true));
	moreMenu.append(form);
}

export default function () {
	if (pageDetect.isPR() || pageDetect.isIssue() || pageDetect.isCommit() || pageDetect.isDiscussion()) {
		delegate('summary[aria-label="Show more options"]', 'click', handleMenuOpening);
	}
}
