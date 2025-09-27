// form-validation.js - Validaciones de formularios
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form validation loaded successfully');
    // Validación para formulario de clasificación
    const classificationForm = document.querySelector('form[action*="classification"]');
    if (classificationForm) {
        classificationForm.addEventListener('submit', function(e) {
            const classificationInput = document.getElementById('classification_name');
            if (classificationInput) {
                const value = classificationInput.value.trim();
                const regex = /^[a-zA-Z0-9]+$/;
                
                if (!regex.test(value)) {
                    e.preventDefault();
                    showValidationError('Classification name cannot contain spaces or special characters. Only letters and numbers are allowed.', classificationInput);
                    return false;
                }
                
                if (value.length < 2) {
                    e.preventDefault();
                    showValidationError('Classification name must be at least 2 characters long.', classificationInput);
                    return false;
                }
            }
        });
    }
    
    // Función para mostrar errores de validación
    function showValidationError(message, inputElement) {
        // Remover error anterior si existe
        const existingError = inputElement.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Crear elemento de error
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.textContent = message;
        
        // Añadir estilo al input
        inputElement.style.borderColor = '#dc3545';
        inputElement.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.25)';
        
        // Insertar después del input
        inputElement.parentNode.appendChild(errorElement);
        
        // Focus en el input
        inputElement.focus();
        
        // Remover estilos cuando el usuario empiece a escribir
        inputElement.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
            if (errorElement) {
                errorElement.remove();
            }
        }, { once: true });
    }
    
    // Validación en tiempo real para mejor UX
    const classificationInput = document.getElementById('classification_name');
    if (classificationInput) {
        classificationInput.addEventListener('input', function() {
            const value = this.value.trim();
            const regex = /^[a-zA-Z0-9]*$/; // Permite vacío mientras escribe
            
            if (!regex.test(value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    }

    // Inventory form validation
const inventoryForm = document.querySelector('form[action*="inventory"]');
if (inventoryForm) {
    inventoryForm.addEventListener('submit', function(e) {
        let errors = [];
        
        // Check required fields
        const requiredFields = inventoryForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.labels[0].textContent} is required.`);
                field.style.borderColor = '#dc3545';
            }
        });
        
        // Check numeric fields
        const yearField = document.getElementById('inv_year');
        if (yearField.value) {
            const currentYear = new Date().getFullYear();
            if (yearField.value < 1900 || yearField.value > currentYear + 1) {
                errors.push('Year must be between 1900 and ' + (currentYear + 1));
            }
        }
        
        const priceField = document.getElementById('inv_price');
        if (priceField.value && priceField.value < 0) {
            errors.push('Price cannot be negative.');
        }
        
        const milesField = document.getElementById('inv_miles');
        if (milesField.value && milesField.value < 0) {
            errors.push('Miles cannot be negative.');
        }
        
        if (errors.length > 0) {
            e.preventDefault();
            alert('Please correct the following errors:\n\n' + errors.join('\n'));
        }
    });
}
});