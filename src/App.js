import React, { useState, useEffect } from 'react';

// A helper function to adjust a hex color's lightness
const adjustColorLightness = (hex, amount) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    const toHex = (c) => {
        const value = Math.min(255, Math.max(0, c + c * amount));
        return `00${Math.round(value).toString(16)}`.slice(-2);
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Define initial state values
const initialBaseColor = '#e0e0e0';
const initialShape = 'convex';
const initialSize = 250;
const initialDistance = 10;
const initialBlur = 20;
const initialIntensity = 0.15;
const initialRadius = 20;

// Main App component
const App = () => {
    // State to hold all the user-adjustable properties
    const [baseColor, setBaseColor] = useState(initialBaseColor);
    const [shape, setShape] = useState(initialShape);
    const [size, setSize] = useState(initialSize);
    const [distance, setDistance] = useState(initialDistance);
    const [blur, setBlur] = useState(initialBlur);
    const [intensity, setIntensity] = useState(initialIntensity);
    const [radius, setRadius] = useState(initialRadius);
    const [isCopied, setIsCopied] = useState(false);

    // Effect to update the CSS custom property on the root element
    useEffect(() => {
        document.documentElement.style.setProperty('--base-color', baseColor);
    }, [baseColor]);

    // Function to reset all controls to their initial values
    const handleReset = () => {
        setBaseColor(initialBaseColor);
        setShape(initialShape);
        setSize(initialSize);
        setDistance(initialDistance);
        setBlur(initialBlur);
        setIntensity(initialIntensity);
        setRadius(initialRadius);
    };

    // Function to calculate the box-shadow style based on current state
    const getNeumorphicStyle = () => {
        const lightColor = adjustColorLightness(baseColor, intensity * 2);
        const darkColor = adjustColorLightness(baseColor, -intensity * 2);
        let shadow1, shadow2;

        if (shape === 'concave') {
            shadow1 = `inset ${distance}px ${distance}px ${blur}px ${darkColor}`;
            shadow2 = `inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
        } else if (shape === 'flat') {
            shadow1 = `${distance}px ${distance}px ${blur}px ${darkColor}`;
            shadow2 = `-${distance}px -${distance}px ${blur}px ${lightColor}`;
        } else if (shape === 'pressed') {
            // "Pressed" state is a simpler, more uniform inset shadow
            shadow1 = `inset 5px 5px 10px ${darkColor}`;
            shadow2 = `inset -5px -5px 10px ${lightColor}`;
        } else { // convex
            shadow1 = `${distance}px ${distance}px ${blur}px ${darkColor}`;
            shadow2 = `-${distance}px -${distance}px ${blur}px ${lightColor}`;
        }

        return {
            borderRadius: `${radius}px`,
            boxShadow: `${shadow1}, ${shadow2}`,
            backgroundColor: baseColor,
            transition: 'all 0.3s ease-in-out'
        };
    };

    // Function to handle the copy button click
    const handleCopy = () => {
        const cssCode = `
.neumorphic-element {
    background: ${baseColor};
    width: ${size}px;
    height: ${size}px;
    border-radius: ${radius}px;
    box-shadow: ${getNeumorphicStyle().boxShadow};
}
        `.trim();
        
        const textArea = document.createElement('textarea');
        textArea.value = cssCode;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-inter">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />

            <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8 p-4">
                {/* Left Panel: Preview and Reset Button */}
                <div className="flex flex-col items-center flex-1 gap-8 p-8 bg-gray-200 rounded-3xl"
                    style={{ boxShadow: '10px 10px 20px #b5b5b5, -10px -10px 20px #ffffff' }}>
                     <div 
                        id="neumorphic-preview-box"
                        className="flex items-center justify-center text-xl font-semibold text-black/40"
                        style={{ ...getNeumorphicStyle(), width: `${size}px`, height: `${size}px` }}>
                        {shape}
                    </div>
                    <button
                        onClick={handleReset}
                        className="w-full lg:w-auto px-6 py-3 border-none rounded-xl bg-gray-200 text-gray-600 font-semibold cursor-pointer transition-all duration-200 ease-in-out
                                shadow-[6px_6px_12px_#c3c3c3,_-6px_-6px_12px_#ffffff] 
                                hover:shadow-[3px_3px_6px_#c3c3c3,_-3px_-3px_6px_#ffffff]
                                active:shadow-[inset_4px_4px_8px_#c3c3c3,_inset_-4px_-4px_8px_#ffffff] active:scale-98"
                    >
                        Reset All
                    </button>
                </div>

                {/* Right Panel: Controls and CSS Output */}
                <div className="flex flex-col flex-1 gap-8 p-8 bg-gray-200 rounded-3xl"
                    style={{ boxShadow: '10px 10px 20px #b5b5b5, -10px -10px 20px #ffffff' }}>
                    {/* Color Selection */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-700">Color Selection</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex-1 font-semibold text-gray-800 min-w-[100px]">Base Color:</label>
                            <input 
                                type="color" 
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-10 h-10 border-none rounded-lg cursor-pointer shadow-[2px_2px_5px_#b0b0b0,_-2px_-2px_5px_#ffffff] overflow-hidden"
                            />
                            <input 
                                type="text"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="flex-1 p-2 rounded-lg bg-gray-200 text-gray-800 shadow-[inset_2px_2px_5px_#bebebe,_inset_-2px_-2px_5px_#ffffff] min-w-[120px]"
                            />
                        </div>
                    </div>

                    {/* Shape Toggles */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-700">Shape</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {['flat', 'convex', 'concave', 'pressed'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setShape(s)}
                                    className={`flex-1 px-6 py-3 border-none rounded-xl font-semibold text-gray-600 capitalize cursor-pointer transition-all duration-200 ease-in-out
                                        bg-gray-200 shadow-[6px_6px_12px_#c3c3c3,_-6px_-6px_12px_#ffffff] 
                                        hover:shadow-[3px_3px_6px_#c3c3c3,_-3px_-3px_6px_#ffffff]
                                        ${shape === s ? 'active shadow-[inset_4px_4px_8px_#c3c3c3,_inset_-4px_-4px_8px_#ffffff] text-gray-900' : ''}`
                                    }
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shadow & Shape Controls */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-700">Shadow & Shape Controls</h3>
                        {[
                            { label: 'Size', value: size, setValue: setSize, min: 50, max: 400, step: 10 },
                            { label: 'Radius', value: radius, setValue: setRadius, min: 0, max: 100, step: 1 },
                            { label: 'Distance', value: distance, setValue: setDistance, min: 0, max: 50, step: 1 },
                            { label: 'Intensity', value: intensity, setValue: setIntensity, min: 0.01, max: 0.3, step: 0.01 },
                            { label: 'Blur', value: blur, setValue: setBlur, min: 0, max: 100, step: 1 }
                        ].map((control) => (
                            <div key={control.label} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                                <label className="flex-1 font-semibold text-gray-800">{control.label}:</label>
                                <input
                                    type="range"
                                    min={control.min}
                                    max={control.max}
                                    step={control.step}
                                    value={control.value}
                                    onChange={(e) => control.setValue(parseFloat(e.target.value))}
                                    className="flex-2 w-full h-2 rounded-md appearance-none bg-gray-300 outline-none shadow-[inset_2px_2px_5px_#bebebe,_inset_-2px_-2px_5px_#ffffff]
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gray-200 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[2px_2px_5px_#b0b0b0,_-2px_-2px_5px_#ffffff]
                                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-gray-200 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-[2px_2px_5px_#b0b0b0,_-2px_-2px_5px_#ffffff]"
                                />
                                <span className="text-gray-600 font-semibold min-w-[40px] text-right">{control.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* CSS Output */}
                    <div className="relative mt-4">
                        <h3 className="mb-4 text-xl font-bold text-gray-700">CSS Output</h3>
                        <pre 
                            className="bg-gray-100 p-4 rounded-xl whitespace-pre-wrap break-words font-mono text-sm text-gray-600 min-h-[100px] shadow-[inset_2px_2px_5px_#bebebe,_inset_-2px_-2px_5px_#ffffff]"
                        >
                            {`
.neumorphic-element {
    background: ${baseColor};
    width: ${size}px;
    height: ${size}px;
    border-radius: ${radius}px;
    box-shadow: ${getNeumorphicStyle().boxShadow};
}
                            `.trim()}
                        </pre>
                        {isCopied && (
                            <div className="absolute top-0 right-0 -mt-8 mr-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-lg animate-fade-in-out">
                                Copied!
                            </div>
                        )}
                        <button
                            onClick={handleCopy}
                            className="w-full px-6 py-3 mt-4 border-none rounded-xl bg-gray-200 text-gray-600 font-semibold cursor-pointer transition-all duration-200 ease-in-out
                                shadow-[6px_6px_12px_#c3c3c3,_-6px_-6px_12px_#ffffff] 
                                hover:shadow-[3px_3px_6px_#c3c3c3,_-3px_-3px_6px_#ffffff]
                                active:shadow-[inset_4px_4px_8px_#c3c3c3,_inset_-4px_-4px_8px_#ffffff] active:scale-98"
                        >
                            Copy CSS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;