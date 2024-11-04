"use client"
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import IframeResizer from '@iframe-resizer/react'

interface ColorClass {
    active: string;
    inactive: string;
    text: string;
  }
  
interface ColorClasses {
    [key: string]: ColorClass;
  }  

const colorClasses: ColorClasses = {
    red: {
      active: 'bg-red-700',
      inactive: 'bg-red-500',
      text: 'Button'
    },
    blue: {
      active: 'bg-blue-700',
      inactive: 'bg-blue-500',
      text: 'Dropdown'
    },
    yellow: {
      active: 'bg-yellow-700',
      inactive: 'bg-yellow-500',
      text: 'Logo'
    },
    green: {
      active: 'bg-green-700',
      inactive: 'bg-green-500',
      text: 'Hyperlink'
    },
    orange: {
      active: 'bg-orange-700',
      inactive: 'bg-orange-500',
      text: 'Search'
    },
    black: {
      active: 'bg-zinc-800',
      inactive: 'bg-black',
      text: 'Menu'
    },
  };  

const LabelCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<[number, number]>([1200, 500])
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [currentColor, setCurrentColor] = useState<string>('black');
    const [lineWidth, setLineWidth] = useState<number>(3);
    const [drawingActions, setDrawingActions] = useState<Array<{ path: Array<{x: number, y: number}>, style: { color: string; lineWidth: number } }>>([]);
    const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
    const [currentStyle, setCurrentStyle] = useState<{ color: string; lineWidth: number }>({ color: 'black', lineWidth: 3 });
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [displayCanvas, setDisplayCanvas] = useState<boolean>(true)
    const [screenDimensions, setScreenDimensions] = useState<{width: number, height: number}>({ width: 0, height: 0 });


    const [websiteCounter, setWebsiteCounter] = useState<number>(0)
    const websiteList = ["http://127.0.0.1:5500/frontend/sign_up_page.html","https://yelp.com", "https://example.com"]

    useEffect(() => {
        if (canvasRef.current){
            const canvas = canvasRef.current;
            canvas.width = canvasSize[0];
            canvas.height = canvasSize[1];
            const ctx = canvas.getContext('2d');
            setContext(ctx);
            // reDrawPreviousData(ctx);
        }

        const handleScreenDimensions = (event: MessageEvent) => {
            if (event.data && event.data.width && event.data.height) {
                setScreenDimensions({ width: event.data.width, height: event.data.height });
            }
        };
        
        window.addEventListener('message', handleScreenDimensions);
        
        return () => {
            window.removeEventListener('message', handleScreenDimensions);
        };

    }, [])

    // const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    //     if (context) {
    //         context.beginPath();
    //         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    //         setDrawing(true);
    //     }
    // }

    // const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    //     if (!drawing) return;
    //     if (context) {
    //         context.strokeStyle = currentStyle.color;
    //         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    //         context.stroke();
    //         setCurrentPath([...currentPath, {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}]);
    //     }
    // }

    // const endDrawing = () => {
    //     setDrawing(false);
    //     context && context.closePath();
    //     if (currentPath.length > 0){
    //         setDrawingActions([...drawingActions, {path: currentPath, style: currentStyle}]);
    //     }
    //     setCurrentPath([]);
    // }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (context) {
            // Capture the starting point (the first corner of the rectangle)
            const startX = e.nativeEvent.offsetX;
            const startY = e.nativeEvent.offsetY;
            setStartPoint({ x: startX, y: startY });
            setDrawing(true);
        }
    };
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing || !startPoint) return;
        if (context && canvasRef.current) {
            // Clear the canvas before redrawing the rectangle
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
            // Redraw all previously saved rectangles
            drawingActions.forEach(({ path, style }) => {
                context.beginPath();
                context.strokeStyle = style.color;
                context.lineWidth = style.lineWidth;
                const [start, end] = path; // Rectangle is defined by two corners
                const width = end.x - start.x;
                const height = end.y - start.y;
                context.strokeRect(start.x, start.y, width, height);
            });
    
            // Current mouse position (opposite corner)
            const currentX = e.nativeEvent.offsetX;
            const currentY = e.nativeEvent.offsetY;
    
            // Draw the current rectangle from startPoint to current mouse position
            const width = currentX - startPoint.x;
            const height = currentY - startPoint.y;
    
            context.strokeStyle = currentStyle.color;
            context.lineWidth = currentStyle.lineWidth;
            context.strokeRect(startPoint.x, startPoint.y, width, height);
        }
    };
    
    const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!startPoint) return;
    
        setDrawing(false);
        if (context) {
            const endX = e.nativeEvent.offsetX;
            const endY = e.nativeEvent.offsetY;
            // Capture the final rectangle points and save the drawing action
            const endPoint = { x: endX, y: endY };
            const path = [startPoint, endPoint];
    
            setDrawingActions([...drawingActions, { path, style: currentStyle }]);
        }
        setStartPoint(null); // Reset the start point
    };
        
    const changeColor = (color: string) => {
        setCurrentColor(color);
        setCurrentStyle({...currentStyle, color: color})
    }

    const changeWidth = (width: number) => {
        setLineWidth(width);
        setCurrentStyle({...currentStyle, lineWidth: width})
    }

    const undoDrawing = () => {
        if (drawingActions.length > 0 && canvasRef.current){
            drawingActions.pop();
            const newContext = canvasRef.current.getContext('2d');
            const width = canvasRef.current.width ?? 0;
            const height = canvasRef.current.height ?? 0;
            newContext?.clearRect(0, 0, width, height);

            if (newContext){
                drawingActions.forEach(({path, style}) => {
                    newContext.beginPath();
                    newContext.strokeStyle = style.color;
                    newContext.lineWidth = style.lineWidth;
                    const [start, end] = path; // Rectangle is defined by two corners
                    const width = end.x - start.x;
                    const height = end.y - start.y;
                    newContext.strokeRect(start.x, start.y, width, height);
                    });
            };
        }
    }

    const clearDrawing = () => {
        setDrawingActions([]);
        setCurrentPath([]);
        if (canvasRef.current){
            const newContext = canvasRef.current.getContext('2d');
            newContext?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        };
    };

    const reDrawPreviousData = (ctx: CanvasRenderingContext2D) => {
        drawingActions.forEach(({ path, style }) => {
            ctx.beginPath();
            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.lineWidth;
            const [start, end] = path; // Rectangle is defined by two corners
            const width = end.x - start.x;
            const height = end.y - start.y;
            ctx.strokeRect(start.x, start.y, width, height);
        });
    };

    // const captureDiv = async () => {
    //     if (divRef.current) {
    //         const canvas = await html2canvas(divRef.current);
    //         const imgDataUrl = canvas.toDataURL("image/png");

    //         // Display the image in a new window/tab
    //         const newTab = window.open();
    //         newTab?.document.write(`<img src="${imgDataUrl}" alt="Screenshot" />`);
    //     }
    // }

    const captureDiv = () => {
        if (divRef.current) {
          toPng(divRef.current)
            .then((dataUrl) => {
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = 'screenshot.png';
              link.click();
            })
            .catch((error) => {
              console.error('Error capturing image:', error);
            });
        }
      };
      

    return(
        <div className='flex flex-row'>
            <div className='flex justify-center space-y-4 flex-col mx-4'>
                {['red', 'blue', 'yellow', 'green', 'orange', 'black'].map((color) => (
                <div key={color} className='flex flex-row space-x-2 text-black items-center'>
                    <div
                        className={`w-8 h-8 rounded-full cursor-pointer ${
                        currentColor === color ? colorClasses[color].active : colorClasses[color].inactive
                        }`}
                        onClick={() => changeColor(color)}
                    />
                    <p>{colorClasses[color].text}</p>
                </div>
                ))}
                <button
                    onClick={() => setDisplayCanvas(!displayCanvas)}
                    className={`px-4 py-2 rounded ${displayCanvas ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                    {displayCanvas ? 'On' : 'Off'}
                </button>
            </div>
            <div>
                <div className='flex justify-center my-4'>
                    <button className='bg-blue-500 text-white px-4 py-2 mr-2'
                        onClick={() => setWebsiteCounter((websiteCounter - 1) < 0 ? 0 : (websiteCounter - 1))}>
                        Back
                    </button>
                    <button className='bg-red-500 text-white px-4 py-2'
                        onClick={() => setWebsiteCounter((websiteCounter + 1) % websiteList.length)}>
                        Next
                    </button>
                    <button onClick={captureDiv} className="p-2 bg-green-500 text-white rounded">
                        Capture Screenshot
                    </button>
                    
                    <div>Screen Dimensions: {screenDimensions.width} x {screenDimensions.height}</div>
                </div>

                <div 
                    ref={divRef}
                    className='relative flex justify-center items-center'
                    style={{width: canvasSize[0], height: canvasSize[1]}}>
                    <iframe 
                        src={websiteList[websiteCounter]} 
                        srcDoc={`<script>
                                    document.writeln(window.screen.width,'x',window.screen.height)
                                </script>`}
                        title="Website Display"
                        className="top-0 left-0"
                        style={{
                            width: '100%',
                            maxWidth: canvasSize[0], // Define your desired max width
                            overflow: 'auto',   // Enable scrolling within the iframe
                            height: canvasSize[1]
                        }}              
                    />
                    {/* <IframeResizer
                        license="GPLv3"
                        src={websiteList[websiteCounter]}
                        style={{
                            width: '100%',
                            maxWidth: canvasSize[0], // Define your desired max width
                            overflow: 'auto',   // Enable scrolling within the iframe
                            height: '100%'
                        }}              
                    /> */}


                    <canvas 
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseOut={endDrawing}
                        className= {`absolute top-0 left-0 border border-gray-400`}
                        style={{
                            zIndex: displayCanvas ? 100 : -100, // Place canvas above iframe when displayCanvas is true
                        }}            
                    />
                </div>

                <div className='flex my-4'>
                    <div className='flex justify-center my-4'>
                        <button className='bg-blue-500 text-white px-4 py-2 mr-2'
                            onClick={undoDrawing}>
                            Undo
                        </button>
                        <button className='bg-red-500 text-white px-4 py-2'
                            onClick={clearDrawing}>
                            Clear
                        </button>
                    </div>

                    <div className='flex-grow' />
                    <div>

                        <input 
                            type='range'
                            min={1}
                            max={10}
                            value={lineWidth}
                            onChange={(e) => changeWidth(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LabelCanvas;
