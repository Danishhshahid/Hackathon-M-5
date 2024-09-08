declare let html2pdf: any;

interface ResumeData {
    name: string;
    email: string;
    contact: string;
    city: string;
    profilePicture: string;
    educationList: string[];
    skillsList: string[];
    workExperienceList: string[];
}

class ResumeBuilder {
    data: ResumeData;
  private isEditable: boolean = false;

    constructor() {
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
    storePersonalData(id: string, value: string) {
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
    storeProfilePicture(file: File) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.data.profilePicture = reader.result as string;
            this.updateProfilePicture();
        };
        reader.readAsDataURL(file);
    }

    // Store comma-separated list data
    storeListData(id: string, value: string) {
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
        const profilePicElement = document.getElementById('profile-picture-preview') as HTMLImageElement;
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
            } else {
                // Display non-editable resume
                resumeOutput.innerHTML = this.generateStaticResume();
            }
        }
    }

    // Generate editable fields
    private generateEditableFields() {
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
    private generateStaticResume() {
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
            const nameInput = document.getElementById('input-name') as HTMLInputElement;
            const emailInput = document.getElementById('input-email') as HTMLInputElement;
            const contactInput = document.getElementById('input-contact') as HTMLInputElement;
            const cityInput = document.getElementById('input-city') as HTMLInputElement;
            const educationInput = document.getElementById('input-education') as HTMLTextAreaElement;
            const skillsInput = document.getElementById('input-skills') as HTMLTextAreaElement;
            const workExperienceInput = document.getElementById('input-work') as HTMLTextAreaElement;

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
            const target = event.target as HTMLInputElement;
            resumeBuilder.storePersonalData(target.id, target.value);
        });
    });

    // Capture profile picture
    const profilePictureInput = document.getElementById('profile-picture') as HTMLInputElement;
    profilePictureInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            resumeBuilder.storeProfilePicture(target.files[0]);
        }
    });

    // Capture list data (education, skills, work experience)
    const educationInput = document.getElementById('education') as HTMLTextAreaElement;
    const skillsInput = document.getElementById('skills') as HTMLTextAreaElement;
    const workExperienceInput = document.getElementById('work-experience') as HTMLTextAreaElement;

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
    submitButton?.addEventListener('click', () => {
        resumeBuilder.generateResume();
    });
    
    // Edit button to toggle edit mode
    const editButton = document.getElementById('edit-resume');
    editButton?.addEventListener('click', () => {
        resumeBuilder.toggleEdit();
    });
    const downloadButton = document.getElementById('download-pdf');
    downloadButton?.addEventListener('click', () => {
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
    
    })
})