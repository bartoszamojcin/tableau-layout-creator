import React, { useEffect, useRef } from 'react';

const Container = (props) => {
    useEffect(() => {
        fitTableauObjectInContainer();
    }, []);

    const containerElement = useRef(null);

    const fitTableauObjectInContainer = () => {
        const containerRect = containerElement.current.getBoundingClientRect();

        props.moveAndResizeTableauObject({
            objectId: props.container.tableauObject.id,
            position: { x: containerRect.x + 5, y: containerRect.y + 5 },
            size: {
                width: containerRect.width - 10,
                height: containerRect.height - 10
            }
        })
    }

    return <div
        ref={containerElement}
        style={{
            border: '1px solid black',
            minWidht: '400px',
            height: '400px',
            flex: '0 0 400px'
        }}>
    </div>;
};

export default Container;
