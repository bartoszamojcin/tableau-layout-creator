import { Button } from '@mui/material';
import React from 'react';

const ControlPanel = (props) => {
	return <div>
		<div>X: {props.cursorPosition.x}, Y: {props.cursorPosition.y}</div>
		<Button onClick={props.onModesToggle}>Toggle mode</Button>
		{/* <Button onClick={props.onComponentAdd}>Add container</Button> */}
	</div>
};

export default ControlPanel;
