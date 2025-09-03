# Video Editor Application

A comprehensive video editing application built with React, TypeScript, Zustand for state management, and Fabric.js for canvas manipulation.

## Canvas and Aspect Ratio Management

### Overview

The video editor features a responsive canvas that automatically adapts to different screen sizes while maintaining the selected video aspect ratio. The canvas covers all available space except for the sidebar and timeline.

### Key Features

#### 1. Responsive Canvas

- **Adaptive Layout**: Canvas automatically resizes to fill available space
- **Aspect Ratio Preservation**: Maintains the selected video resolution aspect ratio
- **Device Compatibility**: Works seamlessly across different screen sizes
- **Auto-fit**: Never overflows - shrinks and expands as needed

#### 2. Resolution Management

- **Multiple Aspect Ratios**: Support for 16:9, 9:16, 1:1, 4:3, and 21:9
- **Common Resolutions**: Predefined resolutions for each aspect ratio
- **Custom Resolutions**: Manual width/height input for custom needs
- **Export Resolution**: Maintains actual resolution settings for export

#### 3. Canvas Controls

- **Zoom Controls**: Zoom in/out with mouse or keyboard
- **Fit to Container**: Auto-fit canvas to available space
- **Scale Indicator**: Shows current zoom percentage
- **Resolution Display**: Shows current project resolution

### Keyboard Shortcuts

- `Cmd/Ctrl + +`: Zoom in
- `Cmd/Ctrl + -`: Zoom out
- `Cmd/Ctrl + 0`: Reset zoom (fit to container)

### Usage

#### Changing Resolution

1. Click on the "Export" panel in the right sidebar
2. Use the "Aspect Ratio" dropdown to select desired ratio
3. Choose from predefined resolutions or enter custom values
4. Canvas will automatically update to maintain the new aspect ratio

#### Canvas Behavior

- **Editing View**: Canvas scales to fit screen with aspect ratio preserved
- **Export**: Uses actual resolution settings regardless of canvas scale
- **Responsive**: Automatically adjusts when window is resized
- **Zoom**: Manual zoom control for detailed editing

## Features

### Core Functionality

- 🎬 **Timeline-based editing** with drag and drop support
- 🎨 **Canvas-based preview** with real-time feedback
- 📁 **Media management** for videos, images, and audio
- ✨ **Effects and filters** for visual enhancement
- 🎭 **Animations** with customizable properties
- ⌨️ **Keyboard shortcuts** for efficient editing
- ↩️ **Undo/Redo** functionality with history management
- 💾 **Project saving and loading**

### Supported Formats

- **Video**: MP4, WebM, AVI, MOV, WMV, FLV, MKV
- **Image**: JPG, JPEG, PNG, GIF, BMP, SVG, WebP
- **Audio**: MP3, WAV, OGG, AAC, M4A, FLAC
- **Export**: MP4, WebM, AVI

### Editor Tools

1. **Video Library** - Upload and manage video files
2. **Image Library** - Upload and manage image files
3. **Audio Library** - Upload and manage audio files
4. **Text Tool** - Add customizable text elements
5. **Effects Panel** - Apply visual effects and filters
6. **Animation Panel** - Add entrance/exit animations
7. **Export Panel** - Configure and export final video

## Architecture

### File Structure

```
app/editor/
├── components/          # React components
│   ├── video-editor.tsx     # Main editor component
│   ├── sidebar.tsx          # Tool selection sidebar
│   ├── timeline.tsx         # Timeline component
│   ├── navbar.tsx           # Top navigation bar
│   ├── canvas.tsx           # Canvas wrapper
│   └── property-panel.tsx   # Right panel for tools
├── hooks/              # Custom React hooks
│   ├── use-canvas.ts        # Canvas management
│   ├── use-keyboard-shortcuts.ts  # Keyboard shortcuts
│   └── use-timeline.ts      # Timeline functionality
├── store/              # Zustand state management
│   └── use-editor.ts        # Main editor store
├── types/              # TypeScript type definitions
│   └── index.ts             # All type definitions
├── utils/              # Utility functions
│   └── index.ts             # Helper functions
└── index.ts            # Main exports
```

### State Management (Zustand)

The application uses Zustand for predictable state management with the following key stores:

- **Canvas State**: Fabric.js canvas instance and background settings
- **Elements**: Video, image, audio, and text elements with positioning and timing
- **Timeline**: Current time, playback state, and duration
- **UI State**: Selected tools, panels, and menu options
- **History**: Undo/redo functionality with state snapshots
- **Project**: Project metadata and save/load functionality

### Key Components

#### VideoEditor

Main container component that orchestrates all sub-components and manages the overall layout.

#### Timeline

Handles temporal aspects of editing including:

- Playback controls
- Scrubbing and seeking
- Element timing visualization
- Zoom controls

#### Canvas

Fabric.js integration for visual editing:

- Object manipulation (move, resize, rotate)
- Layer management
- Real-time preview
- Selection handling

#### PropertyPanel

Context-sensitive panel that changes based on selected tool:

- File upload interfaces
- Text editing controls
- Effect configuration
- Export settings

## Usage

### Basic Editing Workflow

1. **Import Media**: Use the sidebar tools to upload videos, images, or audio
2. **Add to Timeline**: Drag media from the library to the timeline
3. **Position Elements**: Use the canvas to position and resize elements
4. **Apply Effects**: Select elements and apply effects from the effects panel
5. **Add Animations**: Configure entrance/exit animations
6. **Export**: Configure export settings and generate final video

### Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo
- `Ctrl/Cmd + D`: Duplicate selected element
- `Delete/Backspace`: Remove selected element
- `Space`: Play/Pause
- `Escape`: Stop playback

### Timeline Controls

- **Click**: Seek to position
- **Drag**: Scrub through timeline
- **Scroll**: Zoom in/out
- **+/-**: Zoom controls

## Technical Details

### Dependencies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Zustand**: State management
- **Fabric.js**: Canvas manipulation
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **@ffmpeg/ffmpeg**: Video processing (planned)

### Performance Considerations

- Canvas operations are optimized with requestAnimationFrame
- Timeline rendering uses virtualization for large projects
- State updates are batched to prevent unnecessary re-renders
- File uploads create object URLs for memory efficiency

### Browser Compatibility

- Modern browsers with Canvas and File API support
- Hardware acceleration recommended for smooth playback
- Minimum 4GB RAM recommended for HD video editing

## Development

### Getting Started

1. Install dependencies: `pnpm install`
2. Run development server: `pnpm dev`
3. Open http://localhost:3000/editor

### Adding New Features

1. **New Tool**: Add to sidebar items and create corresponding panel
2. **New Effect**: Add to effects array and implement in FabricUtils
3. **New Animation**: Add to animations array and implement timing logic
4. **New Format**: Add to supported formats and update file validation

### Contributing

1. Follow the existing TypeScript patterns
2. Use Zustand for state management
3. Add proper type definitions
4. Include keyboard shortcuts for new features
5. Update this README for new functionality

## Future Enhancements

### Planned Features

- [ ] Audio waveform visualization
- [ ] Advanced text styling (fonts, shadows, outlines)
- [ ] Transition effects between clips
- [ ] Multi-track audio editing
- [ ] Green screen/chroma key support
- [ ] Motion tracking
- [ ] 3D transformations
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Template system
- [ ] Batch processing

### Performance Optimizations

- [ ] WebGL rendering for effects
- [ ] Web Workers for heavy processing
- [ ] Progressive loading for large files
- [ ] Memory management improvements
- [ ] Caching strategies

## License

This project is part of a larger video editing suite and follows the same licensing terms.
