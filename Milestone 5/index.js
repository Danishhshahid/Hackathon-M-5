"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jspdf_1 = require("jspdf");
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
    storeProfilePicture(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.data.profilePicture = reader.result;
            this.updateProfilePicture();
        };
        reader.readAsDataURL(file);
    }
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
    updateProfilePicture() {
        const profilePicElement = document.getElementById('profile-picture-preview');
        if (profilePicElement) {
            profilePicElement.src = this.data.profilePicture;
        }
    }
    generateResume() {
        const resumeOutput = document.getElementById('resume-output');
        if (resumeOutput) {
            if (this.isEditable) {
                resumeOutput.innerHTML = this.generateEditableFields();
            }
            else {
                resumeOutput.innerHTML = this.generateStaticResume();
            }
        }
    }
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
    toggleEdit() {
        if (this.isEditable) {
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
        this.isEditable = !this.isEditable;
        this.generateResume();
    }
}
const resumeBuilder = new ResumeBuilder();
document.addEventListener('DOMContentLoaded', () => {
    const personalInputs = document.querySelectorAll('#form-part input');
    personalInputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            const target = event.target;
            resumeBuilder.storePersonalData(target.id, target.value);
        });
    });
    const profilePictureInput = document.getElementById('profile-picture');
    profilePictureInput.addEventListener('change', (event) => {
        const target = event.target;
        if (target.files && target.files[0]) {
            resumeBuilder.storeProfilePicture(target.files[0]);
        }
    });
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
    const toggleEditButton = document.getElementById('toggle-edit');
    toggleEditButton === null || toggleEditButton === void 0 ? void 0 : toggleEditButton.addEventListener('click', () => {
        resumeBuilder.toggleEdit();
    });
    const downloadButton = document.getElementById('download-resume');
    downloadButton === null || downloadButton === void 0 ? void 0 : downloadButton.addEventListener('click', () => {
        const doc = new jspdf_1.jsPDF();
        const resumeOutput = document.getElementById('resume-output');
        if (resumeOutput) {
            doc.html(resumeOutput, {
                callback: function (doc) {
                    doc.save('resume.pdf');
                },
                x: 10,
                y: 10
            });
        }
        else {
            console.error('Resume output element not found');
        }
    });
});
