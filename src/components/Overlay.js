import React from 'react';

const Overlay = () => {
  const overlayText = (
    <div
      style={{
        transform: 'rotate(30deg)',
        opacity: 0.05,
        color: 'gray',
        fontSize: '72px',
        fontWeight: 'bold',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <div>Build Number</div>
      <div>000001</div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {[...Array(2)].map((_, index) => (
        <div key={index} style={{ margin: '50px' }}>
          {overlayText}
        </div>
      ))}
    </div>
  );
};

export default Overlay;


