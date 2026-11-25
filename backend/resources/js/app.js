

import Alpine from 'alpinejs';
import richTextEditor from './rich-text-editor';

window.Alpine = Alpine;
Alpine.data('richTextEditor', richTextEditor);

Alpine.start();
