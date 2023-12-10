//j07c8riwYnz20MYibuDbtJgcZ0wjUlqBemknpoP//Vl5WRFYJRgFuRh3MgsbMrXd
import { ajax } from 'nc-lightapp-front';
import { ACTION_URL } from '../../constant/constant.js';

export default function(props, config, pks) {
	if (pks == null || pks.length == 0) {
		return;
	}
	let pageInfo = props.table.getTablePageInfo(this.tableId);
	let data = {
		pks: pks,
		pageCode: this.pageId
	};
	let that = this;
	ajax({
		url: ACTION_URL.PAGEQUERY,
		data: data,
		success: function(res) {
			props.table.setAllTableData(that.tableId, res.data.grid[that.tableId]);
		}
	});
}

//j07c8riwYnz20MYibuDbtJgcZ0wjUlqBemknpoP//Vl5WRFYJRgFuRh3MgsbMrXd