
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ProductViewer3DProps {
  productId: string;
  productName: string;
  model3dUrl?: string | null;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  productId, 
  productName,
  model3dUrl 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Set up controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Load 3D model if available, otherwise create a placeholder shape
    if (model3dUrl) {
      const loader = new GLTFLoader();
      
      loader.load(
        model3dUrl,
        (gltf) => {
          scene.add(gltf.scene);
          
          // Auto-center and fit the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxSize = Math.max(size.x, size.y, size.z);
          const fitRatio = 3 / maxSize;
          
          gltf.scene.scale.multiplyScalar(fitRatio);
          gltf.scene.position.sub(center.multiplyScalar(fitRatio));
          gltf.scene.position.y -= size.y * fitRatio / 2;
          
          // Setup initial rotation for better view
          gltf.scene.rotation.y = Math.PI / 4;
          
          setLoading(false);
        },
        (xhr) => {
          // Optional loading progress callback
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('Error loading 3D model:', error);
          setError('Failed to load 3D model. Falling back to placeholder.');
          createPlaceholderModel(scene);
          setLoading(false);
        }
      );
    } else {
      createPlaceholderModel(scene);
      setLoading(false);
    }

    function createPlaceholderModel(scene: THREE.Scene) {
      // Create a simple cube as placeholder
      const geometry = new THREE.BoxGeometry(1, 1.5, 1);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x3366cc,
        shininess: 30,
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Auto-rotate the cube
      const autoRotate = true;
      
      if (autoRotate) {
        const animateCube = () => {
          if (cube) {
            cube.rotation.y += 0.005;
          }
        };
        
        const interval = setInterval(animateCube, 16);
        
        return () => {
          clearInterval(interval);
        };
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [productId, model3dUrl]);

  return (
    <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forever-navy"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-80 text-white p-2 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
