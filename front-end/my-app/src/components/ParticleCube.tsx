import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ParticleCubeProps {
    apiEndpoint: string;
}

const ParticleCube: React.FC<ParticleCubeProps> = ({ apiEndpoint }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState({ temperatura: 20, umidade: 50 });

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(apiEndpoint);
                const sensorData = await response.json();
                const temperatura = parseFloat(sensorData.find((sensor: { name: string; }) => sensor.name === "Sys/sensors/temperature").value);
                const umidade = parseFloat(sensorData.find((sensor: { name: string; }) => sensor.name === "Sys/sensors/humidity_air").value);
                setData({ temperatura, umidade });
            } catch (error) {
                console.error("Failed to fetch sensor data", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 10000); // Fetch data every 10 seconds
        return () => clearInterval(interval);
    }, [apiEndpoint]);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2; // Aproxima a câmera do cubo

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        if (mountRef.current) {
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            mountRef.current.appendChild(renderer.domElement);
        }

        // Ground grid
        const gridHelper = new THREE.GridHelper(1, 10, 0x999999, 0x999999);
        gridHelper.position.y = -1; // Posiciona a grade na base do cubo
        scene.add(gridHelper);

        const controls = new OrbitControls(camera, renderer.domElement);

        // Particle color based on temperature
        function getParticleColor(temp: number): THREE.Color {
            const t = (temp - 10) / 30; // Assume range from 10°C (blue) to 40°C (red)
            return new THREE.Color(1 - t, 0, t);
        }

        // Create particles based on humidity and temperature
        function createParticleCube(width: number, height: number, depth: number, temp: number, hum: number) {
            const particles = new THREE.BufferGeometry();
            const count = Math.floor(hum * 10); // Number of particles proportional to humidity
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const color = getParticleColor(temp);

            for (let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * width;
                positions[i + 1] = (Math.random() - 0.5) * height;
                positions[i + 2] = (Math.random() - 0.5) * depth;

                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.02,
                vertexColors: true,
            });

            return new THREE.Points(particles, material);
        }

        const particleCube = createParticleCube(1, 2, 1, data.temperatura, data.umidade);
        scene.add(particleCube);

        function animate() {
            requestAnimationFrame(animate);

            // Movimento das partículas para simular a umidade
            const positions = particleCube.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.005;     // Movimento em X
                positions[i + 1] += (Math.random() - 0.5) * 0.005; // Movimento em Y
                positions[i + 2] += (Math.random() - 0.5) * 0.005; // Movimento em Z
            }
            particleCube.geometry.attributes.position.needsUpdate = true;

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        const handleResize = () => {
            if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [data.temperatura, data.umidade]);

    return (
        <div
            ref={mountRef}
            className="h-full w-full"
            style={{ touchAction: 'none' }}
        ></div>
    );
};

export default ParticleCube;
