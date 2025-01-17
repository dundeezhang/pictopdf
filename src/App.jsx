import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

import "./App.css";

function App() {
    const [images, setImages] = useState([]);
    const currYear = new Date().getFullYear();

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imagePreviews = files.map((file) => URL.createObjectURL(file));
        setImages((prevImages) => [
            ...prevImages,
            ...files.map((file, index) => ({
                file,
                preview: imagePreviews[index],
            })),
        ]);
    };

    const clearImages = () => {
        setImages([]);
    };

    const convertToPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        for (const { file } of images) {
            const imgBytes = await file.arrayBuffer();
            let img;
            if (file.type === "image/jpeg") {
                img = await pdfDoc.embedJpg(imgBytes);
                const page = pdfDoc.addPage([img.width, img.height]);
                page.drawImage(img, {
                    x: 0,
                    y: 0,
                    width: img.width,
                    height: img.height,
                });
            } else if (file.type === "image/png") {
                img = await pdfDoc.embedPng(imgBytes);
                const { width, height } = img.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(img, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                });
            }
        }
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "converted.pdf");
        setImages([]); // clear after conversion
    };

    return (
        <div>
            <div className="container">
                <h1 className="prog-title">PNG and JPEG to PDF Converter</h1>
                <p className="by-tag">by dhz</p>
                <p>
                    A lightweight and small program to convert your image files
                    to .pdf files. It takes .png and .jpeg files and outputs
                    them all in a singlular .pdf file. Simply upload your image
                    and press the Convert to PDF button. There is no data
                    collected on this site. Your pictures will remain private
                    with you and whoever you choose to share the .pdf with.
                </p>
                <h2>Submit your Image Files:</h2>
                <div className="button-div">
                    <label htmlFor="picsub" className="buttons">
                        Upload Pictures
                    </label>
                </div>

                <input
                    type="file"
                    id="picsub"
                    accept="image/*"
                    className="picsub"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
                <div className="button-div">
                    <label onClick={convertToPDF} className="buttons">
                        Press to Convert to PDF
                    </label>
                </div>

                <p>
                    Note that JPEG files may not display well on the .pdf files
                    on Firefox. Please use dedicated PDF viewers or use
                    Chromium-based browsers to view the .pdf files.
                </p>
                <div className="image-preview">
                    <h2>Pictures:</h2>
                    <div className="button-div">
                        <label onClick={clearImages} className="buttons">
                            Press to Clear Images
                        </label>
                    </div>

                    <br />
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.preview}
                            className="images"
                            alt={`preview-${index}`}
                        />
                    ))}
                    <p>End of submitted pictures. :)</p>
                </div>
                <hr />
                <p>
                    Check out my other projects and programs at{" "}
                    <a href="https://dundeezhang.com">dundeezhang.com</a>{" "}
                </p>
            </div>
            <footer>
                <p>Dundee Zhang {currYear} - Some rights reserved</p>
                <a href="https://dundeezhang.com">dundeezhang.com</a>
            </footer>
        </div>
    );
}

export default App;
