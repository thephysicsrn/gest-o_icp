import React, { useEffect, useRef } from 'react';

interface ScienceCanvas3DProps {
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface OrbitalNode {
  radiusX: number;
  radiusY: number;
  angle: number;
  speed: number;
  tilt: number;
  tiltZ: number;
  size: number;
  color: string;
  glowColor: string;
  label?: string;
}

interface LatticePoint extends Point3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  pulsePhase: number;
}

export const ScienceCanvas3D: React.FC<ScienceCanvas3DProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse parallax tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left - rect.width / 2;
      const clientY = e.clientY - rect.top - rect.height / 2;
      targetRotationY = (clientX / rect.width) * 0.45;
      targetRotationX = -(clientY / rect.height) * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Pause when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Lattice 3D points (Molecular structure)
    const latticePoints: LatticePoint[] = [
      { baseX: 0, baseY: 0, baseZ: 0, x: 0, y: 0, z: 0, radius: 10, pulsePhase: 0 },
      { baseX: -75, baseY: -45, baseZ: 30, x: 0, y: 0, z: 0, radius: 6, pulsePhase: 1 },
      { baseX: 70, baseY: -50, baseZ: -25, x: 0, y: 0, z: 0, radius: 5.5, pulsePhase: 2 },
      { baseX: -80, baseY: 55, baseZ: -35, x: 0, y: 0, z: 0, radius: 6, pulsePhase: 3 },
      { baseX: 75, baseY: 50, baseZ: 40, x: 0, y: 0, z: 0, radius: 6.5, pulsePhase: 4 },
      { baseX: 0, baseY: -85, baseZ: 45, x: 0, y: 0, z: 0, radius: 5, pulsePhase: 5 },
      { baseX: 0, baseY: 90, baseZ: -40, x: 0, y: 0, z: 0, radius: 5.5, pulsePhase: 6 },
      { baseX: -115, baseY: 10, baseZ: 10, x: 0, y: 0, z: 0, radius: 4.5, pulsePhase: 1.5 },
      { baseX: 110, baseY: -5, baseZ: -15, x: 0, y: 0, z: 0, radius: 4.5, pulsePhase: 3.5 },
    ];

    // Bonds connecting points
    const bonds: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 7], [3, 7], [2, 8], [4, 8], [1, 5], [2, 5], [3, 6], [4, 6]
    ];

    // Orbiting nodes (data satellites representing research fields)
    const orbitalNodes: OrbitalNode[] = [
      { radiusX: 130, radiusY: 55, angle: 0, speed: 0.012, tilt: 0.45, tiltZ: 0.2, size: 5, color: '#70B32D', glowColor: 'rgba(112, 179, 45, 0.4)', label: 'Hipótese' },
      { radiusX: 155, radiusY: 65, angle: 2.1, speed: -0.009, tilt: -0.55, tiltZ: -0.3, size: 5.5, color: '#005696', glowColor: 'rgba(0, 86, 150, 0.4)', label: 'Metodologia' },
      { radiusX: 175, radiusY: 75, angle: 4.2, speed: 0.008, tilt: 0.85, tiltZ: -0.15, size: 5, color: '#002B5C', glowColor: 'rgba(0, 43, 92, 0.4)', label: 'Evidência' },
      { radiusX: 195, radiusY: 80, angle: 1.2, speed: -0.006, tilt: -0.2, tiltZ: 0.7, size: 4.5, color: '#86D636', glowColor: 'rgba(134, 214, 54, 0.35)', label: 'Diário' },
    ];

    // Ambient floating particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.5) * 360,
      z: (Math.random() - 0.5) * 200,
      vy: -0.2 - Math.random() * 0.3,
      size: 1.2 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.45,
    }));

    let baseTime = 0;

    // 3D rotation projection helper
    const project = (x: number, y: number, z: number, rx: number, ry: number, focalLength: number = 380) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = focalLength / (focalLength + z2);
      return {
        screenX: width / 2 + x1 * scale,
        screenY: height / 2 + y1 * scale,
        scale,
        depth: z2,
      };
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      baseTime += prefersReducedMotion ? 0.002 : 0.015;

      // Smooth camera interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      const autoRotY = baseTime * 0.35 + currentRotationY;
      const autoRotX = Math.sin(baseTime * 0.2) * 0.15 + currentRotationX;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Background Concentric Scientific Radar Rings
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.strokeStyle = 'rgba(0, 43, 92, 0.04)';
      ctx.lineWidth = 1;
      [70, 130, 190].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Subtle crosshair
      ctx.strokeStyle = 'rgba(0, 43, 92, 0.03)';
      ctx.beginPath();
      ctx.moveTo(centerX - 210, centerY);
      ctx.lineTo(centerX + 210, centerY);
      ctx.moveTo(centerX, centerY - 210);
      ctx.lineTo(centerX, centerY + 210);
      ctx.stroke();
      ctx.restore();

      // 2. Draw Floating Particles
      particles.forEach((p) => {
        p.y += p.vy;
        if (p.y < -180) p.y = 180;

        const proj = project(p.x, p.y, p.z, autoRotX * 0.5, autoRotY * 0.5, 340);
        if (proj.scale > 0) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(112, 179, 45, ${p.opacity * proj.scale})`;
          ctx.arc(proj.screenX, proj.screenY, p.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Update & Project Lattice Points
      const projectedLattice = latticePoints.map((pt) => {
        // Micro-breathing per point
        const pulse = Math.sin(baseTime * 2 + pt.pulsePhase) * 3;
        const x = pt.baseX + pulse * 0.5;
        const y = pt.baseY + pulse * 0.5;
        const z = pt.baseZ + pulse;
        return {
          ...pt,
          ...project(x, y, z, autoRotX, autoRotY, 400),
        };
      });

      // 4. Draw Bonds (Connecting lines with glowing depth)
      bonds.forEach(([i, j]) => {
        const p1 = projectedLattice[i];
        const p2 = projectedLattice[j];
        if (!p1 || !p2 || p1.scale <= 0 || p2.scale <= 0) return;

        const avgDepth = (p1.depth + p2.depth) / 2;
        const bondAlpha = Math.max(0.08, Math.min(0.45, 0.3 - avgDepth / 400));

        const grad = ctx.createLinearGradient(p1.screenX, p1.screenY, p2.screenX, p2.screenY);
        grad.addColorStop(0, `rgba(0, 43, 92, ${bondAlpha * 1.2})`);
        grad.addColorStop(0.5, `rgba(112, 179, 45, ${bondAlpha * 1.5})`);
        grad.addColorStop(1, `rgba(0, 43, 92, ${bondAlpha * 1.2})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(0.8, 1.6 * ((p1.scale + p2.scale) / 2));
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.stroke();

        // Animated pulse packet moving along bond
        const t = (Math.sin(baseTime * 1.8 + i + j) + 1) / 2;
        const packetX = p1.screenX + (p2.screenX - p1.screenX) * t;
        const packetY = p1.screenY + (p2.screenY - p1.screenY) * t;
        ctx.fillStyle = `rgba(134, 214, 54, ${bondAlpha * 1.8})`;
        ctx.beginPath();
        ctx.arc(packetX, packetY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Elliptical Orbit Rings
      orbitalNodes.forEach((orb, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(orb.tiltZ + autoRotY * 0.15);
        ctx.scale(1, Math.cos(orb.tilt + autoRotX * 0.3));

        ctx.beginPath();
        ctx.ellipse(0, 0, orb.radiusX, orb.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(0, 43, 92, 0.1)' : 'rgba(112, 179, 45, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // 6. Draw Orbiting Nodes
      orbitalNodes.forEach((orb) => {
        orb.angle += orb.speed;
        // Calculate position on the tilted ellipse
        const localX = Math.cos(orb.angle) * orb.radiusX;
        const localY = Math.sin(orb.angle) * orb.radiusY;

        // Apply tilt
        const tiltedY = localY * Math.cos(orb.tilt);
        const tiltedZ = localY * Math.sin(orb.tilt);

        const proj = project(localX, tiltedY, tiltedZ, autoRotX, autoRotY, 400);
        if (proj.scale <= 0) return;

        // Glow ring
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, orb.size * proj.scale * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = orb.glowColor;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, orb.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = orb.color;
        ctx.fill();

        // Node white specular highlight
        ctx.beginPath();
        ctx.arc(proj.screenX - 1.2, proj.screenY - 1.2, orb.size * proj.scale * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();

        // Mini Label if closer to camera
        if (proj.depth < 50 && orb.label && width > 480) {
          ctx.font = '600 9px Outfit, Inter, sans-serif';
          ctx.fillStyle = 'rgba(0, 43, 92, 0.75)';
          ctx.fillText(orb.label, proj.screenX + 8, proj.screenY + 3);
        }
      });

      // 7. Draw Lattice Nodes (sorted by depth for painter's algorithm)
      const sortedLattice = [...projectedLattice].sort((a, b) => b.depth - a.depth);
      sortedLattice.forEach((pt) => {
        if (pt.scale <= 0) return;

        const effectiveRadius = pt.radius * pt.scale;

        // Soft outer aura
        const gradient = ctx.createRadialGradient(
          pt.screenX, pt.screenY, 0,
          pt.screenX, pt.screenY, effectiveRadius * 2.2
        );
        if (pt.baseX === 0 && pt.baseY === 0) {
          // Central Core Nucleus (The Research Catalyst)
          gradient.addColorStop(0, 'rgba(0, 43, 92, 0.95)');
          gradient.addColorStop(0.4, 'rgba(112, 179, 45, 0.5)');
          gradient.addColorStop(1, 'rgba(112, 179, 45, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(112, 179, 45, 0.8)');
          gradient.addColorStop(0.5, 'rgba(0, 43, 92, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 43, 92, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, effectiveRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Solid Sphere
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, effectiveRadius, 0, Math.PI * 2);
        ctx.fillStyle = pt.baseX === 0 && pt.baseY === 0 ? '#002B5C' : '#528521';
        ctx.fill();

        // Specular 3D highlight
        ctx.beginPath();
        ctx.arc(
          pt.screenX - effectiveRadius * 0.3,
          pt.screenY - effectiveRadius * 0.3,
          effectiveRadius * 0.35,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[560px] max-h-[500px] object-contain drop-shadow-sm pointer-events-auto"
        style={{ touchAction: 'none' }}
        aria-label="Visualização 3D de órbitas e estrutura molecular da pesquisa científica"
        role="img"
      />
    </div>
  );
};
