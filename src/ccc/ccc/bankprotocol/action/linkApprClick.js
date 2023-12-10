//Y7lnAVsOJUrFiEwlEuz9ht4vuuXvSYkYq6z/Ssu2DSvQOZLlVn3yn7IPxnR6txIC
import { toast } from 'nc-lightapp-front';
import { TEMPLATE } from '../constant/constant';
/**
 * 联查审批详情
 * @param {*} props 
 */
export default function linkApprClick(props, key) {
	if (key == 'list') {
		let approvemsgData = this.props.table.getCheckedRows(this.tableId);
		//数据校验
		if (approvemsgData.length != 1) {
			toast({
				color: 'warning',
				content: this.state.json['36610CC-000000'] /* 国际化处理： 请选择单条数据，查看审批意见!*/
			});
			return;
		}
		//处理选择数据
		let billversionpk;
		let approve_billtype;
		approvemsgData.forEach((val) => {
			if (val.data.values.pk_protocol && val.data.values.pk_protocol.value) {
				billversionpk = val.data.values.pk_protocol.value;
			}
			if (val.data.values.pk_trantypecode && val.data.values.pk_trantypecode.value) {
				approve_billtype = val.data.values.pk_trantypecode.value;
			}else{
				approve_billtype = '36X1';
			}
		});
		if (billversionpk) {
			this.setState({
				showApprove: true,
				billType: approve_billtype, //单据类型
				billID: billversionpk //单据pk
			});
		}
	} else if (key == 'card') {
		let pk_link = props.form.getFormItemsValue(TEMPLATE.FORM_ID, 'pk_protocol').value; //单据pk
		let pk_trantypecode = props.form.getFormItemsValue(TEMPLATE.FORM_ID, 'pk_trantypecode').value; //单据类型
		let billtype = pk_trantypecode?pk_trantypecode:'36X1';
		this.setState(
			{
				billid: pk_link, //单据pk
				billtype: billtype
			},
			() => {
				this.setState({
					showAppr: true
				});
			}
		);
	}
}

//Y7lnAVsOJUrFiEwlEuz9ht4vuuXvSYkYq6z/Ssu2DSvQOZLlVn3yn7IPxnR6txIC