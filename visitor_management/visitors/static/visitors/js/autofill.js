document.addEventListener("DOMContentLoaded", function () {
    const mobileInput = document.querySelector('input[name="mobile"]');
    
    // Other fields to be auto-filled
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const genderSelect = document.querySelector('select[name="gender"]');
    const addressTextarea = document.querySelector('textarea[name="address"]');
    const aadhaarInput = document.querySelector('input[name="aadhaar"]');
    const purposeInput = document.querySelector('input[name="purpose"]');
    const visitToInput = document.querySelector('input[name="visit_to"]');
    
    const duplicateWarning = document.getElementById("duplicate-warning");

    if (mobileInput) {
        mobileInput.addEventListener("change", function () {
            const mobileNumber = this.value;
            if (mobileNumber.length === 10) {
                fetchVisitorData(mobileNumber);
                checkDuplicateVisitor(mobileNumber);
            } else {
                clearWarning();
            }
        });

        mobileInput.addEventListener("input", function () {
            const mobileNumber = this.value;
            if (mobileNumber.length === 10) {
                fetchVisitorData(mobileNumber);
                checkDuplicateVisitor(mobileNumber);
            } else {
                clearWarning();
            }
        });
        
        // Add blur event as requested
        mobileInput.addEventListener("blur", function () {
            const mobileNumber = this.value;
            if (mobileNumber.length === 10) {
                checkDuplicateVisitor(mobileNumber);
            }
        });
    }

    function fetchVisitorData(mobile) {
        fetch(`/api/visitor-by-mobile/?mobile=${mobile}`)
            .then(response => response.json())
            .then(data => {
                if (data.found) {
                    if (nameInput) nameInput.value = data.name || "";
                    if (emailInput) emailInput.value = data.email || "";
                    if (genderSelect) genderSelect.value = data.gender || "";
                    if (addressTextarea) addressTextarea.value = data.address || "";
                    if (aadhaarInput) aadhaarInput.value = data.aadhaar || "";
                    if (purposeInput) purposeInput.value = data.purpose || "";
                    if (visitToInput) visitToInput.value = data.visit_to || "";

                    console.log("Visitor data auto-filled for mobile:", mobile);
                }
            })
            .catch(error => {
                console.error("Error fetching visitor data:", error);
            });
    }

    function checkDuplicateVisitor(mobile) {
        fetch(`/api/check-duplicate-visitor/?mobile=${mobile}`)
            .then(response => response.json())
            .then(data => {
                if (data.duplicate) {
                    showWarning(data.message);
                } else {
                    clearWarning();
                }
            })
            .catch(error => {
                console.error("Error checking duplicate visitor:", error);
            });
    }

    function showWarning(message) {
        if (duplicateWarning) {
            duplicateWarning.textContent = message;
            duplicateWarning.classList.remove("d-none");
            duplicateWarning.classList.add("text-danger");
        }
    }

    function clearWarning() {
        if (duplicateWarning) {
            duplicateWarning.textContent = "";
            duplicateWarning.classList.add("d-none");
        }
    }
});
