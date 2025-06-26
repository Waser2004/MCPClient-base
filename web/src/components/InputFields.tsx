import '../styles/InputFields.css';
import React, { useEffect, useState } from 'react';

export interface Field {
    label: string
    type: "input" | "radio" | "checkbox"
    choices: string[]
    value: string
}

export interface FieldArray {
    fields: Field[]
}

export const InputFields: React.FC<FieldArray> = ({ fields }) => {
    return (
        <div className="input-fields">
            <h2 className="input-fields-title">Datenerfassung:</h2>

            <form>

                {/* Fields */}
                <div className="input-fields-fields">
                    {fields.map((field, index) => {
                        if (field.type === "input"){
                            return (
                                <div className="input-fields-fields-field" key={index}>
                                    <label>{field.label}:</label>
                                    <input type="text" name={field.label} id={field.label} placeholder={field.label}/>
                                </div>
                            )
                        } else if (field.type === "radio") {
                            return (
                                <div className="input-fields-fields-field" key={index}>
                                    <legend>{field.label}:</legend>

                                    {field.choices.map((choice, idx) => (
                                        <label key={idx}><input type="radio" name={field.label} value={choice}/>{choice}</label>
                                    ))}
                                </div>
                            )
                        } else if (field.type === "checkbox") {
                            return (
                                <div className="input-fields-fields-field" key={index}>
                                    <label><input type="checkbox" name={field.label}/>{field.label}</label>
                                </div>
                            )
                        }
                    })}
                </div>

                {/* Buttons */}
                <div className="input-fields-buttons">
                    <button type="submit" id="Button1">Abbrechen</button>
                    <button type="submit" id="Button2">Eingaben bestätigen</button>
                </div>

            </form>
        </div>
    )
}