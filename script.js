"use strict";

const form = document.querySelector(".form");
const input = document.querySelectorAll("input");
const errorMessage = document.querySelectorAll(".error-text");
const fix = document.querySelectorAll(".fix");
const submitBtn = document.querySelector(".btn-submit");
const resetBtn = document.querySelector(".btn-reset");
const formGroups = document.querySelectorAll(".form-group, .form-group-radio");

const resultEmpty = document.querySelector(".empty-results");
const resultComplete = document.querySelector(".complete-results");
const monthlyTotal = document.querySelector(".monthly-total");
const termTotal = document.querySelector(".term-total");

function calculateMortgage() {
  const mortgageAmount = parseFloat(document.querySelector(".amount").value);
  const mortgageTerm = parseInt(document.querySelector(".term").value);
  const annualInterestRate = parseFloat(document.querySelector(".rate").value);
  const mortgageType = document.querySelectorAll('input[name="mortgage-type"]');

  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const totalPayments = mortgageTerm * 12;

  let monthlyPayment, totalRepaid;

  for (const type of mortgageType) {
    if (type.checked) {
      if (type.value === "repayment") {
        monthlyPayment =
          (mortgageAmount *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, totalPayments)) /
          (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
        totalRepaid = monthlyPayment * totalPayments;
      } else if (type.value === "interest") {
        monthlyPayment = mortgageAmount * monthlyInterestRate;
        totalRepaid = monthlyPayment * totalPayments + mortgageAmount;
      }
    }
  }

  const formattedMonthlyPayment = monthlyPayment.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedTotalRepaid = totalRepaid.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  monthlyTotal.textContent = `£${formattedMonthlyPayment}`;
  termTotal.textContent = `£${formattedTotalRepaid}`;

  return {
    monthlyPayment: formattedMonthlyPayment,
    totalRepaid: formattedTotalRepaid,
  };
}

const showError = (input) => {
  const group = input.closest(".form-group");
  if (!group) return;

  group.style.marginBottom = "36px";

  const errorMessage = group.querySelector(".error-text");
  if (errorMessage) {
    errorMessage.textContent = "This field is required";
    errorMessage.style.display = "block";
  }

  const fix = group.querySelector(".fix");
  if (fix) {
    fix.style.background = "var(--Red)";
    fix.style.color = "var(--White)";
  }

  input.style.borderColor = "var(--Red)";
};

const clearError = (e) => {
  for (const group of formGroups) {
    group.style.marginBottom = "24px";
  }

  const group = e.target.closest(".form-group, .form-group-radio");

  if (group) {
    const errorMessage = group.querySelector(".error-text");
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }

    e.target.style.borderColor = "";

    const fix = group.querySelector(".fix");
    if (fix) {
      fix.style.background = "var(--Slate-100)";
      fix.style.color = "var(--Slate-700)";
    }
  }
};

formGroups.forEach((group) => {
  const inputs = group.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("focus", clearError);
    }
  });
});

const handleSubmit = (e) => {
  e.preventDefault();

  let formIsValid = true;

  const mortgageTypes = document.querySelectorAll(
    'input[name="mortgage-type"]'
  );
  let mortgageTypeSelected = false;
  for (const mortgageType of mortgageTypes) {
    if (mortgageType.checked) {
      mortgageTypeSelected = true;
      break;
    }
  }

  if (!mortgageTypeSelected) {
    const mortgageTypeGroup = document.querySelector(".form-group-radio");
    showError(mortgageTypeGroup.querySelector("input"));
    formIsValid = false;
  } else {
    // clearError(document.querySelector('input[name="mortgage-type"]'));
  }

  formGroups.forEach((group) => {
    const input = group.querySelector("input");
    if (input && !input.value) {
      showError(input);
      formIsValid = false;
    } else if (input) {
      // clearError(input);
    }
  });

  if (!formIsValid) {
    return;
  }

  resultEmpty.style.display = "none";
  resultComplete.style.display = "flex";
  resultComplete.setAttribute("aria-hidden", "false");
  resultEmpty.setAttribute("aria-hidden", "true");
  calculateMortgage();
};

submitBtn.addEventListener("click", handleSubmit);

const resetForm = () => {
  formGroups.forEach((group) => {
    group.style.marginBottom = "24px";

    const input = group.querySelector("input");
    input.style.borderColor = "var(--Slate-500)";

    const errorMessage = group.querySelector(".error-text");
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    const fix = group.querySelector(".fix");
    if (fix) {
      fix.style.background = "var(--Slate-100)";
      fix.style.color = "var(--Slate-700)";
    }
  });

  radioGroups.forEach((g) => (g.style.backgroundColor = ""));
  resultEmpty.style.display = "flex";
  resultComplete.style.display = "none";
  resultComplete.setAttribute("aria-hidden", "true");
  resultEmpty.setAttribute("aria-hidden", "false");
};

resetBtn.addEventListener("click", resetForm);

const radioGroups = document.querySelectorAll(".form__radio-group-wrap");

radioGroups.forEach((group) => {
  const radio = group.querySelector(".form__radio");

  radio.addEventListener("change", () => {
    radioGroups.forEach((g) => (g.style.backgroundColor = ""));
    if (radio.checked) {
      group.style.backgroundColor = "var(--radio-bg)";
    }
  });
});
