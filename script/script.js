document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
});

let currentStep = 1;
let selectedType = null;
let priceBase = 0;

const steps = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3')
};
const progressSteps = document.querySelectorAll('.progress-bar .step');
const btnStep1 = document.getElementById('btnStep1');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const finalPriceDisplay = document.getElementById('finalPriceDisplay');

const prices = {
    'grade': 450,
    'portao': 850,
    'estrutura': 1200
};

function selectType(type, element) {
    document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
    
    element.classList.add('selected');
    selectedType = type;
    priceBase = prices[type];
    
    btnStep1.removeAttribute('disabled');
}

function nextStep(toStep) {
    hideAllSteps();
    steps[toStep].classList.remove('hidden-step');
    steps[toStep].classList.add('active-step');
    updateProgressBar(toStep);
    currentStep = toStep;
}

function prevStep(toStep) {
    hideAllSteps();
    steps[toStep].classList.remove('hidden-step');
    steps[toStep].classList.add('active-step');
    updateProgressBar(toStep);
    currentStep = toStep;
}

function calculateFinal() {
    const w = parseFloat(widthInput.value);
    const h = parseFloat(heightInput.value);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        alert("Por favor, insira medidas válidas (maiores que zero).");
        return;
    }

    const area = w * h;
    const total = area * priceBase;

    finalPriceDisplay.innerText = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    nextStep(3);
}

function resetConfigurator() {
    currentStep = 1;
    selectedType = null;
    priceBase = 0;
    widthInput.value = '';
    heightInput.value = '';
    document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
    btnStep1.setAttribute('disabled', true);
    nextStep(1);
}

function hideAllSteps() {
    Object.values(steps).forEach(step => {
        step.classList.remove('active-step');
        step.classList.add('hidden-step');
    });
}

function updateProgressBar(stepNumber) {
    progressSteps.forEach(step => {
        const stepData = parseInt(step.dataset.step);
        if (stepData <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

const navLinks = document.querySelector('.nav-links');
const mobToggle = document.querySelector('.mob-toggle');
const icon = mobToggle.querySelector('i');

function toggleMenu() {
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        icon.style.color = 'var(--blue-primary)';
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        icon.style.color = 'var(--text-white)';
    }
}

mobToggle.addEventListener('click', toggleMenu);

document.addEventListener('click', (e) => {
    if(navLinks.classList.contains('active') && 
       !navLinks.contains(e.target) && 
       !mobToggle.contains(e.target)) {
        toggleMenu();
    }
});