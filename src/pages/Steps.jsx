import React, {useState} from 'react';
import {Button} from '@material-ui/core';
import {
	Link, Redirect
} from 'react-router-dom';
import {stepVarieties} from '../v60';
import {Layout} from '../App';
import {useSeconds, useSearch} from '../hooks';

const getStep = variety => n => water => roast => {
	const maybeDesc = stepVarieties[variety][n - 1];
	try {
		return maybeDesc (water) (roast);
	} catch {
		return maybeDesc;
	}
};

const buttonStyle = {color: 'black', textDecoration: 'none', background: 'white', width: 'max-content', margin: 10, display: 'grid', placeItems: 'center'};

export const ButtonLink = props => {
	const {to, children} = props;
	const style = Object.assign({}, buttonStyle, props.style);
	return (
		<div style={style}>
			<Link to={to}>
				<Button> {children} </Button>
			</Link>
		</div>
	);
};

const containerStyle = {
	display: 'flex',
	flexFlow: 'row wrap',
	alignContent: 'space-evenly',
	alignItems: 'center',
	justifyContent: 'space-evenly',
	width: '100%'
};

const mode = 'hoffmann';

export const Step = props => {
	const {seconds, pause, start, isRunning} = useSeconds();
	const {step,water,roast} = useSearch();
	const [blooming, setBlooming] = useState(false);
	const beginBlooming = _ => setBlooming(true);
	const nextUrl = `/step?step=${step+1}&water=${water}&roast=${roast}`;
	const lastUrl = `/step?step=${step-1}&water=${water}&roast=${roast}`;
	const currentDesc = getStep(mode)(step)(water)(roast);
	const handleClickTimer = _ => {
		if (isRunning) pause();
		start();
	};
	if (!currentDesc) return <Redirect to='/done'/>;
	return (
		<Layout next={nextUrl} from={lastUrl}>
			{blooming ? <iframe style={{position: 'fixed', left: 69, top: 69}} src="https://www.youtube.com/embed/IxBQ8Er8DYc" frameBorder="0" allow="autoplay" title='bloom'/> : null}
			<div style={containerStyle}>
				<div style={{width: '60%', height: '100%', display: 'grid', placeItems: 'center'}}>
					<div style={{maxWidth: '90%'}}>
						{currentDesc.split(' ').flatMap(s => s === 'bloom' ? [<span onClick={beginBlooming}>bloom</span>, ' '] : [s, ' '])}
					</div>
					<div style={buttonStyle}>
						<Button onClick={handleClickTimer}>
							{isRunning || seconds ? seconds : 'start timer'}
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	);
};
