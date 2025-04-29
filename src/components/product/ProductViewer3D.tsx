
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
// Import OrbitControls with the correct path that includes type declarations
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface ProductViewer3DProps {
  productId: string;
  productName: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  productId,
  productName 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<"2D" | "3D">("2D");

  useEffect(() => {
    if (viewMode !== "3D" || !containerRef.current) return;

    // Setup basic three.js elements
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add a basic cube to represent our product
    const geometry = new THREE.BoxGeometry(2, 3, 0.2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x1e3a8a,  // forever-navy color
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Add text label for the product name
    const createTextTexture = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      canvas.width = 256;
      canvas.height = 256;
      
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = 'Bold 24px Arial';
      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.fillText(productName, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };
    
    const textTexture = createTextTexture();
    if (textTexture) {
      const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture });
      const textGeometry = new THREE.PlaneGeometry(1.5, 0.5);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.y = -2;
      scene.add(textMesh);
    }
    
    // Add orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Handle window resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube.rotation.y += 0.005;
      controls.update();
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [viewMode, productName]);

  return (
    <div className="mb-6">
      <div className="flex justify-end mb-2">
        <Button 
          variant={viewMode === "2D" ? "default" : "outline"}
          onClick={() => setViewMode("2D")}
          className="mr-2"
        >
          2D View
        </Button>
        <Button 
          variant={viewMode === "3D" ? "default" : "outline"} 
          onClick={() => setViewMode("3D")}
        >
          <Package className="mr-2 h-4 w-4" />
          3D View
        </Button>
      </div>
      
      <div 
        ref={containerRef} 
        className={`rounded-lg overflow-hidden ${viewMode === "2D" ? "hidden" : "block"} h-96 bg-gray-100`}
      />
      
      <div className={`bg-gray-100 rounded-lg overflow-hidden ${viewMode === "3D" ? "hidden" : "block"}`}>
        <div className="h-96 flex items-center justify-center">
          <img 
            src={`https://images.unsplash.com/photo-1598033129183-c4f50c736f10?product=${productId}`} 
            alt={productName}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=Product+Image";
            }}
          />
        </div>
      </div>
    </div>
  );
};
