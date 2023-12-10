//MCUJLSpAzKlqHOOf5vIExF0JsUAxD+ghj4lkyIpkiQhV1OWJN9FSrMdahVdEPjip
import { ajax } from 'nc-lightapp-front';

export function formBeforeEvent(props, moduleId, key, value, data) {
	const currType = [ 'glcrate', 'gllcrate' ];
	if (currType.includes(key)) {
		let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value; //财务组织
		let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value; //源币
		let rateType = '';
		if (key === 'glcrate') {
			rateType = 'grouprate';
		} else if (key === 'gllcrate') {
			rateType = 'globalrate';
		}
		const CurrtypeData = {
			pk_org: pk_org,
			pk_currtype: pk_currtype,
			ratekey: rateType
		};
		let editTable = getBeforeEventCurrtype.call(this, CurrtypeData).then((res) => {
			if (res.success) {
                props.form.setFormItemsDisabled(this.formId, { 
                    key: res.data ? false : true
                });
                return res.data ? true : false;
			} else {
				return false;
			}
		});
		return editTable;
	} else {
		return true;
	}
}

/**
 * 获取编辑前事件接口
 *
 * @param {*} data - 必传。
 */
function getBeforeEventCurrtype(data) {
	return new Promise((resolve, reject) => {
		ajax({
			url: '/nccloud/ccc/common/currtypeQuery.do',
			async: false,
			data,
			success: (res) => {
				resolve(res);
			},
			error: (res) => {
				toast({ color: 'danger', content: res.message });
				reject(res);
			}
		});
	});
}

//MCUJLSpAzKlqHOOf5vIExF0JsUAxD+ghj4lkyIpkiQhV1OWJN9FSrMdahVdEPjip