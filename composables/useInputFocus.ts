import { ref, readonly, onMounted, onBeforeUnmount } from 'vue';

const focused = ref(false);

function isEditableElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (!tag) return false;
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'a') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  const role = el.getAttribute && el.getAttribute('role');
  if (role === 'textbox') return true;
  return false;
}

export function useInputFocus() {
  // ensure this runs only once per app lifecycle
  if (process.client) {
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      focused.value = isEditableElement(target);
    };

    const onFocusOut = (_e: FocusEvent) => {
      // Defer check because activeElement may update slightly after blur
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        focused.value = isEditableElement(active);
      }, 0);
    };

    onMounted(() => {
      window.addEventListener('focusin', onFocusIn, true);
      window.addEventListener('focusout', onFocusOut, true);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('focusin', onFocusIn, true);
      window.removeEventListener('focusout', onFocusOut, true);
    });
  }

  return { isInputFocused: readonly(focused) };
}
