const puppeteer = require('puppeteer');
const path = require('path');


async function generatePdf(data) {
    try {
        let allTotal = data.map((product) => {
            const total = product.rate * product.qty;
            const gst = total * 0.18
            const totalWithGst = total + gst
            const userId = product.userId
            return {
                totalWithGst,
                total,
                userId
            }
        })
        let priceTotal = allTotal.reduce((acc, num) => acc + num.total, 0);
        let grandTotal = allTotal.reduce((acc, num) => acc + num.totalWithGst, 0);
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            const content = `
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        .total-row {
                            font-weight: bold;
                        }
                        .footer {
                            display: flex;
                            justify-content: flex-end;
                            margin-top: 20px;
                        }
                        .footer div {
                            margin-right: 50px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Invoice</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(product => `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.qty}</td>
                                    <td>${product.rate}</td>
                                    <td>INR ${product.total}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <div>
                            <p>Total: INR ${priceTotal}</p>
                            <p>GST: 18%</p>
                            <p>Grand Total: ${grandTotal}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
            const pdfPath = path.join(__dirname, '../../pdf', `${Date.now()}.pdf`);
            await page.setContent(content)
            let pdfBiffer = await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true
            })
            return pdfPath


        } catch (error) {
            throw new Error(`Failed to generate PDF: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }
}

module.exports = {
    generatePdf
};
