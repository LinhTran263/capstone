"use client"
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';

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
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
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
    const websiteList = ["https://www.google.com",
"https://www.blogger.com",
"https://www.youtube.com",
"https://www.linkedin.com",
"https://www.cloudflare.com",
"https://www.microsoft.com",
"https://www.apple.com",
"https://www.en.wikipedia.org",
"https://www.play.google.com",
"https://www.wordpress.org",
"https://www.mozilla.org",
"https://www.bp.blogspot.com",
"https://www.europa.eu",
"https://www.whatsapp.com",
"https://www.adobe.com",
"https://www.facebook.com",
"https://www.uol.com.br",
"https://www.istockphoto.com",
"https://www.vimeo.com",
"https://www.github.com",
"https://www.amazon.com",
"https://www.bbc.co.uk",
"https://www.gravatar.com",
"https://www.cnn.com",
"https://www.dropbox.com",
"https://www.wikimedia.org",
"https://www.creativecommons.org",
"https://www.opera.com",
"https://www.globo.com",
"https://www.brandbucket.com",
"https://www.myspace.com",
"https://www.slideshare.net",
"https://www.paypal.com",
"https://www.netvibes.com",
"https://www.theguardian.com",
"https://www.who.int",
"https://www.medium.com",
"https://www.tools.google.com",
"https://www.draft.blogger.com",
"https://www.pt.wikipedia.org",
"https://www.fr.wikipedia.org",
"https://www.weebly.com",
"https://www.news.google.com",
"https://www.developers.google.com",
"https://www.w3.org",
"https://www.mail.google.com",
"https://www.gstatic.com",
"https://www.jimdofree.com",
"https://www.cpanel.net",
"https://www.imdb.com",
"https://www.wa.me",
"https://www.feedburner.com",
"https://www.enable-javascript.com",
"https://www.nytimes.com",
"https://www.workspace.google.com",
"https://www.ok.ru",
"https://www.google.es",
"https://www.dailymotion.com",
"https://www.afternic.com",
"https://www.bloomberg.com",
"https://www.amazon.de",
"https://www.photos.google.com",
"https://www.wiley.com",
"https://www.aliexpress.com",
"https://www.indiatimes.com",
"https://www.youronlinechoices.com",
"https://www.elpais.com",
"https://www.tinyurl.com",
"https://www.yadi.sk",
"https://www.spotify.com",
"https://www.huffpost.com",
"https://www.ru.wikipedia.org",
"https://www.google.fr",
"https://www.webmd.com",
"https://www.samsung.com",
"https://www.independent.co.uk",
"https://www.amazon.co.jp",
"https://www.get.google.com",
"https://www.amazon.co.uk",
"https://www.4shared.com",
"https://www.telegram.me",
"https://www.planalto.gov.br",
"https://www.businessinsider.com",
"https://www.ig.com.br",
"https://www.issuu.com",
"https://www.wsj.com",
"https://www.hugedomains.com",
"https://www.picasaweb.google.com",
"https://www.usatoday.com",
"https://www.scribd.com",
"https://www.gov.uk",
"https://www.storage.googleapis.com",
"https://www.huffingtonpost.com",
"https://www.bbc.com",
"https://www.estadao.com.br",
"https://www.nature.com",
"https://www.mediafire.com",
"https://www.washingtonpost.com",
"https://www.forms.gle",
"https://www.namecheap.com",
"https://www.forbes.com",
"https://www.mirror.co.uk",
"https://www.soundcloud.com",
"https://www.fb.com",
"https://www.marketingplatform.google....",
"https://www.domainmarket.com",
"https://www.ytimg.com",
"https://www.terra.com.br",
"https://www.google.co.uk",
"https://www.shutterstock.com",
"https://www.dailymail.co.uk",
"https://www.reg.ru",
"https://www.t.co",
"https://www.cdc.gov",
"https://www.thesun.co.uk",
"https://www.wp.com",
"https://www.cnet.com",
"https://www.instagram.com",
"https://www.researchgate.net",
"https://www.google.it",
"https://www.fandom.com",
"https://www.office.com",
"https://www.list-manage.com",
"https://www.msn.com",
"https://www.un.org",
"https://www.de.wikipedia.org",
"https://www.ovh.com",
"https://www.mail.ru",
"https://www.bing.com",
"https://www.news.yahoo.com",
"https://www.myaccount.google.com",
"https://www.hatena.ne.jp",
"https://www.shopify.com",
"https://www.adssettings.google.com",
"https://www.bit.ly",
"https://www.reuters.com",
"https://www.booking.com",
"https://www.discord.com",
"https://www.buydomains.com",
"https://www.nasa.gov",
"https://www.aboutads.info",
"https://www.time.com",
"https://www.abril.com.br",
"https://www.change.org",
"https://www.nginx.org",
"https://www.twitter.com",
"https://www.wikipedia.org",
"https://www.archive.org",
"https://www.cbsnews.com",
"https://www.networkadvertising.org",
"https://www.telegraph.co.uk",
"https://www.pinterest.com",
"https://www.google.co.jp",
"https://www.pixabay.com",
"https://www.zendesk.com",
"https://www.cpanel.com",
"https://www.vistaprint.com",
"https://www.sky.com",
"https://www.windows.net",
"https://www.alicdn.com",
"https://www.google.ca",
"https://www.lemonde.fr",
"https://www.newyorker.com",
"https://www.webnode.page",
"https://www.surveymonkey.com",
"https://www.translate.google.com",
"https://www.calendar.google.com",
"https://www.amazonaws.com",
"https://www.academia.edu",
"https://www.apache.org",
"https://www.imageshack.us",
"https://www.akamaihd.net",
"https://www.nginx.com",
"https://www.discord.gg",
"https://www.thetimes.co.uk"
]

    useEffect(() => {
        // const img = new Image();
        // img.src = 'image/yelp.png';  // Specify the path to your local image here    

        const img = new Image();
        img.src = `webs1/screenshot_${websiteCounter}.png`

        img.onload = () => {
            // After the image has loaded, update the state with the image's dimensions
            setScreenDimensions({ width: img.width / 1.5, height: img.height });
          };

    }, [])

    useEffect(() => {
        if (canvasRef.current && screenDimensions.width && screenDimensions.height) {
            const canvas = canvasRef.current;
            canvas.width = screenDimensions.width;
            canvas.height = screenDimensions.height;
    
            const ctx = canvas.getContext('2d');
            setContext(ctx);
    
            // Optional: redraw previous data
            // reDrawPreviousData(ctx);
        }
    }, [screenDimensions]);  // Depend on canvasSize to run after it updates
    

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
        console.log("drawing")
        if (context && canvasRef.current) {
            console.log("drawing 2")
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
            <div className='relative h-screen w-[10vw]'>
                <div className='fixed top-1/2 left-2 transform -translate-y-1/2 flex flex-col space-y-4'>
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
                    <button onClick={captureDiv} className="p-2 bg-green-500 text-white rounded">
                                Capture Screenshot
                    </button>
                    <div className='flex justify-center my-4'>
                        <button className='bg-blue-500 text-white px-4 py-2 mr-2'
                            onClick={() => setWebsiteCounter((websiteCounter - 1) < 0 ? 0 : (websiteCounter - 1))}>
                            Back
                        </button>
                        <button className='bg-red-500 text-white px-4 py-2'
                            onClick={() => setWebsiteCounter((websiteCounter + 1) % websiteList.length)}>
                            Next
                        </button>                        
                    </div>

                </div>
            </div>
            <div>
                <div className='flex justify-center my-4'>                    
                    <div>Screen Dimensions: {screenDimensions.width} x {screenDimensions.height}</div>
                </div>

                <div 
                    ref={divRef}
                    className='relative flex justify-center items-center'
                    style={{width: screenDimensions.width + 'px', height: screenDimensions.height + 'px'}}>
                    <iframe
                        ref={iframeRef} 
                        src={websiteList[websiteCounter + 1]} 
                        title="Website Display"
                        className="absolute top-0 left-0"
                        style={{
                            width: screenDimensions.width + 'px',
                            maxWidth: screenDimensions.width + 'px', // Define your desired max width
                            overflow: 'auto',   // Enable scrolling within the iframe
                            height: screenDimensions.height + 'px'
                        }}              
                    />

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
            </div>
        </div>
    )
};

export default LabelCanvas;
