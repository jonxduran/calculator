function HistoryItem(props) {
	return React.createElement(
		'div',
		{ className: props.cls },
		props.line
	);
}

function Button(props) {
	return React.createElement(
		'div',
		{ className: 'calc-button ' + props.type, onClick: function onClick() {
				return props.onClick();
			} },
		React.createElement(
			'span',
			null,
			props.val
		)
	);
}


class CalcApp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			calcHistory:[],
			dataLong: [0],
			dataQuery: [0],
			dataResult: 0,
			firstQuery :true,
			numEntry: true,
			mStore: '',
			decml: true
		};
	}


	numClick(nm) {
		let dataLongTemp = this.state.dataLong;
		let dataQueryTemp = this.state.dataQuery;
		let dataResultTemp = this.state.dataResult;

		if(this.state.firstQuery) {
			dataQueryTemp[0] = (dataQueryTemp[0] === 0) ? nm : (dataQueryTemp[0] + nm);
			dataLongTemp[0] = dataQueryTemp[0];
			dataResultTemp = dataQueryTemp[0];
		} else {
			dataQueryTemp[2] = (!dataQueryTemp[2]) ? nm : (dataQueryTemp[2] + nm);
			if(this.state.numEntry) {
				dataLongTemp[dataLongTemp.length-1] = dataQueryTemp[2]; 
			} else {
				dataLongTemp[dataLongTemp.length] = dataQueryTemp[2];
			}
			dataResultTemp = dataQueryTemp[2];
		}
		this.setState({ dataLong: dataLongTemp, dataQuery: dataQueryTemp, 
			dataResult: dataResultTemp, numEntry: true });
	}

	funcClick(fun) {
		let dataLongTemp = this.state.dataLong;
		let dataQueryTemp = this.state.dataQuery;
		let dataResultTemp = this.state.dataResult;

		if (this.state.numEntry) {
			dataLongTemp.push(fun);
			if (dataQueryTemp.length === 3) {
				let tempSolve = this.solve();
				dataQueryTemp = [tempSolve];
				dataResultTemp = tempSolve;
			}
		} else {
			dataLongTemp[dataLongTemp.length-1] = fun;
		}
		dataQueryTemp[1] = fun;

		this.setState({ dataLong: dataLongTemp, dataQuery: dataQueryTemp, 
			dataResult: dataResultTemp, firstQuery: false, numEntry: false, decml: true });
	}

	solve() {
		let q = '';
		this.state.dataQuery.forEach( qp => {
			q += qp;
		});
		let solq = eval(q);
		let roundq = +(solq).toFixed(3);
		return roundq;
	}

	equalsClick() {
		let dataLongTemp = this.state.dataLong;
		let dataQueryTemp = this.state.dataQuery;
		let dataResultTemp = this.state.dataResult;
		let calcHistoryTemp = this.state.calcHistory;

		if (dataQueryTemp.length === 3) {
			let tempSolve = this.solve().toString();
			dataResultTemp = tempSolve;
			calcHistoryTemp.push(dataLongTemp);
			dataLongTemp = [tempSolve];
			dataQueryTemp = [tempSolve];
			let decmlTemp = (tempSolve.indexOf('.') > -1) ? false : true;
			this.setState({ dataResult: dataResultTemp, calcHistory: calcHistoryTemp, decml: decmlTemp,
				dataLong: dataLongTemp, dataQuery: dataQueryTemp, firstQuery: true, numEntry: true });
		}
	}

	clrClick() {
		let dataQueryTemp = [0];
		let dataLongTemp = [];
		this.setState({ dataQuery: dataQueryTemp, dataLong: dataLongTemp, 
			dataResult: null, numEntry: true, firstQuery: true, decml: true });
	}

	msClick() {
		let dataQueryTemp = this.state.dataQuery;
		if (this.state.firstQuery) {
			let newMS = dataQueryTemp[0];
			this.setState({ mStore: newMS });
		} else if (dataQueryTemp.length > 1) {
			let newMS = this.state.dataResult;
			this.setState({ mStore: newMS });
		}
	}

	mrClick() {
		let recallMS = this.state.mStore;
		let dataQueryTemp = this.state.dataQuery;
		let dataLongTemp = this.state.dataLong;
		let firstQueryTemp = this.state.firstQuery;
		let numEntryTemp = this.state.numEntry;

		if(firstQueryTemp) {
			dataQueryTemp = [recallMS];
			dataLongTemp = [recallMS];
		} else if (dataQueryTemp.length > 1) {
			dataQueryTemp[2] = recallMS;
			if(numEntryTemp) {
				dataLongTemp[dataLongTemp.length-1] = recallMS;
			} else {
				dataLongTemp.push(recallMS);
				numEntryTemp = true;
			}
		}
		this.setState({ dataQuery: dataQueryTemp, dataLong: dataLongTemp, 
			dataResult: recallMS, numEntry: numEntryTemp, decml: true });
	}

	flipSign() {
		let dataQueryTemp = this.state.dataQuery;
		let dataLongTemp = this.state.dataLong;
		let evalTemp;

		if(dataQueryTemp.length === 1) {
			evalTemp = eval(-dataQueryTemp);
			dataQueryTemp = [evalTemp];
			dataLongTemp = [evalTemp];
		} else if (dataQueryTemp.length === 3) {
			evalTemp = eval(-dataQueryTemp[2]);
			dataQueryTemp[2] = evalTemp;
			dataLongTemp[dataLongTemp.length-1] = evalTemp;
		}
		this.setState({ dataQuery: dataQueryTemp, dataLong: dataLongTemp, dataResult: evalTemp });
	}

	decmlPt() {
		if(this.state.decml) {
			let dataQueryTemp = this.state.dataQuery;
			let dataLongTemp = this.state.dataLong;
			let tempDec;

			if(dataQueryTemp.length === 1) {
				tempDec = dataQueryTemp[0] + '.';
				dataQueryTemp = [tempDec];
				dataLongTemp = [tempDec];
			} else if (dataQueryTemp.length === 2) {
				tempDec = '0.';
				dataQueryTemp[2] = tempDec;
				dataLongTemp[2] = tempDec;
			} else if (dataQueryTemp.length === 3) {
				tempDec = dataQueryTemp[2] + '.';
				dataQueryTemp[2] = tempDec;
				dataLongTemp[2] = tempDec;
			}
			this.setState({ dataQuery: dataQueryTemp, dataLong: dataLongTemp, 
				dataResult: tempDec, decml: false, numEntry: true });
		}
	}

	render() {
		var _this2 = this;
		
		return React.createElement(
			'div',
			{ id: 'App' },
			React.createElement(
				'div',
				{ id: 'left' },
				React.createElement(
					'div',
					{ id: 'entryscreen' },
					React.createElement(
						'div',
						{ id: 'entryscreen-query' },
						this.state.dataLong.map(function (entry, index) {
							return React.createElement(
								'div',
								{ className: 'longquery', key: index },
								' ',
								entry,
								' '
							);
						})
					),
					React.createElement(
						'div',
						{ id: 'entryscreen-result' },
						React.createElement('div', { id: 'entryscreen-dataquery' }),
						React.createElement(
							'div',
							{ id: 'entryresult' },
							' ',
							this.state.dataResult,
							' '
						)
					)
				),
				React.createElement(
					'div',
					{ id: 'calcbuttons' },
					React.createElement(
						'div',
						{ className: 'calc-row' },
						React.createElement(Button, { val: 'C', onClick: function onClick() {
								return _this2.clrClick();
							} }),
						React.createElement(Button, { val: 'MS', onClick: function onClick() {
								return _this2.msClick();
							} }),
						React.createElement(Button, { val: 'MR', onClick: function onClick() {
								return _this2.mrClick();
							} }),
						React.createElement(Button, { val: '/', onClick: function onClick() {
								return _this2.funcClick('/');
							} })
					),
					React.createElement(
						'div',
						{ className: 'calc-row' },
						React.createElement(Button, { val: 7, type: 'num', onClick: function onClick() {
								return _this2.numClick('7');
							} }),
						React.createElement(Button, { val: 8, type: 'num', onClick: function onClick() {
								return _this2.numClick('8');
							} }),
						React.createElement(Button, { val: 9, type: 'num', onClick: function onClick() {
								return _this2.numClick('9');
							} }),
						React.createElement(Button, { val: 'x', onClick: function onClick() {
								return _this2.funcClick('*');
							} })
					),
					React.createElement(
						'div',
						{ className: 'calc-row' },
						React.createElement(Button, { val: 4, type: 'num', onClick: function onClick() {
								return _this2.numClick('4');
							} }),
						React.createElement(Button, { val: 5, type: 'num', onClick: function onClick() {
								return _this2.numClick('5');
							} }),
						React.createElement(Button, { val: 6, type: 'num', onClick: function onClick() {
								return _this2.numClick('6');
							} }),
						React.createElement(Button, { val: '-', onClick: function onClick() {
								return _this2.funcClick('-');
							} })
					),
					React.createElement(
						'div',
						{ className: 'calc-row' },
						React.createElement(Button, { val: 1, type: 'num', onClick: function onClick() {
								return _this2.numClick('1');
							} }),
						React.createElement(Button, { val: 2, type: 'num', onClick: function onClick() {
								return _this2.numClick('2');
							} }),
						React.createElement(Button, { val: 3, type: 'num', onClick: function onClick() {
								return _this2.numClick('3');
							} }),
						React.createElement(Button, { val: '+', onClick: function onClick() {
								return _this2.funcClick('+');
							} })
					),
					React.createElement(
						'div',
						{ className: 'calc-row' },
						React.createElement(Button, { val: '±', onClick: function onClick() {
								return _this2.flipSign();
							} }),
						React.createElement(Button, { val: 0, type: 'num', onClick: function onClick() {
								return _this2.numClick('0');
							} }),
						React.createElement(Button, { val: '.', onClick: function onClick() {
								return _this2.decmlPt();
							} }),
						React.createElement(Button, { val: '=', onClick: function onClick() {
								return _this2.equalsClick();
							} })
					)
				)
			),
			React.createElement(
				'div',
				{ id: 'right' },
				React.createElement(
					'div',
					{ className: 'right-title-container' },
					React.createElement(
						'div',
						null,
						'Memory'
					)
				),
				React.createElement(
					'div',
					{ className: 'right-big-container', id: 'right-memory-container' },
					React.createElement(
						'div',
						{ className: 'right-selectable' },
						' ',
						this.state.mStore,
						' '
					)
				),
				React.createElement(
					'div',
					{ className: 'right-title-container' },
					React.createElement(
						'div',
						null,
						'History'
					)
				),
				React.createElement(
					'div',
					{ className: 'right-big-container', id: 'right-history-container' },
					this.state.calcHistory.map(function (line, index) {
						return React.createElement(HistoryItem, { key: index, line: line, cls: 'right-selectable' });
					})
				)
			)
		);

	}

}


class Tester extends React.Component {
	render() {
		return React.createElement(
			'div',
			null,
			'hi'
		)
	}
}
