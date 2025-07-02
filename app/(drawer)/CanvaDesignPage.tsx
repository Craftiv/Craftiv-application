import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Polygon, Rect, Image as SvgImage, Text as SvgText } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

import ColorPicker from '../../components/ColorPicker';
import ShapePicker from '../../components/ShapePicker';
import TextEditor from '../../components/TextEditor';
import { useDesigns } from '../../contexts/DesignContext';
import { Element, ImageElement, Shape, TextElement, Tool, useDesignStore } from '../../stores/designStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CANVAS_WIDTH = screenWidth;
const CANVAS_HEIGHT = screenHeight * 0.7;

const generateId = () => Math.random().toString(36).substr(2, 9);

// Resize handle positions
type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left';

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  elementStartX: number;
  elementStartY: number;
  elementId: string | null;
}

interface ResizeState {
  isResizing: boolean;
  handle: ResizeHandle | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  elementId: string | null;
}

export default function CanvaDesignPage() {
  const {
    elements,
    selectedElements,
    canvasBackgroundColor,
    currentTool,
    addElement,
    selectElement,
    clearSelection,
    moveElement,
    resizeElement,
    deleteSelectedElements,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    loadDesign,
    clearDesign,
    updateElement,
    setCurrentTool,
  } = useDesignStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<'canvas' | 'element'>('canvas');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
    elementId: null,
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    elementId: null,
  });
  const [showShapePicker, setShowShapePicker] = useState(false);
  
  const canvasRef = useRef<View>(null);
  const viewShotRef = useRef<ViewShot>(null);

  // Load design on mount
  useEffect(() => {
    // Don't auto-load design - let user choose what to load
    // loadDesign();
  }, []);

  // Check if a point is within a resize handle
  const getResizeHandleAtPoint = (x: number, y: number, element: Element): ResizeHandle | null => {
    const handleSize = 12;
    const { x: elX, y: elY, width, height } = element;
    
    // Check corner handles
    if (x >= elX - handleSize && x <= elX + handleSize && y >= elY - handleSize && y <= elY + handleSize) {
      return 'top-left';
    }
    if (x >= elX + width - handleSize && x <= elX + width + handleSize && y >= elY - handleSize && y <= elY + handleSize) {
      return 'top-right';
    }
    if (x >= elX - handleSize && x <= elX + handleSize && y >= elY + height - handleSize && y <= elY + height + handleSize) {
      return 'bottom-left';
    }
    if (x >= elX + width - handleSize && x <= elX + width + handleSize && y >= elY + height - handleSize && y <= elY + height + handleSize) {
      return 'bottom-right';
    }
    
    // Check edge handles
    if (x >= elX && x <= elX + width && y >= elY - handleSize && y <= elY + handleSize) {
      return 'top';
    }
    if (x >= elX + width - handleSize && x <= elX + width + handleSize && y >= elY && y <= elY + height) {
      return 'right';
    }
    if (x >= elX && x <= elX + width && y >= elY + height - handleSize && y <= elY + height + handleSize) {
      return 'bottom';
    }
    if (x >= elX - handleSize && x <= elX + handleSize && y >= elY && y <= elY + height) {
      return 'left';
    }
    
    return null;
  };

  // PanResponder for canvas interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      
      if (currentTool === 'select' && selectedElements.length > 0) {
        // Check if we're clicking on a resize handle
        for (const elementId of selectedElements) {
          const element = elements.find(el => el.id === elementId);
          if (element) {
            const handle = getResizeHandleAtPoint(locationX, locationY, element);
            if (handle) {
              setResizeState({
                isResizing: true,
                handle,
                startX: locationX,
                startY: locationY,
                startWidth: element.width,
                startHeight: element.height,
                elementId,
              });
              return;
            }
          }
        }
        
        // Check if we're clicking on a selected element for dragging
        for (const elementId of selectedElements) {
          const element = elements.find(el => el.id === elementId);
          if (element && 
              locationX >= element.x && locationX <= element.x + element.width &&
              locationY >= element.y && locationY <= element.y + element.height) {
            setDragState({
              isDragging: true,
              startX: locationX,
              startY: locationY,
              elementStartX: element.x,
              elementStartY: element.y,
              elementId,
            });
            return;
          }
        }
      }
      
      // Default canvas tap behavior
      handleCanvasTap(locationX, locationY);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      
      if (resizeState.isResizing && resizeState.elementId) {
        handleResize(locationX, locationY);
      } else if (dragState.isDragging && dragState.elementId) {
        handleDrag(locationX, locationY);
      } else {
        handleCanvasDrag(locationX, locationY);
      }
    },
    onPanResponderRelease: () => {
      setDragState({
        isDragging: false,
        startX: 0,
        startY: 0,
        elementStartX: 0,
        elementStartY: 0,
        elementId: null,
      });
      setResizeState({
        isResizing: false,
        handle: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        elementId: null,
      });
    },
  });

  const handleDrag = (x: number, y: number) => {
    if (dragState.elementId) {
      // Adjust coordinates for canvas container margin
      const adjustedX = x - 10; // canvasContainer margin
      const adjustedY = y - 10; // canvasContainer margin
      
      const deltaX = adjustedX - (dragState.startX - 10);
      const deltaY = adjustedY - (dragState.startY - 10);
      const newX = dragState.elementStartX + deltaX;
      const newY = dragState.elementStartY + deltaY;
      
      // Add bounds checking to keep element within canvas
      const element = elements.find(el => el.id === dragState.elementId);
      if (element) {
        const boundedX = Math.max(0, Math.min(CANVAS_WIDTH - element.width, newX));
        const boundedY = Math.max(0, Math.min(CANVAS_HEIGHT - element.height, newY));
        
        console.log('Drag Debug:', {
          touchX: x,
          touchY: y,
          adjustedX,
          adjustedY,
          startX: dragState.startX,
          startY: dragState.startY,
          deltaX,
          deltaY,
          elementStartX: dragState.elementStartX,
          elementStartY: dragState.elementStartY,
          newX: boundedX,
          newY: boundedY,
          canvasWidth: CANVAS_WIDTH,
          canvasHeight: CANVAS_HEIGHT
        });
        
        // Update element position directly
        updateElement(dragState.elementId, { x: boundedX, y: boundedY });
      }
    }
  };

  const handleResize = (x: number, y: number) => {
    if (!resizeState.elementId || !resizeState.handle) return;
    
    // Adjust coordinates for canvas container margin
    const adjustedX = x - 10;
    const adjustedY = y - 10;
    
    const deltaX = adjustedX - (resizeState.startX - 10);
    const deltaY = adjustedY - (resizeState.startY - 10);
    
    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newX = 0;
    let newY = 0;
    
    const element = elements.find(el => el.id === resizeState.elementId);
    if (!element) return;
    
    switch (resizeState.handle) {
      case 'top-left':
        newWidth = Math.max(10, resizeState.startWidth - deltaX);
        newHeight = Math.max(10, resizeState.startHeight - deltaY);
        newX = element.x + deltaX;
        newY = element.y + deltaY;
        break;
      case 'top-right':
        newWidth = Math.max(10, resizeState.startWidth + deltaX);
        newHeight = Math.max(10, resizeState.startHeight - deltaY);
        newY = element.y + deltaY;
        break;
      case 'bottom-left':
        newWidth = Math.max(10, resizeState.startWidth - deltaX);
        newHeight = Math.max(10, resizeState.startHeight + deltaY);
        newX = element.x + deltaX;
        break;
      case 'bottom-right':
        newWidth = Math.max(10, resizeState.startWidth + deltaX);
        newHeight = Math.max(10, resizeState.startHeight + deltaY);
        break;
      case 'top':
        newHeight = Math.max(10, resizeState.startHeight - deltaY);
        newY = element.y + deltaY;
        break;
      case 'right':
        newWidth = Math.max(10, resizeState.startWidth + deltaX);
        break;
      case 'bottom':
        newHeight = Math.max(10, resizeState.startHeight + deltaY);
        break;
      case 'left':
        newWidth = Math.max(10, resizeState.startWidth - deltaX);
        newX = element.x + deltaX;
        break;
    }
    
    // Add bounds checking for resize
    const boundedX = Math.max(0, Math.min(CANVAS_WIDTH - newWidth, newX));
    const boundedY = Math.max(0, Math.min(CANVAS_HEIGHT - newHeight, newY));
    const boundedWidth = Math.min(CANVAS_WIDTH - boundedX, newWidth);
    const boundedHeight = Math.min(CANVAS_HEIGHT - boundedY, newHeight);
    
    // Update element with new dimensions and position
    const updates: Partial<Element> = {
      width: boundedWidth,
      height: boundedHeight,
    };
    
    if (newX !== 0) updates.x = boundedX;
    if (newY !== 0) updates.y = boundedY;
    
    updateElement(resizeState.elementId, updates);
  };

  const handleCanvasTap = (x: number, y: number) => {
    if (currentTool === 'select') {
      // Check if tapping on an element
      const tappedElement = elements.find(el => 
        x >= el.x && x <= el.x + el.width &&
        y >= el.y && y <= el.y + el.height
      );

      if (tappedElement) {
        selectElement(tappedElement.id, false);
      } else {
        clearSelection();
      }
    } else if (currentTool === 'rectangle') {
      const newShape: Shape = {
        id: generateId(),
        type: 'rectangle',
        x: x - 50,
        y: y - 25,
        width: 100,
        height: 50,
        backgroundColor: '#FF6B6B',
        selected: true,
      };
      addElement(newShape);
    } else if (currentTool === 'circle') {
      const newShape: Shape = {
        id: generateId(),
        type: 'circle',
        x: x - 25,
        y: y - 25,
        width: 50,
        height: 50,
        backgroundColor: '#4ECDC4',
        selected: true,
      };
      addElement(newShape);
    } else if (currentTool === 'text') {
      const newText: TextElement = {
        id: generateId(),
        type: 'text',
        x: x,
        y: y,
        width: 200,
        height: 30,
        text: 'Double tap to edit',
        fontSize: 16,
        fontFamily: 'System',
        color: '#000000',
        selected: true,
      };
      addElement(newText);
      setEditingTextId(newText.id);
    }
  };

  const handleCanvasDrag = (x: number, y: number) => {
    // Handle dragging for selected elements
    if (selectedElements.length > 0 && currentTool === 'select') {
      // This would need more sophisticated drag handling
      // For now, we'll implement basic movement
    }
  };

  const handleTextEdit = (id: string) => {
    setEditingTextId(id);
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: ImageElement = {
          id: generateId(),
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          uri: result.assets[0].uri,
          selected: true,
        };
        addElement(newImage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleExport = async () => {
    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const uri = await viewShotRef.current.capture();
        Alert.alert('Success', `Design exported to: ${uri}`);
      } else {
        Alert.alert('Error', 'Export functionality not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export design');
    }
  };

  const handleSaveDesign = async () => {
    try {
      const designId = generateId();
      await saveDesign(designId);
      
      // Add to recent designs
      const { addDesign } = useDesigns();
      addDesign({
        label: `Design ${new Date().toLocaleDateString()}`,
        image: 'https://placehold.co/120x90/eee/000?text=Design',
        isCompleted: true,
      });
      
      Alert.alert('Success', 'Design saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save design');
    }
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedElements.includes(element.id);

    switch (element.type) {
      case 'rectangle':
        return (
          <Rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.backgroundColor}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'circle':
        return (
          <Circle
            key={element.id}
            cx={element.x + element.width / 2}
            cy={element.y + element.height / 2}
            r={element.width / 2}
            fill={element.backgroundColor}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'text':
        return (
          <SvgText
            key={element.id}
            x={element.x}
            y={element.y + element.fontSize}
            fontSize={element.fontSize}
            fontFamily={element.fontFamily}
            fill={element.color}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 1 : 0}
            onPress={() => handleTextEdit(element.id)}
          >
            {element.text}
          </SvgText>
        );
      case 'image':
        return (
          <SvgImage
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            href={{ uri: element.uri }}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'ellipse':
        return (
          <Ellipse
            key={element.id}
            cx={element.x + element.width / 2}
            cy={element.y + element.height / 2}
            rx={element.width / 2}
            ry={element.height / 2}
            fill={element.backgroundColor}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'triangle':
        return (
          <Polygon
            key={element.id}
            points={`${element.x},${element.y} ${element.x + element.width / 2},${element.y + element.height} ${element.x + element.width},${element.y}`}
            fill={element.backgroundColor}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'line':
        return (
          <Line
            key={element.id}
            x1={element.x}
            y1={element.y}
            x2={element.x + element.width}
            y2={element.y + element.height}
            stroke={element.backgroundColor}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      case 'star':
        return (
          <Polygon
            key={element.id}
            points={`${element.x + element.width / 2},${element.y} ${element.x + element.width * 0.16},${element.y + element.height * 0.16} ${element.x + element.width * 0.5},${element.y + element.height * 0.5} ${element.x + element.width * 0.84},${element.y + element.height * 0.16} ${element.x},${element.y}`}
            fill={element.backgroundColor}
            stroke={isSelected ? '#007AFF' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            onPress={() => selectElement(element.id, false)}
          />
        );
      default:
        return null;
    }
  };

  // Render resize handles for selected elements
  const renderResizeHandles = (element: Element) => {
    if (!selectedElements.includes(element.id)) return null;
    
    const handleSize = 6;
    const { x, y, width, height } = element;
    
    return (
      <>
        {/* Corner handles */}
        <Rect key={`${element.id}-tl`} x={x - handleSize} y={y - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-tr`} x={x + width - handleSize} y={y - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-bl`} x={x - handleSize} y={y + height - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-br`} x={x + width - handleSize} y={y + height - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        
        {/* Edge handles */}
        <Rect key={`${element.id}-t`} x={x + width / 2 - handleSize} y={y - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-r`} x={x + width - handleSize} y={y + height / 2 - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-b`} x={x + width / 2 - handleSize} y={y + height - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
        <Rect key={`${element.id}-l`} x={x - handleSize} y={y + height / 2 - handleSize} width={handleSize * 2} height={handleSize * 2} fill="#007AFF" />
      </>
    );
  };

  const ToolButton = ({ tool, icon, label }: { tool: Tool; icon: string; label: string }) => (
    <TouchableOpacity
      style={[styles.toolButton, currentTool === tool && styles.activeToolButton]}
      onPress={() => useDesignStore.getState().setCurrentTool(tool)}
    >
      <Ionicons name={icon as any} size={24} color={currentTool === tool ? '#007AFF' : '#333'} />
      <Text style={[styles.toolLabel, currentTool === tool && styles.activeToolLabel]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* Top Toolbar */}
      <View style={styles.topToolbar}>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => undo()} disabled={!canUndo()}>
          <Ionicons name="arrow-undo" size={24} color={canUndo() ? '#333' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => redo()} disabled={!canRedo()}>
          <Ionicons name="arrow-redo" size={24} color={canRedo() ? '#333' : '#999'} />
        </TouchableOpacity>
        {/* Shapes Button */}
        <TouchableOpacity style={styles.toolbarButton} onPress={() => setShowShapePicker(true)}>
          <Ionicons name="shapes" size={24} color="#333" />
          <Text style={styles.toolbarButtonLabel}>Shapes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.toolbarButton,
            selectedElements.length > 0 && styles.activeToolbarButton
          ]} 
          onPress={() => {
            if (selectedElements.length > 0) {
              setColorPickerTarget('element');
            } else {
              setColorPickerTarget('canvas');
            }
            setShowColorPicker(true);
          }}
        >
          <Ionicons 
            name={selectedElements.length > 0 ? "color-palette" : "color-palette"} 
            size={24} 
            color={selectedElements.length > 0 ? "#007AFF" : "#333"} 
          />
          {selectedElements.length > 0 && (
            <Text style={styles.toolbarButtonLabel}>Shape</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={handleExport}>
          <Ionicons name="download" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={handleSaveDesign}>
          <Ionicons name="save" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Shape Picker Modal */}
      <Modal visible={showShapePicker} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 8 }}>
            <ShapePicker
              selected={currentTool}
              onSelect={type => {
                setCurrentTool(type as Tool);
                setShowShapePicker(false);
              }}
            />
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 8 }} onPress={() => setShowShapePicker(false)}>
              <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Canvas */}
      <ViewShot ref={viewShotRef} style={styles.canvasContainer}>
        <View
          ref={canvasRef}
          style={[styles.canvas, { backgroundColor: canvasBackgroundColor }]}
          {...panResponder.panHandlers}
        >
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            {elements.map(renderElement)}
            {elements.map(element => (
              <React.Fragment key={`handles-${element.id}`}>
                {renderResizeHandles(element)}
              </React.Fragment>
            ))}
          </Svg>
        </View>
      </ViewShot>

      {/* Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        <ToolButton tool="select" icon="hand-left" label="Select" />
        <ToolButton tool="rectangle" icon="square" label="Rectangle" />
        <ToolButton tool="circle" icon="ellipse" label="Circle" />
        <ToolButton tool="text" icon="text" label="Text" />
        <TouchableOpacity style={styles.toolButton} onPress={handleImagePicker}>
          <Ionicons name="image" size={24} color="#333" />
          <Text style={styles.toolLabel}>Image</Text>
        </TouchableOpacity>
        
        {selectedElements.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedElements}>
            <Ionicons name="trash" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <ColorPicker
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          title={colorPickerTarget === 'element' ? 'Choose Shape Color' : 'Choose Canvas Color'}
          initialColor={
            colorPickerTarget === 'element' && selectedElements.length > 0
              ? (() => {
                  const selectedElement = elements.find(el => el.id === selectedElements[0]);
                  if (selectedElement && 'backgroundColor' in selectedElement) {
                    return selectedElement.backgroundColor;
                  }
                  return '#FFFFFF';
                })()
              : canvasBackgroundColor
          }
          onColorSelect={(color) => {
            setShowColorPicker(false);
            if (colorPickerTarget === 'canvas') {
              useDesignStore.getState().setCanvasBackgroundColor(color);
            } else if (colorPickerTarget === 'element' && selectedElements.length > 0) {
              // Update background color for all selected elements
              selectedElements.forEach(elementId => {
                const element = elements.find(el => el.id === elementId);
                if (element && 'backgroundColor' in element) {
                  updateElement(elementId, { backgroundColor: color });
                }
              });
            }
          }}
        />
      )}

      {/* Text Editor Modal */}
      <TextEditor
        visible={editingTextId !== null}
        onClose={() => setEditingTextId(null)}
        textElementId={editingTextId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  toolbarButton: {
    padding: 8,
    borderRadius: 8,
  },
  canvasContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 8,
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  toolButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: '#E3F2FD',
  },
  toolLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  activeToolLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  activeToolbarButton: {
    backgroundColor: '#E3F2FD',
  },
  toolbarButtonLabel: {
    fontSize: 12,
    marginLeft: 4,
    color: '#333',
  },
}); 