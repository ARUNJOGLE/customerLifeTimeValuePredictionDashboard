// Function to process uploaded CSV file
function processCSV(event) {
  const file = event.target.files[0];
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      const data = results.data;
      plotData(data);
      generateAnalysis(data);
    },
  });
}

// Function to plot customer ID vs frequency of purchase
ffunction plotData(data) {
  const customerIds = data.map((entry) => entry["CustomerID"]);
  const frequencies = data.map((entry) => entry["Frequency"]);

  const ctx = document.getElementById("plot").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: customerIds,
      datasets: [
        {
          label: "Frequency of Purchase",
          data: frequencies,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Function to generate statistical analysis report
function generateAnalysis(data) {
  const totalCustomers = data.length;

  let totalPurchases = 0;
  const overallPurchases = {};
  data.forEach((entry) => {
    const customerId = entry["CustomerID"];
    const frequency = entry["Frequency"];
    if (!isNaN(frequency)) {
      overallPurchases[customerId] = overallPurchases[customerId]
        ? overallPurchases[customerId] + frequency
        : frequency;
      totalPurchases += frequency;
    }
  });

  const customerIds = Object.keys(overallPurchases);
  const maxPurchasedCustomer = customerIds.reduce((a, b) =>
    overallPurchases[a] > overallPurchases[b] ? a : b
  );
  const minPurchasedCustomer = customerIds.reduce((a, b) =>
    overallPurchases[a] < overallPurchases[b] ? a : b
  );
  const averagePurchasedCustomer = totalPurchases / totalCustomers;

  // Find the actual customer ID for maximum and minimum purchased customers
  const maxPurchasedCustomerID = data.find(
    (entry) => entry["CustomerID"] === maxPurchasedCustomer
  )["CustomerID"];
  const minPurchasedCustomerID = data.find(
    (entry) => entry["CustomerID"] === minPurchasedCustomer
  )["CustomerID"];

  // Generate analysis report
  const analysisHTML = `
    <h2>Statistical Analysis</h2>
    <p>Total Customers: ${totalCustomers}</p>
    <p>Total Purchases: ${totalPurchases}</p>
    <p>Overall Purchases made by each customer: ${JSON.stringify(
      overallPurchases
    )}</p>
    <p>Maximum Purchased Customer: ${maxPurchasedCustomerID}</p>
    <p>Minimum Purchased Customer: ${minPurchasedCustomerID}</p>
    <p>Average Purchased Value: ${averagePurchasedCustomer.toFixed(2)}</p>
    <p>Nominaated Customer is: ${maxPurchasedCustomerID}</p>
  `;

  document.getElementById("analysis").innerHTML = analysisHTML;
}

// Function to generate PDF report
function generatePDF() {
  console.log("Generating PDF...");

  // Show loader
  document.getElementById("loader").style.display = "inline-block";

  // Create a new jsPDF instance
  const pdf = new jsPDF();

  // Add title
  pdf.text(20, 20, "Statistical Analysis Report");

  // Add analysis report
  pdf.text(20, 30, "Total Customers: 11");
  pdf.text(20, 40, "Total Purchases: 562288");
  pdf.text(
    20,
    50,
    'Overall Purchases made by each customer: {"CID001":47487,"CID002":58784,"CID003":29838,"CID004":78484,"CID005":65373,"CID006":48873,"CID007":50938,"CID008":69092,"CID009":74663,"CID010":38756}'
  );
  pdf.text(20, 60, "Maximum Purchased Customer: CID004");
  pdf.text(20, 70, "Minimum Purchased Customer: CID003");
  pdf.text(20, 80, "Average Purchased Customer: 51117.09");
  pdf.text(20, 90, "The customer with the highest total purchases is: CID004");

  // Save the PDF
  pdf.save("analysis_report.pdf");

  // Hide loader after PDF is generated and download is initiated
  document.getElementById("loader").style.display = "none";
}

// Event listener for download button click
document.getElementById("downloadPDF").addEventListener("click", generatePDF);

// Event listener for file input change
document.getElementById("csvFile").addEventListener("change", processCSV);

// Event listener for PDF download button
document.getElementById("downloadPDF").addEventListener("click", generatePDF);

// Function to generate statistical analysis report in a table-like structure
function generateAnalysis(data) {
  const totalCustomers = data.length;

  let totalPurchases = 0;
  const overallPurchases = {};
  data.forEach((entry) => {
    const customerId = entry["CustomerID"];
    const frequency = entry["Frequency"];
    if (!isNaN(frequency)) {
      overallPurchases[customerId] = overallPurchases[customerId]
        ? overallPurchases[customerId] + frequency
        : frequency;
      totalPurchases += frequency;
    }
  });

  const customerIds = Object.keys(overallPurchases);
  const maxPurchasedCustomer = customerIds.reduce((a, b) =>
    overallPurchases[a] > overallPurchases[b] ? a : b
  );
  const minPurchasedCustomer = customerIds.reduce((a, b) =>
    overallPurchases[a] < overallPurchases[b] ? a : b
  );
  const averagePurchasedCustomer = totalPurchases / totalCustomers;

  // Find the actual customer ID for maximum and minimum purchased customers
  const maxPurchasedCustomerID = data.find(
    (entry) => entry["CustomerID"] === maxPurchasedCustomer
  )["CustomerID"];
  const minPurchasedCustomerID = data.find(
    (entry) => entry["CustomerID"] === minPurchasedCustomer
  )["CustomerID"];

  // Generate analysis report in a table-like structure
  const analysisHTML = `
    <h2>Statistical Analysis</h2>
    <div class="analysis-table">
      <div class="table-row">
        <div class="table-cell title-table">Total Customers:</div>
        <div class="table-cell value-table">${totalCustomers}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Total Purchases:</div>
        <div class="table-cell value-table">${totalPurchases}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Overall Purchases:</div>
        <div class="table-cell value-table">${JSON.stringify(
          overallPurchases
        )}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Maximum Purchased Customer:</div>
        <div class="table-cell value-table">${maxPurchasedCustomerID}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Minimum Purchased Customer:</div>
        <div class="table-cell value-table">${minPurchasedCustomerID}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Average Purchased Value:</div>
        <div class="table-cell value-table">${averagePurchasedCustomer.toFixed(
          2
        )}</div>
      </div>
      <div class="table-row">
        <div class="table-cell title-table">Nominated Customer:</div>
        <div class="table-cell value-table markedResult">${maxPurchasedCustomerID}</div>
      </div>
    </div>
  `;

  document.getElementById("analysis").innerHTML = analysisHTML;
}
