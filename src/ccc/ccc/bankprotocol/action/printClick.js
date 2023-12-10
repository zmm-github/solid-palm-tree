//81e8pN1UAJUY+gXnAY0hHMsLqiRBLNPuhvwm/gPuNyMUukrW7GjUuBs7Uldo8pME
import { print } from 'nc-lightapp-front';
/**
 * 打印
 * @param {*} key 
 */
export default function printClick(key, pks) {
	if (key == 'print') {
		print('pdf', '/nccloud/ccc/bankprotocol/print.do', {
			appcode: '36610CC',
			nodekey: '36610CCC', //模板节点标识
			oids: pks
		});
	}
	//输出
	if (key == 'printout') {
		this.refs.printOutput.open();
		this.setState(
			{
				outputData: {
					appcode: '36610CC',
					nodekey: '36610CCC', //模板节点标识
					outputType: 'output',
					oids: pks
				}
			},
			() => {
				this.refs.printOutput.open();
			}
		);
	}
}

//81e8pN1UAJUY+gXnAY0hHMsLqiRBLNPuhvwm/gPuNyMUukrW7GjUuBs7Uldo8pME