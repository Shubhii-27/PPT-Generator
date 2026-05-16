import React, { useState } from 'react';
import { FileDown, FileType, Loader2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

const ExportMenu = ({ presentation, template }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);

  const exportPDF = async () => {
    setIsExporting(true);
    setExportType('PDF');
    
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720]
      });

      const exportContainer = document.getElementById('export-container');
      exportContainer.style.display = 'block';

      for (let i = 0; i < presentation.slides.length; i++) {
        const slideElement = document.getElementById(`export-slide-${i}`);
        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage([1280, 720], 'landscape');
        pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
      }

      exportContainer.style.display = 'none';
      pdf.save(`${presentation.title || 'Presentation'}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportPPTX = async () => {
    setIsExporting(true);
    setExportType('PPTX');
    
    try {
      const pptx = new pptxgen();
      
      presentation.slides.forEach((slideData) => {
        const slide = pptx.addSlide();
        
        // Background
        slide.background = { color: slideData.backgroundColor || template.style.backgroundColor || '#ffffff' };
        
        // Title
        slide.addText(slideData.title.replace(/<[^>]*>/g, ''), {
          x: 0.5, y: 0.5, w: '90%', h: 1.5,
          fontSize: 44,
          color: (slideData.textColor || template.style.color || '#000000').replace('#', ''),
          bold: true,
          align: slideData.textAlign || 'left'
        });
        
        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle.replace(/<[^>]*>/g, ''), {
            x: 0.5, y: 2, w: '90%', h: 1,
            fontSize: 24,
            color: template.style.accentColor.replace('#', ''),
            align: slideData.textAlign || 'left'
          });
        }
        
        // Content
        if (slideData.content) {
          slide.addText(slideData.content.replace(/<[^>]*>/g, ''), {
            x: 0.5, y: 3, w: '90%', h: 2,
            fontSize: 18,
            color: (slideData.textColor || template.style.color || '#000000').replace('#', ''),
            align: slideData.textAlign || 'left'
          });
        }

        // Image (if any)
        if (slideData.image) {
          slide.addImage({ 
            data: slideData.image, 
            x: (slideData.imageX || 100) / 100 * 10, 
            y: (slideData.imageY || 100) / 100 * 5.6, 
            w: (slideData.imageW || 300) / 100 * 10, 
            h: (slideData.imageH || 200) / 100 * 5.6 
          });
        }
      });

      pptx.writeFile({ fileName: `${presentation.title || 'Presentation'}.pptx` });
    } catch (error) {
      console.error('PPTX Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Export Presentation</h1>
        <p>Save your work in professional formats</p>
      </div>

      <div className="export-grid">
        <div className="export-card">
          <div className="export-icon-wrapper pdf">
            <FileDown size={40} />
          </div>
          <div className="export-info">
            <h3>Export as PDF</h3>
            <p>Best for sharing, printing, and universal viewing.</p>
            <ul className="export-features">
              <li>High-quality images</li>
              <li>Preserves all formatting</li>
              <li>Small file size</li>
            </ul>
          </div>
          <button 
            className="btn-primary" 
            onClick={exportPDF}
            disabled={isExporting}
          >
            {isExporting && exportType === 'PDF' ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <Download size={18} />
            )}
            {isExporting && exportType === 'PDF' ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon-wrapper pptx">
            <FileType size={40} />
          </div>
          <div className="export-info">
            <h3>Export as PPTX</h3>
            <p>Best for editing in PowerPoint or Google Slides.</p>
            <ul className="export-features">
              <li>Editable text elements</li>
              <li>Native shapes and objects</li>
              <li>Standard 16:9 ratio</li>
            </ul>
          </div>
          <button 
            className="btn-primary" 
            onClick={exportPPTX}
            disabled={isExporting}
          >
            {isExporting && exportType === 'PPTX' ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <Download size={18} />
            )}
            {isExporting && exportType === 'PPTX' ? 'Generating PPTX...' : 'Download PPTX'}
          </button>
        </div>
      </div>

      {/* Hidden Export Rendering Area */}
      <div id="export-container" style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
        {presentation.slides.map((slide, index) => (
          <div 
            key={index} 
            id={`export-slide-${index}`}
            style={{
              width: '1280px',
              height: '720px',
              backgroundColor: slide.backgroundColor || template.style.backgroundColor || '#ffffff',
              color: slide.textColor || template.style.color || '#000000',
              fontFamily: template.style.fontFamily,
              position: 'relative',
              overflow: 'hidden',
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: slide.textAlign || 'left'
            }}
          >
             <h1 style={{ fontSize: '72px', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: slide.title }} />
             <h2 style={{ fontSize: '32px', color: template.style.accentColor, marginBottom: '40px' }} dangerouslySetInnerHTML={{ __html: slide.subtitle }} />
             <div style={{ fontSize: '24px', opacity: 0.8 }} dangerouslySetInnerHTML={{ __html: slide.content }} />
             
             {slide.image && (
               <img 
                 src={slide.image} 
                 style={{
                   position: 'absolute',
                   left: `${slide.imageX || 10}%`,
                   top: `${slide.imageY || 40}%`,
                   width: `${slide.imageW || 40}%`,
                   height: `${slide.imageH || 35}%`,
                   borderRadius: `${slide.imageRadius || 0}px`,
                   border: slide.imageBorder ? `${slide.imageBorder}px solid ${template.style.accentColor}` : 'none',
                   objectFit: 'cover'
                 }} 
               />
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportMenu;
