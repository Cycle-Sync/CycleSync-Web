import fitz  # PyMuPDF
import cv2
import numpy as np
import os
import logging
import time
import tkinter as tk
from tkinter import filedialog

# Configure logging
dlogging = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

# Constants
OUTPUT_DIR = "extracted_snippets"
WINDOW_NAME = "PDF Snipper"
MAX_ZOOM = 3.0
MIN_ZOOM = 0.5
PAN_STEP = 100  # pixels per arrow key
STATUS_DURATION = 2.0  # seconds to display status messages

class PDFSnipper:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        try:
            self.doc = fitz.open(pdf_path)
        except Exception as e:
            dlogging.error(f"Failed to open PDF file: {e}")
            exit(1)
        self.total_pages = len(self.doc)
        self.page_num = 0
        self.rectangles = []  # store [(page_index, (x1,y1)), (page_index, (x2,y2))]
        self.drag_start = None
        self.zoom = 1.0
        self.pan_y = 0
        self.base_img = None
        self.img = None
        self.status_message = ""
        self.status_time = 0
        self._load_page(self.page_num)

    def _load_page(self, num):
        try:
            self.page = self.doc.load_page(num)
        except Exception as e:
            dlogging.error(f"Failed to load page {num}: {e}")
            return
        pix = self.page.get_pixmap(matrix=fitz.Matrix(1, 1))
        arr = np.frombuffer(pix.samples, dtype=np.uint8)
        self.base_img = arr.reshape(pix.height, pix.width, pix.n)[:, :, :3]
        self.img = cv2.cvtColor(self.base_img, cv2.COLOR_RGB2BGR)
        self.rectangles.clear()
        self.zoom = 1.0
        self.pan_y = 0
        dlogging.info(f"Loaded page {num + 1}/{self.total_pages}")
        self._set_status(f"Page {num + 1}/{self.total_pages} loaded")

    def _transform_coords(self, x, y):
        # Convert view coords to page coords
        return int(x / self.zoom), int((y + self.pan_y) / self.zoom)

    def mouse_callback(self, event, x, y, flags, param):
        if self.img is None:
            return
        if event == cv2.EVENT_LBUTTONDOWN:
            px, py = self._transform_coords(x, y)
            self.drag_start = (self.page_num, (px, py))
        elif event == cv2.EVENT_MOUSEMOVE and self.drag_start:
            page_idx, (x0, y0) = self.drag_start
            px, py = self._transform_coords(x, y)
            self.rectangles = [(page_idx, (x0, y0)), (self.page_num, (px, py))]
        elif event == cv2.EVENT_LBUTTONUP and self.drag_start:
            end = (self.page_num, self._transform_coords(x, y))
            self.rectangles = [self.drag_start, end]
            self._save_stitched_snippet()
            self.drag_start = None

    def _save_stitched_snippet(self):
        (p1, (x1, y1)), (p2, (x2, y2)) = self.rectangles
        # Compute global coordinates: page_index * page_height + y
        heights = [self.doc.load_page(i).rect.height for i in range(self.total_pages)]
        x0, x1_clip = sorted([x1, x2])
        global_y1 = sum(heights[:p1]) + y1
        global_y2 = sum(heights[:p2]) + y2
        if global_y1 > global_y2:
            global_y1, global_y2 = global_y2, global_y1
        slices = []
        cum = 0
        for i, h in enumerate(heights):
            page_start = cum
            page_end = cum + h
            if page_end < global_y1:
                cum += h
                continue
            if page_start > global_y2:
                break
            y_start = max(0, global_y1 - page_start)
            y_end = min(h, global_y2 - page_start)
            slices.append((i, y_start, y_end))
            cum += h
        imgs = []
        for (i, ys, ye) in slices:
            page = self.doc.load_page(i)
            clip = fitz.Rect(x0, ys, x1_clip, ye)
            pix = page.get_pixmap(clip=clip)
            arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3]
            bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
            imgs.append(bgr)
        stitched = np.vstack(imgs)
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        timestamp = int(time.time())
        filename = f"stitched_{timestamp}.png"
        path = os.path.join(OUTPUT_DIR, filename)
        cv2.imwrite(path, stitched)
        dlogging.info(f"Stitched snippet saved: {path}")
        self._set_status(f"Stitched saved: {filename}")
        self.rectangles.clear()

    def _set_status(self, message):
        self.status_message = message
        self.status_time = time.time()

    def run(self):
        cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL)
        cv2.setMouseCallback(WINDOW_NAME, self.mouse_callback)
        while True:
            h, w = self.img.shape[:2]
            disp = cv2.resize(self.img, (int(w * self.zoom), int(h * self.zoom)))
            view = disp[self.pan_y: self.pan_y + 600, :].copy()
            # Draw live rectangle preview during drag
            if self.rectangles and self.drag_start:
                (p1, (xa, ya)), (p2, (xb, yb)) = self.rectangles
                if p1 == self.page_num and p2 == self.page_num:
                    x1d, y1d = int(xa * self.zoom), int(ya * self.zoom) - self.pan_y
                    x2d, y2d = int(xb * self.zoom), int(yb * self.zoom) - self.pan_y
                    cv2.rectangle(view, (x1d, y1d), (x2d, y2d), (0, 255, 0), 2)
            # Status message
            if time.time() - self.status_time < STATUS_DURATION:
                cv2.putText(view, self.status_message, (10, view.shape[0] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            cv2.imshow(WINDOW_NAME, view)
            key = cv2.waitKey(20) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('n'):
                self.page_num = min(self.total_pages - 1, self.page_num + 1)
                self._load_page(self.page_num)
            elif key == ord('p'):
                self.page_num = max(0, self.page_num - 1)
                self._load_page(self.page_num)
            elif key == ord('z'):
                self.zoom = min(MAX_ZOOM, self.zoom + 0.1)
            elif key == ord('x'):
                self.zoom = max(MIN_ZOOM, self.zoom - 0.1)
            elif key == 82:
                self.pan_y = max(0, self.pan_y - PAN_STEP)
            elif key == 84:
                max_pan = max(0, int(h * self.zoom) - 600)
                self.pan_y = min(max_pan, self.pan_y + PAN_STEP)
        cv2.destroyAllWindows()
        self.doc.close()

if __name__ == '__main__':
    root = tk.Tk()
    root.withdraw()
    pdf_path = filedialog.askopenfilename(
        title="Select PDF file to snip",
        filetypes=[("PDF files", "*.pdf"), ("All files", "*")]
    )
    if not pdf_path:
        dlogging.error("No file selected, exiting.")
        exit(1)
    dlogging.info(f"Selected PDF: {pdf_path}")
    snipper = PDFSnipper(pdf_path)
    snipper.run()
    dlogging.info("PDF Snipper closed.")