import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const AnswerTable = ({
	question,
	datas,
	answer,
	children
}) =>
	<div styleName="test_content">
		{	children[1] }
		<table>
			<thead styleName="test_head">
				<tr>
					<td colSpan="2" rowSpan="2">請針對以下各項描述判斷符合你的程度</td>
					<td><div>完全不符合</div>0%</td>
					<td><div>不符合</div>20%</td>
					<td><div>有點不符合</div>40%</td>
					<td><div>有點符合</div>60%</td>
					<td><div>符合</div>80%</td>
					<td><div>非常符合</div>100%</td>
				</tr>
				<tr>
					<td>1</td>
					<td>2</td>
					<td>3</td>
					<td>4</td>
					<td>5</td>
					<td>6</td>
				</tr>
			</thead>
			<tbody>
				{
						datas.map((data, key) => (
							<tr key={ key }>
								<td>{data[question]}</td>
								<td>{data.QST_DESC}</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}1` } type="radio" name={ `q${data.QST_ID}` } value="1"
									/>
									<label htmlFor={ `${key + data.QST_ID}1` } onClick={ answer.bind(this, data.index, 1) }>
										<div styleName="check" />
									</label>
								</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}2` } type="radio" name={ `q${data.QST_ID}` } value="2"
									/>
									<label htmlFor={ `${key + data.QST_ID}2` } onClick={ answer.bind(this, data.index, 2) }>
										<div styleName="check" />
									</label>
								</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}3` } type="radio" name={ `q${data.QST_ID}` } value="3"
									/>
									<label htmlFor={ `${key + data.QST_ID}3` } onClick={ answer.bind(this, data.index, 3) }>
										<div styleName="check" />
									</label>
								</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}4` } type="radio" name={ `q${data.QST_ID}` } value="4"
									/>
									<label htmlFor={ `${key + data.QST_ID}4` } onClick={ answer.bind(this, data.index, 4) }>
										<div styleName="check" />
									</label>
								</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}5` } type="radio" name={ `q${data.QST_ID}` } value="5"
									/>
									<label htmlFor={ `${key + data.QST_ID}5` } onClick={ answer.bind(this, data.index, 5) }>
										<div styleName="check" />
									</label>
								</td>
								<td styleName="radioGroup">
									<input
										key={ key + data.QST_ID } id={ `${key + data.QST_ID}6` } type="radio" name={ `q${data.QST_ID}` } value="6"
									/>
									<label htmlFor={ `${key + data.QST_ID}6` } onClick={ answer.bind(this, data.index, 6) }>
										<div styleName="check" />
									</label>
								</td>
							</tr>
						))
					}
			</tbody>
		</table>
		<div styleName="button_div">
			{ children[0] }
		</div>
	</div>;

export default CSSModules(AnswerTable, css);
