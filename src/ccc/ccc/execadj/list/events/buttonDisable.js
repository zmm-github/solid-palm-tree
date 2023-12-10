//QCRu/PDcDggPUTbrjwK8iP3vFOxyLtNrXXJbRp6K0s9+Bczqdl+fqoaxvFDR1+7D
// 按钮禁用控制
export function buttonDisabled() {
	let selected = this.props.table.getCheckedRows(this.tableId);
	let subStatus = selected.filter((item) => {
		if (item.data.values.vbillstatus.value === '-1') {
			return item;
		}
	});
	let withdrawStatus = selected.filter((item) => {
		if ((item.data.values.vbillstatus.value === '1') | (item.data.values.vbillstatus.value === '3')) {
			return item;
		}
	});
	if (selected.length > 1) {
		let delAndSubVisibleFlag = subStatus.length === selected.length ? true : false;
		let withdrawVisilbeFlag = withdrawStatus.length === selected.length ? true : false;
		this.props.button.setButtonDisabled([ 'Commit', 'UnCommit', 'Print', 'OutPut', 'copy' ], false);
		this.props.button.setButtonDisabled([ 'ApproveDetail', 'Protocol', 'Attachment', 'Delete' ], true);
		if (delAndSubVisibleFlag) this.props.button.setButtonDisabled([ 'Delte', 'Commit' ], false);
		if (withdrawVisilbeFlag) this.props.button.setButtonDisabled([ 'UnCommit' ]);
	} else if (selected.length == 1) {
		let status = selected[0].data.values.vbillstatus.value;
		switch (status) {
			case '-1':
				this.props.button.setButtonDisabled(
					[ 'Delete', 'Commit', 'ApproveDetail', 'Protocol', 'Print', 'OutPut', 'Attachment', 'copy' ],
					false
				);
				this.props.button.setButtonDisabled([ 'UnCommit' ], true);
				break;
			case '1':
				this.props.button.setButtonDisabled(
					[ 'UnCommit', 'ApproveDetail', 'Protocol', 'Print', 'OutPut', 'Attachment', 'copy' ],
					false
				);
				this.props.button.setButtonDisabled([ 'Delete', 'Commit' ], true);
				break;
			case '2':
				this.props.button.setButtonDisabled(
					[ 'ApproveDetail', 'Protocol', 'Print', 'OutPut', 'Attachment', 'copy' ],
					false
				);
				this.props.button.setButtonDisabled([ 'Delete', 'Commit', 'UnCommit' ], true);
				break;
			case '3':
				this.props.button.setButtonDisabled(
					[ 'UnCommit', 'ApproveDetail', 'Protocol', 'Print', 'OutPut', 'Attachment', 'copy' ],
					false
				);
				this.props.button.setButtonDisabled([ 'Delete', 'Commit' ], true);
				break;
		}
	} else if (selected.length < 1) {
		this.props.button.setButtonDisabled(
			[ 'Delete', 'Commit', 'UnCommit', 'ApproveDetail', 'Protocol', 'Print', 'OutPut', 'Attachment', 'copy' ],
			true
		);
	}
}

//QCRu/PDcDggPUTbrjwK8iP3vFOxyLtNrXXJbRp6K0s9+Bczqdl+fqoaxvFDR1+7D