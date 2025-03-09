// PieChart.js
'use client';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './PieChart.module.css';

export default function PieChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const data = [25, 35, 40];
      const labels = ['Growth', 'Revenue', 'Engagement'];

      const generateGreenPalette = (ctx) => ({
        backgroundColors: [
          createGreenGradient(ctx, '#C8FACD', '#5BE584'),
          createGreenGradient(ctx, '#D8F3DC', '#95D5B2'),
          createGreenGradient(ctx, '#E6FCF5', '#38B2AC')
        ],
        borderColors: ['#2D9F6E', '#1B7A4F', '#115E3E']
      });

      const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: generateGreenPalette(ctx).backgroundColors,
            borderColor: generateGreenPalette(ctx).borderColors,
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverOffset: 10,
            spacing: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: 'easeOutBack'
          },
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 16,
                font: {
                  family: "'Inter', sans-serif",
                  size: 14
                },
                color: '#1A2E35',
                usePointStyle: true,
                pointStyle: 'rectRotated'
              }
            },
            tooltip: {
              backgroundColor: '#1A2E35',
              titleColor: '#95D5B2',
              bodyColor: '#C8FACD',
              titleFont: { family: "'Inter', sans-serif", size: 14 },
              bodyFont: { family: "'Inter', sans-serif", size: 14, weight: '600' },
              padding: 12,
              cornerRadius: 6,
              displayColors: false
            }
          },
          layout: {
            padding: 24
          },
          elements: {
            arc: {
              borderWidth: 0,
              borderRadius: 8,
              hoverBorderColor: '#F5F5F5'
            }
          }
        }
      });

      return () => pieChart.destroy();
    }
  }, []);

  const createGreenGradient = (ctx, start, end) => {
    const gradient = ctx.createRadialGradient(100, 100, 10, 100, 100, 100);
    gradient.addColorStop(0, start);
    gradient.addColorStop(1, end);
    return gradient;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Performance Metrics</h3>
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} />
      </div>
      <div className={styles.updatedText}>Current quarter • Updated live</div>
    </div>
  );
}