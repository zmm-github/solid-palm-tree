//Du8U2jnUGKqs+Ih/vkVOrL1kxSKWvJkAF1+ZH3gaw8hTTTtSlLAIHhTlKvoYt+tf
import { ajax, toast } from 'nc-lightapp-front';
import { ACTION_URL } from '../constant/constant';
/**
 * 联查预算
 * 
 * @param {*} props 
 */
export default function linkNtbClick(props, key, selectData) {
	let pk;
	if (key == 'card') {
		pk = props.form.getFormItemsValue(this.formId, this.billPK).value;
	} else if (key == 'list') {
		//let selectData = props.table.getCheckedRows(tableCode);
		selectData.forEach((val) => {
			if (val.data.values[this.billPK] && val.data.values[this.billPK].value != null) {
				pk = val.data.values[this.billPK].value;
			}
		});
	}
	ajax({
		url: ACTION_URL.LINKNTB,
		data: { pk },
		success: (res) => {
			let { data } = res;
			if (data.hint) {
				toast({ content: data.hint, color: 'warning' });
				return;
			} else {
				this.setState({
					showNtbDetail: true,
					ntbdata: data
				});
			}
		}
	});
}

//Du8U2jnUGKqs+Ih/vkVOrL1kxSKWvJkAF1+ZH3gaw8hTTTtSlLAIHhTlKvoYt+tf