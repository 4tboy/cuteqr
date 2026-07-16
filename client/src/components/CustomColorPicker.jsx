import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';

export default function CustomColorPicker({ color, onChange, presets = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const handleHexInputChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onChange(val);
    }
  };

  const handleColorChange = (newColor) => {
    setHexInput(newColor);
    onChange(newColor);
  };

  const handleEyedropper = async () => {
    if (!window.EyeDropper) return;
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      handleColorChange(result.sRGBHex);
    } catch (e) {
      // User canceled the eyedropper, do nothing
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-xl shadow-sm border border-black/10 hover:scale-110 transition-transform cursor-pointer shrink-0"
        style={{ backgroundColor: color }}
        title="Choose color"
      />

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-10 right-0 z-50 bg-[#1E2337] rounded-2xl shadow-xl border border-white/5 p-4 w-64 text-white">
          {/* react-colorful Picker */}
          <div className="mb-4">
            <HexColorPicker color={color} onChange={handleColorChange} style={{ width: '100%', height: '160px' }} />
          </div>

          {/* Hex Input & Eyedropper */}
          <div className="flex items-center gap-2 mb-4 bg-black/20 rounded-lg p-1.5 border border-white/5 w-full">
            <span className="text-xs text-white/50 pl-2 shrink-0">Hex</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              className="flex-1 min-w-0 w-full bg-transparent text-sm text-white font-mono focus:outline-none px-1"
            />
            {window.EyeDropper && (
              <button 
                onClick={handleEyedropper}
                className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Pick color from screen"
              >
                <Pipette className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Presets */}
          {presets.length > 0 && (
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60">Saved colors:</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {presets.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => handleColorChange(presetColor)}
                    className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
