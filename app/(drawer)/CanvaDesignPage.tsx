import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  PanResponder,
  SafeAreaView as RNSafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView as SafeAreaContextView } from 'react-native-safe-area-context';
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
const SELECTION_PADDING = 10;

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
  dragOffsetX: number;
  dragOffsetY: number;
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
    dragOffsetX: 0,
    dragOffsetY: 0,
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
  const [activeTab, setActiveTab] = useState<'select' | 'text' | 'images' | 'shapes' | 'background'>('text');
  
  const canvasRef = useRef<View>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const router = useRouter();
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Load design on mount
  useEffect(() => {
    // Don't auto-load design - let user choose what to load
    // loadDesign();
  }, []);

  // Use measure to get the absolute position of the canvas on the screen
  useEffect(() => {
    const measureCanvas = () => {
      if (canvasRef.current && typeof canvasRef.current.measure === 'function') {
        // @ts-ignore
        canvasRef.current.measure((fx, fy, width, height, px, py) => {
          setCanvasOffset({ x: px, y: py });
        });
      }
    };
    // Measure after a short delay to ensure layout is complete
    const timeout = setTimeout(measureCanvas, 500);
    return () => clearTimeout(timeout);
  }, [elements, canvasBackgroundColor]);

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
      const { pageX, pageY } = evt.nativeEvent;
      const localX = pageX - canvasOffset.x;
      const localY = pageY - canvasOffset.y;
      console.log('PanResponder grant at:', pageX, pageY, 'Local:', localX, localY, 'Current tool:', currentTool, 'Selected elements:', selectedElements);
      if (currentTool === 'select' && selectedElements.length > 0) {
        // Check if we're clicking on a resize handle
        for (const elementId of selectedElements) {
          const element = elements.find(el => el.id === elementId);
          if (element) {
            const handle = getResizeHandleAtPoint(localX, localY, element);
            if (handle) {
              setResizeState({
                isResizing: true,
                handle,
                startX: localX,
                startY: localY,
                startWidth: element.width,
                startHeight: element.height,
                elementId,
              });
              console.log('Resize started for element:', elementId, 'Handle:', handle);
              return;
            }
          }
        }
        
        // Check if we're clicking on a selected element for dragging
        for (const elementId of selectedElements) {
          const element = elements.find(el => el.id === elementId);
          if (element && 
              localX >= element.x - SELECTION_PADDING && localX <= element.x + element.width + SELECTION_PADDING &&
              localY >= element.y - SELECTION_PADDING && localY <= element.y + element.height + SELECTION_PADDING) {
            setDragState({
              isDragging: true,
              startX: localX,
              startY: localY,
              elementStartX: element.x,
              elementStartY: element.y,
              elementId,
              dragOffsetX: localX - element.x,
              dragOffsetY: localY - element.y,
            });
            console.log('Drag started for element:', elementId);
            return;
          }
        }
      }
      
      // Default canvas tap behavior
      handleCanvasTap(localX, localY);
    },
    onPanResponderMove: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      const localX = pageX - canvasOffset.x;
      const localY = pageY - canvasOffset.y;
      if (resizeState.isResizing && resizeState.elementId) {
        handleResize(localX, localY);
      } else if (dragState.isDragging && dragState.elementId) {
        handleDrag(localX, localY);
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
        dragOffsetX: 0,
        dragOffsetY: 0,
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
      // Use the offset so the element stays under the finger
      const newX = x - dragState.dragOffsetX;
      const newY = y - dragState.dragOffsetY;

      // Add bounds checking to keep element within canvas
      const element = elements.find(el => el.id === dragState.elementId);
      if (element) {
        const boundedX = Math.max(0, Math.min(CANVAS_WIDTH - element.width, newX));
        const boundedY = Math.max(0, Math.min(CANVAS_HEIGHT - element.height, newY));

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
    // Debug log for tap coordinates
    console.log('Canvas tap at:', x, y, 'Current tool:', currentTool, 'Active tab:', activeTab);
    if (activeTab === 'text') {
      // Add text element at tap location
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
      setActiveTab('select');
      setCurrentTool('select');
      return;
    }
    if (currentTool === 'select') {
      // Check if tapping on an element (including text with bounding box)
      const tappedElement = elements.find(el => {
        if (el.type === 'text') {
          // Estimate width: fontSize * 0.6 * text.length
          const width = (el.fontSize || 16) * 0.6 * (el.text?.length || 1);
          const height = el.fontSize || 16;
          // Add padding for easier selection
          return x >= el.x - SELECTION_PADDING && x <= el.x + width + SELECTION_PADDING && y >= el.y - SELECTION_PADDING && y <= el.y + height + SELECTION_PADDING;
        }
        // Add padding for all other elements
        return x >= el.x - SELECTION_PADDING && x <= el.x + el.width + SELECTION_PADDING && y >= el.y - SELECTION_PADDING && y <= el.y + el.height + SELECTION_PADDING;
      });
      console.log('Tapped element:', tappedElement);
      if (tappedElement) {
        selectElement(tappedElement.id, false);
      } else {
        clearSelection();
      }
    } else if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'ellipse' || currentTool === 'triangle' || currentTool === 'star' || currentTool === 'line') {
      // Add shape at tap location
      let newShape: Shape;
      if (currentTool === 'rectangle') {
        newShape = {
          id: generateId(),
          type: 'rectangle',
          x: x - 50,
          y: y - 25,
          width: 100,
          height: 50,
          backgroundColor: '#FF6B6B',
          selected: true,
        };
      } else if (currentTool === 'circle') {
        newShape = {
          id: generateId(),
          type: 'circle',
          x: x - 25,
          y: y - 25,
          width: 50,
          height: 50,
          backgroundColor: '#4ECDC4',
          selected: true,
        };
      } else if (currentTool === 'ellipse') {
        newShape = {
          id: generateId(),
          type: 'ellipse',
          x: x - 40,
          y: y - 20,
          width: 80,
          height: 40,
          backgroundColor: '#FFD166',
          selected: true,
        };
      } else if (currentTool === 'triangle') {
        newShape = {
          id: generateId(),
          type: 'triangle',
          x: x - 40,
          y: y - 35,
          width: 80,
          height: 70,
          backgroundColor: '#118AB2',
          selected: true,
        };
      } else if (currentTool === 'star') {
        newShape = {
          id: generateId(),
          type: 'star',
          x: x - 40,
          y: y - 35,
          width: 80,
          height: 70,
          backgroundColor: '#EF476F',
          selected: true,
        };
      } else if (currentTool === 'line') {
        newShape = {
          id: generateId(),
          type: 'line',
          x: x,
          y: y,
          width: 80,
          height: 0,
          backgroundColor: '#073B4C',
          selected: true,
        };
      }
      addElement(newShape!);
      setActiveTab('select');
      setCurrentTool('select');
    }
  };

  const handleCanvasDrag = (x: number, y: number) => {
    // Handle dragging for selected elements
    if (selectedElements.length > 0 && currentTool === 'select') {
      // This would need more sophisticated drag handling
      // For now, we'll implement basic movement
    }
  };

  // Double-tap detection for text editing
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  const handleTextTap = (id: string) => {
    const now = Date.now();
    if (lastTapRef.current && lastTapRef.current.id === id && now - lastTapRef.current.time < 350) {
      setEditingTextId(id);
      setActiveTab('select');
      setCurrentTool('select');
      lastTapRef.current = null;
    } else {
      selectElement(id, false);
      lastTapRef.current = { id, time: now };
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0] && result.assets[0].uri) {
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
            onPress={() => handleTextTap(element.id)}
          >
            {element.text}
          </SvgText>
        );
      case 'image':
        if (!element.uri) {
          console.warn('Skipping image with empty uri', element);
          return null;
        }
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
    let x = element.x, y = element.y, width = element.width, height = element.height;
    if (element.type === 'text') {
      // For text, use fontSize for height and estimate width based on text length and fontSize
      height = element.fontSize;
      // Estimate width: fontSize * 0.6 * text.length (roughly)
      width = (element.fontSize || 16) * 0.6 * (element.text?.length || 1);
    }
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
    <RNSafeAreaView style={{ flex: 1, backgroundColor: '#F4F4FF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F4FF', paddingTop: 24, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => { if (typeof router !== 'undefined') router.back && router.back(); }} style={{ position: 'absolute', left: 10, zIndex: 2, padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222' }}>Untitled Design</Text>
        <TouchableOpacity onPress={clearDesign} style={{ position: 'absolute', right: 10, zIndex: 2, padding: 4 }}>
          <Ionicons name="refresh" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: '#F4F4FF' }}>
        <StatusBar barStyle="dark-content" />
        {/* Top Tab Bar with Undo, Redo, Save */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F4F4FF', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {['select', 'text', 'images', 'shapes', 'background'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                style={{ marginRight: 18, borderBottomWidth: activeTab === tab ? 2 : 0, borderBottomColor: '#6366F1', paddingBottom: 4 }}
              >
                <Text style={{ color: activeTab === tab ? '#6366F1' : '#222', fontWeight: activeTab === tab ? 'bold' : 'normal', fontSize: 16 }}>
                  {tab === 'select' ? 'Select' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={undo} disabled={!canUndo()} style={{ marginHorizontal: 6 }}>
              <Ionicons name="arrow-undo" size={22} color={canUndo() ? '#333' : '#999'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={redo} disabled={!canRedo()} style={{ marginHorizontal: 6 }}>
              <Ionicons name="arrow-redo" size={22} color={canRedo() ? '#333' : '#999'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveDesign} style={{ marginLeft: 10 }}>
              <Ionicons name="save" size={22} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Canvas */}
        <View style={{ flex: 1, backgroundColor: '#F4F4FF', justifyContent: 'center', alignItems: 'center' }}>
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
        </View>

        {/* Bottom Bar: context-sensitive controls */}
        <SafeAreaContextView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0' }}>
            {activeTab === 'text' && (
              // Text controls: font, bold, underline, opacity, font size
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {/* Font family selector */}
                <TouchableOpacity style={{ marginHorizontal: 6, padding: 6, backgroundColor: '#eee', borderRadius: 6 }}>
                  <Text>Open Sans</Text>
                </TouchableOpacity>
                {/* Bold */}
                <TouchableOpacity style={{ marginHorizontal: 6 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>B</Text>
                </TouchableOpacity>
                {/* Underline */}
                <TouchableOpacity style={{ marginHorizontal: 6 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 18 }}>U</Text>
                </TouchableOpacity>
                {/* Opacity */}
                <View style={{ marginHorizontal: 6, width: 80 }}>
                  <Text style={{ fontSize: 12 }}>Opacity</Text>
                  {/* Replace with a slider if you have one */}
                  <View style={{ height: 4, backgroundColor: '#ccc', borderRadius: 2, marginTop: 2 }} />
                </View>
                {/* Font size */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 6 }}>
                  <Text style={{ fontSize: 16 }}>32</Text>
                  <TouchableOpacity style={{ marginLeft: 4 }}><Text style={{ fontSize: 18 }}>-</Text></TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 4 }}><Text style={{ fontSize: 18 }}>+</Text></TouchableOpacity>
                </View>
              </View>
            )}
            {activeTab === 'images' && (
              <TouchableOpacity onPress={handleImagePicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="image" size={24} color="#333" />
                <Text style={{ marginLeft: 8 }}>Upload Image</Text>
              </TouchableOpacity>
            )}
            {activeTab === 'shapes' && (
              <TouchableOpacity onPress={() => setShowShapePicker(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shapes" size={24} color="#333" />
                <Text style={{ marginLeft: 8 }}>Add Shape</Text>
              </TouchableOpacity>
            )}
            {activeTab === 'background' && (
              <TouchableOpacity onPress={() => { setColorPickerTarget('canvas'); setShowColorPicker(true); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="color-palette" size={24} color="#333" />
                <Text style={{ marginLeft: 8 }}>Background Color</Text>
              </TouchableOpacity>
            )}
            {/* Delete button always at bottom right if an element is selected */}
            {selectedElements.length > 0 && (
              <TouchableOpacity onPress={deleteSelectedElements} style={{ marginLeft: 'auto', backgroundColor: '#FFEBEE', padding: 8, borderRadius: 8 }}>
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            )}
            {/* Optionally, you can show a hint or nothing for 'select' tab at the bottom bar */}
            {activeTab === 'select' && (
              <View style={{ flex: 1 }} />
            )}
          </View>
        </SafeAreaContextView>

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

        <TextEditor
          visible={editingTextId !== null}
          onClose={() => {
            setEditingTextId(null);
            setActiveTab('select');
          }}
          textElementId={editingTextId}
        />
      </View>
    </RNSafeAreaView>
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