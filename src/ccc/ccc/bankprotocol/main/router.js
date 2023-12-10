//Jd2y+qhYYLi1p942tboURkQ+ooRjvy3AH+Ygu2cwCSb3KOlOXB9dt1y18UhjIoR4
import { asyncComponent } from 'nc-lightapp-front';
import List from '../list';

const card = asyncComponent(() => import(/* webpackChunkName: "ccc/ccc/bankprotocol/card/card" *//* webpackMode: "eager" */'../card'));

const routes = [
	{
		path: '/',
		component: List,
		exact: true
	},
	{
		path: '/list',
		component: List
	},
	{
		path: '/card',
		component: card
	}
	
];

export default routes;

//Jd2y+qhYYLi1p942tboURkQ+ooRjvy3AH+Ygu2cwCSb3KOlOXB9dt1y18UhjIoR4