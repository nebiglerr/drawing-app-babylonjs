import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null); // BabylonJS engine referansı
  const sceneRef = useRef(null); // BabylonJS scene referansı
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null); // Seçilen şekil

  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;

    // Sahneyi oluşturma
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Kamera oluşturma
    const camera = new BABYLON.ArcRotateCamera("camera1", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(90), 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);

    // Işık ekleme
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Zemin ekleyerek fareyle boş alana tıklamayı kontrol ediyoruz
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    ground.isPickable = true; // Zemin pickable olmalı

    // Render döngüsü
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Pencere boyutu değiştiğinde sahneyi yeniden boyutlandır
    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      // Temizlik işlemi
      window.removeEventListener('resize', () => engine.resize());
      engine.dispose();
    };
  }, []);

  // Kare (Rectangle) ekleme fonksiyonu
  const addRectangle = () => {
    const plane = BABYLON.MeshBuilder.CreatePlane("rect", { width: 2, height: 1 }, sceneRef.current);
    plane.position = new BABYLON.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);
    plane.id = uuidv4();
    plane.type = 'rect';

    const material = new BABYLON.StandardMaterial("mat", sceneRef.current);
    var c1 = Math.random();
    var c2 = Math.random();
    var c3 = Math.random();
    console.log(c1 + " " + c2 + " " + c3)
    material.diffuseColor = new BABYLON.Color3(c1, c2, c3);
    plane.material = material;

    // 3D sürükleme işlemi için PointerDragBehavior ekliyoruz
    const dragBehavior = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) // Sürükleme düzlemi olarak Z ekseni üzerinde hareket ettiriyoruz
    });

    plane.addBehavior(dragBehavior); // Davranışı ekliyoruz

    plane.actionManager = new BABYLON.ActionManager(sceneRef.current);
    plane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
      setSelectedShape(plane); // Şekil tıklandığında seçiliyor
    }));

    setShapes([...shapes, plane]);
  };

  // Daire (Circle) ekleme fonksiyonu
  const addCircle = () => {
    const circle = BABYLON.MeshBuilder.CreateDisc("circle", { radius: 1, tessellation: 30 }, sceneRef.current);
    circle.position = new BABYLON.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);
    circle.id = uuidv4();
    circle.type = 'circle';

    const material = new BABYLON.StandardMaterial("mat", sceneRef.current);
    material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    circle.material = material;

    // 3D sürükleme işlemi için PointerDragBehavior ekliyoruz
    const dragBehavior = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) // Z ekseni üzerinde sürükleme işlemi
    });

    circle.addBehavior(dragBehavior); // Davranışı ekliyoruz

    circle.actionManager = new BABYLON.ActionManager(sceneRef.current);
    circle.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
      setSelectedShape(circle); // Şekil tıklandığında seçiliyor
    }));

    setShapes([...shapes, circle]);
  };

  // Çizgi (Line) ekleme fonksiyonu
  const addLine = () => {
    const points = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(1, 1, 0)
    ];
    const line = BABYLON.MeshBuilder.CreateLines("line", { points: points }, sceneRef.current);
    line.position = new BABYLON.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);
    line.id = uuidv4();
    line.type = 'line';

    line.color = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

    // 3D sürükleme işlemi için PointerDragBehavior ekliyoruz
    const dragBehavior = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) // Z ekseni üzerinde sürükleme işlemi
    });

    line.addBehavior(dragBehavior); // Davranışı ekliyoruz

    line.actionManager = new BABYLON.ActionManager(sceneRef.current);
    line.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
      setSelectedShape(line); // Şekil tıklandığında seçiliyor
    }));

    setShapes([...shapes, line]);
  };

  // Seçilen öğeyi sil
  const deleteSelectedShape = () => {
    if (selectedShape) {
      selectedShape.dispose(); // Sahneden kaldır
      setShapes(shapes.filter((shape) => shape.id !== selectedShape.id)); // State'den kaldır
      setSelectedShape(null); // Seçimi sıfırla
    }
  };
// Export JSON (tüm şekilleri dışa aktar)
const exportShapes = () => {
  try {
    const shapesData = shapes.map((shape) => {
      // Pozisyonu sadece x, y, z koordinatları olarak alıyoruz
      const shapeData = {
        type: shape.type,
        position: shape.position ? [shape.position.x, shape.position.y, shape.position.z] : null, // Pozisyonu array'e çeviriyoruz
        color: shape.material && shape.material.diffuseColor ? shape.material.diffuseColor : shape.color ? shape.color : null
      };
      
      return shapeData;
    });

    const jsonData = JSON.stringify(shapesData, null, 2);  // JSON formatına çeviriyoruz
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shapes.json';
    link.click();

  } catch (error) {
    console.error("JSON export sırasında hata oluştu:", error);
  }
};



  // Tüm öğeleri sil
  const deleteAllShapes = () => {
    shapes.forEach((shape) => {
      shape.dispose(); // Sahnedeki tüm şekilleri kaldır
    });
    setShapes([]); // State'i temizle
    setSelectedShape(null); // Seçimi sıfırla
  };

  // Delete tuşu ile silme fonksiyonu
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedShape) {
      deleteSelectedShape();
    }
  };
  
 // Import JSON (şekilleri içeri aktar)
const importShapes = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedShapes = JSON.parse(e.target.result);
      deleteAllShapes(); // Eski şekilleri temizle

      importedShapes.forEach((shape) => {
        // Pozisyonun array olduğunu kontrol ediyoruz ve Vector3'e çeviriyoruz
        if (!shape.position || !Array.isArray(shape.position)) {
          console.error('Geçersiz pozisyon verisi:', shape.position);
          return; // Hatalı pozisyon varsa bu shape'i yüklemiyoruz
        }

        // Array'den x, y, z pozisyonlarını alarak Vector3'e çeviriyoruz
        const position = new BABYLON.Vector3(shape.position[0], shape.position[1], shape.position[2]);
        const color = BABYLON.Color3.FromArray(shape.color);

        // Şekil tipine göre ekliyoruz
        switch (shape.type) {
          case 'rect':
            addRectangle(position, color);
            break;
          case 'circle':
            addCircle(position, color);
            break;
          case 'line':
            addLine(position, color);
            break;
          default:
            console.error('Bilinmeyen şekil tipi:', shape.type);
            break;
        }
      });
    } catch (error) {
      console.error('JSON import hatası:', error);
    }
  };
  reader.readAsText(file);
};



  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: 'none' }}>
      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addLine}>Add Line</button>
      <button onClick={deleteSelectedShape}>Delete Selected Shape</button>
      <button onClick={deleteAllShapes}>Delete All Shapes</button>
      <button onClick={exportShapes}>Export JSON</button>
      <input type="file" onChange={importShapes} />
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default App;
