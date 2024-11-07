'use client'
import db from './db';

interface StudentData {
    email: string;
    passwordHash: string;
    fullName: string;
    educationLevel: string;
    careerStatus: string;
    skills?: object;
    experience?: object;
    education: object;
    location?: string;
    profileStatus?: string;
}




export async function createStudent(data: any) {
    const validateStudentData = (data: any): data is StudentData => {
        return (
            typeof data.email === 'string' &&
            typeof data.passwordHash === 'string' &&
            typeof data.fullName === 'string' &&
            typeof data.educationLevel === 'string' &&
            typeof data.careerStatus === 'string' &&
            (typeof data.skills === 'object' || data.skills === undefined) &&
            (typeof data.experience === 'object' || data.experience === undefined) &&
            typeof data.education === 'object' &&
            (typeof data.location === 'string' || data.location === undefined) &&
            (typeof data.profileStatus === 'string' || data.profileStatus === undefined)
        );
    };

    if (!validateStudentData(data)) {
        throw new Error('Invalid student data');
    }

    return await db.student.create({ data });
}
