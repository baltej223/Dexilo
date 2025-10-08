import React, { useState, useRef, useEffect } from 'react';
import './WaveformGenerator.css';

const WaveformGenerator = ({ audioFile, onWaveformGenerated, waveformStyle = 'gradient' }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [waveformData, setWaveformData] = useState(null);

  const waveformStyles = {
    // Classic Styles
    gradient: { name: 'Gradient Bars', description: 'Colorful gradient bars with glow effect' },
    neon: { name: 'Neon Pulse', description: 'Electric neon waveform with pulse effect' },
    minimal: { name: 'Minimal Lines', description: 'Clean minimal line waveform' },
    vintage: { name: 'Vintage Vinyl', description: 'Retro vinyl record style' },
    spectrum: { name: 'Frequency Spectrum', description: 'Audio frequency spectrum visualization' },
    glitch: { name: 'Digital Glitch', description: 'Cyberpunk glitch art style' },
    
    // Artistic Styles
    watercolor: { name: 'Watercolor Splash', description: 'Artistic watercolor paint effect' },
    crystalline: { name: 'Crystal Formation', description: 'Geometric crystal-like structures' },
    organic: { name: 'Organic Flow', description: 'Natural flowing organic shapes' },
    holographic: { name: 'Holographic Foil', description: 'Iridescent holographic effect' },
    plasma: { name: 'Plasma Energy', description: 'Electric plasma energy waves' },
    galaxy: { name: 'Galaxy Nebula', description: 'Cosmic nebula with stars' },
    
    // Geometric Styles
    geometric: { name: 'Sacred Geometry', description: 'Mathematical geometric patterns' },
    hexagonal: { name: 'Hexagon Grid', description: 'Honeycomb hexagonal pattern' },
    triangular: { name: 'Triangle Mosaic', description: 'Triangular mosaic composition' },
    circular: { name: 'Circular Waves', description: 'Concentric circular patterns' },
    
    // Nature-Inspired
    mountain: { name: 'Mountain Range', description: 'Mountain silhouette landscape' },
    ocean: { name: 'Ocean Waves', description: 'Fluid ocean wave motion' },
    forest: { name: 'Forest Canopy', description: 'Tree canopy silhouettes' },
    aurora: { name: 'Aurora Borealis', description: 'Northern lights effect' },
    
    // Futuristic Styles
    matrix: { name: 'Digital Matrix', description: 'Matrix-style digital rain' },
    cyberpunk: { name: 'Cyberpunk Grid', description: 'Futuristic grid overlay' },
    neural: { name: 'Neural Network', description: 'Brain synapse connections' },
    quantum: { name: 'Quantum Field', description: 'Quantum particle field' },
    
    // Abstract Art
    abstract: { name: 'Abstract Art', description: 'Abstract expressionist style' },
    fractal: { name: 'Fractal Pattern', description: 'Mathematical fractal design' },
    mandala: { name: 'Mandala Circle', description: 'Spiritual mandala pattern' },
    kaleidoscope: { name: 'Kaleidoscope', description: 'Symmetrical kaleidoscope view' },
    
    // Vintage & Retro
    retro80s: { name: 'Retro 80s', description: 'Synthwave retro aesthetic' },
    artdeco: { name: 'Art Deco', description: '1920s art deco styling' },
    steampunk: { name: 'Steampunk', description: 'Victorian steampunk design' },
    psychedelic: { name: 'Psychedelic', description: '60s psychedelic art' }
  };

  const generateWaveform = async () => {
    if (!audioFile) return;

    setIsGenerating(true);
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const samples = 200; // Number of samples for waveform
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      
      // Normalize data
      const normalizedData = filteredData.map(value => value / Math.max(...filteredData));
      setWaveformData(normalizedData);
      
      // Draw waveform based on selected style
      drawWaveform(normalizedData);
      
      // Generate image URL for NFT
      const canvas = canvasRef.current;
      const imageUrl = canvas.toDataURL('image/png');
      onWaveformGenerated(imageUrl);
      
      // Show success toast for waveform generation
      if (window.showToast) {
        window.showToast('🌊 Waveform visualization generated successfully!', 'waveform');
      }
      
    } catch (error) {
      console.error('Error generating waveform:', error);
      if (window.showToast) {
        window.showToast('Failed to generate waveform. Please try again.', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const drawWaveform = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    switch (waveformStyle) {
      // Classic Styles
      case 'gradient':
        drawGradientBars(ctx, data, width, height);
        break;
      case 'neon':
        drawNeonPulse(ctx, data, width, height);
        break;
      case 'minimal':
        drawMinimalLines(ctx, data, width, height);
        break;
      case 'vintage':
        drawVintageVinyl(ctx, data, width, height);
        break;
      case 'spectrum':
        drawFrequencySpectrum(ctx, data, width, height);
        break;
      case 'glitch':
        drawDigitalGlitch(ctx, data, width, height);
        break;
        
      // Artistic Styles
      case 'watercolor':
        drawWatercolorSplash(ctx, data, width, height);
        break;
      case 'crystalline':
        drawCrystallineFormation(ctx, data, width, height);
        break;
      case 'organic':
        drawOrganicFlow(ctx, data, width, height);
        break;
      case 'holographic':
        drawHolographicFoil(ctx, data, width, height);
        break;
      case 'plasma':
        drawPlasmaEnergy(ctx, data, width, height);
        break;
      case 'galaxy':
        drawGalaxyNebula(ctx, data, width, height);
        break;
        
      // Geometric Styles
      case 'geometric':
        drawSacredGeometry(ctx, data, width, height);
        break;
      case 'hexagonal':
        drawHexagonGrid(ctx, data, width, height);
        break;
      case 'triangular':
        drawTriangleMosaic(ctx, data, width, height);
        break;
      case 'circular':
        drawCircularWaves(ctx, data, width, height);
        break;
        
      // Nature-Inspired
      case 'mountain':
        drawMountainRange(ctx, data, width, height);
        break;
      case 'ocean':
        drawOceanWaves(ctx, data, width, height);
        break;
      case 'forest':
        drawForestCanopy(ctx, data, width, height);
        break;
      case 'aurora':
        drawAuroraBorealis(ctx, data, width, height);
        break;
        
      // Futuristic Styles
      case 'matrix':
        drawDigitalMatrix(ctx, data, width, height);
        break;
      case 'cyberpunk':
        drawCyberpunkGrid(ctx, data, width, height);
        break;
      case 'neural':
        drawNeuralNetwork(ctx, data, width, height);
        break;
      case 'quantum':
        drawQuantumField(ctx, data, width, height);
        break;
        
      // Abstract Art
      case 'abstract':
        drawAbstractArt(ctx, data, width, height);
        break;
      case 'fractal':
        drawFractalPattern(ctx, data, width, height);
        break;
      case 'mandala':
        drawMandalaCircle(ctx, data, width, height);
        break;
      case 'kaleidoscope':
        drawKaleidoscope(ctx, data, width, height);
        break;
        
      // Vintage & Retro
      case 'retro80s':
        drawRetro80s(ctx, data, width, height);
        break;
      case 'artdeco':
        drawArtDeco(ctx, data, width, height);
        break;
      case 'steampunk':
        drawSteampunk(ctx, data, width, height);
        break;
      case 'psychedelic':
        drawPsychedelic(ctx, data, width, height);
        break;
        
      default:
        drawGradientBars(ctx, data, width, height);
    }
  };

  const drawGradientBars = (ctx, data, width, height) => {
    // Original gradient bars implementation
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#667eea');
    
    ctx.fillStyle = gradient;
    
    data.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
    
    // Add glow effect
    ctx.shadowColor = '#667eea';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    
    data.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  };

  const drawNeonPulse = (ctx, data, width, height) => {
    // Dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const barHeight = value * height * 0.9;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      // Neon glow effect
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Inner bright core
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y + barHeight * 0.1, barWidth - 4, barHeight * 0.8);
    });
  };

  const drawMinimalLines = (ctx, data, width, height) => {
    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + (value - 0.5) * height * 0.8;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  const drawVintageVinyl = (ctx, data, width, height) => {
    // Vintage background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, '#2c1810');
    gradient.addColorStop(1, '#1a0f08');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    data.forEach((value, index) => {
      const angle = (index / data.length) * Math.PI * 2;
      const radius = maxRadius * (0.3 + value * 0.7);
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `hsl(${30 + value * 30}, 70%, ${40 + value * 30}%)`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawFrequencySpectrum = (ctx, data, width, height) => {
    // Dark spectrum background
    ctx.fillStyle = '#000a1a';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const barHeight = value * height * 0.9;
      const x = index * barWidth;
      const y = height - barHeight;
      
      // Spectrum colors (blue to red based on frequency)
      const hue = (index / data.length) * 240; // Blue to red spectrum
      ctx.fillStyle = `hsl(${hue}, 100%, ${50 + value * 30}%)`;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Add reflection
      const reflectionGradient = ctx.createLinearGradient(0, height, 0, height + barHeight * 0.3);
      reflectionGradient.addColorStop(0, `hsla(${hue}, 100%, ${30 + value * 20}%, 0.5)`);
      reflectionGradient.addColorStop(1, `hsla(${hue}, 100%, ${30 + value * 20}%, 0)`);
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(x, height, barWidth - 1, barHeight * 0.3);
    });
  };

  const drawDigitalGlitch = (ctx, data, width, height) => {
    // Dark cyber background
    ctx.fillStyle = '#0d001a';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      // Random glitch offset
      const glitchOffset = Math.random() > 0.9 ? Math.random() * 10 - 5 : 0;
      
      // Primary color (magenta)
      ctx.fillStyle = '#ff0080';
      ctx.fillRect(x + glitchOffset, y, barWidth - 1, barHeight);
      
      // Glitch colors (cyan and yellow)
      if (Math.random() > 0.8) {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(x + glitchOffset + 2, y, barWidth - 1, barHeight);
      }
      
      if (Math.random() > 0.9) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + glitchOffset - 2, y, barWidth - 1, barHeight);
      }
    });
    
    // Add scan lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  };

  // Artistic Styles Drawing Functions
  const drawWatercolorSplash = (ctx, data, width, height) => {
    // Watercolor background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e8f4fd');
    gradient.addColorStop(0.5, '#b8e6ff');
    gradient.addColorStop(1, '#74c0fc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      const radius = value * 30 + 5;
      
      // Create watercolor splash effect
      const colors = ['#fd79a8', '#fdcb6e', '#6c5ce7', '#a29bfe', '#fd79a8'];
      const color = colors[index % colors.length];
      
      ctx.globalAlpha = 0.3 + value * 0.4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add smaller droplets
      for (let i = 0; i < 3; i++) {
        const dropX = x + (Math.random() - 0.5) * 40;
        const dropY = y + (Math.random() - 0.5) * 40;
        const dropRadius = Math.random() * 5 + 2;
        
        ctx.beginPath();
        ctx.arc(dropX, dropY, dropRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  };

  const drawCrystallineFormation = (ctx, data, width, height) => {
    // Dark crystal background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.8;
      const y = (height - barHeight) / 2;
      
      // Create crystal facets
      const facets = 6;
      const angleStep = (Math.PI * 2) / facets;
      
      ctx.fillStyle = `hsl(${180 + value * 60}, 70%, ${50 + value * 30}%)`;
      ctx.strokeStyle = `hsl(${180 + value * 60}, 90%, ${70 + value * 20}%)`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (let i = 0; i < facets; i++) {
        const angle = i * angleStep;
        const px = x + barWidth/2 + Math.cos(angle) * (barWidth/3);
        const py = y + barHeight/2 + Math.sin(angle) * (barHeight/4);
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Add inner glow
      ctx.shadowColor = `hsl(${180 + value * 60}, 100%, 70%)`;
      ctx.shadowBlur = 10;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  };

  const drawOrganicFlow = (ctx, data, width, height) => {
    // Natural gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2d5016');
    gradient.addColorStop(0.5, '#3c6e18');
    gradient.addColorStop(1, '#4a7c19');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Create flowing organic shapes
    ctx.strokeStyle = '#74b816';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    for (let layer = 0; layer < 3; layer++) {
      ctx.globalAlpha = 0.6 - layer * 0.2;
      ctx.beginPath();
      
      data.forEach((value, index) => {
        const x = (index / data.length) * width;
        const baseY = height / 2;
        const offset = (layer - 1) * 20;
        const y = baseY + offset + Math.sin(index * 0.1 + layer) * value * 50;
        
        if (index === 0) ctx.moveTo(x, y);
        else {
          const prevX = ((index - 1) / data.length) * width;
          const prevY = baseY + offset + Math.sin((index - 1) * 0.1 + layer) * data[index - 1] * 50;
          const cpX = (x + prevX) / 2;
          const cpY = (y + prevY) / 2 + Math.sin(index * 0.05) * 10;
          
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      });
      
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const drawHolographicFoil = (ctx, data, width, height) => {
    // Dark background for holographic effect
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.9;
      const y = (height - barHeight) / 2;
      
      // Create iridescent effect with multiple gradients
      const gradient1 = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
      const hue1 = (index * 10 + value * 60) % 360;
      const hue2 = (hue1 + 60) % 360;
      
      gradient1.addColorStop(0, `hsl(${hue1}, 100%, 60%)`);
      gradient1.addColorStop(0.5, `hsl(${hue2}, 100%, 70%)`);
      gradient1.addColorStop(1, `hsl(${(hue1 + 120) % 360}, 100%, 50%)`);
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Add metallic shine effect
      const shineGradient = ctx.createLinearGradient(x, y, x + barWidth/2, y);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = shineGradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  };

  const drawPlasmaEnergy = (ctx, data, width, height) => {
    // Dark energy background
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, width, height);
    
    // Create plasma energy effect
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      const energy = value * 100 + 20;
      
      // Main plasma bolt
      ctx.strokeStyle = `hsl(${280 + value * 80}, 100%, ${60 + value * 30}%)`;
      ctx.lineWidth = 3 + value * 5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.moveTo(x, y - energy/2);
      
      // Create lightning-like branches
      for (let i = 0; i < energy/10; i++) {
        const branchY = y - energy/2 + (i * energy/10);
        const branchX = x + (Math.random() - 0.5) * 20;
        ctx.lineTo(branchX, branchY);
      }
      ctx.lineTo(x, y + energy/2);
      ctx.stroke();
      
      // Add secondary bolts
      if (value > 0.7) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - 5, y - energy/3);
        ctx.lineTo(x + 5, y + energy/3);
        ctx.stroke();
      }
    });
    ctx.shadowBlur = 0;
  };

  const drawGalaxyNebula = (ctx, data, width, height) => {
    // Deep space background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Add stars
    for (let i = 0; i < 50; i++) {
      const starX = Math.random() * width;
      const starY = Math.random() * height;
      const starSize = Math.random() * 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create nebula effect
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + Math.sin(index * 0.05) * height * 0.2;
      const size = value * 40 + 10;
      
      // Nebula colors
      const colors = ['#ff6b9d', '#a8e6cf', '#ffd93d', '#6c5ce7', '#fd79a8'];
      const color = colors[index % colors.length];
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Geometric Styles Drawing Functions
  const drawSacredGeometry = (ctx, data, width, height) => {
    // Sacred geometry background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    data.forEach((value, index) => {
      const angle = (index / data.length) * Math.PI * 2;
      const radius = 50 + value * 60;
      
      // Golden ratio proportions
      const phi = (1 + Math.sqrt(5)) / 2;
      const innerRadius = radius / phi;
      
      // Draw geometric shapes
      ctx.strokeStyle = `hsl(${45 + value * 30}, 70%, ${50 + value * 30}%)`;
      ctx.lineWidth = 2;
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, 5, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner circle (golden ratio)
      ctx.beginPath();
      ctx.arc(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius, 3, 0, Math.PI * 2);
      ctx.stroke();
      
      // Connecting lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      ctx.stroke();
    });
  };

  const drawHexagonGrid = (ctx, data, width, height) => {
    // Honeycomb background
    ctx.fillStyle = '#2c2c54';
    ctx.fillRect(0, 0, width, height);
    
    const hexSize = 15;
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = 2 * hexSize;
    
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + (value - 0.5) * height * 0.6;
      
      // Draw hexagon
      ctx.strokeStyle = `hsl(${60 + value * 60}, 80%, ${40 + value * 40}%)`;
      ctx.fillStyle = `hsl(${60 + value * 60}, 60%, ${20 + value * 20}%)`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + Math.cos(angle) * hexSize * (0.5 + value);
        const py = y + Math.sin(angle) * hexSize * (0.5 + value);
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawTriangleMosaic = (ctx, data, width, height) => {
    // Mosaic background
    ctx.fillStyle = '#1e3c72';
    ctx.fillRect(0, 0, width, height);
    
    const triangleSize = 20;
    
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      const size = triangleSize * (0.5 + value);
      
      // Draw upward triangle
      ctx.fillStyle = `hsl(${200 + value * 120}, 70%, ${40 + value * 30}%)`;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x - size * Math.cos(Math.PI/6), y + size * Math.sin(Math.PI/6));
      ctx.lineTo(x + size * Math.cos(Math.PI/6), y + size * Math.sin(Math.PI/6));
      ctx.closePath();
      ctx.fill();
      
      // Draw downward triangle
      ctx.fillStyle = `hsl(${200 + value * 120}, 50%, ${30 + value * 20}%)`;
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x - size * Math.cos(Math.PI/6), y - size * Math.sin(Math.PI/6));
      ctx.lineTo(x + size * Math.cos(Math.PI/6), y - size * Math.sin(Math.PI/6));
      ctx.closePath();
      ctx.fill();
    });
  };

  const drawCircularWaves = (ctx, data, width, height) => {
    // Wave background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    data.forEach((value, index) => {
      const radius = (index / data.length) * Math.min(width, height) * 0.4;
      const amplitude = value * 20;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + value * 0.5})`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const waveRadius = radius + Math.sin(angle * 8 + index * 0.5) * amplitude;
        const x = centerX + Math.cos(angle) * waveRadius;
        const y = centerY + Math.sin(angle) * waveRadius;
        
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });
  };

  // Nature-Inspired Drawing Functions
  const drawMountainRange = (ctx, data, width, height) => {
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#FFB6C1');
    gradient.addColorStop(1, '#DDA0DD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw mountain layers
    const layers = 3;
    for (let layer = 0; layer < layers; layer++) {
      const layerAlpha = 0.8 - layer * 0.2;
      const layerHeight = 0.6 + layer * 0.1;
      
      ctx.fillStyle = `rgba(${70 + layer * 30}, ${50 + layer * 20}, ${80 + layer * 30}, ${layerAlpha})`;
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      data.forEach((value, index) => {
        const x = (index / data.length) * width;
        const mountainHeight = value * height * layerHeight;
        const y = height - mountainHeight - layer * 20;
        
        if (index === 0) ctx.lineTo(x, y);
        else {
          const prevX = ((index - 1) / data.length) * width;
          const prevValue = data[index - 1];
          const prevY = height - prevValue * height * layerHeight - layer * 20;
          
          // Create jagged mountain peaks
          const midX = (x + prevX) / 2;
          const midY = (y + prevY) / 2 + (Math.random() - 0.5) * 20;
          
          ctx.lineTo(midX, midY);
          ctx.lineTo(x, y);
        }
      });
      
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawOceanWaves = (ctx, data, width, height) => {
    // Ocean gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#e3f2fd');
    gradient.addColorStop(0.5, '#2196f3');
    gradient.addColorStop(1, '#0d47a1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw wave layers
    for (let wave = 0; wave < 4; wave++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 - wave * 0.1})`;
      ctx.lineWidth = 3 - wave * 0.5;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      data.forEach((value, index) => {
        const x = (index / data.length) * width;
        const baseY = height * (0.3 + wave * 0.15);
        const waveHeight = value * 30 * (1 + wave * 0.5);
        const y = baseY + Math.sin(index * 0.2 + wave * Math.PI/2) * waveHeight;
        
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    
    // Add foam effect
    data.forEach((value, index) => {
      if (value > 0.7) {
        const x = (index / data.length) * width;
        const y = height * 0.3 + value * 20;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 2 + value * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawForestCanopy = (ctx, data, width, height) => {
    // Forest background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#4a5d23');
    gradient.addColorStop(0.5, '#3c4f1c');
    gradient.addColorStop(1, '#2e3f16');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw tree silhouettes
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const treeHeight = value * height * 0.8 + height * 0.2;
      const treeWidth = 10 + value * 15;
      
      // Tree trunk
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(x - 3, height - treeHeight * 0.3, 6, treeHeight * 0.3);
      
      // Tree canopy
      ctx.fillStyle = `hsl(${100 + value * 40}, 40%, ${20 + value * 20}%)`;
      ctx.beginPath();
      
      // Create organic tree shape
      const canopyY = height - treeHeight;
      ctx.ellipse(x, canopyY + treeWidth/2, treeWidth/2, treeWidth/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add smaller branches
      for (let i = 0; i < 3; i++) {
        const branchX = x + (Math.random() - 0.5) * treeWidth;
        const branchY = canopyY + Math.random() * treeWidth;
        const branchSize = treeWidth * (0.3 + Math.random() * 0.4);
        
        ctx.beginPath();
        ctx.ellipse(branchX, branchY, branchSize/2, branchSize/2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawAuroraBorealis = (ctx, data, width, height) => {
    // Night sky background
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, width, height);
    
    // Add stars
    for (let i = 0; i < 30; i++) {
      const starX = Math.random() * width;
      const starY = Math.random() * height * 0.5;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starX, starY, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw aurora waves
    const colors = ['#00ffff', '#00ff88', '#88ff00', '#ffff00', '#ff8800'];
    
    for (let layer = 0; layer < 3; layer++) {
      const color = colors[layer];
      ctx.strokeStyle = color;
      ctx.lineWidth = 8 - layer * 2;
      ctx.globalAlpha = 0.6 - layer * 0.1;
      
      ctx.beginPath();
      data.forEach((value, index) => {
        const x = (index / data.length) * width;
        const baseY = height * (0.3 + layer * 0.1);
        const waveHeight = value * 60 + 20;
        const y = baseY + Math.sin(index * 0.1 + layer * Math.PI/3) * waveHeight;
        
        if (index === 0) ctx.moveTo(x, y);
        else {
          const prevX = ((index - 1) / data.length) * width;
          const prevValue = data[index - 1];
          const prevY = baseY + Math.sin((index - 1) * 0.1 + layer * Math.PI/3) * (prevValue * 60 + 20);
          
          const cpX = (x + prevX) / 2;
          const cpY = (y + prevY) / 2 + Math.sin(index * 0.05) * 20;
          
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      });
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  // Futuristic Styles Drawing Functions
  const drawDigitalMatrix = (ctx, data, width, height) => {
    // Matrix background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Digital rain effect
    const columns = data.length;
    const columnWidth = width / columns;
    
    data.forEach((value, index) => {
      const x = index * columnWidth;
      const rainHeight = value * height;
      
      // Main rain stream
      ctx.fillStyle = '#00ff41';
      ctx.font = '12px monospace';
      
      for (let i = 0; i < rainHeight / 15; i++) {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96);
        const y = (i * 15) + (Date.now() * 0.1 + index * 100) % height;
        
        ctx.globalAlpha = 1 - (i / (rainHeight / 15));
        ctx.fillText(char, x, y);
      }
      
      // Highlight characters
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1;
      const highlightY = (Date.now() * 0.1 + index * 100) % height;
      const highlightChar = String.fromCharCode(0x30A0 + Math.random() * 96);
      ctx.fillText(highlightChar, x, highlightY);
    });
    
    ctx.globalAlpha = 1;
  };

  const drawCyberpunkGrid = (ctx, data, width, height) => {
    // Cyberpunk background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Data visualization
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.8;
      const y = (height - barHeight) / 2;
      
      // Neon bars
      ctx.fillStyle = `hsl(${180 + value * 120}, 100%, 50%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Digital noise overlay
      if (value > 0.5) {
        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
        for (let i = 0; i < 5; i++) {
          const noiseX = x + Math.random() * barWidth;
          const noiseY = y + Math.random() * barHeight;
          ctx.fillRect(noiseX, noiseY, 2, 2);
        }
      }
    });
    
    ctx.shadowBlur = 0;
  };

  const drawNeuralNetwork = (ctx, data, width, height) => {
    // Neural background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, width, height);
    
    // Create nodes
    const nodes = [];
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + (value - 0.5) * height * 0.6;
      nodes.push({ x, y, value });
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const node1 = nodes[i];
      const node2 = nodes[i + 1];
      
      if (Math.abs(node1.value - node2.value) < 0.3) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
      }
      
      // Long-distance connections
      if (i < nodes.length - 3 && Math.random() > 0.8) {
        const node3 = nodes[i + 3];
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.2)';
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node3.x, node3.y);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      }
    }
    
    // Draw nodes
    nodes.forEach((node) => {
      const size = 3 + node.value * 8;
      
      ctx.fillStyle = `hsl(${200 + node.value * 60}, 80%, ${50 + node.value * 30}%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner glow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  };

  const drawQuantumField = (ctx, data, width, height) => {
    // Quantum void background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Quantum particles
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      const energy = value;
      
      // Particle probability cloud
      for (let i = 0; i < energy * 20; i++) {
        const particleX = x + (Math.random() - 0.5) * 60 * energy;
        const particleY = y + (Math.random() - 0.5) * 60 * energy;
        const size = Math.random() * 2;
        
        ctx.fillStyle = `hsl(${270 + energy * 90}, 100%, ${30 + Math.random() * 40}%)`;
        ctx.globalAlpha = 0.1 + energy * 0.4;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Quantum wave function
      ctx.strokeStyle = `hsl(${300 + energy * 60}, 80%, 60%)`;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const waveX = x + Math.cos(angle) * energy * 30;
        const waveY = y + Math.sin(angle) * energy * 30;
        
        if (angle === 0) ctx.moveTo(waveX, waveY);
        else ctx.lineTo(waveX, waveY);
      }
      ctx.stroke();
    });
    
    ctx.globalAlpha = 1;
  };

  // Abstract Art Drawing Functions
  const drawAbstractArt = (ctx, data, width, height) => {
    // Abstract background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(0.5, '#fecfef');
    gradient.addColorStop(1, '#fecfef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Abstract shapes based on audio data
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + (value - 0.5) * height * 0.4;
      
      // Random abstract shapes
      const shapeType = Math.floor(value * 3);
      const size = value * 40 + 10;
      const color = `hsl(${index * 10 + value * 180}, 70%, 60%)`;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      
      switch (shapeType) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Rectangle
          ctx.fillRect(x - size/2, y - size/2, size, size);
          break;
        case 2: // Triangle
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x - size, y + size);
          ctx.lineTo(x + size, y + size);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      // Abstract brush strokes
      if (value > 0.6) {
        ctx.strokeStyle = `hsl(${index * 15}, 60%, 40%)`;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.quadraticCurveTo(x, y - 20, x + 20, y);
        ctx.stroke();
      }
    });
    
    ctx.globalAlpha = 1;
  };

  const drawFractalPattern = (ctx, data, width, height) => {
    // Fractal background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Generate fractal based on audio data
    data.forEach((value, index) => {
      const angle = (index / data.length) * Math.PI * 2;
      const baseRadius = 20 + value * 60;
      
      // Recursive fractal branches
      drawFractalBranch(ctx, centerX, centerY, angle, baseRadius, value, 4);
    });
    
    function drawFractalBranch(ctx, x, y, angle, length, intensity, depth) {
      if (depth <= 0 || length < 2) return;
      
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      ctx.strokeStyle = `hsl(${intensity * 240}, 80%, ${50 + depth * 10}%)`;
      ctx.lineWidth = depth;
      ctx.globalAlpha = 0.8;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Recursive branches
      const newLength = length * 0.7;
      const angleOffset = intensity * Math.PI / 3;
      
      drawFractalBranch(ctx, endX, endY, angle - angleOffset, newLength, intensity, depth - 1);
      drawFractalBranch(ctx, endX, endY, angle + angleOffset, newLength, intensity, depth - 1);
    }
    
    ctx.globalAlpha = 1;
  };

  const drawMandalaCircle = (ctx, data, width, height) => {
    // Mandala background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, '#2e073f');
    gradient.addColorStop(1, '#7209b7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw mandala patterns
    for (let ring = 0; ring < 5; ring++) {
      const ringRadius = 20 + ring * 25;
      const segments = 8 + ring * 4;
      
      data.forEach((value, index) => {
        if (index % (Math.floor(data.length / segments)) === 0) {
          const angle = (index / data.length) * Math.PI * 2;
          const petalRadius = ringRadius + value * 20;
          
          // Draw petal
          ctx.fillStyle = `hsl(${280 + ring * 20 + value * 40}, 70%, ${50 + value * 20}%)`;
          ctx.strokeStyle = `hsl(${280 + ring * 20}, 90%, 70%)`;
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          const petalX = centerX + Math.cos(angle) * ringRadius;
          const petalY = centerY + Math.sin(angle) * ringRadius;
          
          // Create petal shape
          ctx.ellipse(petalX, petalY, value * 10 + 5, value * 15 + 3, angle, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Inner details
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.ellipse(petalX, petalY, value * 3 + 1, value * 5 + 1, angle, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    
    // Center circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawKaleidoscope = (ctx, data, width, height) => {
    // Kaleidoscope background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const segments = 6;
    
    // Create kaleidoscope pattern
    for (let segment = 0; segment < segments; segment++) {
      ctx.save();
      
      // Rotate for each segment
      ctx.translate(centerX, centerY);
      ctx.rotate((segment * Math.PI * 2) / segments);
      ctx.translate(-centerX, -centerY);
      
      // Draw pattern for this segment
      data.forEach((value, index) => {
        if (index < data.length / segments) {
          const x = centerX + (index / (data.length / segments)) * 60;
          const y = centerY - value * 40;
          const size = value * 15 + 3;
          
          const colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'];
          ctx.fillStyle = colors[index % colors.length];
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Mirror effect
          ctx.save();
          ctx.scale(1, -1);
          ctx.translate(0, -2 * centerY);
          ctx.beginPath();
          ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      
      ctx.restore();
    }
  };

  // Vintage & Retro Drawing Functions
  const drawRetro80s = (ctx, data, width, height) => {
    // 80s synthwave background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ff006e');
    gradient.addColorStop(0.5, '#8338ec');
    gradient.addColorStop(1, '#3a86ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Retro waveform
    const barWidth = width / data.length;
    
    data.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.8;
      const y = (height - barHeight) / 2;
      
      // Neon glow effect
      ctx.shadowColor = '#ff006e';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Inner bright core
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y + barHeight * 0.2, barWidth - 4, barHeight * 0.6);
      
      // Retro scan lines
      if (index % 3 === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let scanY = y; scanY < y + barHeight; scanY += 4) {
          ctx.beginPath();
          ctx.moveTo(x, scanY);
          ctx.lineTo(x + barWidth, scanY);
          ctx.stroke();
        }
      }
    });
    
    ctx.shadowBlur = 0;
  };

  const drawArtDeco = (ctx, data, width, height) => {
    // Art Deco background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Art Deco patterns
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      const fanHeight = value * height * 0.6;
      
      // Fan pattern
      const fanSegments = 8;
      const fanWidth = width / data.length;
      
      for (let segment = 0; segment < fanSegments; segment++) {
        const angle = (segment / fanSegments) * Math.PI - Math.PI / 2;
        const segmentHeight = fanHeight * (1 - segment / fanSegments);
        
        ctx.fillStyle = `hsl(${45 + segment * 15}, 60%, ${40 + value * 30}%)`;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * segmentHeight, y + Math.sin(angle) * segmentHeight);
        ctx.lineTo(x + Math.cos(angle + Math.PI/fanSegments) * segmentHeight, y + Math.sin(angle + Math.PI/fanSegments) * segmentHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      
      // Geometric accents
      if (value > 0.5) {
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(x - fanWidth/4, y - 5, fanWidth/2, 10);
      }
    });
  };

  const drawSteampunk = (ctx, data, width, height) => {
    // Steampunk background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, '#8b4513');
    gradient.addColorStop(0.5, '#654321');
    gradient.addColorStop(1, '#2f1b14');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Mechanical elements
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2 + (value - 0.5) * height * 0.4;
      const size = value * 20 + 10;
      
      // Brass gears
      ctx.strokeStyle = '#cd7f32';
      ctx.fillStyle = '#b8860b';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Gear teeth
      const teeth = Math.floor(size / 3);
      for (let tooth = 0; tooth < teeth; tooth++) {
        const angle = (tooth / teeth) * Math.PI * 2;
        const toothX = x + Math.cos(angle) * (size + 3);
        const toothY = y + Math.sin(angle) * (size + 3);
        
        ctx.fillRect(toothX - 1, toothY - 1, 2, 2);
      }
      
      // Center bolt
      ctx.fillStyle = '#696969';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Steam pipes
      if (value > 0.7) {
        ctx.strokeStyle = '#708090';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y - size - 20);
        ctx.stroke();
        
        // Steam effect
        for (let steam = 0; steam < 5; steam++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
          const steamX = x + (Math.random() - 0.5) * 10;
          const steamY = y - size - 20 - steam * 5;
          
          ctx.beginPath();
          ctx.arc(steamX, steamY, 2 + Math.random() * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  const drawPsychedelic = (ctx, data, width, height) => {
    // Psychedelic background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, '#ff1744');
    gradient.addColorStop(0.3, '#ff9800');
    gradient.addColorStop(0.6, '#9c27b0');
    gradient.addColorStop(1, '#3f51b5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Psychedelic patterns
    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height / 2;
      
      // Trippy spirals
      const spiralSize = value * 50 + 10;
      const spiralTurns = 3;
      
      ctx.strokeStyle = `hsl(${index * 30 + value * 180}, 100%, 70%)`;
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      for (let angle = 0; angle < spiralTurns * Math.PI * 2; angle += 0.1) {
        const radius = (angle / (spiralTurns * Math.PI * 2)) * spiralSize;
        const spiralX = x + Math.cos(angle) * radius;
        const spiralY = y + Math.sin(angle) * radius;
        
        if (angle === 0) ctx.moveTo(spiralX, spiralY);
        else ctx.lineTo(spiralX, spiralY);
      }
      ctx.stroke();
      
      // Floating shapes
      for (let shape = 0; shape < value * 5; shape++) {
        const shapeX = x + (Math.random() - 0.5) * 80;
        const shapeY = y + (Math.random() - 0.5) * 80;
        const shapeSize = Math.random() * 10 + 5;
        
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 60%)`;
        ctx.globalAlpha = 0.6;
        
        if (Math.random() > 0.5) {
          // Circle
          ctx.beginPath();
          ctx.arc(shapeX, shapeY, shapeSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Star
          drawStar(ctx, shapeX, shapeY, 5, shapeSize, shapeSize/2);
        }
      }
    });
    
    ctx.globalAlpha = 1;
    
    function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const starX = x + Math.cos(angle) * radius;
        const starY = y + Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(starX, starY);
        else ctx.lineTo(starX, starY);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  useEffect(() => {
    if (audioFile && waveformData) {
      drawWaveform(waveformData);
      
      // Generate new image URL when style changes
      const canvas = canvasRef.current;
      const imageUrl = canvas.toDataURL('image/png');
      onWaveformGenerated(imageUrl);
      
      // Show toast for style change (only if this isn't the initial generation)
      if (window.showToast && waveformData.length > 0) {
        window.showToast(`🎨 Waveform style updated to ${waveformStyles[waveformStyle]?.name}!`, 'waveform');
      }
    }
  }, [waveformStyle]);

  useEffect(() => {
    if (audioFile) {
      generateWaveform();
    }
  }, [audioFile]);

  return (
    <div className="waveform-generator">
      <div className="waveform-header">
        <h4>🎵 Audio Waveform Visualization</h4>
        {isGenerating && <span className="generating">Generating...</span>}
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="waveform-canvas"
      />
      
      {waveformData && (
        <div className="waveform-info">
          <p>✅ Waveform generated successfully</p>
          <div className="style-info">
            <strong>{waveformStyles[waveformStyle]?.name}</strong>
            <br />
            <small>{waveformStyles[waveformStyle]?.description}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveformGenerator;
