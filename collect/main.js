// Hadawi Gift Collection - Main JavaScript
// This file handles occasion data fetching and ClickPay payment integration

// Global variables
window.occasionData = null;

// Translations object
const translations = {
    en: {
        title: "Loading Gift Details...",
        subtitle: "Please wait while we load the occasion details...",
        occasionDetails: "Occasion Details",
        giftFor: "Gift for",
        giftDetails: "Gift Details",
        yourContribution: "Your Contribution",
        yourName: "Your Name *",
        phoneNumber: "Phone Number *",
        email: "Email *",
        message: "Message for",
        messagePlaceholder: "Write a personal message...",
        payButton: "Pay",
        giftGoalAchieved: "Gift Goal Achieved! 🎉",
        thankYouMessage: "This occasion has reached its funding goal. Thank you to all contributors!",
        totalCollected: "Total Collected:",
        contributors: "Contributors:",
        people: "people",
        loadingError: "Unable to load occasion details. Please try again.",
        processing: "Processing...",
        sar: "SAR"
    },
    ar: {
        title: "جاري تحميل تفاصيل الهدية...",
        subtitle: "يرجى الانتظار بينما نقوم بتحميل تفاصيل المناسبة...",
        occasionDetails: "تفاصيل المناسبة",
        giftFor: "هدية لـ",
        giftDetails: "تفاصيل الهدية",
        yourContribution: "مساهمتك",
        yourName: "اسمك *",
        phoneNumber: "رقم الهاتف *",
        email: "البريد الإلكتروني *",
        message: "رسالة لـ",
        messagePlaceholder: "اكتب رسالة شخصية...",
        payButton: "دفع",
        giftGoalAchieved: "تم تحقيق هدف الهدية! 🎉",
        thankYouMessage: "وصلت هذه المناسبة إلى هدف التمويل. شكراً لجميع المساهمين!",
        totalCollected: "إجمالي المجموع:",
        contributors: "المساهمون:",
        people: "شخص",
        loadingError: "تعذر تحميل تفاصيل المناسبة. يرجى المحاولة مرة أخرى.",
        processing: "جاري المعالجة...",
        sar: "ريال"
    }
};

// Language functions
function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || navigator.language.split('-')[0];
    return lang === 'en' ? 'en' : 'ar'; // Default to Arabic
}

function switchLanguage() {
    const currentLang = getLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // Update URL with new language
    const url = new URL(window.location);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
}

function updateLanguage() {
    const lang = getLanguage();
    
    // Update page direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-language', lang);
    
    // Update language button text
    const langBtn = document.getElementById('langText');
    if (langBtn) {
        langBtn.textContent = lang === 'ar' ? 'English' : 'العربية';
    }
    
    // Update page title and subtitle
    const t = translations[lang];
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');
    
    if (title && !window.occasionData) title.textContent = t.title;
    if (subtitle && !window.occasionData) subtitle.textContent = t.subtitle;
}

// Extract occasion ID from URL
function getOccasionId() {
    const urlPath = window.location.pathname;
    return urlPath.split('/').pop();
}

// Get the appropriate contribution amount
function getContributionAmount(data) {
    if (data.amountForEveryone) return parseFloat(data.amountForEveryone);
    if (data.amountPerPerson) return parseFloat(data.amountPerPerson);
    return parseFloat(data.totalAmount) || parseFloat(data.giftPrice) || 0;
}

// Fetch occasion details from API
async function loadOccasionDetails() {
    const occasionId = getOccasionId();
    const lang = getLanguage();
    const t = translations[lang];
    
    try {
        const response = await fetch('https://api.hadawi.sa/occasions/occasion-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: occasionId
            })
        });
        
        if (response.ok) {
            const occasionData = await response.json();
            window.occasionData = occasionData;
            displayOccasionDetails(occasionData);
        } else {
            showErrorState(t.loadingError);
        }
    } catch (error) {
        console.error('Error loading occasion details:', error);
        showErrorState(t.loadingError);
    }
}

// Display occasion details on the page
function displayOccasionDetails(data) {
    const lang = getLanguage();
    const t = translations[lang];
    
    // Hide the loading spinner
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
    
    // Update page title and subtitle
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');
    
    if (title) title.textContent = data.occasionName || t.occasionDetails;
    if (subtitle) subtitle.textContent = `${t.giftFor} ${data.receiverName || 'the recipient'}`;
    
    // Format date
    const occasionDate = new Date(data.occasionDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Check if goal is achieved
    const isGoalAchieved = data.stats && data.stats.totalPayments >= data.giftPrice;
    
    // Build HTML content
    let contentHTML = `
        <div class="occasion-details">
            <div class="occasion-info">
                <div class="occasion-header">
                    <h3>${data.occasionName}</h3>
                    <span class="occasion-type">${data.type}</span>
                </div>
                
                <div class="occasion-meta">
                    <div class="meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        <span>${occasionDate}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>${data.receiverName.charAt(0).toUpperCase() + data.receiverName.slice(1)}</span>
                    </div>
                </div>
                
                ${data.note ? `
                <div class="occasion-note">
                    <p><strong>Note:</strong> ${data.note}</p>
                </div>
                ` : ''}
                
                <div class="gift-info">
                    <h4>${t.giftDetails}</h4>
                    <div class="gift-details">
                        <div class="gift-type">${data.giftType}</div>
                        ${data.giftName ? `<div class="gift-name">${data.giftName}</div>` : ''}
                        <div class="gift-amount">${data.giftPrice} ${t.sar}</div>
                    </div>
                </div>
    `;
    
    // Add completion section if goal achieved, otherwise payment form
    if (isGoalAchieved) {
        contentHTML += `
                <div class="completion-section">
                    <div class="completion-message">
                        <div class="completion-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h4>${t.giftGoalAchieved}</h4>
                        <p>${t.thankYouMessage}</p>
                        <div class="completion-stats">
                            <div class="stat-item">
                                <span class="stat-label">${t.totalCollected}</span>
                                <span class="stat-value">${data.stats.totalPayments} ${t.sar}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">${t.contributors}</span>
                                <span class="stat-value">${data.stats.paymentCount} ${t.people}</span>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    } else {
        const contributionAmount = getContributionAmount(data);
        contentHTML += `
                <div class="payment-section">
                    <div class="payment-amount">
                        <h4>${t.yourContribution}</h4>
                        <div class="amount-display">
                            <span class="currency">${t.sar}</span>
                            <span class="amount">${contributionAmount}</span>
                        </div>
                    </div>
                    
                    <form id="paymentForm" class="payment-form">
                        <div class="form-group">
                            <label for="contributorName">${t.yourName}</label>
                            <input type="text" id="contributorName" name="contributorName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contributorPhone">${t.phoneNumber}</label>
                            <input type="tel" id="contributorPhone" name="contributorPhone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contributorEmail">${t.email}</label>
                            <input type="email" id="contributorEmail" name="contributorEmail" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">${t.message} ${data.receiverName} (Optional)</label>
                            <textarea id="message" name="message" rows="3" placeholder="${t.messagePlaceholder}"></textarea>
                        </div>
                        
                        <button type="submit" class="payment-btn">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            ${t.payButton} ${contributionAmount} ${t.sar}
                        </button>
                    </form>
                </div>
        `;
    }
    
    contentHTML += `
            </div>
        </div>
    `;
    
    // Insert content into the container
    const container = document.getElementById('occasionContainer');
    if (container) {
        container.innerHTML = contentHTML;
        
        // Add event listener for payment form if it exists
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', handlePayment);
        }
    }
}

// Show error state
function showErrorState(message) {
    const spinner = document.getElementById('loadingSpinner');
    const subtitle = document.getElementById('pageSubtitle');
    
    if (spinner) spinner.style.display = 'none';
    if (subtitle) {
        subtitle.textContent = message;
        subtitle.className = 'error-message';
    }
}

// Handle payment form submission
async function handlePayment(event) {
    event.preventDefault();
    
    const lang = getLanguage();
    const t = translations[lang];
    const form = event.target;
    const formData = new FormData(form);
    
    const contributionAmount = getContributionAmount(window.occasionData);
    
    // Build payment data object
    const paymentData = {
        occasionId: window.occasionData.id,
        amount: parseFloat(contributionAmount),
        payerName: formData.get('contributorName'),
        payerPhone: formData.get('contributorPhone'),
        payerEmail: formData.get('contributorEmail'),
        message: formData.get('message') || '',
        currency: "SAR",
        returnUrl: window.location.origin + "/payment/result.html"
    };
    
    try {
        // Show loading state
        const submitBtn = form.querySelector('.payment-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <span>${t.processing}</span>
        `;
        submitBtn.disabled = true;
        
        // Store form data in sessionStorage for later use
        sessionStorage.setItem('paymentFormData', JSON.stringify({
            contributorName: formData.get('contributorName'),
            contributorPhone: formData.get('contributorPhone'),
            contributorEmail: formData.get('contributorEmail'),
            message: formData.get('message'),
            occasionId: window.occasionData.id,
            amount: contributionAmount
        }));
        
        // Initiate payment with ClickPay
        const response = await fetch('https://api.hadawi.sa/payments/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });
        
        if (response.ok) {
            const paymentResult = await response.json();
            
            // Store transaction reference for verification
            if (paymentResult.transactionRef) {
                sessionStorage.setItem('transactionRef', paymentResult.transactionRef);
            }
            
            // Redirect to ClickPay hosted payment page
            if (paymentResult.success && paymentResult.paymentUrl) {
                window.location.href = paymentResult.paymentUrl;
            } else {
                throw new Error('No payment URL received from ClickPay');
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to initiate payment');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        alert(lang === 'ar' 
            ? 'فشل الدفع. يرجى المحاولة مرة أخرى.' 
            : 'Payment failed. Please try again.');
        
        // Reset button
        const submitBtn = form.querySelector('.payment-btn');
        submitBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ${t.payButton} ${contributionAmount} ${t.sar}
        `;
        submitBtn.disabled = false;
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update language first
    updateLanguage();
    
    // Load occasion details
    loadOccasionDetails();
});




