# React BabylonJS 3D Drawing Application

This project is a 3D drawing application built using React and BabylonJS. It allows users to add, move, select, and delete 3D shapes such as rectangles, circles, and lines on a canvas. It also supports exporting shapes data as JSON and importing shapes from JSON files.

## Features

- Add Rectangles, Circles, and Lines with random colors.
- Drag shapes across the canvas in 3D space.
- Select shapes by clicking on them.
- Delete individual or all shapes.
- Export and import shape data as JSON.
- Real-time rendering with BabylonJS engine.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- BabylonJS: A powerful 3D engine for rendering scenes and interacting with 3D objects.
- UUID: For generating unique identifiers for each shape.
- HTML5 File API: For importing and exporting JSON files.

### Installation

1. Clone the repository:

```bash git clone <repository-url> ```

2. Navigate to the project directory:

```bash cd react-babylonjs-3d-app```

3.Install dependencies: Ensure you have Node.js installed, then run:

```bash npm install ```

4.Start the development server:

```bash  npm start ```

5.Open your browser: The application will be available at http://localhost:3000.
 

### Usage

- Add Shapes: Use the buttons to add rectangles, circles, or lines to the 3D scene.
- Move Shapes: Drag shapes within the 3D canvas.
- Select Shapes: Click on a shape to select it.
- Delete Shapes: Use the "Delete Selected Shape" button to remove the selected shape or the "Delete All Shapes" button to clear the entire canvas.
- Export Shapes: Click the "Export JSON" button to save all shapes in JSON format.
- Import Shapes: Use the file input to load shapes from a JSON file and display them on the canvas.

### Project Structure

-  App.js: The main React component that manages shape creation, interaction, deletion, and the BabylonJS rendering engine.
-  BabylonJS is responsible for handling the 3D rendering and interactive drag behavior of shapes.

### Keyboard Shortcuts

- Delete: Deletes the selected shapes.

### Future Improvements

- Add the ability to resize shapes. 
- Add group selection and manipulation of multiple shapes.  
- Implement undo/redo functionality for better shape control.   
