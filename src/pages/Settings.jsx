import React, {useState, useEffect} from 'react';
import {useRatio} from '../hooks';
import {Button, TextField, InputAdornment, Select, MenuItem} from '@material-ui/core';
import { Link
} from 'react-router-dom';

const InputGrams = props =>
	<TextField
		{...props} type='number'
		InputProps={{endAdornment: <InputAdornment position='end'>g</InputAdornment>}}
	/>

export const Rules = props => {
	const {waterToCoffee, coffeeToWater} = useRatio({water: 100, coffee: 6});
	const childStyle = {flex: '0 1 150px', margin: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', color: 'black', padding: 10};
	const parentStyle = {display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '90%'};
	const inputStyle = {width: '100%'};
	const [water, setWater] = useState('');
	const [coffee, setCoffee] = useState('');
	const [roast, setRoast] = useState('light');
	const [focusedField, setFocusedField] = useState();
	const handleFocus = s => _ => 
		s === 'water' ? setFocusedField('water') : setFocusedField('coffee');
	const handleBlur = _ => setFocusedField(undefined);

	useEffect(_ => {
		const field          = focusedField === 'coffee' ? coffee : water;
		const setter         = focusedField === 'coffee' ? setCoffee : setWater;
		const oppositeSetter = focusedField === 'coffee' ? setWater : setCoffee;
		const converter      = focusedField === 'coffee' ? coffeeToWater : waterToCoffee;
		if (field < 0) {
			alert('a horse walks up to a barista and says "can i get a coffee with no milk?". the barista says "we\'re all out of no milk, but we have no cream".');
			setter(field * -1);
		}
		oppositeSetter(converter(field));
		// eslint-disable-next-line
	}, [water, coffee, waterToCoffee, coffeeToWater])

	const setty = s => e => s(e.target.value);

	return (
		<div style={parentStyle}>
			<div style={childStyle}>
				water
				<InputGrams 
					value={water} onChange={setty(setWater)} autoFocus
					onBlur={handleBlur} onFocus={handleFocus('water')}
				/>
			</div>
			<div style={childStyle}>
				coffee
				<InputGrams 
					value={coffee} onChange={setty(setCoffee)} 
					onBlur={handleBlur} onFocus={handleFocus('coffee')}
				/>
				<div style={{height: 20}}/>
				<Link to={`/step?step=1&water=${water}&roast=${roast}`}>
					<Button tabIndex={-1} disabled={[0, '0'].includes(water)}>done</Button>
				</Link>
			</div>
			<div style={childStyle}>
				roast
				<Select style={inputStyle} value={roast} onChange={setty(setRoast)}>
					<MenuItem value={'light'}>Light</MenuItem>
					<MenuItem value={'medium'}>Medium</MenuItem>
					<MenuItem value={'dark'}>Dark</MenuItem>
				</Select>
			</div>
		</div>
	);
};
