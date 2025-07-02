# Canva-Style Design App

A comprehensive React Native design application built with Zustand, react-native-svg, and modern React Native patterns.

## Features

### 🎨 Design Tools
- **Shapes**: Add rectangles and circles by tapping the canvas
- **Text**: Add and edit text elements with custom fonts and colors
- **Images**: Insert images from your device gallery
- **Selection**: Select, move, and resize elements
- **Colors**: Change canvas background and element colors

### 🛠️ Advanced Features
- **Undo/Redo**: Full history management with undo/redo functionality
- **Export**: Save your designs as images
- **Persistence**: Automatic saving and loading of designs
- **Multi-selection**: Select multiple elements at once
- **Real-time Preview**: See changes as you make them

### 📱 User Interface
- **Clean Design**: Modern, intuitive interface
- **Toolbar**: Easy access to all design tools
- **Color Picker**: Comprehensive color selection with presets
- **Text Editor**: Full-featured text editing with font options

## Project Structure

```
├── app/
│   ├── CanvaDesignPage.tsx     # Main design interface
│   └── _layout.tsx            # Navigation setup
├── components/
│   ├── ColorPicker.tsx        # Color selection component
│   └── TextEditor.tsx         # Text editing interface
├── stores/
│   └── DesignStore.ts         # Zustand state management
└── DESIGN_APP_README.md       # This file
```

## Getting Started

1. **Navigate to Design Page**: Tap the "🎨 Open Design Editor" button on the home screen
2. **Choose a Tool**: Select from the bottom toolbar:
   - 👆 Select: Choose and move elements
   - ⬜ Rectangle: Add rectangular shapes
   - ⭕ Circle: Add circular shapes
   - 📝 Text: Add text elements
   - 🖼️ Image: Insert images

## How to Use

### Adding Elements
1. Select a tool from the bottom toolbar
2. Tap on the canvas where you want to place the element
3. The element will be created and automatically selected

### Editing Text
1. Add a text element using the text tool
2. Tap on the text element to open the text editor
3. Modify text content, font size, font family, and color
4. Save your changes

### Changing Colors
1. Tap the color palette icon in the top toolbar
2. Choose from preset colors or enter a custom hex color
3. Apply the color to the canvas background

### Selecting and Moving Elements
1. Use the select tool (hand icon)
2. Tap on any element to select it
3. Selected elements show a blue border
4. Drag to move elements (basic implementation)

### Deleting Elements
1. Select one or more elements
2. Tap the trash icon in the bottom toolbar
3. Elements will be permanently deleted

### Undo/Redo
- Use the undo/redo buttons in the top toolbar
- All actions are tracked in the history

### Exporting Designs
1. Tap the download icon in the top toolbar
2. The design will be exported as an image
3. The file path will be shown in an alert

### Saving Designs
- Designs are automatically saved to AsyncStorage
- Tap the save icon to manually save
- Designs persist between app sessions

## Technical Implementation

### State Management (Zustand)
- **Elements**: All shapes, text, and images
- **Selection**: Currently selected elements
- **History**: Undo/redo functionality
- **Tools**: Current active tool
- **Canvas**: Background color and settings

### Key Components
- **DesignStore**: Central state management with persistence
- **CanvaDesignPage**: Main design interface with canvas
- **ColorPicker**: Modal color selection with presets
- **TextEditor**: Comprehensive text editing interface

### Dependencies
- `zustand`: State management
- `react-native-svg`: SVG rendering for shapes and text
- `react-native-view-shot`: Design export functionality
- `expo-image-picker`: Image selection from gallery
- `@react-native-async-storage/async-storage`: Design persistence

## Future Enhancements

- **Advanced Dragging**: Improved drag and drop functionality
- **Resize Handles**: Visual resize controls for elements
- **Layers**: Z-index management for element stacking
- **Templates**: Pre-designed templates
- **Collaboration**: Real-time collaborative editing
- **Advanced Shapes**: More shape types (polygons, stars, etc.)
- **Effects**: Shadows, gradients, and other visual effects
- **Animations**: Element animations and transitions

## Troubleshooting

### Common Issues
1. **Images not loading**: Ensure you have proper permissions for photo library access
2. **Export not working**: Check that react-native-view-shot is properly configured
3. **Performance issues**: Large designs may slow down - consider element limits

### Permissions
The app requires:
- Photo library access for image insertion
- Storage permissions for design export

## Contributing

This is a comprehensive design app template that can be extended with:
- Additional shape types
- More text formatting options
- Advanced image editing features
- Custom brushes and drawing tools
- Template system
- Export to different formats

The modular architecture makes it easy to add new features while maintaining clean, maintainable code. 