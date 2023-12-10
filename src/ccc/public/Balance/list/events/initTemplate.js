//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz
import { createPage, ajax, base} from 'nc-lightapp-front';
import balance from './balance.js';

let tableId = 'table_area';
let pageId = '36610CCB';


export default function (json, props) {
	let data = balance.call(this, json);
	if (data.template) {
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
	}
}

function modifierMeta(props, meta) {
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		return item;
	});
	return meta;
}

//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz