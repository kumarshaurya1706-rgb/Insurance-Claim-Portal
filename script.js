let customers = JSON.parse(localStorage.getItem("customers")) || [];
let policies = JSON.parse(localStorage.getItem("policies")) || [];
let claims = JSON.parse(localStorage.getItem("claims")) || [];


// Save data in local storage
function saveData() {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("policies", JSON.stringify(policies));
    localStorage.setItem("claims", JSON.stringify(claims));
}

// Show different pages
function showPage(page) {

    let pages = document.querySelectorAll(".page");

    pages.forEach(function(p) {
        p.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    updateDashboard();
    showCustomers();
    showPolicies();
    showClaims();
    showReview();
    showHistory();
}

// Register customer
document.getElementById("customerForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let customer = {
        id: customers.length + 1,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };

    customers.push(customer);
    saveData();

    this.reset();

    alert("Customer Registered Successfully!");

    showCustomers();
});

// Display customers
function showCustomers() {

    let list = document.getElementById("customerList");

    list.innerHTML = "";

    document.getElementById("policyCustomer").innerHTML =
        '<option value="">Select Customer</option>';

    document.getElementById("claimCustomer").innerHTML =
        '<option value="">Select Customer</option>';

    customers.forEach(function(c) {

        list.innerHTML += `
            <div class="item">
                <b>${c.name}</b><br>
                Email: ${c.email}<br>
                Phone: ${c.phone}
            </div>
        `;

        document.getElementById("policyCustomer").innerHTML +=
            `<option value="${c.id}">${c.name}</option>`;

        document.getElementById("claimCustomer").innerHTML +=
            `<option value="${c.id}">${c.name}</option>`;
    });
}

// Add policy
document.getElementById("policyForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let policy = {
        id: policies.length + 1,
        customerId: document.getElementById("policyCustomer").value,
        type: document.getElementById("policyType").value,
        coverage: document.getElementById("coverage").value,
        premium: document.getElementById("premium").value
    };

    policies.push(policy);

    this.reset();

    alert("Policy Added Successfully!");

    showPolicies();
});

// Display policies
function showPolicies() {

    let list = document.getElementById("policyList");

    list.innerHTML = "";

    document.getElementById("claimPolicy").innerHTML =
        '<option value="">Select Policy</option>';

    policies.forEach(function(p) {

        let customer = customers.find(c => c.id == p.customerId);

        list.innerHTML += `
            <div class="item">
                <b>Policy ID: ${p.id}</b><br>
                Customer: ${customer ? customer.name : "Unknown"}<br>
                Type: ${p.type}<br>
                Coverage: ₹${p.coverage}<br>
                Premium: ₹${p.premium}
            </div>
        `;

        document.getElementById("claimPolicy").innerHTML +=
            `<option value="${p.id}">Policy ${p.id} - ${p.type}</option>`;
    });
}

// Submit claim
document.getElementById("claimForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let customerId = document.getElementById("claimCustomer").value;
    let policyId = document.getElementById("claimPolicy").value;

    let policy = policies.find(p => p.id == policyId);

    if (!policy || policy.customerId != customerId) {
        alert("Please select a valid customer and policy.");
        return;
    }

    let amount = Number(document.getElementById("amount").value);

    if (amount > Number(policy.coverage)) {
        alert("Claim amount cannot exceed policy coverage.");
        return;
    }

    let documents = [];

    if (document.getElementById("idProof").checked)
        documents.push("Identity Proof");

    if (document.getElementById("policyDoc").checked)
        documents.push("Policy Document");

    if (document.getElementById("report").checked)
        documents.push("Incident Report");

    if (document.getElementById("bill").checked)
        documents.push("Supporting Bills");

    let claim = {

        id: claims.length + 1,

        customerId: customerId,

        policyId: policyId,

        incident: document.getElementById("incident").value,

        date: document.getElementById("incidentDate").value,

        amount: amount,

        description: document.getElementById("description").value,

        documents: documents,

        status: "Pending",

        remarks: ""
    };

    claims.push(claim);
    saveData();

    this.reset();

    alert("Claim Submitted Successfully!");

    showClaims();
    updateDashboard();
});

// Display claims
function showClaims() {

    let list = document.getElementById("claimList");

    list.innerHTML = "";

    claims.forEach(function(c) {

        let customer = customers.find(x => x.id == c.customerId);

        list.innerHTML += `
            <div class="item">
                <b>Claim ID: ${c.id}</b><br>
                Customer: ${customer ? customer.name : "Unknown"}<br>
                Incident: ${c.incident}<br>
                Amount: ₹${c.amount}<br>
                Date: ${c.date}<br>
                Status: <b>${c.status}</b><br>
                Documents: ${c.documents.join(", ") || "None"}
            </div>
        `;
    });
}

// Review pending claims
function showReview() {

    let list = document.getElementById("reviewList");

    list.innerHTML = "";

    claims.forEach(function(c) {

        if (c.status == "Pending") {

            list.innerHTML += `
                <div class="item">

                    <b>Claim ID: ${c.id}</b><br>
                    Incident: ${c.incident}<br>
                    Amount: ₹${c.amount}<br>
                    Description: ${c.description}<br>

                    <input type="text" id="remark${c.id}"
                    placeholder="Enter remarks">

                    <button class="approve"
                    onclick="processClaim(${c.id}, 'Approved')">
                    Approve</button>

                    <button class="reject"
                    onclick="processClaim(${c.id}, 'Rejected')">
                    Reject</button>

                </div>
            `;
        }
    });
}

// Approve or reject claim
function processClaim(id, status) {

    let claim = claims.find(c => c.id == id);

    let remark = document.getElementById("remark" + id).value;

    if (status == "Rejected" && remark.trim() == "") {
        alert("Please enter a reason for rejection.");
        return;
    }

    claim.status = status;
    claim.remarks = remark;

    saveData();

    alert("Claim " + status + " Successfully!");

    showReview();
    showClaims();
    showHistory();
    updateDashboard();
}

// Claim history
function showHistory() {

    let list = document.getElementById("historyList");

    list.innerHTML = "";

    claims.forEach(function(c) {

        if (c.status != "Pending") {

            list.innerHTML += `
                <div class="item">
                    Claim ID: ${c.id}<br>
                    Amount: ₹${c.amount}<br>
                    Status: ${c.status}<br>
                    Remarks: ${c.remarks || "No remarks"}
                </div>
            `;
        }
    });
}

// Dashboard statistics
function updateDashboard() {

    document.getElementById("total").innerText = claims.length;

    document.getElementById("pending").innerText =
        claims.filter(c => c.status == "Pending").length;

    document.getElementById("approved").innerText =
        claims.filter(c => c.status == "Approved").length;

    document.getElementById("rejected").innerText =
        claims.filter(c => c.status == "Rejected").length;
}

// Open dashboard by default
showPage("home");