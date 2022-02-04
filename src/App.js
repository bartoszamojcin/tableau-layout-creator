import './App.css';
import { useEffect, useState } from 'react';
import ControlPanel from './components/ControlPanel/ControlPanel';
import Container from './components/Container/Container';

const { tableau } = window;
const SIDE_PANEL_WIDHT = 180;
const SETTINGS_PREFIX = 'SETTINGS_PREFIX';
const EXTENSION_NAME = 'Extension for tests';

const App = () => {
	const [containers, setContainers] = useState([]);				// może stworzyć obiekt z pozycjami layoutu flexboxa - row column
	const [dashboard, setDashboard] = useState(null);
	const [inEditMode, setInEditMode] = useState(false);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		tableau.extensions.initializeAsync().then(() => {
			const dashboard = tableau.extensions.dashboardContent.dashboard;
			setDashboard(dashboard)
			const extension = dashboard.objects.find(object => object.name === EXTENSION_NAME);

			moveAndResizeTableauObject({							// resizing extensions to full size of dashboard + additional space for control panel
				objectId: extension.id,
				position: { x: 0, y: 0 },
				size: {
					width: dashboard.size.width + SIDE_PANEL_WIDHT,
					height: dashboard.size.height
				}
			})

			if (dashboard.objects.length > 1) {
				const containers = [];
				dashboard.objects.filter(object => object.name !== EXTENSION_NAME).forEach(object => {
					containers.push({ tableauObject: object });
				})
				setContainers(containers);
			}


			// tableau.extensions.settings.

			dashboard.addEventListener(tableau.TableauEventType.DashboardLayoutChanged, () => {
				// console.log('Dashboard layout changed');
				// console.log(dashboard);
			})

			dashboard.addEventListener(tableau.TableauEventType.WorkbookFormattingChanged, (sheets) => {
				console.log('Workbook formatting changed');
				console.log(sheets);
			})
		})
	}, []);

	const moveAndResizeTableauObject = (resizeData) => {
		tableau.extensions.dashboardContent.dashboard.moveAndResizeDashboardObjectsAsync([
			{
				dashboardObjectID: resizeData.objectId,
				x: resizeData.position.x,
				y: resizeData.position.y,
				width: resizeData.size.width,
				height: resizeData.size.height
			}
		]);
	}

	const setSetting = () => {
		for (let i = 0; i < 200; i++) {
			const obj = JSON.stringify({
				test: 'test',
				test1: 1,
				array: [{ name: 'test', padding: [1, 4, 5, 6], margin: [42, 5, 0, 4] }, { name: 'test2', padding: [1, 4, 5, 6], margin: [42, 5, 0, 4] }],
				array2: ['fsdfds', 'fsdfsd', 'fsdfsdf'],
				position: { width: 40, height: 24 },
				dupa: false,
				dupa1: {
					cycki: 'cycki',
					punia: 'penis'
				}
			})
			tableau.extensions.settings.set('testKey' + i, obj);
		}

		console.log('setting set');
	}

	const getSetting = () => {
		const setting = tableau.extensions.settings.get('test');
		console.log('setting get');
		console.log(setting);
	}

	const getAllSettings = () => {
		const settings = tableau.extensions.settings.getAll();
		console.log(settings);
		// let settingsObjs = [];
		for (let key in settings) {
			const obj = JSON.parse(settings[key]);
			console.log(obj);
		}
		console.log('all settings get');
		console.log(settings);
	}

	const saveSettings = () => {
		tableau.extensions.settings.saveAsync().then(result => {
			console.log('Settings saved.');
			// ... process results
		}).catch((error) => {
			// ...
			// ... code for error handling
		});
	}

	const toggleModes = () => {
		setInEditMode(prevState => !prevState);
	}

	const eraseAll = () => {
		const settings = tableau.extensions.settings.getAll();
		for (let key in settings) {
			tableau.extensions.settings.erase(key);
		}
		console.log('All settings erased');
	}

	// const addComponent = () => {
	// 	const updatedComponents = [...containers];
	// 	updatedComponents.push({
	// 		type: 'Container'
	// 	})
	// 	setContainers(updatedComponents);
	// }

	return (
		dashboard && <div className="App" style={{ height: dashboard.size.height + 'px', display: 'flex' }}>
			<div onMouseMove={event => setCursorPosition({ x: event.clientX, y: event.clientY })} style={{
				backgroundColor: 'transparent',
				width: dashboard.size.width + 'px',
				height: '100%',
				borderRight: '1px solid black',
				display: 'flex'
			}}>
				{/* <button onClick={setSetting}>Set setting</button>
				<button onClick={getSetting}>Get setting</button>
				<button onClick={getAllSettings}>Get all settings</button>
				<button onClick={saveSettings}>Save settings</button>
				<button onClick={eraseAll}>Erase all settings</button> */}

				{
					containers.map((container, index) => (
						<Container
							key={index}
							container={container}
							moveAndResizeTableauObject={moveAndResizeTableauObject}
						/>
					))
				}
				&nbsp;
			</div>
			<div style={{ height: '100%', width: SIDE_PANEL_WIDHT + 'px' }}>
				<ControlPanel
					cursorPosition={cursorPosition}
					onModesToggle={toggleModes}
				// onComponentAdd={addComponent}
				/>
			</div>
		</div>
	);
}

export default App;
