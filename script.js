const passwordInput = document.getElementById('password');
const strengthProgress = document.getElementById('strength-progress');
const message = document.getElementById('message');
const entropyDisplay = document.getElementById('entropy');
const lengthIcon = document.getElementById('length-icon');
const lowercaseIcon = document.getElementById('lowercase-icon');
const uppercaseIcon = document.getElementById('uppercase-icon');
const numberIcon = document.getElementById('number-icon');
const specialIcon = document.getElementById('special-icon');

// Customizable password policies
const passwordPolicies = {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    entropyThreshold: 50,
};

const commonPasswords = [
    "123456", "password", "123456789", "12345678", "12345", 
    "1234567", "qwerty", "abcdef", "letmein", "1234"
];

const dictionaryWords = [
    "password", "welcome", "monkey", "dragon", "sunshine", 
    "princess", "flower", "loveme", "iloveyou", "admin"
];

passwordInput.addEventListener('input', updateStrength);

function updateStrength() {
    const password = passwordInput.value;
    const strength = getStrength(password);
    const entropy = calculateEntropy(password);
    const suggestions = getSuggestions(password);

    updateProgressBar(strength);
    updateIcons(password);
    message.textContent = suggestions.length === 0 ? 'Password is strong!' : suggestions.join(', ');
    entropyDisplay.textContent = `Entropy: ${entropy.toFixed(2)} bits`;

    // Provide real-time feedback through ARIA live regions for screen readers
    message.setAttribute('aria-live', 'polite');
}

function getStrength(password) {
    let strength = 0;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

    if (password.length >= passwordPolicies.minLength) strength++;
    if (hasLowerCase) strength++;
    if (hasUpperCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChars) strength++;
    if (password.length >= 12) strength += 2;

    if (isCommonPassword(password) || isDictionaryWord(password) || isPatternOrRepetition(password)) {
        strength = 0;
    }

    return strength;
}

function isCommonPassword(password) {
    return commonPasswords.includes(password);
}

function isDictionaryWord(password) {
    for (let word of dictionaryWords) {
        if (password.toLowerCase().includes(word)) {
            return true;
        }
    }
    return false;
}

function isPatternOrRepetition(password) {
    const repetitivePattern = /(.)\1\1\1/;
    if (repetitivePattern.test(password)) {
        return true;
    }

    const sequentialPattern = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|klz|lzxc|zxcv|xcvb|cvbn|vbnm|bnm)/i;
    if (sequentialPattern.test(password)) {
        return true;
    }

    return false;
}

function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    return password.length * Math.log2(charsetSize);
}

function getSuggestions(password) {
    const suggestions = [];
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

    if (password.length < passwordPolicies.minLength) {
        suggestions.push(`At least ${passwordPolicies.minLength} characters`);
    }
    if (passwordPolicies.requireLowercase && !hasLowerCase) {
        suggestions.push('At least one lowercase letter');
    }
    if (passwordPolicies.requireUppercase && !hasUpperCase) {
        suggestions.push('At least one uppercase letter');
    }
    if (passwordPolicies.requireNumbers && !hasNumbers) {
        suggestions.push('At least one number');
    }
    if (passwordPolicies.requireSpecialChars && !hasSpecialChars) {
        suggestions.push('At least one special character');
    }

    if (isCommonPassword(password)) {
        suggestions.push('Avoid common passwords');
    }
    if (isDictionaryWord(password)) {
        suggestions.push('Avoid common words');
    }
    if (isPatternOrRepetition(password)) {
        suggestions.push('Avoid repetitive sequences or patterns');
    }

    return suggestions;
}

function updateProgressBar(strength) {
    const progressBarColors = ['red', 'orange', 'yellowgreen', 'green'];
    const progressBarWidths = ['25%', '50%', '75%', '100%,'];

    strengthProgress.style.width = progressBarWidths[strength] || '0';
    strengthProgress.style.backgroundColor = progressBarColors[strength] || '#e0e0e0';
}

function updateIcons(password) {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
    const lengthValid = password.length >= passwordPolicies.minLength;

    updateIcon(lengthIcon, lengthValid);
    updateIcon(lowercaseIcon, hasLowerCase);
    updateIcon(uppercaseIcon, hasUpperCase);
    updateIcon(numberIcon, hasNumbers);
    updateIcon(specialIcon, hasSpecialChars);
}

function updateIcon(icon, valid) {
    if (valid) {
        icon.classList.add('fa-check');
        icon.classList.remove('fa-times');
        icon.style.color = 'green';
    } else {
        icon.classList.add('fa-times');
        icon.classList.remove('fa-check');
        icon.style.color = 'red';
    }
}

// Localization Support
const localization = {
    en: {
        enterPassword: 'Enter your password:',
        atLeastChars: 'At least {0} characters',
        lowercaseLetter: 'At least one lowercase letter',
        uppercaseLetter: 'At least one uppercase letter',
        oneNumber: 'At least one number',
        specialChar: 'At least one special character',
        avoidCommonPasswords: 'Avoid common passwords',
        avoidCommonWords: 'Avoid common words',
        avoidPatterns: 'Avoid repetitive sequences or patterns',
        passwordStrong: 'Password is strong!',
        entropyBits: 'Entropy: {0} bits'
    },
    // Additional languages can be added here
};

function localize(locale) {
    document.querySelector('label[for="password"]').textContent = localization[locale].enterPassword;
    document.querySelector('.criterion[data-tooltip]').setAttribute('data-tooltip', localization[locale].atLeastChars.replace('{0}', passwordPolicies.minLength));
    document.querySelector('.criterion span').textContent = localization[locale].atLeastChars.replace('{0}', passwordPolicies.minLength);
    document.querySelector('.criterion:nth-child(2) span').textContent = localization[locale].lowercaseLetter;
    document.querySelector('.criterion:nth-child(3) span').textContent = localization[locale].uppercaseLetter;
    document.querySelector('.criterion:nth-child(4) span').textContent = localization[locale].oneNumber;
    document.querySelector('.criterion:nth-child(5) span').textContent = localization[locale].specialChar;
}

document.addEventListener('DOMContentLoaded', () => {
    localize('en'); // Default to English
});
