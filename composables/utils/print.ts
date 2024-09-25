export const usePrint = () => {
  const printResult = (documentId1: string) => {
    // Get HTML to print from elements
    const prtHtml1: string =
      document.getElementById(documentId1)?.innerHTML || "";

    // Get all stylesheets HTML
    let stylesHtml: string = "";
    for (const node of [
      ...document.querySelectorAll('link[rel="stylesheet"], style'),
    ]) {
      stylesHtml += (node as HTMLElement).outerHTML;
    }

    const printStyle = "";

    // Open the print window
    const WinPrint: Window | null = window.open(
      "",
      "",
      `left=0,top=0,width=210mm,max-width=210mm,height=270mm,toolbar=0,scrollbars=0,status=0`,
    );

    if (WinPrint) {
      WinPrint.document.write(`<!DOCTYPE html>
            <html>
                <head>
                    ${stylesHtml}
                    <style>${printStyle}</style> <!-- Insert the print style here -->
                </head>
                <body>
                    ${prtHtml1}
                   
                    <script>
                        // Convert NodeList to Array
                        const images = Array.from(document.images);
                        let loadedImages = 0;
        
                        const checkIfAllImagesLoaded = () => {
                            if (loadedImages === images.length) {
                                window.print();
                                window.close();
                            }
                        };
        
                        images.forEach(img => {
                            if (img.complete) {
                                loadedImages += 1;
                            } else {
                                img.onload = () => {
                                    loadedImages += 1;
                                    checkIfAllImagesLoaded();
                                };
                                // Handle cases where the image fails to load
                                img.onerror = () => {
                                    loadedImages += 1;
                                    checkIfAllImagesLoaded();
                                };
                            }
                        });
        
                        // In case there are no images or they are already cached
                        checkIfAllImagesLoaded();
                    </script>
                </body>
            </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      // Note: The actual printing and closing will be triggered after all images are loaded.
    }
  };
  return { printResult };
};
