import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';


function HistoryItem(props) {
	return <div className={props.cls}>{props.line}</div>;
}

function Button(props) {
	return <div className={'calc-button '+props.type} onClick={() => props.onClick()}>
		<span>{props.val}</span>
	</div>;
}


class App extends Component {
	
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
	
	static PropTypes = {
		calcHistory: PropTypes.array,
		dataLong: PropTypes.array,
		dataResult: PropTypes.number,
		numEntry: PropTypes.boolean
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
		
		return (
			<div id="App">

				<div id="left">
					
					<div id="entryscreen">
						
						<div id="entryscreen-query">
						{ this.state.dataLong.map( (entry, index) => 
							<div className='longquery' key={index}> {entry} </div>
						)} 
						</div>

						<div id="entryscreen-result">
							<div id='entryscreen-dataquery'></div>
							<div id='entryresult'> {this.state.dataResult} </div>
						</div>

					</div>

					<div id="calcbuttons">
						
						<div className="calc-row">
							<Button val={'C'} onClick={() => this.clrClick()} />
							<Button val={'MS'} onClick={() => this.msClick()} />
							<Button val={'MR'} onClick={() => this.mrClick()} />
							<Button val={'/'} onClick={() => this.funcClick('/')} />
						</div>

						<div className="calc-row">
							<Button val={7} type={'num'} onClick={() => this.numClick('7')} />
							<Button val={8} type={'num'} onClick={() => this.numClick('8')} />
							<Button val={9} type={'num'} onClick={() => this.numClick('9')} />
							<Button val={'x'} onClick={() => this.funcClick('*')} />
						</div>

						<div className="calc-row">
							<Button val={4} type={'num'} onClick={() => this.numClick('4')} />
							<Button val={5} type={'num'} onClick={() => this.numClick('5')} />
							<Button val={6} type={'num'} onClick={() => this.numClick('6',)} />
							<Button val={'-'} onClick={() => this.funcClick('-')} />
						</div>

						<div className="calc-row">
							<Button val={1} type={'num'} onClick={() => this.numClick('1')} />
							<Button val={2} type={'num'} onClick={() => this.numClick('2')} />
							<Button val={3} type={'num'} onClick={() => this.numClick('3')} />
							<Button val={'+'} onClick={() => this.funcClick('+')} />
						</div>

						<div className="calc-row">
							<Button val={'±'} onClick={() => this.flipSign()} />
							<Button val={0} type={'num'} onClick={() => this.numClick('0')} />
							<Button val={'.'} onClick={() => this.decmlPt()} />
							<Button val={'='} onClick={() => this.equalsClick()} />
						</div>
						
					</div>

				</div>

				<div id='right'>

					<div className='right-title-container'>
						<div>Memory</div>
					</div>

					<div className='right-big-container' id='right-memory-container'>
						<div className='right-selectable'> {this.state.mStore} </div>
					</div>

					<div className='right-title-container'>
						<div>History</div>
					</div>

					<div className='right-big-container' id='right-history-container'>
					{ this.state.calcHistory.map( (line, index) => 
						<HistoryItem key={index} line={line} cls='right-selectable' />
					)}
					</div>
					
				</div>
				
			</div>
		);
	}
}


export default App;
