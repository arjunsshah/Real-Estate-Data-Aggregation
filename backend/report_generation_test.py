import reportlab
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

def create_pdf(file_name, data):
    # Create a document
    pdf = SimpleDocTemplate(file_name, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # List to hold the elements (paragraphs, tables, etc.)
    elements = []
    
    # Add a Title
    title = Paragraph("Real Estate Report", styles['Title'])
    elements.append(title)
    
    # Add a paragraph
    intro = Paragraph("This report contains data on various real estate properties.", styles['Normal'])
    elements.append(intro)
    
    # Add a table
    table_data = [["Property Name", "Location", "Size", "Acquisition Date", "Number of Units"]] + data
    table = Table(table_data)
    
    # Add styling to the table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)
    
    # Build the PDF
    pdf.build(elements)

# Example data to add to the PDF
data = [
    ["Sunset Villas", "Los Angeles, CA", "25000 sq ft", "2018-05-15", 120],
    ["Oceanview Condos", "Miami, FL", "34000 sq ft", "2019-03-22", 85],
    ["Greenwood Estates", "Austin, TX", "12000 sq ft", "2020-07-10", 55],
]

# Create PDF
create_pdf("real_estate_report.pdf", data)
