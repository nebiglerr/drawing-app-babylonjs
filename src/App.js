import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as BABYLON from 'babylonjs';
import { v4 as uuidv4 } from 'uuid';

// Yardımcı fonksiyonlar
const getRandomColor = () => new BABYLON.Color3(Math.random(), Math.random(), Math.random());
const getRandomPosition = () => new BABYLON.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);

const App = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);

  // Sahneyi ve motoru başlatan fonksiyon
  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;

    const camera = new BABYLON.ArcRotateCamera("camera1", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(90), 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Render döngüsü
    engine.runRenderLoop(() => scene.render());

    // Olayları yönetmek için temizleme
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  // Şekil ekleme fonksiyonları
  const createShape = useCallback((type) => {
    const position = getRandomPosition();
    const color = getRandomColor();
    let shape;

    switch (type) {
      case 'rect':
        shape = createRectangle(position, color);
        break;
      case 'circle':
        shape = createCircle(position, color);
        break;
      case 'line':
        shape = createLine(position, color);
        break;
      default:
        console.error("Bilinmeyen şekil tipi:", type);
        return;
    }

    setShapes((prevShapes) => [...prevShapes, shape]);
  }, []);

  const createRectangle = (position, color) => {
    const rectangle = BABYLON.MeshBuilder.CreatePlane("rect", { width: 2, height: 1 }, sceneRef.current);
    rectangle.position = position;
    rectangle.material = createMaterial(color);
    addDraggableBehavior(rectangle);
    return addShapeAction(rectangle, 'rect');
  };

  const createCircle = (position, color) => {
    const circle = BABYLON.MeshBuilder.CreateDisc("circle", { radius: 1, tessellation: 30 }, sceneRef.current);
    circle.position = position;
    circle.material = createMaterial(color);
    addDraggableBehavior(circle);
    return addShapeAction(circle, 'circle');
  };

  const createLine = (position, color) => {
    const line = BABYLON.MeshBuilder.CreateLines("line", { points: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(1, 1, 0)] }, sceneRef.current);
    line.position = position;
    line.color = color;
    addDraggableBehavior(line);
    return addShapeAction(line, 'line');
  };

  // Material oluşturma
  const createMaterial = (color) => {
    const material = new BABYLON.StandardMaterial("mat", sceneRef.current);
    material.diffuseColor = color;
    return material;
  };

  // Şekil sürükleme
  const addDraggableBehavior = (shape) => {
    const dragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) });
    shape.addBehavior(dragBehavior);
  };

  // Şekil seçim fonksiyonu
  const addShapeAction = (shape, type) => {
    shape.id = uuidv4();
    shape.type = type;

    shape.actionManager = new BABYLON.ActionManager(sceneRef.current);
    shape.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => setSelectedShape(shape)));

    return shape;
  };

  // Seçili şekli sil
  const deleteSelectedShape = () => {
    if (selectedShape) {
      selectedShape.dispose();
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShape.id));
      setSelectedShape(null);
    }
  };

  // Tüm şekilleri sil
  const deleteAllShapes = () => {
    shapes.forEach((shape) => shape.dispose());
    setShapes([]);
    setSelectedShape(null);
  };

  // JSON dışa aktarma
  const exportShapes = () => {
    const shapesData = shapes.map(({ type, position, material, color }) => ({
      type,
      position: [position.x, position.y, position.z],
      color: material?.diffuseColor.asArray() || color.asArray(),
    }));

    const blob = new Blob([JSON.stringify(shapesData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shapes.json';
    link.click();
  };

  // JSON içe aktarma
  const importShapes = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedShapes = JSON.parse(e.target.result);
      deleteAllShapes();

      importedShapes.forEach(({ type, position, color }) => {
        const shapePosition = new BABYLON.Vector3(...position);
        const shapeColor = BABYLON.Color3.FromArray(color);

        switch (type) {
          case 'rect':
            createShapeWithProps('rect', shapePosition, shapeColor);
            break;
          case 'circle':
            createShapeWithProps('circle', shapePosition, shapeColor);
            break;
          case 'line':
            createShapeWithProps('line', shapePosition, shapeColor);
            break;
          default:
            console.error('Bilinmeyen şekil tipi:', type);
            break;
        }
      });
    };
    reader.readAsText(file);
  };

  const createShapeWithProps = (type, position, color) => {
    switch (type) {
      case 'rect':
        return createRectangle(position, color);
      case 'circle':
        return createCircle(position, color);
      case 'line':
        return createLine(position, color);
      default:
        console.error("Bilinmeyen şekil tipi:", type);
        return null;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={(e) => e.key === 'Delete' && deleteSelectedShape()} style={{ outline: 'none' }}>
      <button onClick={() => createShape('rect')}>Add Rectangle</button>
      <button onClick={() => createShape('circle')}>Add Circle</button>
      <button onClick={() => createShape('line')}>Add Line</button>
      <button onClick={deleteSelectedShape}>Delete Selected Shape</button>
      <button onClick={deleteAllShapes}>Delete All Shapes</button>
      <button onClick={exportShapes}>Export JSON</button>
      <input type="file" onChange={importShapes} />
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default App;
