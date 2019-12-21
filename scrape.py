from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfpage import PDFTextExtractionNotAllowed
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfdevice import PDFDevice
from pdfminer.layout import LAParams
from pdfminer.converter import PDFPageAggregator
import pdfminer

def scrape_pdf(pdf_file, thresholds):

    # Open a PDF file.
    # fp = open(file_path, 'rb')

    # Create a PDF parser object associated with the file object.
    # parser = PDFParser(fp)
    parser = PDFParser(pdf_file)

    # Create a PDF document object that stores the document structure.
    # Password for initialization as 2nd parameter
    document = PDFDocument(parser)

    # Check if the document allows text extraction. If not, abort.
    if not document.is_extractable:
        raise PDFTextExtractionNotAllowed

    # Create a PDF resource manager object that stores shared resources.
    rsrcmgr = PDFResourceManager()

    # Create a PDF device object.
    device = PDFDevice(rsrcmgr)

    # BEGIN LAYOUT ANALYSIS
    # Set parameters for analysis.
    laparams = LAParams()

    # Create a PDF page aggregator object.
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)

    # Create a PDF interpreter object.
    interpreter = PDFPageInterpreter(rsrcmgr, device)

    # Create dictionary to store raw contents in each column
    days = {
        "monday": "",
        "tuesday": "",
        "wednesday": "",
        "thursday": "",
        "friday": ""
    }

    def parse_obj(lt_objs):
        # loop over the object list
        for obj in lt_objs:

            # if it's a textbox, print text and location
            if isinstance(obj, pdfminer.layout.LTTextBoxHorizontal):
                box_x = obj.bbox[0]
                box_y = obj.bbox[1]

                # group into columns            
                if (thresholds[0][0] < box_x and box_x < thresholds[0][1]):
                    # days['monday'].append("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))
                    days['monday'] += ("%s" % (obj.get_text().replace('\n', '_')))
                elif (thresholds[1][0] <= box_x and box_x <= thresholds[1][1]):
                    # days['tuesday'].append("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))
                    days['tuesday'] += ("%s" % (obj.get_text().replace('\n', '_')))
                
                elif (thresholds[2][0] <= box_x and box_x < thresholds[2][1]):
                    # days['wednesday'].append("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))
                    days['wednesday'] += ("%s" % (obj.get_text().replace('\n', '_')))
                
                elif (thresholds[3][0] <= box_x and box_x <= thresholds[3][1]):
                    # days['thursday'].append("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))
                    days['thursday'] += ("%s" % (obj.get_text().replace('\n', '_')))
                
                elif (thresholds[4][0] <= box_x and box_x <= thresholds[4][1]):
                    # days['friday'].append("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))
                    days['friday'] += ("%s" % (obj.get_text().replace('\n', '_')))
                print("%6d, %6d, %s" % (obj.bbox[0], obj.bbox[1], obj.get_text().replace('\n', '_')))

            # if it's a container, recurse
            elif isinstance(obj, pdfminer.layout.LTFigure):
                parse_obj(obj._objs)

    # loop over all pages in the document
    for page in PDFPage.create_pages(document):

        # read the page into a layout object
        interpreter.process_page(page)
        layout = device.get_result()

        # extract text from this object
        parse_obj(layout._objs)

    # Create dictionary to store array of raw data
    items_raw = {
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": []
    }


    for key in days:
        s = "_" + days[key]
        # print(key)
        # print(s)

        split_pos = []
        for i in range(2, len(s)):
            if (s[i - 2] == "_" and s[i - 1].isupper() and s[i].isupper() and (s[i - 1] != "F" and s[i] != "I")):
                split_pos.append(i - 2)

        split_pos = split_pos[::-1]

        for pos in split_pos:
            items_raw[key].insert(0, (s[pos:]))
            s = s[:pos]


    res = []

    for key in items_raw:
        for item in items_raw[key]:
            a = item.split('_')
            
            # split by '-'
            a = list(map(lambda x: x.split("-") , a))
            # flatten
            a = [i for sublist in a for i in sublist]
            # split by ' '
            a = list(map(lambda x: x.split(" "), a))
            # flatten        
            a = [i for sublist in a for i in sublist]
            # remove any empty items
            a = list(filter(lambda x: (len(x) > 0) , a))
            
            event = {
                "class": a[0],
                "code": a[1],
                "section": a[2],
                "type": a[3],
                "day": key,
                "start": a[4],
                "end": a[5],
                "location": " ".join(a[6:])
            }
            
            res.append(event)

    return res
