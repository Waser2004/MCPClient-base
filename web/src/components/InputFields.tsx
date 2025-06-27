import '../styles/InputFields.css';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

export interface Field {
    label: string
    name: string
    required: boolean
    control: string
    type: string | null
    value: string
    options: {
        label: string
        value: string
    }[] | null
}

export interface formReturn {
    [key: string]: string | boolean
}

export interface InputFieldsProps {
    title: string
    fields: Field[]
    onSubmit: (formData: formReturn) => void
}

export const InputFields: React.FC<InputFieldsProps> = ({ title, fields, onSubmit }) => {
    const [missingButRequired, setMissingButRequired] = useState<boolean[]>(Array(fields.length).fill(false));

    // handle submit event
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // extract data
        const form = e.currentTarget;
        console.log(form)
        const formData: formReturn = {};

        // process data
        let missingrequired = Array(fields.length).fill(false);
        fields.forEach(({ name, control, required }, index) => {
            const element = form.elements.namedItem(name);
            if (!element) return;
            
            if (control === 'checkbox') {
                const checkbox = element as HTMLInputElement;
                formData[name] = checkbox.checked;
                missingrequired[index] = required ? (checkbox.checked ? false : true) : false 
            } else {
                const input = element as HTMLInputElement;
                formData[name] = input.value;
                missingrequired[index] = required ? (input.value !== "" ? false : true) : false 
            }
        });      
        
        // return data
        if (!missingrequired.includes(true)) {onSubmit(formData)}
        // update missing but required fields
        setMissingButRequired(missingrequired)
    }

    return (
        <div className="input-fields">
            <h2 className="input-fields-title">{title}</h2>

            <form onSubmit={handleSubmit}>

                {/* Fields */}
                <div className="input-fields-fields">
                    {fields.map((field, index) => {
                        if (field.control === "radio") {
                            return (
                                <div className={`input-fields-fields-field ${missingButRequired[index] ? "missing-but-required" : ""}`} key={index}>
                                    <legend>{field.label}:{field.required ? "*" : ""}</legend>

                                    {field.options ? field.options.map((option, idx) => (
                                        <label key={idx}><input type="radio" name={field.name} value={option.value}/>{option.label}</label>
                                    )) : <p>No Options</p>}
                                </div>
                            )
                        } else if (field.control === "checkbox") {
                            return (
                                <div className={`input-fields-fields-field ${missingButRequired[index] ? "missing-but-required" : ""}`} key={index}>
                                    <label><input type="checkbox" name={field.name} />{field.label}{field.required ? "*" : ""}</label>
                                </div>
                            )
                        } else {
                            return (
                                <div className={`input-fields-fields-field ${missingButRequired[index] ? "missing-but-required" : ""}`} key={index}>
                                    <label>{field.label}:{field.required ? "*" : ""}</label>
                                    <input 
                                        type={!field.type ? "text" : field.type} 
                                        name={field.name}
                                        id={field.label} 
                                        placeholder={field.label}
                                        defaultValue={field.value}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>

                {/* Buttons */}
                <div className="input-fields-buttons">
                    <button type="button" id="Button1">Abbrechen</button>
                    <button type="submit" id="Button2">Eingaben bestätigen</button>
                </div>

            </form>
        </div>
    )
}