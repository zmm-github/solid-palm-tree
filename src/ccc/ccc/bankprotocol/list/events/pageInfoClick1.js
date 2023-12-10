//EqGSVpt0lX3bK5rpYEbudnq6LqGUfsR71io7gGUGvzp+Z5+iHvhK7ewkE+eZqhwT
import { ajax } from 'nc-lightapp-front';
import { ACTION_URL } from '../../constant/constant.js';

export default function(props, id) {
	let pks = id;
	if (pks == null || pks.length == 0) {
		return;
	}
	let data = {
		pks: pks,
		pageCode: '36610CCL_Link'
	};
	ajax({
		url: ACTION_URL.PAGEQUERY,
		data: data,
		success: function(res) {
			console.log(res.data);
			props.table.setAllTableData('table', res.data.grid['table']);
		}
	});
}

//EqGSVpt0lX3bK5rpYEbudnq6LqGUfsR71io7gGUGvzp+Z5+iHvhK7ewkE+eZqhwT