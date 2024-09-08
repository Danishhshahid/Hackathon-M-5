"use strict";
class ResumeBuilder {
    constructor() {
        this.isEditable = false;
        this.data = {
            name: '',
            email: '',
            contact: '',
            city: '',
            profilePicture: '',
            educationList: [],
            skillsList: [],
            workExperienceList: []
        };
    }
    // Store personal data
    storePersonalData(id, value) {
        switch (id) {
            case 'name':
                this.data.name = value;
                break;
            case 'email':
                this.data.email = value;
                break;
            case 'contact':
                this.data.contact = value;
                break;
            case 'city':
                this.data.city = value;
                break;
        }
    }
    // Store profile picture
    storeProfilePicture(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.data.profilePicture = reader.result;
            this.updateProfilePicture();
        };
        reader.readAsDataURL(file);
    }
    // Store comma-separated list data
    storeListData(id, value) {
        const values = value.split(',').map((item) => item.trim());
        switch (id) {
            case 'education':
                this.data.educationList = values;
                break;
            case 'skills':
                this.data.skillsList = values;
                break;
            case 'work-experience':
                this.data.workExperienceList = values;
                break;
        }
    }
    // Update profile picture after it is loaded
    updateProfilePicture() {
        const profilePicElement = document.getElementById('profile-picture-preview');
        if (profilePicElement) {
            profilePicElement.src = this.data.profilePicture;
        }
    }
    // Generate resume preview or editable fields
    generateResume() {
        const resumeOutput = document.getElementById('resume-output');
        if (resumeOutput) {
            if (this.isEditable) {
                // Display editable inputs
                resumeOutput.innerHTML = this.generateEditableFields();
            }
            else {
                // Display non-editable resume
                resumeOutput.innerHTML = this.generateStaticResume();
            }
        }
    }
    // Generate editable fields
    generateEditableFields() {
        return `
            <h2>Edit Resume</h2>
            <p><strong>Name:</strong> <input type="text" id="input-name" value="${this.data.name}" /></p>
            <p><strong>Email:</strong> <input type="email" id="input-email" value="${this.data.email}" /></p>
            <p><strong>Contact:</strong> <input type="text" id="input-contact" value="${this.data.contact}" /></p>
            <p><strong>City:</strong> <input type="text" id="input-city" value="${this.data.city}" /></p>
            <p><strong>Education:</strong> <textarea id="input-education">${this.data.educationList.join(', ')}</textarea></p>
            <p><strong>Skills:</strong> <textarea id="input-skills">${this.data.skillsList.join(', ')}</textarea></p>
            <p><strong>Work Experience:</strong> <textarea id="input-work">${this.data.workExperienceList.join(', ')}</textarea></p>
            <img id="profile-picture-preview" src="${this.data.profilePicture}" alt="Profile Picture" />
        `;
    }
    // Generate static resume
    generateStaticResume() {
        return `
            <h2>Resume Preview</h2>
            <h2> Personal Information </h2>
            <img id="profile-picture-preview" src="${this.data.profilePicture}" alt="Profile Picture" />
            <p><strong>Name:</strong> ${this.data.name}</p>
            <p><strong>Email:</strong> ${this.data.email}</p>
            <p><strong>Contact:</strong> ${this.data.contact}</p>
            <p><strong>City:</strong> ${this.data.city}</p>
            <p><h2>Education:</h2><ul>${this.data.educationList.map(item => `<li>${item}</li>`).join('')}</ul></p>
            <p><h2>Skills:</h2><ul>${this.data.skillsList.map(item => `<li>${item}</li>`).join('')}</ul></p>
            <p><h2>Work Experience:</h2> <ul>${this.data.workExperienceList.map(item => `<li>${item}</li>`).join('')}</ul></p>
        `;
    }
    // Toggle edit mode and save changes if applicable
    toggleEdit() {
        if (this.isEditable) {
            // Save changes from editable fields
            const nameInput = document.getElementById('input-name');
            const emailInput = document.getElementById('input-email');
            const contactInput = document.getElementById('input-contact');
            const cityInput = document.getElementById('input-city');
            const educationInput = document.getElementById('input-education');
            const skillsInput = document.getElementById('input-skills');
            const workExperienceInput = document.getElementById('input-work');
            this.storePersonalData('name', nameInput.value);
            this.storePersonalData('email', emailInput.value);
            this.storePersonalData('contact', contactInput.value);
            this.storePersonalData('city', cityInput.value);
            this.storeListData('education', educationInput.value);
            this.storeListData('skills', skillsInput.value);
            this.storeListData('work-experience', workExperienceInput.value);
        }
        // Toggle between view and edit mode
        this.isEditable = !this.isEditable;
        this.generateResume();
    }
}
// Initialize the ResumeBuilder
const resumeBuilder = new ResumeBuilder();
document.addEventListener('DOMContentLoaded', () => {
    // Capture personal information inputs
    const personalInputs = document.querySelectorAll('#form-part input');
    personalInputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            const target = event.target;
            resumeBuilder.storePersonalData(target.id, target.value);
        });
    });
    // Capture profile picture
    const profilePictureInput = document.getElementById('profile-picture');
    profilePictureInput.addEventListener('change', (event) => {
        const target = event.target;
        if (target.files && target.files[0]) {
            resumeBuilder.storeProfilePicture(target.files[0]);
        }
    });
    // Capture list data (education, skills, work experience)
    const educationInput = document.getElementById('education');
    const skillsInput = document.getElementById('skills');
    const workExperienceInput = document.getElementById('work-experience');
    educationInput.addEventListener('input', () => {
        resumeBuilder.storeListData('education', educationInput.value);
    });
    skillsInput.addEventListener('input', () => {
        resumeBuilder.storeListData('skills', skillsInput.value);
    });
    workExperienceInput.addEventListener('input', () => {
        resumeBuilder.storeListData('work-experience', workExperienceInput.value);
    });
    // Submit button to generate the resume
    const submitButton = document.getElementById('submit');
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', () => {
        resumeBuilder.generateResume();
    });
    // Edit button to toggle edit mode
    const editButton = document.getElementById('edit-resume');
    editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener('click', () => {
        resumeBuilder.toggleEdit();
    });
    const downloadButton = document.getElementById('download-pdf');
    downloadButton === null || downloadButton === void 0 ? void 0 : downloadButton.addEventListener('click', () => {
        const resumeOutput = document.getElementById('resume-output');
        if (resumeOutput) {
            // Generate the PDF from the resume preview
            const options = {
                margin: 0.5,
                filename: `${resumeBuilder.data.name}-resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(resumeOutput).set(options).save();
        }
    });
});
